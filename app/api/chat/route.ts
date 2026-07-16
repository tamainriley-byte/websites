import { NextResponse } from "next/server"
import {
  ensureChatSchema,
  getChatHistory,
  saveChatMessage,
  registerChatClient,
  setSessionMeta,
  createEnquiry,
  getSessionPhone,
  markBookedByPhone,
  type ChatRole,
  type ChatMessage,
} from "@/lib/db"
import { availabilityText, createBooking } from "@/lib/gcal"

export const dynamic = "force-dynamic"

const MAX_LEN = 2000

function clean(value: unknown, max = MAX_LEN) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

// Turn a user-agent string into a short readable label.
function shortDevice(ua: string): string | null {
  if (!ua) return null
  const kind = /Mobile|iPhone|Android/i.test(ua) ? "Mobile" : "Desktop"
  let browser = ""
  if (/Edg\//.test(ua)) browser = "Edge"
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera"
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome"
  else if (/Firefox\//.test(ua)) browser = "Firefox"
  else if (/Safari\//.test(ua)) browser = "Safari"
  let os = ""
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iPhone"
  else if (/Android/i.test(ua)) os = "Android"
  else if (/Mac OS X/i.test(ua)) os = "Mac"
  else if (/Windows/i.test(ua)) os = "Windows"
  return [os, kind, browser].filter(Boolean).join(" · ") || null
}

// Read source info from Vercel / proxy headers (free geolocation).
function extractMeta(request: Request) {
  const h = request.headers
  const fwd = h.get("x-forwarded-for") || h.get("x-real-ip") || ""
  const ip = fwd.split(",")[0].trim() || null
  const country = h.get("x-vercel-ip-country") || null
  const cityRaw = h.get("x-vercel-ip-city")
  let city: string | null = null
  try {
    city = cityRaw ? decodeURIComponent(cityRaw) : null
  } catch {
    city = cityRaw || null
  }
  const device = shortDevice(h.get("user-agent") || "")
  const ref = h.get("referer")
  const referer = ref ? ref.replace(/^https?:\/\//, "").slice(0, 120) : null
  return { ip, country, city, device, referer }
}

/* ------------------------------------------------------------------ */
/*  Parissa persona + AI reply                                        */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are Parissa, the therapist and owner of Calm & Contour, a luxury mobile massage and body-contouring service in Mallorca, Spain. You are replying in a chat window on your own website, exactly as you would on WhatsApp. Write as Parissa herself, warm, calm and human. Never say you are an AI, bot or assistant.

HOW YOU WRITE, match this closely
- Very short. Usually ONE sentence, sometimes two. Never a big block of text.
- NEVER use em dashes or any kind of dash. Use commas or full stops instead. Dashes are a dead giveaway that a message is automated.
- Vary your wording so you never sound scripted or repetitive. Sound like a busy human texting, not a template.
- Warm, natural, practical. An occasional 🙏 feels right. Reply in the language they write in (English, Spanish or German).
- Ask only ONE thing at a time.

YOUR JOB IS TO BOOK THEM IN, as a friendly booking, one short question per message, in this order:
1. They have just shared their mobile number. Your first message asks ONLY their name: "Lovely 🙏 what's your name?"
2. Once you know their name, greet them by it and ask the date: "Hi <name> 🙏 when were you thinking of coming in?"
3. Ask whereabouts they are staying, and whether they would like you to come to them or to use the studio.
4. Ask how long they would like, 60, 90 or 120 minutes.
5. Ask which style of massage they would like.
6. Look at PARISSA'S REAL AVAILABILITY below and offer ONE specific time that is genuinely free, for example "I can do Thursday at 6pm, does that suit you?". Only ever offer a time that appears free in that availability. Never invent a time that is not there.
7. When they agree to a specific date, time, duration, location and style, CALL THE book_appointment TOOL to put it in the calendar. Do NOT tell them it is booked until the tool has confirmed it.
8. After the tool confirms, warmly tell them they are booked and you will see them then, and that you will message them on WhatsApp to say hello. Mention once, lightly: "And a little perk, after 6 massages with me your next one is half price 🌿".
9. If the tool returns an error, apologise lightly and offer them another time from the availability.

FACTS YOU KNOW
- You come to the client's villa, yacht or hotel anywhere in Mallorca and bring the table, oils and everything. A private studio is also available at Calle Benito Jerónimo Feijoo 4, Portals Nous (one table only, so couples and groups are done at their place with two therapists).
- Styles: Swedish / relaxation, deep tissue, aromatherapy, lomi lomi, sports, hot stone, lymphatic drainage, prenatal (gentle and safe in pregnancy), reflexology, back-neck-shoulders.
- Body contouring: wood therapy (maderoterapia), lymphatic sculpting, pre-event sculpting.
- Prices: home visit €120 for 60 min, €145 for 90 min. Studio €75 for 60 min, €125 for 90 min. For couples you bring a second therapist to their place.
- Loyalty: after 6 completed massages the next massage is half price.
- You are not a doctor; for any medical concern suggest they check with theirs.`

// Warmer keyword fallback used only until an AI key is configured.
function fallbackReply(userText: string): string {
  const t = userText.toLowerCase()
  if (/\b(couple|couples|two of us|both of us|partner|wife|husband|brother|sister|friend|group)\b/.test(t)) {
    return "Lovely, for two of you I'd bring a second therapist to your villa or hotel so you're side by side 🙏 Where are you staying?"
  }
  if (/\b(pregnan|prenatal|expecting)\b/.test(t)) {
    return "Yes, I do gentle pregnancy massage, completely safe and really soothing. Where are you staying?"
  }
  if (/\b(price|cost|how much|rate|precio|cuesta|preis|kostet)\b/.test(t)) {
    return "A home visit is €120 for 60 minutes or €145 for 90, and I bring everything to you (the studio is €75 / €125). Where are you staying?"
  }
  if (/\b(villa|yacht|hotel|come to|mobile|my place|room)\b/.test(t)) {
    return "Yes, I come to you with the table, oils and everything 🙏 Which area are you in, and what dates were you thinking?"
  }
  if (/\b(book|available|availability|when|date|today|tomorrow|reserva|termin|buchen)\b/.test(t)) {
    return "I'd love to fit you in, which day were you thinking, and whereabouts are you staying?"
  }
  return "Of course 🙏 tell me where you're staying and the style you'd like, and I'll take care of it."
}

type ContentBlock = {
  type: string
  id?: string
  name?: string
  input?: Record<string, unknown>
  text?: string
}

// Tool the AI calls to write a confirmed appointment into Parissa's calendar.
const BOOKING_TOOL = {
  name: "book_appointment",
  description:
    "Put a confirmed appointment into Parissa's Google Calendar. Only call this once the client has agreed to a specific date, start time, duration, location and style. Times are Mallorca local time in 24-hour format.",
  input_schema: {
    type: "object" as const,
    properties: {
      date: { type: "string", description: "Appointment date in YYYY-MM-DD" },
      start_time: {
        type: "string",
        description: "Start time HH:MM, 24-hour, Mallorca local time",
      },
      duration_minutes: {
        type: "number",
        description: "60, 90 or 120",
      },
      treatment: {
        type: "string",
        description: "e.g. deep tissue, relaxation, lymphatic drainage",
      },
      location: {
        type: "string",
        description:
          "the studio, or the client's villa / hotel / yacht and area",
      },
    },
    required: [
      "date",
      "start_time",
      "duration_minutes",
      "treatment",
      "location",
    ],
  },
}

// Calls Anthropic if ANTHROPIC_API_KEY is set; returns null on any failure.
// Reads Parissa's real availability so it only offers free times, and can
// book straight into her calendar via the book_appointment tool.
async function generateReply(
  history: Array<{ role: ChatRole; content: string }>,
  phone: string | null,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const model = process.env.PARISSA_MODEL || "claude-haiku-4-5-20251001"

  let availability: string | null = null
  try {
    availability = await availabilityText(7)
  } catch {
    availability = null
  }
  const system =
    SYSTEM_PROMPT +
    "\n\nPARISSA'S REAL AVAILABILITY (next 7 days, Mallorca time). Only ever offer a time that is free here:\n" +
    (availability ||
      "(the calendar is not readable right now, so offer to confirm the exact time personally rather than guessing a slot)")

  const messages: Array<{ role: string; content: unknown }> = history.map(
    (m) => ({ role: m.role, content: m.content }),
  )

  try {
    // Up to a couple of rounds so one booking tool call can complete.
    for (let round = 0; round < 3; round++) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 400,
          system,
          tools: [BOOKING_TOOL],
          messages,
        }),
      })
      if (!res.ok) {
        console.error("[chat] Anthropic error", res.status, await res.text())
        return null
      }
      const data = (await res.json()) as {
        content?: ContentBlock[]
        stop_reason?: string
      }
      const blocks = data.content ?? []
      const toolUse = blocks.find((b) => b.type === "tool_use")

      if (data.stop_reason === "tool_use" && toolUse) {
        const input = (toolUse.input || {}) as {
          date: string
          start_time: string
          duration_minutes: number
          treatment: string
          location: string
        }
        let toolResult: string
        if (!phone) {
          toolResult =
            "ERROR: no mobile number on file yet, ask them to re-enter it."
        } else {
          try {
            toolResult = await createBooking({ ...input, phone })
          } catch (e) {
            console.error("[chat] createBooking failed", e)
            toolResult = "ERROR: booking failed, please offer another time."
          }
          if (toolResult.startsWith("BOOKED")) {
            const summary =
              `${input.date} at ${input.start_time}, ${input.duration_minutes} min ` +
              `${input.treatment}, ${input.location}`
            try {
              await markBookedByPhone(phone, summary)
            } catch (e) {
              console.error("[chat] markBookedByPhone failed", e)
            }
          }
        }
        messages.push({ role: "assistant", content: blocks })
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: toolResult,
            },
          ],
        })
        continue
      }

      const text = blocks
        .filter((b) => b.type === "text" && b.text)
        .map((b) => b.text as string)
        .join("")
        .trim()
      return text || null
    }
    return null
  } catch (err) {
    console.error("[chat] Anthropic request failed", err)
    return null
  }
}

// Sends the chat transcript to Parissa's WhatsApp when a client registers.
// Uses CallMeBot (free): set PARISSA_WHATSAPP (e.g. 34602020734) and
// CALLMEBOT_APIKEY in the environment. Skips silently if not configured.
async function notifyParissa(
  phone: string,
  name: string | null,
  history: ChatMessage[],
) {
  const to = process.env.PARISSA_WHATSAPP
  const apikey = process.env.CALLMEBOT_APIKEY
  if (!to || !apikey) return
  const transcript = history
    .map((m) => `${m.role === "user" ? "Client" : "Parissa"}: ${m.content}`)
    .join("\n")
  const message =
    `New enquiry from the website chat 🌿\n` +
    `Mobile: ${phone}${name ? `\nName: ${name}` : ""}\n\n` +
    `${transcript || "(no messages yet)"}`
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(to)}` +
    `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`
  try {
    await fetch(url)
  } catch (err) {
    console.error("[chat] WhatsApp notify failed", err)
  }
}

/* ------------------------------------------------------------------ */
/*  Route                                                             */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const type = clean(body.type) || "message"
    const sessionId = clean(body.sessionId, 100)

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session." }, { status: 400 })
    }

    await ensureChatSchema()

    if (type === "history") {
      const messages = await getChatHistory(sessionId)
      return NextResponse.json({ messages })
    }

    // Record where they came from (first-touch) for message + register.
    try {
      await setSessionMeta(sessionId, extractMeta(request))
    } catch (e) {
      console.error("[chat] meta capture failed", e)
    }

    if (type === "register") {
      const phone = clean(body.phone, 40)
      const name = clean(body.name, 120) || null
      if (!phone) {
        return NextResponse.json(
          { error: "Please enter your mobile number." },
          { status: 400 },
        )
      }
      await registerChatClient(sessionId, phone, name)

      const history = await getChatHistory(sessionId)
      const summary = history
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .slice(-6)
        .join("\n")
      try {
        await createEnquiry(
          phone,
          summary
            ? `[Chat] ${name ? name + ", " : ""}${summary}`
            : `[Chat] New chat started${name ? ", " + name : ""}`,
        )
      } catch (e) {
        console.error("[chat] enquiry mirror failed", e)
      }

      // Send straight to Parissa's WhatsApp.
      await notifyParissa(phone, name, history)

      // Kick off the guided booking by asking their name first.
      const confirm = "Lovely, thank you 🙏 What's your name?"
      await saveChatMessage(sessionId, "assistant", confirm)
      return NextResponse.json({ ok: true, reply: confirm })
    }

    const text = clean(body.message)
    if (!text) {
      return NextResponse.json({ error: "Empty message." }, { status: 400 })
    }

    await saveChatMessage(sessionId, "user", text)

    const history = await getChatHistory(sessionId)
    const llmHistory = history.map((m) => ({ role: m.role, content: m.content }))
    const phone = await getSessionPhone(sessionId)

    let reply = await generateReply(llmHistory, phone)
    if (!reply) reply = fallbackReply(text)

    await saveChatMessage(sessionId, "assistant", reply)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[chat] route error", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

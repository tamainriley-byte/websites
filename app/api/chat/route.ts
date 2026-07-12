import { NextResponse } from "next/server"
import {
  ensureChatSchema,
  getChatHistory,
  saveChatMessage,
  registerChatClient,
  setSessionMeta,
  createEnquiry,
  getSessionPhone,
  getSessionState,
  markBookedByPhone,
  pool,
  type ChatRole,
} from "@/lib/db"
import { availabilityText, createBooking } from "@/lib/gcal"
import {
  sendOwnerWhatsApp,
  notifyOwners,
  notifyConversationEnded,
  sweepColdLeads,
} from "@/lib/notify"
import { waClientLink, confirmationMessage } from "@/lib/whatsapp"

export const dynamic = "force-dynamic"

const MAX_LEN = 2000

function clean(value: unknown, max = MAX_LEN) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

// Pull a plausible mobile number out of a chat message (7 to 15 digits).
function extractPhone(text: string): string | null {
  const m = text.match(/\+?\d[\d\s().-]{5,}\d/g)
  if (!m) return null
  for (const cand of m) {
    const digits = (cand.match(/\d/g) || []).length
    if (digits >= 7 && digits <= 15) return cand.trim()
  }
  return null
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

// Studio location (used by the fallback and shared with clients who ask).
const STUDIO_ADDRESS =
  "Calle Benito Jerónimo Feijoo 4, Portals Nous (Costa d'en Blanes), 07181 Mallorca"

// Human-readable booking summary saved with the lead and used to prefill
// the client's WhatsApp confirmation from /admin.
function bookingSummary(input: {
  date: string
  start_time: string
  duration_minutes: number
  treatment: string
  location: string
}): string {
  let day = input.date
  try {
    const d = new Date(`${input.date}T00:00:00`)
    if (!Number.isNaN(d.getTime())) {
      day = d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    }
  } catch {
    // keep the raw date
  }
  const where = /studio/i.test(input.location)
    ? `at the studio, ${STUDIO_ADDRESS}`
    : `at ${input.location}`
  return `${day} at ${input.start_time}, ${input.duration_minutes} min ${input.treatment}, ${where}`
}

const SYSTEM_PROMPT = `You are Parissa, the therapist and owner of Calm & Contour, a luxury mobile massage and body-contouring service in Mallorca, Spain. You are replying in a chat window on your own website, exactly as you would on WhatsApp. Write as Parissa herself, warm, calm and human. Never say you are an AI, bot or assistant.

HOW YOU WRITE, match this closely. These are REAL messages you have sent, copy this exact texture:
- "Hi tomorrow I have appointments available"
- "Hello yes but in studio"
- "What time tomorrow and what hotel are you in please?"
- "Are you in a hotel?" then "It would be easier for you to come to me?"
- "Yes that's ok 1500"
- Very short. Usually ONE line, often just a few words. Sometimes two short lines. Never a big block of text.
- Times often written like 15.00 or 1500. Slightly imperfect, quick, human. You are busy between clients.
- NEVER use em dashes or any kind of dash. Use commas or full stops instead. Dashes are a dead giveaway that a message is automated.
- Vary your wording so you never sound scripted. Never repeat the same phrasing twice in one conversation.
- Actually read what they asked and answer it directly before asking anything back. Never ignore their question.
- Warm and practical, an occasional 🙏 feels right. Reply in the language they write in (English, Spanish or German).

YOUR BOOKING FORM
When they are ready to book and you are still missing several details, send your usual form exactly like this (on its own, nothing after it):
Preferred date:
Time:
Location:
Duration: (60/90/120 minutes)
How many guests:
Type of treatment:
Only send it once per conversation. If you only need one or two details, just ask naturally instead.

WHAT YOU DO
- Be helpful and answer their questions warmly, then move towards booking them in.
- Ask one easy follow-up at a time (where they're staying, their dates, the style they'd like).
- Suggest coming to them first (villa, yacht or hotel), it's the nicest experience. Offer the studio as the alternative, and for anyone on a bike or without space in their room, the studio is perfect (there is a shower).

FACTS YOU KNOW
- Your studio is at ${STUDIO_ADDRESS}, in Calvià, right by Puerto Portals marina. It is about 10 minutes from Magaluf, 15 minutes from Palma and Santa Ponsa. Share the address freely when asked.
- You also come to the client's villa, yacht or hotel anywhere in Mallorca and bring the table, oils and everything.
- You work alone at the moment, there is no second therapist, so side by side couples massage is NOT available. If two people want treatments, offer back to back sessions in the same visit (one after the other), same price per person. Never promise a second therapist.
- Massage styles: Swedish / relaxation, deep tissue, aromatherapy, lomi lomi, sports, hot stone, lymphatic drainage (a signature of yours), prenatal (gentle and safe in pregnancy), reflexology, back-neck-shoulders.
- Facials and body contouring: facial treatments and facial reset, wood therapy (maderoterapia), lymphatic sculpting, pre-event sculpting.
- THE RITUAL, your VIP treatment: 2 hours (120 minutes), €200. A full body massage with warm aromatherapy oils, hot stones, a hot towel rub down afterwards to remove the oil, and herbal tea to finish. Completely unhurried. At their villa, hotel, yacht or the studio. Suggest it to anyone who wants something really special.
- ALL RITUALS ARE 2 HOURS (120 minutes) AND €200, anywhere, studio or at their place. €20 more than a plain 2 hour massage, and worth it for the ceremony. Three to offer:
  THE RITUAL (classic): warm aromatherapy oils, hot stones, hot towel rub down, herbal tea. For anyone wanting pure indulgence.
  THE SERENE FLOW RITUAL: lymphatic drainage + Balinese flowing massage, light to medium pressure, deeply calming, de-bloats and resets the nervous system. Jasmine or hibiscus tea, ocean sounds. For relaxing, de-puffing, feeling lighter.
  THE TENSION RELEASE RITUAL: trigger point therapy + myofascial release + assisted stretching, firm but mindful. For chronic tension, headaches, stiff neck and shoulders, athletes. Peppermint or lemon ginger tea. Advise them to hydrate and skip intense exercise for 24 hours after.
  Rituals are never 60 or 90 minutes. If someone wants 60 or 90, that is a normal massage at the normal prices.
- Prices: home visit €130 for 60 min, €155 for 90, €180 for 120. Studio €90 for 60 min, €135 for 90, €180 for 120. The Ritual is €200 for 120 min anywhere (the VIP version with hot stones, hot towels and tea, €20 more than a plain 2 hours and worth it).
- The studio has a shower, handy for clients coming by bike or heading out after.
- You are not a doctor; for any medical concern suggest they check with theirs.
- Never invent availability. Only state times as free when they appear in the availability list below; without that list, every booking is provisional until Parissa confirms it herself.

HOW A BOOKING HAPPENS
- Let them ask whatever they like first. Answer warmly and never demand their number before they have had their questions answered.
- When they seem ready to book, or give you a day or time, gather across the chat: the treatment or style, the duration (60, 90 or 120 minutes, mention prices naturally), how many guests, the day and rough time, and where they are staying (villa, hotel or yacht, and the area or address). The booking form above collects all of this in one go when several are missing.
- If you do not have their mobile number yet, ask for it so you can confirm and pass it to Parissa. Ask naturally, once, as the last step. If it was captured earlier, never ask again.
- If you know Parissa's real availability (it will be listed below when connected), only ever offer times inside her free slots, and if their preferred time is taken suggest the nearest free ones.
- When the booking details are all agreed and you have the book_appointment tool available, call it once to put the booking straight into Parissa's calendar, then confirm warmly, for example: "Perfect, you're booked in for Saturday at 5pm at your villa in Portals, 90 minutes of deep tissue. Parissa will message you shortly to say hello." Always repeat back the day, the time, the duration, the treatment and the exact place (their address, or the studio address) in that confirmation so they have everything in writing. Vary the wording every time and never use a dash.
- If you cannot book directly (no tool available), confirm provisionally instead: "I'll pencil you in and Parissa will confirm very shortly." Never invent exact availability in that case.`

// Warmer keyword fallback used only until an AI key is configured.
// It actually answers the common questions and never loops the same line.
function fallbackReply(userText: string): string {
  const t = userText.toLowerCase()

  // Where is the studio / address
  if (/\b(address|adress|direccion|dirección|where are you|where.?s the studio|studio.*(where|located|based)|located|postcode|post code|ubicaci)\b/.test(t)) {
    return `The studio is at ${STUDIO_ADDRESS}, right by Puerto Portals 🙏 Or I can bring everything to you. Where are you staying?`
  }

  // How far / distance
  if (/\b(how far|how close|distance|far from|near to|minutes from|drive from|get to)\b/.test(t)) {
    return "The studio is in Portals Nous, about 10 minutes from Magaluf and 15 from Palma. Or I come to you with the table and oils. Whereabouts are you?"
  }

  // Couples / groups
  if (/\b(couple|couples|two of us|both of us|partner|wife|husband|brother|sister|friend|group)\b/.test(t)) {
    return "Lovely, I'd treat you one after the other in the same visit so you both get my full attention 🙏 Where are you staying?"
  }

  // Pregnancy
  if (/\b(pregnan|prenatal|expecting)\b/.test(t)) {
    return "Yes, I do gentle pregnancy massage, completely safe and really soothing. Where are you staying?"
  }

  // Price
  if (/\b(price|cost|how much|rate|precio|cuesta|preis|kostet)\b/.test(t)) {
    return "A home visit is €130 for 60 minutes or €155 for 90, and I bring everything to you. The studio is €90 or €135. Where are you staying?"
  }

  // Facials / body contouring / reset
  if (/\b(facial|face|skin|glow|reset|contour|sculpt|madero|wood therapy|lymph|drainage)\b/.test(t)) {
    return "Yes, I do facials, lymphatic drainage and body contouring as well as massage 🙏 Which were you thinking, and where are you staying?"
  }

  // Specific massage styles
  if (/\b(deep tissue|sports|hot stone|aromatherapy|lomi|reflexolog|swedish|relax|back|neck|shoulder|full body)\b/.test(t)) {
    return "Yes, that's one of mine 🙏 Tell me where you're staying and your dates and I'll sort it."
  }

  // Come to you / studio choice
  if (/\b(villa|yacht|hotel|come to|mobile|my place|my room|to you|studio)\b/.test(t)) {
    return "Yes, you can come to the studio in Portals Nous or I'll come to you with everything 🙏 Which suits you, and what dates?"
  }

  // Availability / booking
  if (/\b(book|available|availability|when|date|today|tomorrow|reserva|termin|buchen)\b/.test(t)) {
    return "I'd love to fit you in. Which day were you thinking, and whereabouts are you staying?"
  }

  // Catch-all: reassure a human will follow up, and keep it moving.
  // Rotates so it never repeats the exact same line back to back.
  const fallbacks = [
    "Of course 🙏 I've got your details and I'll message you personally in a moment. Whereabouts are you staying?",
    "Happy to help with that 🙏 Tell me your dates and where you're based and I'll confirm everything personally.",
    "Absolutely 🙏 I'll come back to you personally shortly. What area are you in and when suits you?",
  ]
  return fallbacks[userText.length % fallbacks.length]
}

// The one tool the AI has: writing a confirmed booking into Parissa's
// Google Calendar. Only offered when her calendar is connected AND the
// client's number is captured.
const BOOK_TOOL = {
  name: "book_appointment",
  description:
    "Book a confirmed appointment in Parissa's calendar. Only call this once the client has clearly agreed the treatment, the date, the start time, the duration (60, 90 or 120 minutes) and the location. Times are Mallorca local time.",
  input_schema: {
    type: "object",
    properties: {
      date: { type: "string", description: "Date as YYYY-MM-DD" },
      start_time: { type: "string", description: "Start time as HH:MM, 24h, Mallorca time" },
      duration_minutes: { type: "integer", enum: [60, 90, 120] },
      treatment: { type: "string", description: "The treatment, e.g. deep tissue massage" },
      location: {
        type: "string",
        description: "Where: 'studio' or the villa/hotel/yacht and area or address",
      },
    },
    required: ["date", "start_time", "duration_minutes", "treatment", "location"],
  },
} as const

type ContentBlock = {
  type: string
  text?: string
  id?: string
  name?: string
  input?: Record<string, unknown>
}

// Short in-memory cache so availability isn't re-fetched on every message.
let availCache: { text: string | null; at: number } | null = null
async function cachedAvailability(): Promise<string | null> {
  if (availCache && Date.now() - availCache.at < 60_000) return availCache.text
  const text = await availabilityText(7)
  availCache = { text, at: Date.now() }
  return text
}

// Calls Anthropic if ANTHROPIC_API_KEY is set; returns null on any failure.
// Runs a small tool loop so the AI can write confirmed bookings into
// Parissa's calendar when everything is agreed.
async function generateReply(
  history: Array<{ role: ChatRole; content: string }>,
  phone: string | null,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  // claude-3-5-haiku was retired by Anthropic on 19 Feb 2026 — calls to it
  // 404 and the chat silently degrades to keyword fallbacks. Keep this on a
  // current model ID (claude-haiku-4-5 is the cheapest/fastest tier).
  const model = process.env.PARISSA_MODEL || "claude-haiku-4-5"

  const availability = await cachedAvailability()
  let system = SYSTEM_PROMPT
  if (phone) {
    system += `\n\nThe client's mobile number is already saved (${phone}). Never ask for it again.`
  }
  if (availability) {
    system += `\n\nPARISSA'S REAL AVAILABILITY, next 7 days, Mallorca time (only offer times inside these free slots):\n${availability}`
  }
  const canBook = Boolean(phone && availability !== null)

  let messages: Array<{ role: string; content: unknown }> = history.map(
    (m) => ({ role: m.role, content: m.content }),
  )

  try {
    // At most 2 tool round-trips as a safety stop.
    for (let i = 0; i < 3; i++) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 500,
          system,
          messages,
          ...(canBook ? { tools: [BOOK_TOOL] } : {}),
        }),
      })
      if (!res.ok) {
        console.error("[chat] Anthropic error", res.status, await res.text())
        return null
      }
      const data = (await res.json()) as {
        stop_reason?: string
        content?: ContentBlock[]
      }
      const blocks = data.content ?? []

      if (data.stop_reason === "tool_use" && canBook && i < 2) {
        const toolUse = blocks.find((b) => b.type === "tool_use")
        if (!toolUse?.id) return null
        const input = (toolUse.input ?? {}) as Record<string, unknown>
        const details = {
          date: String(input.date ?? ""),
          start_time: String(input.start_time ?? ""),
          duration_minutes: Number(input.duration_minutes ?? 60),
          treatment: String(input.treatment ?? "Massage"),
          location: String(input.location ?? ""),
        }
        const result = await createBooking({ ...details, phone: phone as string })
        if (result.startsWith("BOOKED")) {
          // Confirmed booking: flip the lead to booked (with the details so
          // /admin can prefill the client confirmation) and tell Parissa.
          const summary = bookingSummary(details)
          markBookedByPhone(phone as string, summary).catch((e) =>
            console.error("[chat] markBooked failed", e),
          )
          // One-tap forward: opens WhatsApp to the client with the written
          // confirmation ready to send. Only when the number is dialable.
          const confirmLink = waClientLink(
            phone as string,
            null,
            confirmationMessage(summary, process.env.PAYMENT_LINK_URL || null),
          )
          sendOwnerWhatsApp(
            `Confirmed booking ✅ ${result.replace("BOOKED: ", "")}\nClient: ${phone}\nIt's in your Google Calendar.` +
              (confirmLink
                ? `\nTap to send them the confirmation: ${confirmLink}`
                : "") +
              `\nFull chat: https://calmandcontour.com/admin`,
          ).catch((e) => console.error("[chat] booking notify failed", e))
          availCache = null // calendar changed
        }
        messages = [
          ...messages,
          { role: "assistant", content: blocks },
          {
            role: "user",
            content: [
              { type: "tool_result", tool_use_id: toolUse.id, content: result },
            ],
          },
        ]
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

// Owner notifications (new-lead ping, final transcript, cold sweep) live in
// lib/notify.ts so the report cron can reuse them.

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
      const [messages, phone] = await Promise.all([
        getChatHistory(sessionId),
        getSessionPhone(sessionId),
      ])
      return NextResponse.json({ messages, hasPhone: Boolean(phone) })
    }

    // Beacon from the widget: the visitor closed the page mid-conversation.
    // If we have their number, send Parissa the final transcript now.
    if (type === "left") {
      const r = await pool.query<{
        session_id: string
        phone: string | null
        name: string | null
        city: string | null
        country: string | null
      }>(
        `SELECT session_id, phone, name, city, country
         FROM chat_sessions WHERE session_id = $1`,
        [sessionId],
      )
      const session = r.rows[0]
      if (session?.phone) {
        await notifyConversationEnded(session, "left")
      }
      return NextResponse.json({ ok: true })
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

      // Alert Parissa (and the owner) on WhatsApp.
      await notifyOwners(phone, name, history)

      const confirm = "Lovely, thank you 🙏 How can I help you?"
      await saveChatMessage(sessionId, "assistant", confirm)
      return NextResponse.json({ ok: true, reply: confirm })
    }

    const text = clean(body.message)
    if (!text) {
      return NextResponse.json({ error: "Empty message." }, { status: 400 })
    }

    // Opportunistic sweep: any chat traffic also checks for other leads
    // that went cold, since Hobby-plan crons only run daily.
    sweepColdLeads().catch(() => {})

    await saveChatMessage(sessionId, "user", text)

    // Takeover: Parissa is handling this chat herself from /admin, so the AI
    // stays silent. Her replies reach the widget via its history polling.
    const state = await getSessionState(sessionId)
    if (state.ai_muted) {
      return NextResponse.json({ reply: null, muted: true })
    }

    // If they share a mobile number in chat and we have not captured one yet,
    // grab it, mirror it to enquiries and alert the owners with the transcript.
    let phone = state.phone
    const shared = extractPhone(text)
    if (shared && !phone) {
      try {
        await registerChatClient(sessionId, shared, null)
        phone = shared
        const sofar = await getChatHistory(sessionId)
        const summary = sofar
          .filter((m) => m.role === "user")
          .map((m) => m.content)
          .slice(-6)
          .join(" | ")
        try {
          await createEnquiry(shared, `[Chat] ${summary}`)
        } catch (e) {
          console.error("[chat] enquiry mirror failed", e)
        }
        await notifyOwners(shared, null, sofar)
      } catch (e) {
        console.error("[chat] inline capture failed", e)
      }
    }

    const history = await getChatHistory(sessionId)
    const llmHistory = history.map((m) => ({ role: m.role, content: m.content }))

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

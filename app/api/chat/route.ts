import { NextResponse } from "next/server"
import {
  ensureChatSchema,
  getChatHistory,
  saveChatMessage,
  registerChatClient,
  setSessionMeta,
  createEnquiry,
  getSessionPhone,
  type ChatRole,
  type ChatMessage,
} from "@/lib/db"

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

const SYSTEM_PROMPT = `You are Parissa, the therapist and owner of Calm & Contour, a luxury mobile massage and body-contouring service in Mallorca, Spain. You are replying in a chat window on your own website, exactly as you would on WhatsApp. Write as Parissa herself, warm, calm and human. Never say you are an AI, bot or assistant.

HOW YOU WRITE, match this closely
- Very short. Usually ONE sentence, sometimes two. Never a big block of text.
- NEVER use em dashes or any kind of dash. Use commas or full stops instead. Dashes are a dead giveaway that a message is automated.
- Vary your wording so you never sound scripted or repetitive. Sound like a busy human texting, not a template.
- Actually read what they asked and answer it directly before asking anything back. Never ignore their question.
- Warm, natural, practical. An occasional 🙏 feels right. Reply in the language they write in (English, Spanish or German).
- Your real tone sounds like: "Hello, it would be studio 🙏", "Ok I'm fully booked today and tomorrow, morning, afternoon or early evening Tuesday?", "In the studio there's only one table, but I can organise two therapists to come to you.", "Buenas días, what would you like to know?"

WHAT YOU DO
- The client has already shared their mobile number, so you never need to ask for it. Just be helpful and answer their questions warmly.
- Ask one easy follow-up if natural (where they're staying, their dates, the style they'd like).
- Keep it flowing like a real conversation, one small step at a time.

FACTS YOU KNOW
- Your studio is at ${STUDIO_ADDRESS}, in Calvià, right by Puerto Portals marina. It is about 10 minutes from Magaluf, 15 minutes from Palma and Santa Ponsa. Share the address freely when asked.
- You also come to the client's villa, yacht or hotel anywhere in Mallorca and bring the table, oils and everything. The studio has one table only, so couples and groups are done at their place with two therapists.
- Massage styles: Swedish / relaxation, deep tissue, aromatherapy, lomi lomi, sports, hot stone, lymphatic drainage, prenatal (gentle and safe in pregnancy), reflexology, back-neck-shoulders.
- Facials and body contouring: facial treatments and facial reset, wood therapy (maderoterapia), lymphatic sculpting, pre-event sculpting.
- Prices: home visit €120 for 60 min, €145 for 90 min. Studio €75 for 60 min, €125 for 90 min. For couples you bring a second therapist to their place.
- You are not a doctor; for any medical concern suggest they check with theirs.
- Never invent exact availability. Every booking is provisional until Parissa confirms it herself.

HOW A BOOKING HAPPENS
- Let them ask whatever they like first. Answer warmly and never demand their number before they have had their questions answered.
- When they seem ready to book, or give you a day or time, gently gather three things across the chat: the treatment they would like, the day and rough time, and where they are staying (villa, hotel or yacht, and the area or address).
- Once you have those, ask for their mobile number so you can confirm and pass it to Parissa. Ask naturally, once, as the last step.
- When you have the number and the details, confirm provisionally in your own warm words. For example: "Perfect, I'll pencil you in for Saturday around 5pm at your villa in Portals and pass it straight to Parissa. Consider it booked, she'll message you very shortly to confirm the final details." Vary the wording every time and never use a dash.
- If they gave their number earlier, thank them and keep helping, you do not need to ask again.`

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
    return "Lovely, for two of you I'd bring a second therapist to your villa or hotel so you're side by side 🙏 Where are you staying?"
  }

  // Pregnancy
  if (/\b(pregnan|prenatal|expecting)\b/.test(t)) {
    return "Yes, I do gentle pregnancy massage, completely safe and really soothing. Where are you staying?"
  }

  // Price
  if (/\b(price|cost|how much|rate|precio|cuesta|preis|kostet)\b/.test(t)) {
    return "A home visit is €120 for 60 minutes or €145 for 90, and I bring everything to you. The studio is €75 or €125. Where are you staying?"
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

// Calls Anthropic if ANTHROPIC_API_KEY is set; returns null on any failure.
async function generateReply(
  history: Array<{ role: ChatRole; content: string }>,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  // claude-3-5-haiku was retired by Anthropic on 19 Feb 2026 — calls to it
  // 404 and the chat silently degrades to keyword fallbacks. Keep this on a
  // current model ID (claude-haiku-4-5 is the cheapest/fastest tier).
  const model = process.env.PARISSA_MODEL || "claude-haiku-4-5"
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
    if (!res.ok) {
      console.error("[chat] Anthropic error", res.status, await res.text())
      return null
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text as string)
      .join("")
      .trim()
    return text || null
  } catch (err) {
    console.error("[chat] Anthropic request failed", err)
    return null
  }
}

// Alerts the owners on WhatsApp the moment a client shares their number.
// Sends to Parissa (PARISSA_WHATSAPP + CALLMEBOT_APIKEY) and, if configured,
// to the owner too (OWNER_WHATSAPP + OWNER_CALLMEBOT_APIKEY). CallMeBot is the
// free bridge; each recipient needs their own apikey. Skips silently if unset.
async function notifyOwners(
  phone: string,
  name: string | null,
  history: ChatMessage[],
) {
  const recipients = [
    { to: process.env.PARISSA_WHATSAPP, key: process.env.CALLMEBOT_APIKEY },
    { to: process.env.OWNER_WHATSAPP, key: process.env.OWNER_CALLMEBOT_APIKEY },
  ].filter((r) => r.to && r.key) as Array<{ to: string; key: string }>
  if (recipients.length === 0) return

  const transcript = history
    .map((m) => `${m.role === "user" ? "Client" : "Parissa"}: ${m.content}`)
    .join("\n")
  const message =
    `New lead 🌿 A potential client has just entered their phone number and the AI is chatting to them now.\n\n` +
    `Mobile: ${phone}${name ? `\nName: ${name}` : ""}\n\n` +
    `Chat so far:\n${transcript || "(no messages yet)"}\n\n` +
    `If the conversation finishes or they go cold, we'll let you know and you should call them right away.`

  await Promise.all(
    recipients.map(async (r) => {
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(r.to)}` +
        `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(r.key)}`
      try {
        await fetch(url)
      } catch (err) {
        console.error("[chat] WhatsApp notify failed", err)
      }
    }),
  )
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

      // Alert Parissa (and the owner) on WhatsApp.
      await notifyOwners(phone, name, history)

      const confirm =
        "Lovely, thank you 🙏 I've got your number and I'll message you personally very shortly. Meanwhile, where are you staying and what would you like?"
      await saveChatMessage(sessionId, "assistant", confirm)
      return NextResponse.json({ ok: true, reply: confirm })
    }

    const text = clean(body.message)
    if (!text) {
      return NextResponse.json({ error: "Empty message." }, { status: 400 })
    }

    await saveChatMessage(sessionId, "user", text)

    // If they share a mobile number in chat and we have not captured one yet,
    // grab it, mirror it to enquiries and alert the owners with the transcript.
    const shared = extractPhone(text)
    if (shared) {
      try {
        const existing = await getSessionPhone(sessionId)
        if (!existing) {
          await registerChatClient(sessionId, shared, null)
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
        }
      } catch (e) {
        console.error("[chat] inline capture failed", e)
      }
    }

    const history = await getChatHistory(sessionId)
    const llmHistory = history.map((m) => ({ role: m.role, content: m.content }))

    let reply = await generateReply(llmHistory)
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

import { NextResponse } from "next/server"
import {
  ensureChatSchema,
  getChatHistory,
  saveChatMessage,
  registerChatClient,
  createEnquiry,
  type ChatRole,
  type ChatMessage,
} from "@/lib/db"

export const dynamic = "force-dynamic"

const MAX_LEN = 2000

function clean(value: unknown, max = MAX_LEN) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

/* ------------------------------------------------------------------ */
/*  Parissa persona + AI reply                                        */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are Parissa, the therapist and owner of Calm & Contour, a luxury mobile massage and body-contouring service in Mallorca, Spain. You are replying in a chat window on your own website, exactly as you would on WhatsApp. Write as Parissa herself — warm, calm and human. Never say you are an AI, bot or assistant.

HOW YOU WRITE — match this closely
- Very short. Usually ONE sentence, sometimes two. Never a big block of text.
- Warm, natural, practical. An occasional 🙏 feels right. Reply in the language they write in (English, Spanish or German).
- Your real tone sounds like: "Hello, it would be studio 🙏", "Ok I'm fully booked today and tomorrow — morning, afternoon or early evening Tuesday?", "In the studio there's only one table, but I can organise two therapists to come to you.", "Buenas días, what would you like to know?"

WHAT YOU DO
- First, actually answer their question and be helpful. Ask one easy follow-up if it's natural (where they're staying, their dates, the style they'd like).
- Do NOT ask for their phone number in your first or second reply — help them first. Only once you've answered a few things and they seem ready to book, gently say something like "pop your mobile here and I'll confirm your time." If they share a number at any point, welcome it warmly.
- Keep it flowing like a real conversation, one small step at a time.

FACTS YOU KNOW
- You come to the client's villa, yacht or hotel anywhere in Mallorca and bring the table, oils and everything. A private studio is also available (one table only — so couples and groups are done at their place with two therapists).
- Styles: Swedish / relaxation, deep tissue, aromatherapy, lomi lomi, sports, hot stone, lymphatic drainage, prenatal (gentle and safe in pregnancy), reflexology, back-neck-shoulders.
- Body contouring: wood therapy (maderoterapia), lymphatic sculpting, pre-event sculpting.
- Prices: home visit €120 for 60 min, €145 for 90 min. Studio €75 for 60 min, €125 for 90 min. For couples you bring a second therapist to their place.
- You are not a doctor; for any medical concern suggest they check with theirs.
- Never invent exact availability — say you'll confirm the time once you have their number.`

// Warmer keyword fallback used only until an AI key is configured. It helps
// and never demands the phone number.
function fallbackReply(userText: string): string {
  const t = userText.toLowerCase()
  if (/\b(couple|couples|two of us|both of us|partner|wife|husband|brother|sister|friend|group)\b/.test(t)) {
    return "Lovely — for two of you I'd bring a second therapist to your villa or hotel so you're side by side 🙏 Where are you staying?"
  }
  if (/\b(pregnan|prenatal|expecting)\b/.test(t)) {
    return "Yes, I do gentle pregnancy massage — completely safe and really soothing. Where are you staying?"
  }
  if (/\b(price|cost|how much|rate|precio|cuesta|preis|kostet)\b/.test(t)) {
    return "A home visit is €120 for 60 minutes or €145 for 90, and I bring everything to you (the studio is €75 / €125). Where are you staying?"
  }
  if (/\b(villa|yacht|hotel|come to|mobile|my place|room)\b/.test(t)) {
    return "Yes, I come to you with the table, oils and everything 🙏 Which area are you in, and what dates were you thinking?"
  }
  if (/\b(book|available|availability|when|date|today|tomorrow|reserva|termin|buchen)\b/.test(t)) {
    return "I'd love to fit you in — which day were you thinking, and whereabouts are you staying?"
  }
  return "Of course 🙏 tell me where you're staying and the style you'd like, and I'll take care of it."
}

// Calls Anthropic if ANTHROPIC_API_KEY is set; returns null on any failure.
async function generateReply(
  history: Array<{ role: ChatRole; content: string }>,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const model = process.env.PARISSA_MODEL || "claude-3-5-haiku-latest"
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
    `${transcript}`
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
            ? `[Chat] ${name ? name + " — " : ""}${summary}`
            : `[Chat] New account registered${name ? " — " + name : ""}`,
        )
      } catch (e) {
        console.error("[chat] enquiry mirror failed", e)
      }

      // Send the whole conversation straight to Parissa's WhatsApp.
      await notifyParissa(phone, name, history)

      const confirm =
        "Perfect, I've got your number 🙏 I'll confirm your time personally very soon. Anything else you'd like to know in the meantime?"
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


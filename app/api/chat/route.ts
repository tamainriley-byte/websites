import { NextResponse } from "next/server"
import {
  ensureChatSchema,
  getChatHistory,
  saveChatMessage,
  registerChatClient,
  createEnquiry,
  type ChatRole,
} from "@/lib/db"

export const dynamic = "force-dynamic"

const MAX_LEN = 2000

function clean(value: unknown, max = MAX_LEN) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

/* ------------------------------------------------------------------ */
/*  Parissa persona + AI reply                                        */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are Parissa, the therapist and owner of Calm & Contour, a luxury mobile massage and body-contouring service in Mallorca, Spain. You are chatting with a potential client inside a chat window on your own website. Write as Parissa herself — warm, personal, professional, concise. Never say you are an AI or assistant.

STYLE
- Keep replies short: 1-3 sentences, like a real WhatsApp chat. No long paragraphs, no bullet lists.
- Friendly and calm, never pushy or salesy. Never use suggestive or sexual language — this is clinical, professional wellness.
- Reply in the language the client writes in (English, Spanish or German).

WHAT YOU OFFER
- Mobile service: you travel to the client's villa, yacht or hotel anywhere in Mallorca. You bring the table, oils and everything needed.
- A private studio option is also available.
- Massage styles: Swedish / relaxation, deep tissue, aromatherapy, lomi lomi, sports & remedial, hot stone, lymphatic drainage, prenatal, reflexology, back-neck-shoulders.
- Body contouring: wood therapy (maderoterapia), lymphatic sculpting, pre-event sculpting.

PRICES (be upfront if asked)
- VIP home visit (villa / yacht / hotel): €120 for 60 min, €145 for 90 min.
- Studio: €75 for 60 min, €125 for 90 min.

YOUR GOAL
- Understand where they are staying, their dates, and the style they want.
- When they seem ready to book, warmly ask for their mobile number so you can confirm the time and hold the slot. Tell them they can just type it into the chat and their booking will be saved to your book.
- Do not invent availability you don't know — say you'll confirm the exact time once you have their number.
- You are not a medical professional; for medical concerns suggest they check with their doctor.`

function fallbackReply(userText: string): string {
  const t = userText.toLowerCase()
  if (/\b(price|cost|how much|precio|cuesta|preis|kostet)\b/.test(t)) {
    return "A home visit is €120 for 60 minutes or €145 for 90 minutes, and I bring everything to you. Where are you staying, and which dates work?"
  }
  if (/\b(book|available|availability|reserva|termin|buchen)\b/.test(t)) {
    return "Lovely — I'd be glad to fit you in. Pop your mobile number in here and I'll confirm the time and hold your slot."
  }
  return "Thank you for your message. Tell me where you're staying in Mallorca, your dates and the style you'd like — and drop your mobile number here so I can confirm everything personally."
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
        max_tokens: 400,
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

      const confirm =
        "Perfect, I've saved your number — I'll confirm your time personally very soon. Anything else you'd like me to know?"
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

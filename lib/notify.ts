import {
  getChatHistory,
  findColdSessions,
  claimClosedNotification,
  type ChatMessage,
  type ChatSession,
} from "@/lib/db"

/* ------------------------------------------------------------------ */
/*  Owner notifications (WhatsApp via CallMeBot)                      */
/* ------------------------------------------------------------------ */

// Sends a WhatsApp to Parissa (PARISSA_WHATSAPP + CALLMEBOT_APIKEY) and, if
// configured, to the owner too (OWNER_WHATSAPP + OWNER_CALLMEBOT_APIKEY).
// CallMeBot is the free bridge; each recipient needs their own apikey.
// Skips silently if unset.
export async function sendOwnerWhatsApp(message: string) {
  const recipients = [
    { to: process.env.PARISSA_WHATSAPP, key: process.env.CALLMEBOT_APIKEY },
    { to: process.env.OWNER_WHATSAPP, key: process.env.OWNER_CALLMEBOT_APIKEY },
  ].filter((r) => r.to && r.key) as Array<{ to: string; key: string }>
  if (recipients.length === 0) return

  await Promise.all(
    recipients.map(async (r) => {
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(r.to)}` +
        `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(r.key)}`
      try {
        await fetch(url)
      } catch (err) {
        console.error("[notify] WhatsApp send failed", err)
      }
    }),
  )
}

export function formatTranscript(history: ChatMessage[]) {
  return history
    .map((m) => `${m.role === "user" ? "Client" : "Parissa"}: ${m.content}`)
    .join("\n")
}

// Alert the moment a client shares their number: AI is still chatting.
export async function notifyOwners(
  phone: string,
  name: string | null,
  history: ChatMessage[],
) {
  await sendOwnerWhatsApp(
    `New lead 🌿 A potential client has just entered their phone number and the AI is chatting to them now.\n\n` +
      `Mobile: ${phone}${name ? `\nName: ${name}` : ""}\n\n` +
      `Chat so far:\n${formatTranscript(history) || "(no messages yet)"}\n\n` +
      `If the conversation finishes or they go cold, we'll let you know and you should call them right away.`,
  )
}

// The follow-through on that promise: when a captured lead leaves the chat
// (beacon) or goes quiet (sweep), send Parissa the FINAL transcript once.
export async function notifyConversationEnded(
  session: Pick<
    ChatSession,
    "session_id" | "phone" | "name" | "city" | "country"
  >,
  reason: "left" | "cold",
) {
  const claimed = await claimClosedNotification(session.session_id)
  if (!claimed) return
  const history = await getChatHistory(session.session_id)
  const place = [session.city, session.country].filter(Boolean).join(", ")
  await sendOwnerWhatsApp(
    `${reason === "left" ? "They've left the chat" : "They've gone quiet"} 📞 Call this lead now.\n\n` +
      `Mobile: ${session.phone}${session.name ? `\nName: ${session.name}` : ""}${place ? `\nFrom: ${place}` : ""}\n\n` +
      `Full conversation:\n${formatTranscript(history)}`,
  )
}

// Piggybacks on chat traffic (plus the daily report cron): finds captured
// leads quiet for 15+ minutes that never got the final-transcript ping.
export async function sweepColdLeads() {
  try {
    const cold = await findColdSessions(15)
    for (const s of cold) {
      await notifyConversationEnded(s, "cold")
    }
  } catch (err) {
    console.error("[notify] cold sweep failed", err)
  }
}

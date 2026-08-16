// Terry's gratitude affirmation, emailed four times a day by the GitHub
// Actions schedule in .github/workflows/gratitude.yml → /api/gratitude.
// Recipient defaults to terry@tabifa.com, override with GRATITUDE_EMAIL_TO.

const SITE = "https://calmandcontour.com"

// One image per send slot so each email of the day looks different.
const SLOT_IMAGES = [
  { name: "Morning", image: `${SITE}/images/hero-cove.png` },
  { name: "Midday", image: `${SITE}/images/paris-seaside.jpeg` },
  { name: "Afternoon", image: `${SITE}/images/villa-terrace.png` },
  { name: "Evening", image: `${SITE}/images/beach-treatment.jpeg` },
] as const

const MESSAGE_PARAGRAPHS = [
  "I'm grateful for being back.",
  "I'm grateful for being funny, grateful for being considerate, and grateful for being caring. I'm grateful for being loving and grateful for being educational. I'm grateful for being a friend.",
  "I'm grateful for all the things that I can do that are good, and why they have my time.",
  "I'm grateful for all of my family and all of my friends. I'm grateful for being a straight, fair man — not letting anybody abuse me, having brilliant ideas, creating such forward-thinking solutions, and serving as many people as I can to give me this continued life, love and happiness — spotting the villains and keeping them at bay, and not being a villain myself.",
  "I'm grateful for everything that's happened.",
  "I stand here now with gratitude for the hundreds of people's lives that I'm able to touch in a positive way — and I'm the man to do it, and I'm excited about it.",
  "So let's go. 🚀",
]

// Slot by Mallorca local hour so the same image shows at the same time of day
// year-round even though the cron fires in UTC.
export function currentSlot(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Madrid",
    }).format(now),
  )
  if (hour < 10) return SLOT_IMAGES[0]
  if (hour < 14) return SLOT_IMAGES[1]
  if (hour < 18) return SLOT_IMAGES[2]
  return SLOT_IMAGES[3]
}

export function renderGratitudeHtml(now = new Date()) {
  const slot = currentSlot(now)
  const paragraphs = MESSAGE_PARAGRAPHS.map(
    (p, i) =>
      `<p style="font-family:Georgia,serif;font-size:${i === 0 ? 22 : 16}px;line-height:1.6;color:#1f2937;${i === 0 ? "font-weight:bold;" : ""}">${p}</p>`,
  ).join("\n")
  return `<div style="max-width:560px;margin:0 auto;padding:24px;background:#faf7f2;">
    <img src="${slot.image}" alt="${slot.name} in Mallorca" width="512" style="width:100%;border-radius:12px;" />
    ${paragraphs}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;">${slot.name} gratitude · sent automatically four times a day</p>
  </div>`
}

// Sends via Resend, same transport as the daily report. Returns false (and
// logs) instead of throwing so the schedule never hard-fails.
export async function sendGratitudeEmail(now = new Date()): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[gratitude] RESEND_API_KEY not set, skipping email send")
    return false
  }
  const to = process.env.GRATITUDE_EMAIL_TO || "terry@tabifa.com"
  const from =
    process.env.REPORT_EMAIL_FROM || "Calm & Contour <onboarding@resend.dev>"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🌅 Your ${currentSlot(now).name.toLowerCase()} gratitude moment`,
        html: renderGratitudeHtml(now),
      }),
    })
    if (!res.ok) {
      console.error("[gratitude] Resend send failed", res.status, await res.text())
      return false
    }
    return true
  } catch (error) {
    console.error("[gratitude] Resend send failed", error)
    return false
  }
}

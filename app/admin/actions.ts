"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  updateEnquiryStatus,
  setLeadStatusByPhone,
  markBookedByPhone,
  saveChatMessage,
  setAiMuted,
} from "@/lib/db"
import { createBooking } from "@/lib/gcal"

const COOKIE_NAME = "admin_auth"

export async function isAuthed() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === password
}

export async function login(_prevState: unknown, formData: FormData) {
  const password = process.env.ADMIN_PASSWORD
  const submitted = String(formData.get("password") ?? "")

  if (!password) {
    return { error: "ADMIN_PASSWORD is not configured." }
  }
  if (submitted !== password) {
    return { error: "Incorrect password." }
  }

  const store = await cookies()
  store.set(COOKIE_NAME, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect("/admin")
}

// Toggle a lead between "new" and "booked" — the number that unlocks true
// cost-per-booking in the weekly report.
export async function setBooked(formData: FormData) {
  if (!(await isAuthed())) return
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id) || id <= 0) return
  const booked = formData.get("booked") === "1"
  await updateEnquiryStatus(id, booked ? "booked" : "new")
  revalidatePath("/admin")
}

const STUDIO_ADDRESS =
  "Calle Benito Jerónimo Feijoo 4, Portals Nous (Costa d'en Blanes), 07181 Mallorca"

// Paste-to-book: Parissa pastes a WhatsApp message/conversation and the AI
// pulls out the booking details, which prefill the add-booking form for a
// human check before anything touches the calendar.
export async function parseBookingText(formData: FormData) {
  if (!(await isAuthed())) return
  const text = String(formData.get("text") ?? "")
    .trim()
    .slice(0, 4000)
  if (!text) redirect("/admin?manual=parsefail")
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) redirect("/admin?manual=parsefail")

  const now = new Date()
  const today = now.toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" })
  const weekday = now.toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "Europe/Madrid",
  })

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.PARISSA_MODEL || "claude-haiku-4-5",
        max_tokens: 300,
        system: `Extract massage booking details from pasted text (often a WhatsApp conversation, any language). Today is ${weekday} ${today}, timezone Europe/Madrid — resolve relative dates like "tomorrow" or "Friday" to real dates. "The studio" means the therapist's studio; output location "studio" for it. Leave any field you cannot find as an empty string. Never invent details.`,
        messages: [{ role: "user", content: text }],
        tools: [
          {
            name: "extracted_booking",
            description: "The booking details found in the text",
            input_schema: {
              type: "object",
              properties: {
                date: { type: "string", description: "YYYY-MM-DD, or empty" },
                start_time: { type: "string", description: "HH:MM 24h, or empty" },
                duration_minutes: { type: "string", description: "60, 90 or 120, or empty" },
                treatment: { type: "string", description: "e.g. deep tissue massage, or empty" },
                location: { type: "string", description: "'studio' or the address/area, or empty" },
                phone: { type: "string", description: "client mobile if present, or empty" },
              },
              required: [],
            },
          },
        ],
        tool_choice: { type: "tool", name: "extracted_booking" },
      }),
    })
    if (!res.ok) redirect("/admin?manual=parsefail")
    const data = (await res.json()) as {
      content?: Array<{ type: string; input?: Record<string, unknown> }>
    }
    const tool = data.content?.find((b) => b.type === "tool_use")
    const got = (tool?.input ?? {}) as Record<string, unknown>
    const q = new URLSearchParams()
    const set = (key: string, val: unknown) => {
      const s = String(val ?? "").trim()
      if (s) q.set(key, s.slice(0, 200))
    }
    set("bdate", got.date)
    set("btime", got.start_time)
    set("bdur", got.duration_minutes)
    set("btreat", got.treatment)
    set("bloc", got.location)
    set("bphone", got.phone)
    q.set("manual", "parsed")
    redirect(`/admin?${q.toString()}`)
  } catch (err) {
    // redirect() throws internally — let those through.
    if (err && typeof err === "object" && "digest" in err) throw err
    console.error("[admin] parseBookingText failed", err)
    redirect("/admin?manual=parsefail")
  }
}

// Manual booking from /admin: writes straight into Parissa's Google
// Calendar (walk-ins, WhatsApp bookings, or rescuing a chat booking the
// AI confirmed but failed to write).
export async function addManualBooking(formData: FormData) {
  if (!(await isAuthed())) return
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40)
  const date = String(formData.get("date") ?? "")
  const time = String(formData.get("time") ?? "")
  const durationRaw = Number(formData.get("duration") ?? 60)
  const duration = [60, 90, 120].includes(durationRaw) ? durationRaw : 60
  const treatment =
    String(formData.get("treatment") ?? "").trim().slice(0, 100) || "Massage"
  const location =
    String(formData.get("location") ?? "").trim().slice(0, 200) || "studio"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    redirect("/admin?manual=error")
  }

  const result = await createBooking({
    date,
    start_time: time,
    duration_minutes: duration,
    treatment,
    location,
    phone: phone || "manual booking",
  })

  if (result.startsWith("BOOKED")) {
    if (phone) {
      let day = date
      const d = new Date(`${date}T00:00:00`)
      if (!Number.isNaN(d.getTime())) {
        day = d.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      }
      const where = /studio/i.test(location)
        ? `at the studio, ${STUDIO_ADDRESS}`
        : `at ${location}`
      await markBookedByPhone(
        phone,
        `${day} at ${time}, ${duration} min ${treatment}, ${where}`,
      ).catch(() => {})
    }
    revalidatePath("/admin")
    redirect("/admin?manual=ok")
  }
  redirect("/admin?manual=error")
}

// Booking status straight from a chat card: new → booked → shown.
export async function setLeadStatus(formData: FormData) {
  if (!(await isAuthed())) return
  const phone = String(formData.get("phone") ?? "").slice(0, 40)
  const status = String(formData.get("status") ?? "")
  if (!phone || !["new", "booked", "shown"].includes(status)) return
  await setLeadStatusByPhone(phone, status)
  revalidatePath("/admin")
}

// Parissa replies in a conversation from /admin. Her message appears in the
// visitor's chat window (the widget polls for new messages while open).
export async function sendReply(formData: FormData) {
  if (!(await isAuthed())) return
  const sessionId = String(formData.get("sessionId") ?? "").slice(0, 100)
  const text = String(formData.get("text") ?? "")
    .trim()
    .slice(0, 2000)
  if (!sessionId || !text) return
  await saveChatMessage(sessionId, "assistant", text)
  revalidatePath("/admin")
}

// Take over / hand back: while muted the AI stays silent in that chat.
export async function setTakeover(formData: FormData) {
  if (!(await isAuthed())) return
  const sessionId = String(formData.get("sessionId") ?? "").slice(0, 100)
  const muted = formData.get("muted") === "1"
  if (!sessionId) return
  await setAiMuted(sessionId, muted)
  revalidatePath("/admin")
}

export async function logout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  redirect("/admin")
}

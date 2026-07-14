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

import { getSetting, setSetting } from "@/lib/db"

/* ------------------------------------------------------------------ */
/*  Google Calendar for Parissa (single-therapist setup).             */
/*  - Owner connects once via /api/gcal/auth (OAuth, offline access). */
/*  - The chat AI reads her real availability (free/busy) and books   */
/*    confirmed appointments straight into her primary calendar.      */
/*  Env: GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (Google Cloud OAuth  */
/*  web client, redirect URI <site>/api/gcal/callback).               */
/* ------------------------------------------------------------------ */

const REFRESH_TOKEN_KEY = "gcal_refresh_token"
const TZ = "Europe/Madrid"
// Working window offered to clients, Mallorca time.
const DAY_START_H = 9
const DAY_END_H = 21

export function gcalConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  )
}

export async function gcalConnected(): Promise<boolean> {
  if (!gcalConfigured()) return false
  return Boolean(await getSetting(REFRESH_TOKEN_KEY))
}

export function gcalAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
    access_type: "offline",
    prompt: "consent",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function gcalExchangeCode(code: string, redirectUri: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })
  const data = (await res.json()) as {
    refresh_token?: string
    error?: string
    error_description?: string
  }
  if (!res.ok || !data.refresh_token) {
    throw new Error(
      `Google token exchange failed: ${data.error || res.status} ${data.error_description || ""}`,
    )
  }
  await setSetting(REFRESH_TOKEN_KEY, data.refresh_token)
}

async function accessToken(): Promise<string | null> {
  const refreshToken = await getSetting(REFRESH_TOKEN_KEY)
  if (!refreshToken || !gcalConfigured()) return null
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      grant_type: "refresh_token",
    }),
  })
  if (!res.ok) {
    console.error("[gcal] token refresh failed", res.status, await res.text())
    return null
  }
  const data = (await res.json()) as { access_token?: string }
  return data.access_token ?? null
}

/* --------------------- timezone helpers ---------------------------- */

// Offset (ms) between UTC and Mallorca wall time at the given instant.
function madridOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(at)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  const wall = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  )
  return wall - at.getTime()
}

function fmtTime(epochMs: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(epochMs))
}

function fmtDay(epochMs: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(epochMs))
}

/* --------------------- availability -------------------------------- */

type Interval = { start: number; end: number }

async function busyIntervals(days: number): Promise<Interval[] | null> {
  const token = await accessToken()
  if (!token) return null
  const timeMin = new Date()
  const timeMax = new Date(timeMin.getTime() + days * 24 * 60 * 60 * 1000)
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: "primary" }],
    }),
  })
  if (!res.ok) {
    console.error("[gcal] freeBusy failed", res.status, await res.text())
    return null
  }
  const data = (await res.json()) as {
    calendars?: { primary?: { busy?: Array<{ start: string; end: string }> } }
  }
  return (data.calendars?.primary?.busy ?? []).map((b) => ({
    start: Date.parse(b.start),
    end: Date.parse(b.end),
  }))
}

// Human-readable free slots for the next `days` days, for the AI prompt.
// Returns null when the calendar isn't connected (chat then behaves as before).
export async function availabilityText(days = 7): Promise<string | null> {
  try {
    const busy = await busyIntervals(days)
    if (busy === null) return null

    const now = Date.now()
    const lines: string[] = []
    for (let d = 0; d < days; d++) {
      // Sample noon UTC on that day for a stable DST offset.
      const sample = new Date(now + d * 86400000)
      const offset = madridOffsetMs(sample)
      // Local midnight of that day in Mallorca, as a UTC epoch.
      const localNow = new Date(now + offset)
      const dayStartLocal = Date.UTC(
        localNow.getUTCFullYear(),
        localNow.getUTCMonth(),
        localNow.getUTCDate() + d,
        DAY_START_H,
      )
      const windowStart = Math.max(dayStartLocal - offset, now)
      const windowEnd =
        Date.UTC(
          localNow.getUTCFullYear(),
          localNow.getUTCMonth(),
          localNow.getUTCDate() + d,
          DAY_END_H,
        ) - offset
      if (windowEnd <= windowStart) continue

      // Subtract busy intervals from the day window.
      const dayBusy = busy
        .filter((b) => b.end > windowStart && b.start < windowEnd)
        .sort((a, b) => a.start - b.start)
      const free: Interval[] = []
      let cursor = windowStart
      for (const b of dayBusy) {
        if (b.start > cursor) free.push({ start: cursor, end: b.start })
        cursor = Math.max(cursor, b.end)
      }
      if (cursor < windowEnd) free.push({ start: cursor, end: windowEnd })

      const slots = free
        .filter((f) => f.end - f.start >= 60 * 60 * 1000) // ≥ 1h
        .map((f) => `${fmtTime(f.start)}-${fmtTime(f.end)}`)
      lines.push(
        `${fmtDay(windowStart)}: ${slots.length ? slots.join(", ") : "fully booked"}`,
      )
    }
    return lines.join("\n")
  } catch (err) {
    console.error("[gcal] availability failed", err)
    return null
  }
}

/* --------------------- upcoming bookings (admin view) --------------- */

export type UpcomingEvent = {
  day: string // e.g. "Mon 14 Jul"
  time: string // e.g. "17:00-18:30" or "all day"
  summary: string
}

// Next `days` days of events from the connected calendar, for /admin.
// One list per therapist later — for now Parissa's primary calendar.
export async function upcomingEvents(days = 14): Promise<UpcomingEvent[] | null> {
  try {
    const token = await accessToken()
    if (!token) return null
    const timeMin = new Date()
    const timeMax = new Date(timeMin.getTime() + days * 86400000)
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    })
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      { headers: { authorization: `Bearer ${token}` } },
    )
    if (!res.ok) {
      console.error("[gcal] events list failed", res.status, await res.text())
      return null
    }
    const data = (await res.json()) as {
      items?: Array<{
        summary?: string
        start?: { dateTime?: string; date?: string }
        end?: { dateTime?: string; date?: string }
      }>
    }
    return (data.items ?? []).map((e) => {
      const startMs = e.start?.dateTime ? Date.parse(e.start.dateTime) : null
      const endMs = e.end?.dateTime ? Date.parse(e.end.dateTime) : null
      const dayRef = startMs ?? Date.parse(`${e.start?.date}T12:00:00Z`)
      return {
        day: fmtDay(dayRef),
        time:
          startMs && endMs
            ? `${fmtTime(startMs)}-${fmtTime(endMs)}`
            : "all day",
        summary: e.summary || "(untitled)",
      }
    })
  } catch (err) {
    console.error("[gcal] upcoming events failed", err)
    return null
  }
}

/* --------------------- booking ------------------------------------- */

export type BookingInput = {
  date: string // YYYY-MM-DD
  start_time: string // HH:MM, Mallorca time
  duration_minutes: number
  treatment: string
  location: string
  phone: string
}

// Creates the event in Parissa's primary calendar. Returns a short outcome
// string for the AI (success details or a reason it failed).
export async function createBooking(b: BookingInput): Promise<string> {
  const token = await accessToken()
  if (!token) return "ERROR: calendar not connected, keep the booking provisional."

  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !/^\d{2}:\d{2}$/.test(b.start_time)) {
    return "ERROR: invalid date or time format."
  }
  const [h, m] = b.start_time.split(":").map(Number)
  const endMinutes = h * 60 + m + b.duration_minutes
  const end = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: `${b.treatment} ${b.duration_minutes}min — ${b.phone}`,
        description: `Location: ${b.location}\nClient mobile: ${b.phone}\nBooked by the website AI chat. Transcript: https://calmandcontour.com/admin`,
        start: { dateTime: `${b.date}T${b.start_time}:00`, timeZone: TZ },
        end: { dateTime: `${b.date}T${end}:00`, timeZone: TZ },
      }),
    },
  )
  if (!res.ok) {
    console.error("[gcal] event insert failed", res.status, await res.text())
    return "ERROR: could not write to the calendar, keep the booking provisional."
  }
  return `BOOKED: ${b.treatment}, ${b.duration_minutes} min, ${b.date} ${b.start_time}-${end} (Mallorca time), ${b.location}.`
}

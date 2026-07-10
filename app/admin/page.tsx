import type { Metadata } from "next"
import { getEnquiries, getConversations, ensureChatSchema } from "@/lib/db"
import {
  gcalConfigured,
  gcalConnected,
  upcomingEvents,
  type UpcomingEvent,
} from "@/lib/gcal"
import { isAuthed, logout, setBooked } from "./actions"
import { AdminLoginForm } from "@/components/admin-login-form"

export const metadata: Metadata = {
  title: "Enquiries | Calm & Contour Admin",
  robots: { index: false, follow: false },
}

// Always render fresh so new enquiries show up on reload.
export const dynamic = "force-dynamic"

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function flag(country: string | null) {
  if (!country || country.length !== 2) return ""
  const cc = country.toUpperCase()
  return String.fromCodePoint(
    ...[...cc].map((c) => 127397 + c.charCodeAt(0)),
  )
}

export default async function AdminPage() {
  const authed = await isAuthed()

  if (!authed) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-background px-5 py-16">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Owner sign in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Enter your password to view booking enquiries.
          </p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    )
  }

  await ensureChatSchema().catch(() => {})
  const [enquiries, conversations, calendarConnected] = await Promise.all([
    getEnquiries(),
    getConversations().catch(() => []),
    gcalConnected().catch(() => false),
  ])
  const events: UpcomingEvent[] | null = calendarConnected
    ? await upcomingEvents(14).catch(() => null)
    : null

  return (
    <main className="min-h-[100svh] bg-background px-5 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Calm &amp; Contour · Owner
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {conversations.length}{" "}
              {conversations.length === 1 ? "chat" : "chats"} ·{" "}
              {enquiries.length}{" "}
              {enquiries.length === 1 ? "enquiry" : "enquiries"} ·{" "}
              {enquiries.filter((e) => e.status === "booked").length} booked
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* --- Google Calendar status --- */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Google Calendar {calendarConnected ? "· connected ✓" : "· not connected"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {calendarConnected
                ? "The chat AI reads Parissa's availability and books confirmed appointments straight into her calendar."
                : gcalConfigured()
                  ? "Connect Parissa's Google account so the AI can see her availability and book directly."
                  : "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel first, then connect here."}
            </p>
          </div>
          {!calendarConnected && gcalConfigured() ? (
            <a
              href="/api/gcal/auth"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Connect calendar
            </a>
          ) : null}
        </div>

        {/* --- Upcoming bookings (Parissa's calendar, next 14 days) --- */}
        {events !== null && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl font-medium text-foreground">
              Upcoming · next 14 days
            </h2>
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing in the calendar yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {events.map((e, i) => {
                  const newDay = i === 0 || events[i - 1].day !== e.day
                  return (
                    <li key={i}>
                      {newDay && (
                        <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground first:mt-0">
                          {e.day}
                        </p>
                      )}
                      <div className="flex items-baseline gap-3 text-sm">
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {e.time}
                        </span>
                        <span className="text-foreground">{e.summary}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        {/* --- Chat conversations --- */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Chats
          </h2>
          {conversations.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No chats yet.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {conversations.map((c) => {
                const place = [c.city, c.country].filter(Boolean).join(", ")
                return (
                  <li
                    key={c.session_id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {c.phone ? (
                        <a
                          href={`tel:${c.phone}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {c.name ? `${c.name} · ` : ""}
                          {c.phone}
                        </a>
                      ) : (
                        <span className="font-medium text-muted-foreground">
                          Anonymous visitor
                        </span>
                      )}
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {formatDate(c.last_at)}
                      </span>
                    </div>

                    {/* Source details */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {flag(c.country)} {place || "Location unknown"}
                      {c.device ? ` · ${c.device}` : ""}
                      {c.ip ? ` · IP ${c.ip}` : ""}
                    </p>
                    {c.referer ? (
                      <p className="text-xs text-muted-foreground">
                        via {c.referer}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-2">
                      {c.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${
                            m.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                              m.role === "user"
                                ? "rounded-br-sm bg-secondary text-foreground"
                                : "rounded-bl-sm bg-muted text-foreground"
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* --- Booking form enquiries --- */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Booking enquiries
          </h2>
          {enquiries.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No enquiries yet.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {enquiries.map((enquiry) => {
                const isBooked = enquiry.status === "booked"
                return (
                  <li
                    key={enquiry.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {enquiry.phone}
                      </a>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                          isBooked
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {isBooked ? "Booked ✓" : enquiry.status}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-pretty leading-relaxed text-foreground">
                      {enquiry.message}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {formatDate(enquiry.created_at)}
                      </p>
                      <form action={setBooked}>
                        <input type="hidden" name="id" value={enquiry.id} />
                        <input
                          type="hidden"
                          name="booked"
                          value={isBooked ? "0" : "1"}
                        />
                        <button
                          type="submit"
                          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                            isBooked
                              ? "border border-border text-muted-foreground hover:bg-muted"
                              : "bg-primary text-primary-foreground hover:opacity-90"
                          }`}
                        >
                          {isBooked ? "Undo booked" : "Mark booked"}
                        </button>
                      </form>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

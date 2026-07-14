import type { Metadata } from "next"
import { getEnquiries, getConversations, ensureChatSchema } from "@/lib/db"
import {
  gcalConfigured,
  gcalConnected,
  upcomingEvents,
  type UpcomingEvent,
} from "@/lib/gcal"
import {
  isAuthed,
  logout,
  setBooked,
  setLeadStatus,
  sendReply,
  setTakeover,
  addManualBooking,
  parseBookingText,
} from "./actions"
import { AdminLoginForm } from "@/components/admin-login-form"
import {
  waClientLink,
  confirmationMessage,
  rescheduleMessage,
  paymentRequestMessage,
  reviewRequestMessage,
} from "@/lib/whatsapp"

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    manual?: string
    bdate?: string
    btime?: string
    bdur?: string
    btreat?: string
    bloc?: string
    bphone?: string
  }>
}) {
  const authed = await isAuthed()
  const params = (await searchParams) ?? {}
  const manual = params.manual
  const parsed = manual === "parsed"

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
  // Chat leads are managed on their chat card; this list keeps only the
  // enquiries that arrived through the booking form (no chat to live on).
  const formEnquiries = enquiries.filter(
    (e) => !e.message.startsWith("[Chat]"),
  )
  const bookedCount = enquiries.filter(
    (e) => e.status === "booked" || e.status === "shown",
  ).length
  // Any provider's hosted payment page (Stripe, SumUp, Wise…). When set,
  // booked chats get a "Request payment" button and the confirmation
  // message includes the link.
  const paymentLink = process.env.PAYMENT_LINK_URL || null
  // Google Business "write a review" link. When set, clients marked Shown
  // get an "Ask for review" one-tap WhatsApp (€5/€15/€20 offer).
  const reviewUrl = process.env.GOOGLE_REVIEW_URL || null
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
              {enquiries.length === 1 ? "lead" : "leads"} · {bookedCount}{" "}
              booked
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

        {/* --- Add a booking by hand (walk-ins, WhatsApp bookings) --- */}
        {calendarConnected && (
          <details
            className="mt-6 rounded-2xl border border-border bg-card p-4"
            open={parsed || manual === "error" || manual === "parsefail"}
          >
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Add booking to calendar
            </summary>
            {manual === "ok" && (
              <p className="mt-2 rounded-lg bg-whatsapp/15 px-3 py-2 text-sm text-foreground">
                Booking added to the calendar ✓
              </p>
            )}
            {manual === "error" && (
              <p className="mt-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                That didn&apos;t save, check the date and time and try again.
              </p>
            )}
            {manual === "parsefail" && (
              <p className="mt-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                Couldn&apos;t read that text, fill the form below by hand.
              </p>
            )}
            {parsed && (
              <p className="mt-2 rounded-lg bg-whatsapp/15 px-3 py-2 text-sm text-foreground">
                Details read from your paste — check them, add anything
                missing, then Add to calendar.
              </p>
            )}

            {/* Paste a WhatsApp message; the AI fills the form below. */}
            <form action={parseBookingText} className="mt-3">
              <textarea
                name="text"
                rows={3}
                placeholder="Paste the WhatsApp message or conversation here and the details are read for you… e.g. 'Hi can I book 90 min deep tissue tomorrow at 6pm at Villa Sol, Santa Ponsa? My number is +44…'"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="mt-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Read details from paste
              </button>
            </form>

            <form
              action={addManualBooking}
              className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-4 sm:grid-cols-3"
            >
              <input
                type="date"
                name="date"
                required
                defaultValue={params.bdate ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="time"
                name="time"
                required
                defaultValue={params.btime ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <select
                name="duration"
                defaultValue={params.bdur ?? "60"}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
              <input
                name="treatment"
                placeholder="Treatment (e.g. deep tissue)"
                defaultValue={params.btreat ?? ""}
                className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-1"
              />
              <input
                name="location"
                placeholder="studio, or their address"
                defaultValue={params.bloc ?? ""}
                className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-1"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Client mobile (optional)"
                defaultValue={params.bphone ?? ""}
                className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-1"
              />
              <button
                type="submit"
                className="col-span-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 sm:col-span-3"
              >
                Add to calendar
              </button>
            </form>
          </details>
        )}

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
                const status =
                  c.lead_status === "shown"
                    ? "shown"
                    : c.lead_status === "booked"
                      ? "booked"
                      : "new"
                const confirmLink = c.phone
                  ? waClientLink(
                      c.phone,
                      c.country,
                      confirmationMessage(c.booking_info, paymentLink),
                    )
                  : null
                const rescheduleLink = c.phone
                  ? waClientLink(c.phone, c.country, rescheduleMessage())
                  : null
                const payLink =
                  c.phone && paymentLink
                    ? waClientLink(
                        c.phone,
                        c.country,
                        paymentRequestMessage(paymentLink),
                      )
                    : null
                const reviewLink =
                  c.phone && reviewUrl && status === "shown"
                    ? waClientLink(
                        c.phone,
                        c.country,
                        reviewRequestMessage(reviewUrl),
                      )
                    : null
                return (
                  <li
                    key={c.session_id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
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
                        {c.phone && (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                              status === "shown"
                                ? "bg-whatsapp text-whatsapp-foreground"
                                : status === "booked"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {status === "shown"
                              ? "Shown ✓"
                              : status === "booked"
                                ? "Booked ✓"
                                : "New"}
                          </span>
                        )}
                      </span>
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
                    {status !== "new" && c.booking_info ? (
                      <p className="mt-1 text-xs text-foreground">
                        📅 {c.booking_info}
                      </p>
                    ) : null}

                    {/* Booking controls: manage the lead right on the chat */}
                    {c.phone && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {status === "new" ? (
                          <>
                            <form action={setLeadStatus}>
                              <input
                                type="hidden"
                                name="phone"
                                value={c.phone}
                              />
                              <input
                                type="hidden"
                                name="status"
                                value="booked"
                              />
                              <button
                                type="submit"
                                className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                              >
                                Mark booked
                              </button>
                            </form>
                            {calendarConnected && (
                              <details className="w-full">
                                <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                                  Book + add to calendar…
                                </summary>
                                <form
                                  action={addManualBooking}
                                  className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3"
                                >
                                  <input
                                    type="hidden"
                                    name="phone"
                                    value={c.phone}
                                  />
                                  <input
                                    type="date"
                                    name="date"
                                    required
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  />
                                  <input
                                    type="time"
                                    name="time"
                                    required
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  />
                                  <select
                                    name="duration"
                                    defaultValue="60"
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  >
                                    <option value="60">60 min</option>
                                    <option value="90">90 min</option>
                                    <option value="120">120 min</option>
                                  </select>
                                  <input
                                    name="treatment"
                                    placeholder="Treatment"
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  />
                                  <input
                                    name="location"
                                    placeholder="studio, or address"
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  />
                                  <button
                                    type="submit"
                                    className="rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                                  >
                                    Add to calendar
                                  </button>
                                </form>
                              </details>
                            )}
                          </>
                        ) : (
                          <>
                            {confirmLink && (
                              <a
                                href={confirmLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-whatsapp px-3.5 py-1.5 text-xs font-medium text-whatsapp-foreground hover:opacity-90"
                              >
                                WhatsApp confirmation
                              </a>
                            )}
                            {payLink && (
                              <a
                                href={payLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                              >
                                Request payment
                              </a>
                            )}
                            {reviewLink && (
                              <a
                                href={reviewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                              >
                                Ask for review · €5–€20
                              </a>
                            )}
                            {rescheduleLink && (
                              <a
                                href={rescheduleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                              >
                                Reschedule
                              </a>
                            )}
                            {status === "booked" ? (
                              <form action={setLeadStatus}>
                                <input
                                  type="hidden"
                                  name="phone"
                                  value={c.phone}
                                />
                                <input
                                  type="hidden"
                                  name="status"
                                  value="shown"
                                />
                                <button
                                  type="submit"
                                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                >
                                  Mark shown
                                </button>
                              </form>
                            ) : (
                              <form action={setLeadStatus}>
                                <input
                                  type="hidden"
                                  name="phone"
                                  value={c.phone}
                                />
                                <input
                                  type="hidden"
                                  name="status"
                                  value="booked"
                                />
                                <button
                                  type="submit"
                                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                                >
                                  Undo shown
                                </button>
                              </form>
                            )}
                            <form action={setLeadStatus}>
                              <input
                                type="hidden"
                                name="phone"
                                value={c.phone}
                              />
                              <input type="hidden" name="status" value="new" />
                              <button
                                type="submit"
                                className="rounded-full px-2 py-1.5 text-xs text-muted-foreground hover:underline"
                              >
                                Undo booked
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    )}

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

                    {/* Reply as Parissa + takeover toggle */}
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <form action={sendReply} className="flex items-center gap-2">
                        <input type="hidden" name="sessionId" value={c.session_id} />
                        <input
                          name="text"
                          placeholder={
                            c.ai_muted
                              ? "Reply as Parissa (AI is muted)…"
                              : "Reply as Parissa…"
                          }
                          autoComplete="off"
                          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                        >
                          Send
                        </button>
                      </form>
                      <form action={setTakeover} className="mt-2">
                        <input type="hidden" name="sessionId" value={c.session_id} />
                        <input
                          type="hidden"
                          name="muted"
                          value={c.ai_muted ? "0" : "1"}
                        />
                        <button
                          type="submit"
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            c.ai_muted
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {c.ai_muted
                            ? "AI muted — you're replying · Hand back to AI"
                            : "Take over (mute AI)"}
                        </button>
                      </form>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* --- Booking form enquiries (chat leads live on their chat card) --- */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Booking form enquiries
          </h2>
          {formEnquiries.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No form enquiries yet. Chat leads are managed on their chat
              above.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {formEnquiries.map((enquiry) => {
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

import type { Metadata } from "next"
import { getEnquiries, getConversations } from "@/lib/db"
import { isAuthed, logout } from "./actions"
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

  const [enquiries, conversations] = await Promise.all([
    getEnquiries(),
    getConversations().catch(() => []),
  ])

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
              {enquiries.length === 1 ? "enquiry" : "enquiries"}
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
              {conversations.map((c) => (
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

                  {!c.phone && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      No number captured yet.
                    </p>
                  )}
                </li>
              ))}
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
              {enquiries.map((enquiry) => (
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
                    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-pretty leading-relaxed text-foreground">
                    {enquiry.message}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                    {formatDate(enquiry.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

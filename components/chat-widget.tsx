"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

type Msg = { role: "user" | "assistant"; content: string }

const SESSION_KEY = "cc_chat_session"

const GREETING =
  "Hi, I'm Parissa 🌿 Pop your mobile number in below to start, then ask me anything about the massage, prices or areas and I'll get you booked in."

function newSessionId() {
  return (
    "s_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  )
}

// A small human-feeling pause so replies don't appear instantly.
async function humanPause(startedAt: number) {
  const wait = Math.max(0, 1100 - (Date.now() - startedAt))
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [phone, setPhone] = useState("")
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const sessionRef = useRef<string>("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const phoneSavedRef = useRef(false)
  const hasChattedRef = useRef(false)
  phoneSavedRef.current = phoneSaved
  hasChattedRef.current = messages.some((m) => m.role === "user")

  // Init session id.
  useEffect(() => {
    let id = ""
    try {
      id = localStorage.getItem(SESSION_KEY) || ""
      if (!id) {
        id = newSessionId()
        localStorage.setItem(SESSION_KEY, id)
      }
    } catch {
      id = newSessionId()
    }
    sessionRef.current = id
  }, [])

  const openChat = useCallback(() => setOpen(true), [])

  // OWNER DECISION (11 Jul 2026): every green button opens THIS chat — the
  // number gate, working AI and direct calendar booking make it the funnel.
  // The Google Ads conversion onClick fires before we keep them here.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]',
      ) as HTMLAnchorElement | null
      if (link) {
        e.preventDefault()
        openChat()
      }
    }
    document.addEventListener("click", handler)
    window.addEventListener("open-parissa-chat", openChat as EventListener)
    return () => {
      document.removeEventListener("click", handler)
      window.removeEventListener("open-parissa-chat", openChat as EventListener)
    }
  }, [openChat])

  // Load saved history when first opened.
  useEffect(() => {
    if (!open || messages.length > 0) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type: "history",
            sessionId: sessionRef.current,
          }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.hasPhone) setPhoneSaved(true)
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(
            data.messages.map((m: { role: Msg["role"]; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          )
        } else {
          setMessages([{ role: "assistant", content: GREETING }])
        }
      } catch {
        setMessages([{ role: "assistant", content: GREETING }])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, messages.length])

  // Keep scrolled to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, sending])

  // While the chat is open, check for new messages every few seconds so
  // Parissa's replies from /admin appear live in the conversation.
  useEffect(() => {
    if (!open) return
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type: "history",
            sessionId: sessionRef.current,
          }),
        })
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages((current) =>
            data.messages.length > current.length
              ? data.messages.map(
                  (m: { role: Msg["role"]; content: string }) => ({
                    role: m.role,
                    content: m.content,
                  }),
                )
              : current,
          )
        }
      } catch {
        // network blip, try again next tick
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [open])

  // When the visitor leaves the page mid-conversation, tell the server so
  // Parissa gets the final transcript straight away ("they've gone, call now").
  useEffect(() => {
    const onLeave = () => {
      if (!hasChattedRef.current || !sessionRef.current) return
      try {
        navigator.sendBeacon(
          "/api/chat",
          new Blob(
            [JSON.stringify({ type: "left", sessionId: sessionRef.current })],
            { type: "application/json" },
          ),
        )
      } catch {
        // best effort only
      }
    }
    window.addEventListener("pagehide", onLeave)
    return () => window.removeEventListener("pagehide", onLeave)
  }, [])

  // One-tap number save. autocomplete="tel" lets the phone's keyboard offer
  // the visitor's own number, so this is a single tap on mobile.
  async function savePhone() {
    const value = phone.trim()
    if (!value || savingPhone) return
    // A real mobile has 7-15 digits; stop partial numbers before they start.
    const digits = (value.match(/\d/g) || []).length
    if (digits < 7 || digits > 15) {
      setPhoneError(true)
      return
    }
    setPhoneError(false)
    setSavingPhone(true)
    const startedAt = Date.now()
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "register",
          sessionId: sessionRef.current,
          phone: value,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setPhoneSaved(true)
        if (data.reply) {
          await humanPause(startedAt)
          setMessages((m) => [...m, { role: "assistant", content: data.reply }])
        }
      }
    } catch {
      // leave the bar up so they can retry
    } finally {
      setSavingPhone(false)
    }
  }

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setInput("")
    setMessages((m) => [...m, { role: "user", content: text }])
    setSending(true)
    const startedAt = Date.now()
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "message",
          sessionId: sessionRef.current,
          message: text,
        }),
      })
      const data = await res.json()
      // Parissa has taken over this chat: no AI reply — her message will
      // arrive via polling when she answers from /admin.
      if (data.muted) return
      const reply =
        data.reply ||
        "Thanks, tell me a little more and I'll sort it out for you."
      await humanPause(startedAt)
      setMessages((m) => [...m, { role: "assistant", content: reply }])
    } catch {
      await humanPause(startedAt)
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I didn't catch that, please try again in a moment.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with Parissa"
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-whatsapp-foreground shadow-xl transition-transform hover:scale-105 md:bottom-6 md:right-6"
        >
          <MessageCircle className="size-6" aria-hidden="true" />
          <span className="hidden text-sm font-medium sm:inline">
            Chat with Parissa
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center sm:inset-auto sm:bottom-6 sm:right-6">
          <div className="flex h-[85svh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#ece5dd] shadow-2xl sm:h-[560px] sm:w-[380px] sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 bg-whatsapp px-4 py-3 text-whatsapp-foreground">
              <img
                src="/images/paris-portrait.jpeg"
                alt="Parissa"
                className="size-10 rounded-full object-cover ring-2 ring-white/40"
              />
              <div className="flex-1 leading-tight">
                <p className="font-medium">Parissa</p>
                <p className="text-xs opacity-80">Calm &amp; Contour · Mallorca</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 transition-colors hover:bg-white/15"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-2 overflow-y-auto px-3 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "rounded-br-sm bg-[#dcf8c6] text-[#111b21]"
                        : "rounded-bl-sm bg-white text-[#111b21]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-[#667781] shadow-sm">
                    Parissa is typing…
                  </div>
                </div>
              )}
            </div>

            {/* One composer box: first it captures the mobile (autocomplete
                offers the visitor's own number = one tap), then it becomes
                the normal message box. */}
            {!phoneSaved ? (
              <div className="bg-[#f0f2f5] px-3 py-2">
                {phoneError && (
                  <p className="mb-1 px-2 text-xs text-red-600">
                    That number looks too short, please enter your full mobile
                    with country code.
                  </p>
                )}
                <div className="flex items-center gap-2">
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setPhoneError(false)
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      savePhone()
                    }
                  }}
                  placeholder="Enter your mobile to start chatting to Parissa"
                  className={`min-w-0 flex-1 rounded-full border bg-white px-4 py-2 text-sm outline-none focus:border-whatsapp ${
                    phoneError ? "border-red-400" : "border-[#d1d7db]"
                  }`}
                />
                <button
                  type="button"
                  onClick={savePhone}
                  disabled={savingPhone || !phone.trim()}
                  aria-label="Start chat"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Send className="size-5" aria-hidden="true" />
                </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Ask about the massage, or say hello…"
                  className="min-w-0 flex-1 rounded-full border border-[#d1d7db] bg-white px-4 py-2 text-sm outline-none focus:border-whatsapp"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending || !input.trim()}
                  aria-label="Send"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Send className="size-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

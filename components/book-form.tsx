"use client"

import { useState, type FormEvent } from "react"
import { MessageCircle } from "lucide-react"
import { whatsappLink, trackWhatsAppConversion } from "@/lib/whatsapp"

export function BookForm() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedPhone = phone.trim()
    const trimmedMessage = message.trim()

    if (!trimmedPhone || !trimmedMessage) {
      setError("Please add your mobile number and what you'd like to book.")
      setStatus("error")
      return
    }

    setStatus("sending")
    setError("")

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmedPhone, message: trimmedMessage }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Could not save your enquiry.")
      }
    } catch (err) {
      // Even if saving fails, still let the guest reach Parissa on WhatsApp.
      console.error("[v0] Enquiry save failed:", err)
    }

    // Fire the conversion event and open WhatsApp prefilled with their details.
    trackWhatsAppConversion()
    const waMessage = `Hi Parissa, my mobile is ${trimmedPhone}. ${trimmedMessage}`
    window.open(whatsappLink(waMessage), "_blank", "noopener,noreferrer")

    setStatus("idle")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium tracking-wide text-foreground"
        >
          Your mobile
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 7700 900000"
          className="min-h-12 rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-medium tracking-wide text-foreground"
        >
          What would you like to book?
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Where you're staying, your dates, and the treatment or style you'd like."
          className="rounded-2xl border border-border bg-card px-4 py-3 text-base leading-relaxed text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          required
        />
      </div>

      {status === "error" && error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        {status === "sending" ? "Sending..." : "Send to Parissa"}
      </button>
    </form>
  )
}

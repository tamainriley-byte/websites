"use client"

import { MessageCircle, MapPin } from "lucide-react"
import {
  whatsappLink,
  WHATSAPP_DISPLAY,
  trackWhatsAppConversion,
} from "@/lib/whatsapp"

export function CtaFooter() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src="/images/villa-terrace.png"
          alt="Massage table with lavender on a terrace overlooking the Mediterranean"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center text-background md:py-32">
          <h2 className="text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            Ready to unwind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-background/85">
            Message us on WhatsApp to book your studio treatment or VIP mobile
            service. We&apos;ll find the perfect time and come to you.
          </p>
          <a
            href={whatsappLink(
              "Hello Calm & Contour, I'd like to book a massage in Mallorca.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppConversion()}
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book on WhatsApp
          </a>
          <p className="mt-4 text-sm text-background/70">{WHATSAPP_DISPLAY}</p>
        </div>
      </section>

      <footer className="bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-8">
          <div>
            <span className="font-serif text-2xl font-semibold">
              Calm &amp; Contour
            </span>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-background/70">
              Boutique massage, body and facial treatments by Paris Elizabeth.
              Studio &amp; VIP mobile service across Mallorca.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-background/80">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              Balearic Isles, Spain
            </span>
            <a
              href={whatsappLink(
                "Hello Calm & Contour, I'd like to ask about a treatment.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppConversion()}
              className="flex items-center gap-2 transition-colors hover:text-background"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
        <div className="border-t border-background/15">
          <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-background/50 md:px-8">
            © {new Date().getFullYear()} Calm and Contour Clinic by Paris
            Elizabeth. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

"use client"

import { MessageCircle, MapPin } from "lucide-react"
import { whatsappLink, trackWhatsAppConversion } from "@/lib/whatsapp"

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <img
        src="/images/hero-cove.png"
        alt="Linen-draped massage table on a wooden deck overlooking a turquoise Mallorca cove"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 py-32 text-center text-cream">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/40 bg-cream/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] backdrop-blur-sm">
          <MapPin className="size-3.5" aria-hidden="true" />
          Balearic Isles, Spain
        </span>

        <h1 className="text-balance font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Mallorca VIP
          <br />
          Mobile Massage
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-cream/85 md:text-lg">
          Boutique massage, body and facial treatments brought to your villa,
          yacht or hotel, or enjoyed in our Calm &amp; Contour studio.
          Restorative care, wherever you are on the island.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(
              "Hello Calm & Contour, I'd like to book a VIP mobile massage in Mallorca.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppConversion()}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-7 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book on WhatsApp
          </a>
          <a
            href="#pricing"
            className="inline-flex min-h-12 items-center rounded-full border border-cream/50 px-7 py-3 text-base font-medium text-cream backdrop-blur-sm transition-colors hover:bg-cream/10"
          >
            View treatments &amp; pricing
          </a>
        </div>
      </div>
    </section>
  )
}

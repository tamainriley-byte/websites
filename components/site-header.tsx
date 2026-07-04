"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { whatsappLink, trackWhatsAppConversion } from "@/lib/whatsapp"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Treatments", href: "#treatments" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a
          href="#top"
          className={`flex flex-col leading-none transition-colors ${
            scrolled ? "text-foreground" : "text-cream"
          }`}
        >
          <span className="font-serif text-xl font-semibold tracking-wide md:text-2xl">
            Calm &amp; Contour
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.3em] ${
              scrolled ? "text-muted-foreground" : "text-cream/80"
            }`}
          >
            Mallorca VIP Massage
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-cream"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappLink(
            "Hello Calm & Contour, I'd like to book a massage in Mallorca.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppConversion()}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03] md:px-5"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Book on WhatsApp</span>
          <span className="sm:hidden">Book</span>
        </a>
      </div>
    </header>
  )
}

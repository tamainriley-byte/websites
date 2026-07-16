"use client"

import { useEffect } from "react"
import { trackLeadConversion } from "@/lib/whatsapp"

// Owner decision (16 Jul 2026): no in-app chat or booking. Every
// "Message Parissa" button and this floating launcher open WhatsApp
// directly so Parissa handles enquiries herself. We still fire the
// Google Ads lead conversion on any WhatsApp click so the campaign
// keeps optimising.
const WA = "https://wa.me/34602020734"

export function ChatWidget() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]',
      )
      if (link) trackLeadConversion()
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  return (
    <a
      href={WA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Parissa on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-whatsapp-foreground shadow-xl transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/>
      </svg>
      Chat with Parissa
    </a>
  )
}

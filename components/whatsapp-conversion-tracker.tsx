"use client"

import { useEffect } from "react"
import { trackLeadConversion } from "@/lib/whatsapp"

// Fires the Google Ads lead conversion the moment a visitor clicks any
// WhatsApp link (wa.me / api.whatsapp.com) anywhere on the site — i.e. when
// someone on an ad landing page chooses to message Parissa. Uses a delegated
// capture-phase listener so it also catches buttons rendered after load, and
// fires at most once per page load so a single visitor counts once.
export function WhatsAppConversionTracker() {
  useEffect(() => {
    let fired = false
    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null
      const link = el?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]',
      )
      if (!link || fired) return
      fired = true
      trackLeadConversion()
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}

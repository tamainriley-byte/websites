export const WHATSAPP_NUMBER = "34602020734"
export const WHATSAPP_DISPLAY = "+34 602 02 07 34"

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Dial codes for the countries our visitors actually come from, used to fix
// numbers typed without one (e.g. UK "07894…" needs 44, not a literal 0).
const DIAL_CODES: Record<string, string> = {
  ES: "34", GB: "44", DE: "49", AT: "43", CH: "41", FR: "33", IT: "39",
  NL: "31", BE: "32", IE: "353", PT: "351", SE: "46", NO: "47", DK: "45",
  FI: "358", PL: "48", US: "1", CA: "1",
}

// Best-effort wa.me link TO a client. Returns null when the number can't be
// made internationally dialable (no country code and unknown country).
export function waClientLink(
  phone: string,
  country: string | null | undefined,
  message: string,
): string | null {
  const raw = phone.trim()
  let digits = raw.replace(/\D/g, "")
  if (!digits) return null
  if (raw.startsWith("+")) {
    // already international
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2)
  } else if (digits.startsWith("0")) {
    const code = country ? DIAL_CODES[country.toUpperCase()] : undefined
    if (!code) return null
    digits = code + digits.slice(1)
  }
  if (digits.length < 8) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

// The confirmation Parissa sends the client, prefilled so it's one tap.
// bookingInfo is the saved "day at time, duration treatment, location"
// summary; without it she fills the placeholders before sending.
export function confirmationMessage(bookingInfo: string | null): string {
  const details = bookingInfo ?? "[day] at [time], at [address]"
  return `Hi, it's Parissa from Calm & Contour 🌿 Confirming your booking ✅ ${details}. Any questions just message me here. See you then!`
}

export function rescheduleMessage(): string {
  return `Hi, it's Parissa from Calm & Contour 🌿 About your booking, could we look at another time? Tell me what suits you and I'll sort it for you.`
}

const GOOGLE_ADS_CONVERSION = "AW-17683159555/iDouCLaK48kcEIO0_u9B"

// Fires the Google Ads conversion event when a REAL lead is captured — a
// mobile number saved in the chat, or the booking form submitted. Never on
// a plain button click: a click is not a lead and would poison the ad data.
export function trackLeadConversion() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION,
      value: 1.0,
      currency: "EUR",
    })
  }
}

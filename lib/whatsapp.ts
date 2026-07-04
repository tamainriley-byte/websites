export const WHATSAPP_NUMBER = "34602020734"
export const WHATSAPP_DISPLAY = "+34 602 02 07 34"

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const GOOGLE_ADS_CONVERSION = "AW-17683159555/iDouCLaK48kcEIO0_u9B"

// Fires the Google Ads conversion event before the visitor is sent to WhatsApp.
export function trackWhatsAppConversion() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION,
      value: 1.0,
      currency: "EUR",
    })
  }
}

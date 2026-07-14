import type { Metadata } from "next"
import { TownPage } from "@/components/town-page"

export const metadata: Metadata = {
  title: "Massage in Paguera (Peguera) | Mobile Massage to Your Hotel | Calm & Contour",
  description:
    "Mobile massage in Paguera / Peguera brought to your hotel or villa — Massage in Ihrem Hotel in Peguera. Qualified therapist, from €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-paguera" },
  openGraph: {
    title: "Massage in Paguera (Peguera) | Calm & Contour",
    description:
      "Mobile massage to your hotel in Paguera, from €130.",
    url: "https://www.calmandcontour.com/massage-paguera",
    images: ["/images/villa-terrace.png"],
  },
}

export default function Page() {
  return (
    <TownPage
      town="Paguera"
      slug="massage-paguera"
      heroImage="/images/villa-terrace.png"
      heroAlt="Massage table set up near the pine-lined coast of Paguera"
      heroTagline="Paguera · Peguera · Comes to You"
      heroCopy="Along the boulevard hotels, the Cala Fornells coves and the villas of Camp de Mar, Parissa brings the full treatment to your room or terrace. Massage auch in Ihrem Hotel — English, Spanish and warm hands speak for themselves."
      waMessage="Hello Calm & Contour, I'd like a massage in Paguera."
      areaServed={[
        "Paguera", "Peguera", "Cala Fornells", "Camp de Mar", "Costa de la Calma",
        "Andratx", "Calvià", "Mallorca",
      ]}
      intro={{
        heading: "Boulevard hotels, quiet coves, your room",
        copy: "Paguera moves at a gentler pace, and a massage in your hotel room or on a pine-shaded terrace fits it perfectly. Parissa treats guests along the whole boulevard, in the Cala Fornells hotels above the bay, and in the golf and beach villas of Camp de Mar next door. Everything is brought to you; you only need a quiet corner.",
      }}
      highlights={[
        {
          t: "Hotel visits",
          d: "The classic Paguera booking: your room, the balcony door open, sixty or ninety minutes of Swedish or deep tissue.",
        },
        {
          t: "Walkers & cyclists",
          d: "Coming off the Tramuntana trails or the coast road? A sports massage with stretching sorts legs and lower backs.",
        },
        {
          t: "Camp de Mar villas",
          d: "Golf-side and seafront villas covered, including back-to-back treatments for couples in the same visit.",
        },
      ]}
      travel="The studio is in Portals Nous, about 20–25 minutes away — Paguera and Camp de Mar visits are scheduled daily, often same day."
      faqs={[
        {
          q: "Is it Paguera or Peguera, and do you cover both?",
          a: "Same lovely town, two spellings — and yes, all of it, from the boulevard to Cala Fornells, plus Camp de Mar and Costa de la Calma either side.",
        },
        {
          q: "Sprechen Sie Deutsch?",
          a: "Parissa works in English and Spanish, and the booking chat handles German happily. Many of her Paguera clients are German guests, you will be very comfortable.",
        },
        {
          q: "How much is a massage in Paguera?",
          a: "€130 for 60 minutes, €155 for 90 or €180 for 120, brought to your hotel or villa. The studio in Portals Nous is €90/€135/€180 if you prefer to come in.",
        },
        {
          q: "Can I book for this evening?",
          a: "Often yes. Message your hotel and preferred time and Parissa will confirm the soonest slot the diary allows.",
        },
      ]}
    />
  )
}

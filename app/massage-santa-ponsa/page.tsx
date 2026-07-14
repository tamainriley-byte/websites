import type { Metadata } from "next"
import { TownPage } from "@/components/town-page"

export const metadata: Metadata = {
  title: "Massage in Santa Ponsa | Mobile Massage to Your Villa | Calm & Contour",
  description:
    "Mobile massage in Santa Ponsa to your villa, hotel or apartment — after golf, boat days or just to unwind. Qualified therapist 15 minutes away. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-santa-ponsa" },
  openGraph: {
    title: "Massage in Santa Ponsa | Calm & Contour",
    description:
      "Mobile massage to your villa or hotel in Santa Ponsa. From €130.",
    url: "https://www.calmandcontour.com/massage-santa-ponsa",
    images: ["/images/villa-terrace.png"],
  },
}

export default function Page() {
  return (
    <TownPage
      town="Santa Ponsa"
      slug="massage-santa-ponsa"
      heroImage="/images/villa-terrace.png"
      heroAlt="Massage table on a Santa Ponsa villa terrace"
      heroTagline="Santa Ponsa · Comes to You"
      heroCopy="Villa terraces, golf-side homes and family hotels around the bay — Parissa brings a boutique treatment to you, with the table, oils and everything set up wherever you're most comfortable."
      waMessage="Hello Calm & Contour, I'd like a massage in Santa Ponsa."
      areaServed={[
        "Santa Ponsa", "Nova Santa Ponsa", "Port Adriano", "El Toro",
        "Costa de la Calma", "Calvià", "Mallorca",
      ]}
      intro={{
        heading: "Villa life, with a spa that comes to you",
        copy: "Santa Ponsa is villa country, and a massage on your own terrace as the light softens is hard to beat. Parissa treats clients across Santa Ponsa and Nova Santa Ponsa, the golf villas, Costa de la Calma and down to El Toro and Port Adriano, including onboard visits to yachts in the marina. Families welcome: treatments can run back to back while the rest of the house carries on around you.",
      }}
      highlights={[
        {
          t: "After golf",
          d: "Three courses on the doorstep means tight shoulders and lower backs. A sports massage the same evening keeps you swinging tomorrow.",
        },
        {
          t: "Terrace treatments",
          d: "The signature Santa Ponsa booking: table set up on the terrace, sea air, and ninety unhurried minutes.",
        },
        {
          t: "Port Adriano yachts",
          d: "Onboard massage in the marina, with everything brought to the berth. Discretion as standard.",
        },
      ]}
      travel="The studio is in Portals Nous, around 15 minutes away — Santa Ponsa home visits are easy to schedule, often same day."
      faqs={[
        {
          q: "Do you cover Nova Santa Ponsa and the golf area?",
          a: "Yes, all of Santa Ponsa including Nova Santa Ponsa, the golf villas, El Toro, Port Adriano and Costa de la Calma.",
        },
        {
          q: "Can you treat two people in one visit?",
          a: "Yes, back to back in the same visit, one after the other, same price per person. Ideal for couples or friends sharing a villa.",
        },
        {
          q: "How much does it cost?",
          a: "€130 for 60 minutes, €155 for 90 or €180 for 120 at your villa or hotel. Or visit the studio in Portals Nous from €90.",
        },
        {
          q: "Do you do massages on yachts at Port Adriano?",
          a: "Yes. Parissa regularly treats owners and guests onboard at anchor or in the marina. Just share the berth details when you book.",
        },
      ]}
    />
  )
}

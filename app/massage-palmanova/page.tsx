import type { Metadata } from "next"
import { TownPage } from "@/components/town-page"

export const metadata: Metadata = {
  title: "Massage in Palmanova | Mobile Massage to Your Hotel | Calm & Contour",
  description:
    "Mobile massage in Palmanova, five minutes from our Portals Nous studio. To your hotel, aparthotel or villa, often same day. From €130, studio from €90. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-palmanova" },
  openGraph: {
    title: "Massage in Palmanova | Calm & Contour",
    description:
      "Mobile massage to your hotel in Palmanova, often same day. From €130.",
    url: "https://www.calmandcontour.com/massage-palmanova",
    images: ["/images/hero-cove.png"],
  },
}

export default function Page() {
  return (
    <TownPage
      town="Palmanova"
      slug="massage-palmanova"
      heroImage="/images/hero-cove.png"
      heroAlt="Calm bay at Palmanova, Mallorca"
      heroTagline="Palmanova · Comes to You"
      heroCopy="Palmanova is practically next door to our studio, which makes it the easiest place on the island to get a massage — in your hotel room, at your villa, or five minutes up the road with us."
      waMessage="Hello Calm & Contour, I'd like a massage in Palmanova."
      areaServed={[
        "Palmanova", "Son Caliu", "Torrenova", "Portals Nous", "Bendinat",
        "Calvià", "Mallorca",
      ]}
      intro={{
        heading: "The closest town to our studio",
        copy: "Beachfront hotels along the three bays, the aparthotels of Son Caliu and the quiet villas towards Bendinat — Parissa covers all of Palmanova, and being five minutes from the studio means the diary is kindest here. If your hotel room is snug, the studio in Portals Nous is a short taxi ride and has a shower, and studio prices are lower too.",
      }}
      highlights={[
        {
          t: "Same-day slots",
          d: "Closest town to the studio means Palmanova gets the most same-day availability. Message in the morning, massage by evening.",
        },
        {
          t: "Beach-day recovery",
          d: "Sun, swimming and beach walks tighten you up more than you notice. A relaxation or aromatherapy massage resets everything.",
        },
        {
          t: "Studio option",
          d: "Five minutes away in Portals Nous, from €90 for 60 minutes, with a shower. Perfect if you would rather slip away from the family for an hour.",
        },
      ]}
      travel="The Calm & Contour studio is in Portals Nous, about 5 minutes from Palmanova — the closest coverage on the island, home visit or studio."
      faqs={[
        {
          q: "How quickly can I get a massage in Palmanova?",
          a: "Palmanova is five minutes from the studio, so it has the best same-day availability of any town we cover. Message with your hotel and a rough time and Parissa will confirm the soonest slot.",
        },
        {
          q: "Hotel room or studio, which is better?",
          a: "Both are lovely. In your room there is zero effort, from €130. The studio is five minutes away, from €90, with a shower, and can be easier if you are sharing a room with little ones.",
        },
        {
          q: "Which treatments are available?",
          a: "Everything on the menu: Swedish, deep tissue, sports, hot stone, aromatherapy, lymphatic drainage, prenatal, plus facials and body contouring. The 2-hour Ritual (€200) is also available at your hotel or the studio.",
        },
        {
          q: "Do you cover Son Caliu and Torrenova?",
          a: "Yes, the whole Palmanova stretch from Son Caliu through Torrenova towards Magaluf, plus Bendinat and Portals Nous next door.",
        },
      ]}
    />
  )
}

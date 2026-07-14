import type { Metadata } from "next"
import { TownPage } from "@/components/town-page"

export const metadata: Metadata = {
  title: "Massage in Magaluf | Mobile Massage to Your Hotel | Calm & Contour",
  description:
    "Mobile massage in Magaluf brought to your hotel or apartment — recovery, deep tissue or pure relaxation. Qualified therapist 10 minutes away, often same day. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-magaluf" },
  openGraph: {
    title: "Massage in Magaluf | Calm & Contour",
    description:
      "Mobile massage to your hotel in Magaluf, often same day. From €130.",
    url: "https://www.calmandcontour.com/massage-magaluf",
    images: ["/images/hotel-suite.png"],
  },
}

export default function Page() {
  return (
    <TownPage
      town="Magaluf"
      slug="massage-magaluf"
      heroImage="/images/hotel-suite.png"
      heroAlt="Massage set up in a Magaluf hotel suite"
      heroTagline="Magaluf · Comes to You"
      heroCopy="From the beachfront hotels to the villas above Calvià Beach, Parissa brings the massage table, oils and calm to your room. Ten minutes away, often bookable the same day."
      waMessage="Hello Calm & Contour, I'd like a massage in Magaluf."
      areaServed={[
        "Magaluf", "Calvià Beach", "Torrenova", "Cala Vinyes", "Sol de Mallorca",
        "Palmanova", "Portals Nous", "Mallorca",
      ]}
      intro={{
        heading: "A proper reset, without leaving your hotel",
        copy: "Magaluf holidays are full on, and that's exactly the point. When your body needs a pause, a treatment in the quiet of your own room beats any spa queue. Parissa treats guests across the Magaluf and Calvià Beach hotels, the quieter aparthotels of Torrenova and the villas towards Cala Vinyes and Sol de Mallorca. Everything arrives with her: table, fresh linens, oils and music.",
      }}
      highlights={[
        {
          t: "Recovery massage",
          d: "Big night or big beach day, a firm full-body massage with plenty of water and cool towels puts you back together for tomorrow.",
        },
        {
          t: "Deep tissue & sports",
          d: "Focused work on legs, back and shoulders after waterparks, boat days and everything in between.",
        },
        {
          t: "Couples, back to back",
          d: "Two of you? Parissa treats you one after the other in the same visit, same price per person.",
        },
      ]}
      travel="The Calm & Contour studio is in Portals Nous, about 10 minutes from Magaluf — so same-day visits are often possible, or come to us (studio prices from €90)."
      faqs={[
        {
          q: "Do you come to hotels in Magaluf?",
          a: "Yes, hotels, aparthotels and villas across Magaluf, Torrenova and Calvià Beach. Parissa sets up in your room or on a shaded terrace, whatever suits.",
        },
        {
          q: "Can I book a massage today in Magaluf?",
          a: "Often yes. The studio is only 10 minutes away, so Magaluf is the easiest area for same-day slots. Message with your hotel and preferred time and Parissa will confirm the soonest availability.",
        },
        {
          q: "How much is a mobile massage in Magaluf?",
          a: "€130 for 60 minutes, €155 for 90 or €180 for 120, everything included and brought to you. The studio in Portals Nous is €90/€135/€180 if you'd rather come to us.",
        },
        {
          q: "Is this a professional, qualified service?",
          a: "Completely. Parissa is a qualified therapist offering professional treatments only: Swedish, deep tissue, sports, hot stone, lymphatic drainage and more.",
        },
      ]}
    />
  )
}

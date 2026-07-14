import type { Metadata } from "next"
import { TownPage } from "@/components/town-page"

export const metadata: Metadata = {
  title: "Massage in El Arenal & Playa de Palma | Mobile Massage | Calm & Contour",
  description:
    "Mobile massage in El Arenal and Playa de Palma, to your hotel or apartment. Sports and recovery massage for cyclists, deep tissue and relaxation. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-el-arenal" },
  openGraph: {
    title: "Massage in El Arenal & Playa de Palma | Calm & Contour",
    description:
      "Mobile massage to your hotel on Playa de Palma. From €130.",
    url: "https://www.calmandcontour.com/massage-el-arenal",
    images: ["/images/hotel-suite.png"],
  },
}

export default function Page() {
  return (
    <TownPage
      town="El Arenal"
      slug="massage-el-arenal"
      heroImage="/images/hotel-suite.png"
      heroAlt="Massage set up in a Playa de Palma hotel room"
      heroTagline="El Arenal · Playa de Palma · Comes to You"
      heroCopy="The full length of Playa de Palma, from Can Pastilla to El Arenal — Parissa brings the table, oils and quiet to your hotel room or apartment, so the only walking you do is to the door."
      waMessage="Hello Calm & Contour, I'd like a massage in El Arenal."
      areaServed={[
        "El Arenal", "Playa de Palma", "Can Pastilla", "Las Maravillas",
        "Llucmajor", "Palma", "Mallorca",
      ]}
      intro={{
        heading: "The whole beach, covered",
        copy: "Playa de Palma is six kilometres of hotels, and Parissa covers every balneario of it, from Can Pastilla by the airport to El Arenal and the residential streets behind. Spring and autumn bring the cyclists; summer brings the beach crowds; a proper massage in your room suits them both better than any pop-up on the promenade.",
      }}
      highlights={[
        {
          t: "Cyclists' legs",
          d: "Training camps live on this coast. Sports massage with flushing and stretching keeps the legs turning day after day, in your hotel between rides.",
        },
        {
          t: "Beach & party recovery",
          d: "Sun, sand and long nights take their toll. A firm full-body massage resets you for the next round.",
        },
        {
          t: "Deep tissue",
          d: "Knots from travel, sunbeds and carrying kids down the beach, worked out properly, at your pace.",
        },
      ]}
      travel="The studio is in Portals Nous, about 25 minutes around the bay — El Arenal visits run daily, and Palma city is covered on the way."
      faqs={[
        {
          q: "Do you cover the whole of Playa de Palma?",
          a: "Yes, from Can Pastilla through Las Maravillas to El Arenal, hotels, aparthotels and apartments alike.",
        },
        {
          q: "Do you do sports massage for cyclists?",
          a: "Very much so. Recovery and pre-ride sports massage are popular in training season, and Parissa brings everything to your hotel so you can stay off your legs.",
        },
        {
          q: "How much does it cost?",
          a: "€130 for 60 minutes, €155 for 90 or €180 for 120 at your hotel. The studio in Portals Nous is €90/€135/€180 if you're happy to travel.",
        },
        {
          q: "Can groups book?",
          a: "Yes, Parissa treats friends back to back in the same visit, one after the other, same price per person. Message with numbers and she'll plan the timings.",
        },
      ]}
    />
  )
}

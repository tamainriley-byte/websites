import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20body%20contouring%20treatment."

export const metadata: Metadata = {
  title: "Body Contouring Mallorca | Wood Therapy, Cavitation & Sculpting | Calm & Contour",
  description:
    "Non-surgical body contouring in Mallorca by specialist Parissa. Wood therapy (maderoterapia), cavitation, radiofrequency and lymphatic drainage to sculpt, smooth cellulite and lose inches. Studio in Portals Nous from €90, or brought to your villa, hotel or yacht.",
  alternates: { canonical: "https://www.calmandcontour.com/body-contouring-mallorca" },
  openGraph: {
    title: "Body Contouring Mallorca | Calm & Contour",
    description:
      "Non-surgical body sculpting: wood therapy, cavitation, radiofrequency & lymphatic drainage. Studio or brought to you across Mallorca.",
    url: "https://www.calmandcontour.com/body-contouring-mallorca",
    images: ["/images/body-contour.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalSpa",
  name: "Calm & Contour Body Contouring Mallorca",
  image: "https://www.calmandcontour.com/images/body-contour.png",
  url: "https://www.calmandcontour.com/body-contouring-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Palma", "Portals Nous", "Puerto Portals", "Santa Ponsa", "Magaluf",
    "Andratx", "Palmanova", "Paguera", "Calvià", "Mallorca",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Benito Jerónimo Feijoo 4",
    addressLocality: "Portals Nous",
    postalCode: "07181",
    addressRegion: "Balearic Islands",
    addressCountry: "ES",
  },
  makesOffer: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "90",
    description: "60 minute body contouring treatment at the Portals Nous studio",
  },
}

const treatments = [
  { t: "Wood therapy (maderoterapia)", d: "Sculpting wooden tools work the body to smooth cellulite, stimulate circulation and define your silhouette." },
  { t: "Cavitation & radiofrequency", d: "Non-surgical techniques that target stubborn areas and help firm and tighten the skin." },
  { t: "Lymphatic drainage", d: "Light, rhythmic drainage de-bloats and de-puffs, so results look sharper and you feel lighter." },
]

const faqs = [
  {
    q: "What is body contouring?",
    a: "Non-surgical treatments that sculpt and define the body, smooth the look of cellulite and reduce puffiness. Parissa combines wood therapy (maderoterapia), cavitation, radiofrequency and lymphatic drainage, tailored to your goals.",
  },
  {
    q: "How many sessions do I need?",
    a: "You will feel a difference after one session. For visible sculpting most clients do a short course, often once or twice a week, and one or two sessions before an event or beach day is popular.",
  },
  {
    q: "Where can I have it?",
    a: "At the studio in Portals Nous (€90 for 60 minutes, €135 for 90), or Parissa brings everything to your villa, hotel or yacht across the south and southwest of Mallorca (€130 for 60 minutes, €155 for 90).",
  },
  {
    q: "Is it painful or does it have downtime?",
    a: "No. Treatments are relaxing with no downtime, you can carry on with your day straight after. Wood therapy can feel firm but is comfortable, and Parissa adjusts pressure to you.",
  },
]

export default function Page() {
  return (
    <main className="bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/body-contour.png"
          alt="Body contouring treatment in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Body Studio
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Body Contouring in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Non-surgical sculpting with Parissa: wood therapy, cavitation,
            radiofrequency and lymphatic drainage, to smooth, define and tone.
            At the Portals Nous studio or brought to your villa, hotel or yacht.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book body contouring
          </a>
          <p className="mt-4 text-sm text-cream/70">
            Studio from €90 · To you from €130
          </p>
        </div>
      </section>

      {/* Treatments */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
          How Parissa sculpts
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {treatments.map((b) => (
            <div key={b.t} className="text-center">
              <Sparkles className="mx-auto size-8 text-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl text-foreground">{b.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            Body contouring pricing
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="size-5" aria-hidden="true" />
                <span className="font-serif text-xl">Studio, Portals Nous</span>
              </div>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>60 minutes</span><span className="text-foreground">€90</span>
                </li>
                <li className="flex justify-between">
                  <span>90 minutes</span><span className="text-foreground">€135</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="size-5" aria-hidden="true" />
                <span className="font-serif text-xl">To your villa or hotel</span>
              </div>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>60 minutes</span><span className="text-foreground">€130</span>
                </li>
                <li className="flex justify-between">
                  <span>90 minutes</span><span className="text-foreground">€155</span>
                </li>
              </ul>
            </div>
          </div>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Check availability
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Common questions
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-serif text-lg text-foreground">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaFooter />
    </main>
  )
}

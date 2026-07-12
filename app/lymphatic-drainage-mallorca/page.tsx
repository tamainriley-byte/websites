import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20lymphatic%20drainage%20massage."

export const metadata: Metadata = {
  title: "Lymphatic Drainage Massage Mallorca | De-bloat, Sculpt & Recover | Calm & Contour",
  description:
    "Lymphatic drainage massage in Mallorca by specialist Parissa. De-bloat, reduce water retention, recover after flights or sun. Studio in Portals Nous from €85, or brought to your villa, hotel or yacht from €130.",
  alternates: { canonical: "https://www.calmandcontour.com/lymphatic-drainage-mallorca" },
  openGraph: {
    title: "Lymphatic Drainage Massage Mallorca | Calm & Contour",
    description:
      "Specialist lymphatic drainage: de-bloat, define and recover. Studio or brought to you across Mallorca.",
    url: "https://www.calmandcontour.com/lymphatic-drainage-mallorca",
    images: ["/images/body-contour.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Lymphatic Drainage Massage Mallorca",
  image: "https://www.calmandcontour.com/images/body-contour.png",
  url: "https://www.calmandcontour.com/lymphatic-drainage-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Palma", "Portals Nous", "Puerto Portals", "Santa Ponsa", "Magaluf",
    "Andratx", "Alcúdia", "Pollensa", "Calvià", "Mallorca",
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
    price: "85",
    description: "60 minute lymphatic drainage massage at the Portals Nous studio",
  },
}

const benefits = [
  { t: "De-bloat & define", d: "Light, rhythmic strokes move retained fluid so you feel lighter and look more sculpted, a favourite before events and beach days." },
  { t: "Post-flight & heat recovery", d: "Long flights and Mallorca summer heat cause swelling in legs and ankles. Drainage eases it quickly and gently." },
  { t: "Aftercare & wellbeing", d: "Supports recovery after training or (surgeon-approved) post-procedure care, and simply feels deeply calming." },
]

const faqs = [
  {
    q: "What is lymphatic drainage massage?",
    a: "A very light, rhythmic massage technique that encourages your lymphatic system to move retained fluid. It reduces puffiness and bloating, aids recovery and leaves you feeling lighter, it is one of Parissa's signature treatments.",
  },
  {
    q: "How many sessions do I need?",
    a: "You will see and feel a difference after one session. For an event, one or two sessions in the days before is popular. For ongoing goals a weekly course works beautifully.",
  },
  {
    q: "Where can I have it?",
    a: "At the studio in Portals Nous (€85 for 60 minutes, €135 for 90), or Parissa brings everything to your villa, hotel or yacht anywhere in Mallorca (€130 for 60 minutes, €155 for 90).",
  },
  {
    q: "Is it the same as maderoterapia?",
    a: "They pair beautifully but differ: lymphatic drainage uses light hand strokes to move fluid, wood therapy (maderoterapia) uses sculpting tools to contour and stimulate circulation. Parissa offers both, and can combine them.",
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
          alt="Lymphatic drainage massage treatment in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Signature Treatment
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Lymphatic Drainage Massage in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            De-bloat, define and recover. Parissa's signature lymphatic
            drainage, at the Portals Nous studio or brought to your villa,
            hotel or yacht anywhere on the island.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book lymphatic drainage
          </a>
          <p className="mt-4 text-sm text-cream/70">
            Studio from €85 · To you from €130
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
          Why clients love it
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {benefits.map((b) => (
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
            Lymphatic drainage pricing
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="size-5" aria-hidden="true" />
                <span className="font-serif text-xl">Studio, Portals Nous</span>
              </div>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span>60 minutes</span><span className="text-foreground">€85</span>
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

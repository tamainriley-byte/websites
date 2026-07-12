import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'm%20looking%20for%20a%20massage%20near%20me%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Massage Near Me in Mallorca | Same-Day Mobile Massage | Calm & Contour",
  description:
    "Looking for a massage near you in Mallorca? Calm & Contour comes to your villa, hotel or yacht, often same day. Portals, Palma, Magaluf, Santa Ponsa and across the island. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-near-me" },
  openGraph: {
    title: "Massage Near Me in Mallorca | Calm & Contour",
    description:
      "Mobile massage that comes to you across Mallorca, often same day. From €130.",
    url: "https://www.calmandcontour.com/massage-near-me",
    images: ["/images/hero-cove.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Massage Near Me Mallorca",
  image: "https://www.calmandcontour.com/images/hero-cove.png",
  url: "https://www.calmandcontour.com/massage-near-me",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Palma", "Portals Nous", "Puerto Portals", "Santa Ponsa", "Magaluf",
    "Bendinat", "Andratx", "Alcúdia", "Pollensa", "Calvià", "El Arenal",
    "Paguera", "Can Picafort", "Playa de Muro", "Cala d'Or", "Mallorca",
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
    price: "130",
    description: "Mobile massage brought to your location in Mallorca",
  },
}

// Ordered to match what people actually search (Google Ads search terms).
const areas = [
  "Palma", "El Arenal", "Magaluf", "Palmanova", "Santa Ponsa", "Paguera",
  "Portals Nous", "Puerto Portals", "Bendinat", "Calvià", "Andratx",
  "Port d'Andratx", "Camp de Mar", "Alcúdia", "Can Picafort",
  "Playa de Muro", "Pollensa", "Cala d'Or",
]

const faqs = [
  {
    q: "How quickly can someone come to me?",
    a: "Often the same day, depending on the diary. Message Parissa with your area and the time you have in mind and she will confirm the soonest slot personally.",
  },
  {
    q: "Do I need to travel anywhere?",
    a: "No. This is a mobile service, so Parissa comes to your villa, hotel room or yacht with the table, oils and everything set up. There is also a studio in Portals Nous if you prefer to come in.",
  },
  {
    q: "Which areas do you cover?",
    a: "The whole island. In the southwest: Palma, El Arenal, Magaluf, Santa Ponsa, Paguera, Portals and Andratx. In the north and east: Alcúdia, Can Picafort, Playa de Muro, Pollensa and Cala d'Or. If you are elsewhere, just ask.",
  },
  {
    q: "How much does it cost?",
    a: "A mobile visit is €130 for 60 minutes, €155 for 90 or €180 for 120, with the full setup brought to you. Studio treatments are €90, €135 and €180.",
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
          src="/images/hero-cove.png"
          alt="Massage setup overlooking a Mallorca cove, brought to your location"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Comes to You
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Massage Near You in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Searching for a massage near you? Instead of finding a spa, let the
            spa come to you. Parissa brings a boutique treatment to your villa,
            hotel or yacht anywhere on the island, often the same day.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €130 · Often same day</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
          Booked in three messages
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { icon: MessageCircle, t: "Tell us your area", d: "Send your location and the time you have in mind on WhatsApp." },
            { icon: MapPin, t: "We come to you", d: "Parissa arrives with the full setup, no travelling for you." },
            { icon: Sparkles, t: "You unwind", d: "Relax in your own space and feel completely restored." },
          ].map((s) => (
            <div key={s.t} className="text-center">
              <s.icon className="mx-auto size-8 text-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Areas grid */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            Areas near you
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We cover the whole island. A few of the areas we visit most:
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {areas.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="size-5" aria-hidden="true" />
              <span className="font-serif text-xl">Mobile visit</span>
            </div>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex justify-between border-b border-border/60 pb-2">
                <span>60 minutes</span><span className="text-foreground">€130</span>
              </li>
              <li className="flex justify-between border-b border-border/60 pb-2">
                <span>90 minutes</span><span className="text-foreground">€155</span>
              </li>
              <li className="flex justify-between">
                <span>120 minutes</span><span className="text-foreground">€180</span>
              </li>
            </ul>
            <a
              href={WA}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Find a time today
            </a>
          </div>
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

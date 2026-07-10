import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20couples%20massage%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Couples Massage Mallorca | Side by Side at Your Villa or Hotel | Calm & Contour",
  description:
    "Couples massage in Mallorca, side by side at your villa, hotel or yacht. Two qualified therapists, two tables, one relaxing hour together. €120 per person for 60 minutes. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/couples-massage-mallorca" },
  openGraph: {
    title: "Couples Massage Mallorca | Calm & Contour",
    description:
      "Side-by-side couples massage at your villa, hotel or yacht anywhere in Mallorca. Two therapists, full setup brought to you.",
    url: "https://www.calmandcontour.com/couples-massage-mallorca",
    images: ["/images/villa-terrace.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Couples Massage Mallorca",
  image: "https://www.calmandcontour.com/images/villa-terrace.png",
  url: "https://www.calmandcontour.com/couples-massage-mallorca",
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
    price: "240",
    description: "Side-by-side couples massage for two at your villa, hotel or yacht, 60 minutes",
  },
}

const faqs = [
  {
    q: "How does a couples massage work?",
    a: "Parissa brings a second qualified therapist, two tables and everything needed to your villa, hotel or yacht. You are treated side by side at the same time, so neither of you waits.",
  },
  {
    q: "How much is a couples massage?",
    a: "€120 per person for 60 minutes or €145 per person for 90 minutes, so €240 or €290 for two, with the full setup brought to you anywhere in Mallorca.",
  },
  {
    q: "Can we choose different massage styles?",
    a: "Yes. One of you can have a relaxing Swedish massage while the other has deep tissue or a sports massage. Each session is tailored individually.",
  },
  {
    q: "Where do you come to?",
    a: "Anywhere in Mallorca: private villas, hotel suites and yachts. Popular areas include Portals Nous, Puerto Portals, Palma, Santa Ponsa, Magaluf, Andratx, Alcúdia and Pollensa.",
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
          src="/images/villa-terrace.png"
          alt="Two massage tables set up side by side on a private villa terrace in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · For Two
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Couples Massage in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Side by side at your villa, hotel or yacht. Two therapists, two
            tables and one beautifully relaxing hour together, anywhere on the
            island.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book a couples massage
          </a>
          <p className="mt-4 text-sm text-cream/70">
            €120 per person · Villa · Yacht · Hotel
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Massage together, in your own space
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          A couples massage on holiday should feel effortless. Instead of
          booking two spa slots and travelling, Parissa and a second qualified
          therapist come to you with two tables, fresh linens and oils. You
          relax side by side on your terrace, in your suite or on deck, and each
          massage is tailored individually, so one of you can unwind with
          gentle Swedish strokes while the other gets focused deep tissue work.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: MessageCircle, t: "Message Parissa", d: "Tell us where you are staying, your dates and the styles you would each like." },
              { icon: MapPin, t: "Two therapists arrive", d: "Tables, oils and everything for a full side-by-side setup in your space." },
              { icon: Sparkles, t: "Unwind together", d: "One relaxing hour for two, no travel, no waiting rooms, no taking turns." },
            ].map((s) => (
              <div key={s.t} className="text-center">
                <s.icon className="mx-auto size-8 text-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Couples pricing
        </h2>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Side by side, at your place</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>60 minutes · two people</span>
              <span className="text-foreground">€240 (€120 pp)</span>
            </li>
            <li className="flex justify-between">
              <span>90 minutes · two people</span>
              <span className="text-foreground">€290 (€145 pp)</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Two therapists and the full setup brought to your villa, hotel or
            yacht. Groups welcome by arrangement.
          </p>
          <a
            href={WA}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Check availability
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
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
        </div>
      </section>

      <CtaFooter />
    </main>
  )
}

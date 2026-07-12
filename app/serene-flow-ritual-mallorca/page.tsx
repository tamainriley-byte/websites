import type { Metadata } from "next"
import { MessageCircle, Clock, Leaf } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20the%20Serene%20Flow%20Ritual."

export const metadata: Metadata = {
  title: "The Serene Flow Ritual | 2-Hour Lymphatic & Balinese Ritual Mallorca | Calm & Contour",
  description:
    "The Serene Flow Ritual: two hours of lymphatic drainage, Balinese-inspired flowing massage and grounding relaxation. De-bloat, sculpt gently and reset the nervous system. €200 at your villa, yacht, hotel or the studio.",
  alternates: { canonical: "https://www.calmandcontour.com/serene-flow-ritual-mallorca" },
  openGraph: {
    title: "The Serene Flow Ritual | Calm & Contour Mallorca",
    description:
      "Two hours of lymphatic drainage, Balinese flow and deep calm. Feel lighter, calmer, fully restored.",
    url: "https://www.calmandcontour.com/serene-flow-ritual-mallorca",
    images: ["/images/hero-cove.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour The Serene Flow Ritual Mallorca",
  image: "https://www.calmandcontour.com/images/hero-cove.png",
  url: "https://www.calmandcontour.com/serene-flow-ritual-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€",
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
    price: "200",
    description: "The Serene Flow Ritual, 2 hours, at your villa, hotel, yacht or the studio",
  },
}

const journey = [
  {
    time: "10 min",
    t: "Grounding welcome & breathwork",
    d: "You are welcomed into a calm space with slow, intentional movements. Gentle guided breathing settles the body and signals safety to the nervous system, so you receive the treatment fully from the very first touch.",
  },
  {
    time: "15 min",
    t: "Lymphatic activation & pathway opening",
    d: "Very light, rhythmic strokes around the neck, clavicle, abdomen and groin, slow, soothing, almost hypnotic. This opens the main drainage points and prepares the body to release fluid and puffiness.",
  },
  {
    time: "30 min",
    t: "Balinese flow · back of body",
    d: "Long flowing strokes, gentle skin rolling, acupressure-inspired holds and slow forearm movements across the back, shoulders, arms, glutes and legs. A wave-like, continuous flow that releases tension without ever feeling forceful.",
  },
  {
    time: "20 min",
    t: "Lower body drainage & sculpting flow",
    d: "Slow upward strokes and gentle pumping through the calves, knees and thighs. Fluid moves towards the lymph nodes, heavy legs feel light again, and the contours of the legs are subtly, naturally enhanced.",
  },
  {
    time: "20 min",
    t: "Front body flow & abdominal release",
    d: "Deeply rhythmic foot work, flowing leg massage and soothing abdominal strokes that feel nurturing and grounding, supporting digestion, drainage and a release of tension through the centre of the body.",
  },
  {
    time: "15 min",
    t: "Neck, face & jaw lymphatic calm",
    d: "Feather-light lymphatic strokes over the chest, neck and face, with gentle holds around the jaw and temples. Facial puffiness fades, jaw clenching releases, and the rest-and-digest response deepens.",
  },
  {
    time: "10 min",
    t: "Scalp massage & grounding closure",
    d: "A slow, deeply comforting scalp massage followed by stillness and grounding touch. You surface mentally clear, calm and centred.",
  },
]

const senses = [
  { k: "Music", v: "Forest & ocean soundscapes" },
  { k: "Tea", v: "Jasmine or hibiscus" },
  { k: "A little something", v: "Apricots" },
  { k: "Scent", v: "Floral & tropical oils" },
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
          alt="Calm turquoise cove in Mallorca, the mood of the Serene Flow Ritual"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Signature Ritual
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            The Serene Flow Ritual
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Two unhurried hours of lymphatic drainage, Balinese-inspired
            flowing massage and grounding relaxation. Release fluid, ease
            tension and reset the nervous system, you leave feeling lighter,
            calmer and fully restored.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book the Serene Flow
          </a>
          <p className="mt-4 text-sm text-cream/70">
            €200 · 2 hours · Villa, yacht, hotel or studio
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Slow down, release, reset
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          This two-hour signature ritual is designed to help you slow down,
          release fluid retention, ease muscular tension and enter a deeply
          meditative state. Rhythmic Balinese movements, gentle lymphatic
          drainage and long flowing strokes encourage detoxification while
          deeply relaxing body and mind. The pace is nurturing and unhurried,
          with light-to-medium pressure adapted to you.
        </p>
      </section>

      {/* The journey */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            The journey, minute by minute
          </h2>
          <ol className="mt-8 space-y-6">
            {journey.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg text-foreground">
                    {i + 1}. {s.t}
                  </h3>
                  <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
                    {s.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Senses */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Set for the senses
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {senses.map((s) => (
            <div key={s.k} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Leaf className="size-5 shrink-0 text-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.k}</p>
                <p className="text-sm text-foreground">{s.v}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">The Serene Flow Ritual · 2 hours</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>At your villa, yacht or hotel</span>
              <span className="text-foreground">€200</span>
            </li>
            <li className="flex justify-between">
              <span>At the studio, Portals Nous</span>
              <span className="text-foreground">€200</span>
            </li>
          </ul>
          <a
            href={WA}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Check availability
          </a>
        </div>
      </section>

      <CtaFooter />
    </main>
  )
}

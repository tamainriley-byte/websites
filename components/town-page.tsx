import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

// Shared layout for the town landing pages (Magaluf, Santa Ponsa, …).
// Every text block comes in as a prop so each town reads as its own page,
// not a find-and-replace of the last one — that matters for SEO.

export type TownFaq = { q: string; a: string }

export type TownPageProps = {
  town: string
  slug: string
  heroImage: string
  heroAlt: string
  heroTagline: string
  heroCopy: string
  waMessage: string
  areaServed: string[]
  intro: { heading: string; copy: string }
  highlights: { t: string; d: string }[]
  travel: string
  faqs: TownFaq[]
}

export function townJsonLd(p: TownPageProps) {
  return {
    "@context": "https://schema.org",
    "@type": "MassageService",
    name: `Calm & Contour Massage ${p.town}`,
    image: `https://www.calmandcontour.com${p.heroImage}`,
    url: `https://www.calmandcontour.com/${p.slug}`,
    telephone: "+34602020734",
    priceRange: "€€€",
    areaServed: p.areaServed,
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
      description: `Mobile massage to your hotel or villa in ${p.town}`,
    },
  }
}

export function TownPage(p: TownPageProps) {
  const wa = `https://wa.me/34602020734?text=${encodeURIComponent(p.waMessage)}`
  return (
    <main className="bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(townJsonLd(p)) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={p.heroImage}
          alt={p.heroAlt}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            {p.heroTagline}
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Massage in {p.town}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            {p.heroCopy}
          </p>
          <a
            href={wa}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €130 · Often same day</p>
        </div>
      </section>

      {/* Local intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          {p.intro.heading}
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">{p.intro.copy}</p>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {p.travel}
        </p>
      </section>

      {/* Highlights */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            Popular in {p.town}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {p.highlights.map((h) => (
              <div key={h.t} className="rounded-2xl border border-border bg-card p-6">
                <Sparkles className="size-5 text-foreground" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-xl text-foreground">{h.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Mobile massage in {p.town}</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>60 minutes</span>
              <span className="text-foreground">€130</span>
            </li>
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>90 minutes</span>
              <span className="text-foreground">€155</span>
            </li>
            <li className="flex justify-between">
              <span>120 minutes</span>
              <span className="text-foreground">€180</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Prefer to come to us? The studio in Portals Nous is €90/€135/€180,
            and The Ritual (2 hours, VIP) is €200 anywhere.
          </p>
          <a
            href={wa}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Check availability
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            Questions from {p.town}
          </h2>
          <div className="mt-8 space-y-6">
            {p.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-lg text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaFooter />
    </main>
  )
}

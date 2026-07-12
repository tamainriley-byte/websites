import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20mobile%20massage%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Mobile Massage Mallorca | To Your Villa, Yacht or Hotel | Calm & Contour",
  description:
    "Luxury mobile massage in Mallorca brought to your villa, yacht or hotel. Qualified therapist Parissa brings the table, oils and everything. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/mobile-massage-mallorca" },
  openGraph: {
    title: "Mobile Massage Mallorca | Calm & Contour",
    description:
      "Luxury mobile massage to your villa, yacht or hotel anywhere in Mallorca. From €130.",
    url: "https://www.calmandcontour.com/mobile-massage-mallorca",
    images: ["/images/hero-cove.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Mobile Massage Mallorca",
  image: "https://www.calmandcontour.com/images/hero-cove.png",
  url: "https://www.calmandcontour.com/mobile-massage-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Palma", "Portals Nous", "Puerto Portals", "Santa Ponsa", "Magaluf",
    "Andratx", "Alcúdia", "Pollensa", "Calvià", "El Arenal", "Paguera",
    "Can Picafort", "Playa de Muro", "Cala d'Or", "Mallorca",
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
    description: "60 minute mobile massage to your villa, yacht or hotel",
  },
}

const faqs = [
  {
    q: "Do you come to my villa, hotel or yacht?",
    a: "Yes. Parissa brings the table, oils and everything to you, anywhere in Mallorca, whether that is a private villa, a hotel suite or a yacht at anchor or in port.",
  },
  {
    q: "How far do you travel?",
    a: "Across the whole island. Popular areas include Portals Nous, Puerto Portals, Palma, Santa Ponsa, Magaluf, Andratx, Alcúdia and Pollensa. The studio is in Portals Nous, about 10 minutes from Magaluf and 15 from Palma.",
  },
  {
    q: "How much is a home visit?",
    a: "A mobile home visit is €130 for 60 minutes or €155 for 90 minutes, with the full setup brought to you. Studio treatments are €85 and €135.",
  },
  {
    q: "Can you treat couples?",
    a: "Yes. For two people Parissa brings a second therapist so you are treated side by side at your villa or hotel.",
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
          alt="Massage table on a wooden deck overlooking a turquoise Mallorca cove"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · To You
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Mobile Massage in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Luxury massage brought to your villa, yacht or hotel. Parissa arrives
            with the table, oils and everything, so you simply lie back and unwind
            wherever you are on the island.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €130 · Villa · Yacht · Hotel</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          A boutique treatment, wherever you are staying
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Calm &amp; Contour is a mobile massage service across Mallorca by Parissa,
          a qualified therapist specialising in massage, lymphatic drainage and
          body contouring. Instead of travelling to a spa, the spa comes to you.
          Every treatment is tailored, unhurried and delivered with the same
          boutique care whether you are in a hilltop villa, a hotel suite or on a
          yacht.
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
              { icon: MessageCircle, t: "Message Parissa", d: "Tell us where you are staying, your dates and the style you would like." },
              { icon: MapPin, t: "We come to you", d: "Parissa arrives with the table, oils and everything for a full setup." },
              { icon: Sparkles, t: "You unwind", d: "Relax in your own space and feel restored, sculpted and cared for." },
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

      {/* Areas + pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Areas we cover
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          We travel across Mallorca: Palma, El Arenal, Magaluf, Santa Ponsa,
          Paguera, Portals, Bendinat and Andratx in the southwest, and Alcúdia,
          Can Picafort, Playa de Muro, Pollensa and Cala d&apos;Or in the north
          and east. If you are staying somewhere else on the island, just ask.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Mobile home visit</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>60 minutes</span><span className="text-foreground">€130</span>
            </li>
            <li className="flex justify-between">
              <span>90 minutes</span><span className="text-foreground">€155</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Full setup brought to you. Couples treated side by side with a second therapist.
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


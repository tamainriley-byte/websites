import type { Metadata } from "next"
import { MessageCircle, Clock, Sparkles, Leaf, Flame, Droplets } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20The%20Ritual%2C%20the%202%20hour%20massage."

export const metadata: Metadata = {
  title: "The Ritual | 2-Hour VIP Massage Experience in Mallorca | Calm & Contour",
  description:
    "The Ritual: Calm & Contour's 2-hour VIP massage experience in Mallorca. Warm aromatherapy oils, hot stones, hot towel rub down and herbal tea to finish. €200 at your villa, yacht, hotel or the studio.",
  alternates: { canonical: "https://www.calmandcontour.com/ritual-massage-mallorca" },
  openGraph: {
    title: "The Ritual | 2-Hour VIP Massage | Calm & Contour Mallorca",
    description:
      "Two unhurried hours: warm oils, hot stones, hot towels and herbal tea. The VIP massage experience, €200.",
    url: "https://www.calmandcontour.com/ritual-massage-mallorca",
    images: ["/images/villa-terrace.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour The Ritual — 2 Hour VIP Massage Mallorca",
  image: "https://www.calmandcontour.com/images/villa-terrace.png",
  url: "https://www.calmandcontour.com/ritual-massage-mallorca",
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
    price: "200",
    description: "The Ritual: 2-hour VIP massage experience with warm oils, hot stones, hot towels and herbal tea",
  },
}

const ritual = [
  {
    icon: Leaf,
    t: "Arrival & intention",
    d: "A quiet moment to talk through how you want to feel, with calming music and candlelight set around you.",
  },
  {
    icon: Droplets,
    t: "Warm aromatherapy oils",
    d: "A full body massage with warmed oils blended for you, slow, deep and completely unhurried for two full hours.",
  },
  {
    icon: Flame,
    t: "Hot stones & warmth",
    d: "Warm basalt stones melt the deepest tension while heated towels keep you cocooned throughout.",
  },
  {
    icon: Sparkles,
    t: "Hot towel finish & tea",
    d: "A hot towel rub down removes every trace of oil, then you surface slowly with a pot of herbal tea. No rush, ever.",
  },
]

const faqs = [
  {
    q: "What makes The Ritual different from a normal massage?",
    a: "Time and ceremony. Two full hours means nothing is rushed: the whole body is treated properly, the warmth of the stones and towels does its work, and you finish with a hot towel rub down and tea rather than being hurried out the door.",
  },
  {
    q: "Where can I have The Ritual?",
    a: "Anywhere: your villa, yacht or hotel suite (Parissa brings everything, including the stones and tea), or at the studio in Portals Nous. The price is €200 either way.",
  },
  {
    q: "Can two of us book it together?",
    a: "Yes. For couples Parissa brings a second therapist so you experience The Ritual side by side, €200 per person.",
  },
  {
    q: "When should I book it?",
    a: "It is the treatment for a special day: birthdays, anniversaries, the start or end of a holiday, or simply when you need to properly switch off. Evening slots are popular, book a day or two ahead where possible.",
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
          alt="Candlelit massage setup on a private villa terrace in Mallorca at dusk"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · VIP Experience
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            The Ritual · A 2-Hour Massage Experience
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Two unhurried hours. Warm aromatherapy oils, hot stones, a hot
            towel rub down and herbal tea to finish. The most indulgent thing
            we do.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book The Ritual
          </a>
          <p className="mt-4 text-sm text-cream/70">
            €200 · 120 minutes · Villa, yacht, hotel or studio
          </p>
        </div>
      </section>

      {/* The journey */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
          Two hours, four chapters
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ritual.map((s) => (
            <div key={s.t} className="text-center">
              <s.icon className="mx-auto size-8 text-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            One price, anywhere
          </h2>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="size-5" aria-hidden="true" />
              <span className="font-serif text-xl">The Ritual · 120 minutes</span>
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
            <p className="mt-4 text-sm text-muted-foreground">
              Includes warm aromatherapy oils, hot stones, heated towels, the
              hot towel finish and herbal tea. Couples side by side with a
              second therapist, €200 per person.
            </p>
            <a
              href={WA}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Check availability
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

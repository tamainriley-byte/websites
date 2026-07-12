import type { Metadata } from "next"
import { MessageCircle, ShieldCheck, Users, Sparkles, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20private%20villa%20massage%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Private Villa Massage Mallorca | Discreet In-Villa Spa | Calm & Contour",
  description:
    "Discreet private massage at your villa in Mallorca. Qualified, insured, vetted therapist, NDA available for high-profile guests. From €130.",
  alternates: { canonical: "https://www.calmandcontour.com/villa-massage-mallorca" },
  openGraph: {
    title: "Private Villa Massage Mallorca | Calm & Contour",
    description:
      "A discreet, professional in-villa spa across Mallorca by Parissa & Friends. Qualified, insured, vetted therapists. NDA on request.",
    url: "https://www.calmandcontour.com/villa-massage-mallorca",
    images: ["/images/villa-terrace.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Private Villa Massage Mallorca",
  image: "https://www.calmandcontour.com/images/villa-terrace.png",
  url: "https://www.calmandcontour.com/villa-massage-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Son Vida", "Portals Nous", "Puerto Portals", "Bendinat", "Santa Ponsa",
    "Andratx", "Pollensa", "Deia", "Calvià", "Mallorca",
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
    description: "60 minute private massage at your villa in Mallorca",
  },
}

const faqs = [
  {
    q: "Is the service discreet and confidential?",
    a: "Completely. Our therapists are used to working in private residences and around household staff, families and high-profile guests. We keep every booking private, and we are happy to sign a non-disclosure agreement on request.",
  },
  {
    q: "Are the therapists qualified and insured?",
    a: "Yes. Every therapist working under Parissa & Friends is fully qualified, insured and personally vetted by Parissa. You get the same standard whether it is Parissa herself or a member of her team.",
  },
  {
    q: "Can more than one of us have a massage?",
    a: "Yes, one after the other. Parissa treats each of you back to back in the same visit, so nobody has to travel and everyone gets her full attention.",
  },
  {
    q: "What do you bring, and where do you set up?",
    a: "We bring professional tables, fresh linens, oils and everything needed. We set up wherever suits you, a shaded terrace, poolside, a spa room or a bedroom, and leave it exactly as we found it.",
  },
  {
    q: "How much is a villa visit?",
    a: "A private villa visit is €130 for 60 minutes, €155 for 90 or €180 for 120, per person. Just message us with your villa location and dates.",
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
          alt="Private massage table set up on a Mallorca villa terrace overlooking the sea"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Discreet · Private · In Your Villa
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Private Villa Massage in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            A private spa brought to your villa by Parissa &amp; Friends, a small
            team of qualified, insured and personally vetted therapists. Discreet,
            professional and tailored to you, poolside, on the terrace or in the
            comfort of your own room.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €130 · NDA available on request</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          A professional spa, in the privacy of your villa
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Calm &amp; Contour brings a genuine spa experience to private villas
          across Mallorca. Rather than book a table at a hotel spa, you have a
          qualified therapist arrive at your door with everything needed, and you
          never have to leave the privacy of where you are staying. It is the
          service of choice for guests who value both quality and discretion.
        </p>
      </section>

      {/* Trust / discretion */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
            Why villa guests choose us
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Discreet & confidential", d: "Used to private residences, families and high-profile guests. NDA signed on request, every booking kept private." },
              { icon: Sparkles, t: "Qualified & insured", d: "Every therapist under Parissa & Friends is fully qualified, insured and personally vetted, the same standard every visit." },
              { icon: Users, t: "More than one of you?", d: "Back to back treatments in the same visit, so everyone is looked after without leaving the villa." },
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

      {/* Treatments + pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Treatments we bring to your villa
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Deep tissue, Swedish and relaxation, sports, hot stone, aromatherapy,
          lymphatic drainage, prenatal and reflexology, plus facials and body
          contouring. Tell us what you would like and we tailor each treatment to
          you. We cover Son Vida, Portals Nous, Bendinat, Santa Ponsa, Andratx,
          Deià, Pollensa and villas across the island.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Private villa visit</span>
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
            Per person. More than one of you? Back to back sessions in the same visit, just ask.
          </p>
          <a
            href={WA}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Enquire discreetly
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


import type { Metadata } from "next"
import { MessageCircle, MapPin, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20a%20massage%20in%20Palma."

export const metadata: Metadata = {
  title: "Massage in Palma, Mallorca | Mobile Massage to Your Hotel | Calm & Contour",
  description:
    "Luxury mobile massage in Palma, Mallorca, brought to your hotel, apartment or yacht in the marina. Qualified therapist, same-day where possible. From €130. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/massage-palma" },
  openGraph: {
    title: "Massage in Palma, Mallorca | Calm & Contour",
    description:
      "Mobile massage to your hotel or apartment in Palma. From €130.",
    url: "https://www.calmandcontour.com/massage-palma",
    images: ["/images/hotel-suite.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Massage Palma",
  image: "https://www.calmandcontour.com/images/hotel-suite.png",
  url: "https://www.calmandcontour.com/massage-palma",
  telephone: "+34602020734",
  priceRange: "€€€",
  areaServed: [
    "Palma", "Palma Old Town", "Santa Catalina", "Portixol", "Paseo Marítimo",
    "Club de Mar", "Génova", "Son Vida", "Portals Nous", "Mallorca",
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
    description: "Mobile massage to your hotel or apartment in Palma",
  },
}

const faqs = [
  {
    q: "Do you come to hotels in Palma?",
    a: "Yes. Parissa treats guests in hotels, apartments and villas across Palma, from the Old Town and Santa Catalina to Portixol and the Paseo Marítimo, and yachts in Club de Mar. Everything is brought to your room.",
  },
  {
    q: "How far is your studio from central Palma?",
    a: "The studio is in Portals Nous, about 15 minutes from Palma centre. For most Palma clients Parissa comes to you, so there is no need to travel.",
  },
  {
    q: "Can I book for the same day in Palma?",
    a: "Often, yes. Message Parissa with your hotel or area and the time you would like and she will confirm the soonest available slot personally.",
  },
  {
    q: "What treatments can I have?",
    a: "Swedish and deep tissue massage, aromatherapy, hot stone, lymphatic drainage, prenatal massage, plus facials and body contouring. Tell Parissa what you are after and she will tailor it.",
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
          src="/images/hotel-suite.png"
          alt="Hotel suite in Palma prepared for a mobile massage"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Palma · To Your Hotel
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Massage in Palma
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            A boutique massage brought to your hotel, apartment or yacht in Palma.
            Parissa arrives with the table, oils and everything, so you can relax
            without leaving your room or the marina.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €130 · Hotel · Apartment · Yacht</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Palma&apos;s mobile spa
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Whether you are staying in a boutique hotel in the Old Town, an
          apartment in Santa Catalina or aboard a yacht in Club de Mar, Calm
          &amp; Contour brings the treatment to you. Parissa is a qualified
          therapist specialising in massage, lymphatic drainage and body
          contouring, and every visit is unhurried, private and tailored to you.
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
              { icon: MessageCircle, t: "Message Parissa", d: "Send your hotel or area in Palma and the time you have in mind." },
              { icon: MapPin, t: "We come to you", d: "Parissa arrives with the full setup, ready in minutes." },
              { icon: Sparkles, t: "You unwind", d: "Relax in your room or on deck and feel restored." },
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
          Palma pricing
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          We cover Palma and the surrounding areas, including Santa Catalina,
          Portixol, Paseo Marítimo, Génova, Son Vida and out to Portals Nous.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Mobile visit in Palma</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>60 minutes</span><span className="text-foreground">€130</span>
            </li>
            <li className="flex justify-between">
              <span>90 minutes</span><span className="text-foreground">€155</span>
            </li>
            <li className="flex justify-between">
              <span>120 minutes</span><span className="text-foreground">€180</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Studio treatments in Portals Nous from €90. Couples treated side by side with a second therapist.
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

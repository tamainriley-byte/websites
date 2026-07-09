import type { Metadata } from "next"
import { MessageCircle, ShieldCheck, Anchor, Clock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20massage%20on%20my%20yacht%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Yacht Massage Mallorca | Discreet Onboard Spa | Calm & Contour",
  description:
    "Discreet luxury massage on your yacht in Mallorca, at anchor or in port. Vetted, insured therapists, NDA available on request. Puerto Portals, Palma, Port Adriano. From €145. Book on WhatsApp.",
  alternates: { canonical: "https://www.calmandcontour.com/yacht-massage-mallorca" },
  openGraph: {
    title: "Yacht Massage Mallorca | Calm & Contour",
    description:
      "Discreet onboard massage for yachts across Mallorca. Vetted therapists, NDA available. From €145.",
    url: "https://www.calmandcontour.com/yacht-massage-mallorca",
    images: ["/images/yacht-cabin.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour Yacht Massage Mallorca",
  image: "https://www.calmandcontour.com/images/yacht-cabin.png",
  url: "https://www.calmandcontour.com/yacht-massage-mallorca",
  telephone: "+34602020734",
  priceRange: "€€€€",
  areaServed: [
    "Puerto Portals", "Port Adriano", "Palma", "Club de Mar", "Marina Ibiza",
    "Santa Ponsa", "Andratx", "Mallorca",
  ],
  makesOffer: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "145",
    description: "Onboard massage for yachts at anchor or in port",
  },
}

const faqs = [
  {
    q: "Can you come to the yacht at anchor or only in the marina?",
    a: "Both. Parissa and her team treat guests on board in Puerto Portals, Port Adriano, Palma and Club de Mar, and can be tendered out to a yacht at anchor by arrangement with the crew.",
  },
  {
    q: "How discreet is the service?",
    a: "Complete discretion is the standard, not the exception. Therapists arrive plainly, work only with the guests you specify and never discuss clients. A signed non-disclosure agreement is available on request for owners, charter guests and management.",
  },
  {
    q: "Do you work with the crew and interior team?",
    a: "Yes. We coordinate timings, access and setup directly with the chief stew or purser so the treatment fits seamlessly around the itinerary and other guest service.",
  },
  {
    q: "What space do you need on board?",
    a: "A cabin, sun deck or shaded area of roughly two by two metres is enough. Parissa brings a professional table, or can work with the yacht's own massage table and linens if preferred.",
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
          src="/images/yacht-cabin.png"
          alt="Calm yacht cabin prepared for an onboard massage in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Onboard
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Yacht Massage in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Discreet, boutique massage brought aboard your yacht, at anchor or in
            port. Vetted, insured therapists who work quietly around your crew and
            your itinerary, with a non-disclosure agreement available on request.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
          <p className="mt-4 text-sm text-cream/70">From €145 · Discreet · NDA available</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Spa service that comes to the water
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          For owners, charter guests and crew, Calm &amp; Contour brings a
          genuine spa treatment on board without anyone leaving the yacht. Parissa
          and her small team of qualified therapists specialise in massage,
          lymphatic drainage and body contouring, and are used to the pace and
          privacy of yachting in Mallorca. Every booking is handled personally,
          quietly and on your schedule.
        </p>
      </section>

      {/* Trust row */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">
            Trusted on board
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Discreet & confidential", d: "Vetted, insured therapists. NDA available on request for owners and charter guests." },
              { icon: Anchor, t: "Crew-friendly", d: "We coordinate access, timing and setup directly with your interior team." },
              { icon: Sparkles, t: "Full boutique setup", d: "Professional table, oils and linens brought aboard, or we use the yacht's own." },
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

      {/* Marinas + pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Marinas we serve
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Puerto Portals, Port Adriano, Palma, Club de Mar, Santa Ponsa and
          Andratx, plus yachts at anchor around the south west coast by
          arrangement. Tell us your berth or position and we will make it work.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="size-5" aria-hidden="true" />
            <span className="font-serif text-xl">Onboard treatment</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>60 minutes</span><span className="text-foreground">from €145</span>
            </li>
            <li className="flex justify-between">
              <span>90 minutes</span><span className="text-foreground">from €175</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Multiple guests and back-to-back treatments arranged with a second therapist.
          </p>
          <a
            href={WA}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-whatsapp-foreground shadow-sm transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Arrange onboard
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

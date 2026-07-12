import type { Metadata } from "next"
import { MessageCircle, Clock, Leaf, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20the%20Tension%20Release%20Ritual."

export const metadata: Metadata = {
  title: "The Tension Release Ritual | 90-Min Trigger Point & Myofascial Massage Mallorca | Calm & Contour",
  description:
    "The Tension Release Ritual: 90 minutes of trigger point therapy, myofascial release and assisted stretching for chronic tension, headaches and restricted movement. Studio €135 or brought to you €155.",
  alternates: { canonical: "https://www.calmandcontour.com/tension-release-massage-mallorca" },
  openGraph: {
    title: "The Tension Release Ritual | Calm & Contour Mallorca",
    description:
      "Deep, mindful therapeutic work: trigger points, myofascial release and stretching. Firm but never aggressive.",
    url: "https://www.calmandcontour.com/tension-release-massage-mallorca",
    images: ["/images/body-contour.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MassageService",
  name: "Calm & Contour The Tension Release Ritual Mallorca",
  image: "https://www.calmandcontour.com/images/body-contour.png",
  url: "https://www.calmandcontour.com/tension-release-massage-mallorca",
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
    price: "135",
    description: "The Tension Release Ritual, 90 minutes, at the Portals Nous studio",
  },
}

const journey = [
  {
    time: "5 min",
    t: "Full-body assessment & grounding",
    d: "Tissue density, breath and movement patterns are read through touch and posture, mapping exactly where your body holds its tension so the pressure lands where it matters.",
  },
  {
    time: "20 min",
    t: "Myofascial release · global fascia lines",
    d: "Slow, sustained skin-stretching and compression, initially without oil. The tissue softens and begins to melt rather than being forced, easing the deeper work to come.",
  },
  {
    time: "20 min",
    t: "Trigger point therapy · upper body",
    d: "Neck, jaw, shoulders, upper back and arms. Static pressure holds with breath cues, muscle stripping and cross-fibre work to switch off pain-referral patterns, relieve headaches and free stiff shoulders.",
  },
  {
    time: "20 min",
    t: "Trigger point therapy · lower body",
    d: "Hips, glutes, hamstrings and calves. Releases the pelvic and lower-back tension that drives so much discomfort, improving how you walk, sit and move.",
  },
  {
    time: "10 min",
    t: "Joint mobilisation & assisted stretching",
    d: "Gentle mobilisation and assisted stretches restore functional movement and help prevent the tightness from creeping back.",
  },
  {
    time: "15 min",
    t: "Recovery & nervous system regulation",
    d: "Lymphatic flushing strokes, grounding holds and a slower pace to close, so you leave regulated and calm, not wrung out.",
  },
]

const aftercare = [
  "Hydrate well for the rest of the day",
  "Gentle movement later that day helps the release settle",
  "Avoid intense exercise for 24 hours",
  "For chronic patterns, book a short course of follow-ups",
]

const senses = [
  { k: "Music", v: "Soundbath" },
  { k: "Tea", v: "Peppermint or lemon ginger" },
  { k: "A little something", v: "Almonds" },
  { k: "Scent", v: "Earthy & herby: rosemary, eucalyptus, black pepper" },
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
          alt="Deep therapeutic massage treatment in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Signature Ritual
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            The Tension Release Ritual
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            90 minutes of trigger point therapy, myofascial release and
            assisted stretching for chronic tension, headaches and restricted
            movement. Firm but mindful, guided by your body, never rushed,
            never aggressive.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Book the Tension Release
          </a>
          <p className="mt-4 text-sm text-cream/70">
            90 minutes · Studio €135 · To you €155
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          For tension the body has held too long
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          A results-driven treatment for chronic muscular tension, postural
          imbalances, headaches, restricted movement or stress held deep in the
          body. Working layer by layer with slow, intentional pressure, the
          treatment releases long-held tightness while keeping you grounded and
          regulated throughout.
        </p>
      </section>

      {/* The journey */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            The treatment, step by step
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

      {/* Aftercare + senses + pricing */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Aftercare
        </h2>
        <ul className="mt-6 space-y-2">
          {aftercare.map((a) => (
            <li key={a} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
              <span>{a}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-serif text-3xl font-medium text-foreground md:text-4xl">
          Set for the senses
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
            <span className="font-serif text-xl">The Tension Release Ritual · 90 minutes</span>
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-border/60 pb-2">
              <span>At the studio, Portals Nous</span>
              <span className="text-foreground">€135</span>
            </li>
            <li className="flex justify-between">
              <span>At your villa, yacht or hotel</span>
              <span className="text-foreground">€155</span>
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

import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CtaFooter } from "@/components/cta-footer"

const WA =
  "https://wa.me/34602020734?text=Hello%20Calm%20%26%20Contour%2C%20I'd%20like%20to%20book%20a%20treatment%20in%20Mallorca."

export const metadata: Metadata = {
  title: "Treatments | Massage, Facials & Body Contouring in Mallorca | Calm & Contour",
  description:
    "Our treatments in Mallorca: Swedish, deep tissue, aromatherapy, hot stone, lymphatic drainage, prenatal and sports massage, plus facials and body contouring. Studio or mobile to your villa, yacht or hotel. From €85.",
  alternates: { canonical: "https://www.calmandcontour.com/treatments" },
  openGraph: {
    title: "Treatments | Calm & Contour Mallorca",
    description:
      "Massage, facials and body contouring across Mallorca. Studio or mobile.",
    url: "https://www.calmandcontour.com/treatments",
    images: ["/images/body-contour.png"],
  },
}

const massages = [
  { t: "Swedish & relaxation", d: "Flowing, gentle-to-medium pressure to melt away tension and leave you deeply relaxed." },
  { t: "Deep tissue", d: "Firmer, focused work on knots and tight muscles, ideal after travel, sport or long days." },
  { t: "Aromatherapy", d: "Slow, soothing massage with essential oils chosen for calm, energy or sleep." },
  { t: "Hot stone", d: "Warm basalt stones ease muscles and quiet the mind, wonderfully warming and restorative." },
  { t: "Lymphatic drainage", d: "Light, rhythmic strokes that reduce puffiness, aid recovery and leave you feeling lighter." },
  { t: "Prenatal massage", d: "Gentle, safe massage tailored for pregnancy to ease the back, hips and legs." },
  { t: "Sports & recovery", d: "Targeted techniques to loosen, mobilise and speed recovery for active bodies." },
  { t: "Back, neck & shoulders", d: "A focused session for the areas that hold the most tension, perfect as a quick reset." },
]

const contour = [
  { t: "Facial & facial reset", d: "Cleansing, lifting and hydrating facials to refresh and brighten the skin." },
  { t: "Wood therapy (maderoterapia)", d: "Sculpting massage with wooden tools to contour, smooth and stimulate circulation." },
  { t: "Lymphatic sculpting", d: "Drainage-led body work to de-bloat and define, popular before events." },
  { t: "Pre-event sculpting", d: "A tailored session to look and feel your best before a wedding, shoot or special day." },
]

export default function Page() {
  return (
    <main className="bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/body-contour.png"
          alt="Calm treatment room setup for massage and body contouring in Mallorca"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-36 text-center text-cream md:pb-28 md:pt-44">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
            Mallorca · Studio &amp; Mobile
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
            Massage Treatments in Mallorca
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cream/85">
            Massage, facials and body contouring, at the studio in Portals Nous or
            brought to your villa, yacht or hotel. Every treatment is tailored to
            you. Not sure which to choose? Message Parissa and she will guide you.
          </p>
          <a
            href={WA}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Message Parissa
          </a>
        </div>
      </section>

      {/* Massage types */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Massage
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Choose the style you like, or tell Parissa how you would like to feel
          afterwards and she will build the session around you.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {massages.map((m) => (
            <div key={m.t} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-xl text-foreground">{m.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facials & contouring */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
            Facials &amp; body contouring
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Beyond massage, Parissa offers facial treatments and body sculpting to
            refresh the skin and define the body.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {contour.map((m) => (
              <div key={m.t} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-foreground">{m.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP — The Ritual */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          VIP Experience
        </p>
        <h2 className="mt-2 font-serif text-3xl font-medium text-foreground md:text-4xl">
          The Ritual · 2 hours · €200
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Our most indulgent treatment. Two unhurried hours of full body
          massage with warm aromatherapy oils and hot stones, finished with a
          hot towel rub down to remove every trace of oil and a pot of herbal
          tea. At your villa, yacht, hotel or the studio.
        </p>
        <a
          href="/ritual-massage-mallorca"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
        >
          Discover The Ritual
        </a>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <a
            href="/serene-flow-ritual-mallorca"
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted"
          >
            <h3 className="font-serif text-xl text-foreground">
              The Serene Flow Ritual · 90 min
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Lymphatic drainage meets Balinese flowing massage. De-bloat,
              soften and reset the nervous system, with jasmine tea and ocean
              sounds. Studio €135 · to you €155.
            </p>
          </a>
          <a
            href="/tension-release-massage-mallorca"
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted"
          >
            <h3 className="font-serif text-xl text-foreground">
              The Tension Release Ritual · 90 min
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Trigger point therapy and myofascial release for chronic tension,
              headaches and stiff shoulders. Firm but mindful, never rushed.
              Studio €135 · to you €155.
            </p>
          </a>
        </div>
      </section>

      {/* Pricing strip */}
      <section className="bg-secondary/40 mx-auto max-w-none px-0"><div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-medium text-foreground md:text-4xl">
          Pricing
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <span className="font-serif text-xl text-foreground">Studio, Portals Nous</span>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex justify-between border-b border-border/60 pb-2"><span>60 minutes</span><span className="text-foreground">€85</span></li>
              <li className="flex justify-between"><span>90 minutes</span><span className="text-foreground">€135</span></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <span className="font-serif text-xl text-foreground">Mobile, to you</span>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex justify-between border-b border-border/60 pb-2"><span>60 minutes</span><span className="text-foreground">€130</span></li>
              <li className="flex justify-between"><span>90 minutes</span><span className="text-foreground">€155</span></li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          The Ritual (120 minutes, everything included) is €200 anywhere.
          Couples and groups are treated side by side at your villa, hotel or
          yacht with a second therapist. Just ask.
        </p>
      </div></section>

      <CtaFooter />
    </main>
  )
}

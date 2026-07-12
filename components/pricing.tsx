"use client"

import { MessageCircle, Check } from "lucide-react"
import { whatsappLink, trackWhatsAppConversion } from "@/lib/whatsapp"

type Plan = {
  name: string
  subtitle: string
  featured?: boolean
  perks: string[]
  options: { duration: string; price: string; service: string }[]
}

const plans: Plan[] = [
  {
    name: "VIP Home Service",
    subtitle: "Villa · Yacht · Hotel",
    featured: true,
    perks: [
      "We come to your residence",
      "Villa, yacht or hotel suite",
      "Full setup brought to you",
    ],
    options: [
      {
        duration: "60 min",
        price: "€130",
        service: "60 min VIP home service massage",
      },
      {
        duration: "90 min",
        price: "€155",
        service: "90 min VIP home service massage",
      },
    ],
  },
  {
    name: "Studio",
    subtitle: "Calm & Contour studio",
    perks: [
      "Private boutique studio setting",
      "Massage, body & facial treatments",
      "Lymphatic drainage available",
    ],
    options: [
      { duration: "60 min", price: "€85", service: "60 min studio massage" },
      { duration: "90 min", price: "€135", service: "90 min studio massage" },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Treatments &amp; pricing
          </span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            Choose your treatment
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Tap any option to send a prefilled WhatsApp message &mdash; we&apos;ll
            confirm your time and location.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 ${
                plan.featured
                  ? "bg-foreground text-background shadow-xl"
                  : "bg-card text-card-foreground ring-1 ring-border"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-serif text-3xl">{plan.name}</h3>
              <p
                className={`mt-1 text-sm uppercase tracking-[0.2em] ${
                  plan.featured ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {plan.subtitle}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`mt-0.5 size-4 shrink-0 ${
                        plan.featured ? "text-background" : "text-primary"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        plan.featured
                          ? "text-background/90"
                          : "text-muted-foreground"
                      }
                    >
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-8 space-y-3 border-t pt-6 ${
                  plan.featured ? "border-background/20" : "border-border"
                }`}
              >
                {plan.options.map((opt) => (
                  <a
                    key={opt.duration}
                    href={whatsappLink(
                      `Hello Calm & Contour, I'd like to book a ${opt.service} (${opt.price}).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppConversion()}
                    className={`flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-3 transition-transform hover:scale-[1.02] ${
                      plan.featured
                        ? "bg-background/10 hover:bg-background/15"
                        : "bg-secondary hover:bg-accent"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{opt.duration}</span>
                      <span
                        className={`text-xs ${
                          plan.featured
                            ? "text-background/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        Message Parissa
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-serif text-2xl">{opt.price}</span>
                      <MessageCircle
                        className={`size-5 ${
                          plan.featured ? "text-whatsapp" : "text-whatsapp"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Mobile service to your residence available by appointment across the
          Balearic Isles.
        </p>
      </div>
    </section>
  )
}

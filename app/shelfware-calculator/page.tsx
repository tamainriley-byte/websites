"use client"

import { useState } from "react"

/**
 * Shelfware Calculator — lead machine for the PeopleManager x HumAI campaign.
 * Playbook pattern: compute the headline pain free, gate the full payback
 * report behind contact + qualification, end on a dated next step.
 *
 * BEFORE ADS RUN: wire submitLead() to the CRM (Typeform/Make webhook) and
 * set BOOKING_URL to the live Design Session calendar. Leads currently
 * persist to localStorage only.
 */

const BOOKING_URL = "#book-design-session" // TODO: live calendar link

type LeadForm = {
  name: string
  company: string
  email: string
  phone: string
  teamSize: string
  budgetBand: string
}

const emptyLead: LeadForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  teamSize: "",
  budgetBand: "",
}

function gbp(n: number) {
  return `£${Math.round(n).toLocaleString("en-GB")}`
}

export default function ShelfwareCalculatorPage() {
  const [tools, setTools] = useState(6)
  const [paidSeats, setPaidSeats] = useState(20)
  const [activeSeats, setActiveSeats] = useState(8)
  const [pricePerSeat, setPricePerSeat] = useState(40)
  const [step, setStep] = useState<"inputs" | "gate" | "report">("inputs")
  const [lead, setLead] = useState<LeadForm>(emptyLead)

  const monthlySpend = paidSeats * pricePerSeat
  const wastedSeats = Math.max(0, paidSeats - activeSeats)
  const annualWaste = wastedSeats * pricePerSeat * 12
  const fiveYearSpend = monthlySpend * 12 * 5
  const buildEstimate = Math.max(25000, Math.min(500000, fiveYearSpend * 0.35))
  const paybackMonths = monthlySpend > 0 ? Math.ceil(buildEstimate / monthlySpend) : 0

  const submitLead = () => {
    const record = {
      ...lead,
      tools,
      paidSeats,
      activeSeats,
      pricePerSeat,
      annualWaste,
      fiveYearSpend,
      submittedAt: new Date().toISOString(),
    }
    try {
      const key = "shelfware-leads"
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]")
      localStorage.setItem(key, JSON.stringify([record, ...existing]))
    } catch {
      /* storage unavailable — still show the report */
    }
    setStep("report")
  }

  const leadValid =
    lead.name && lead.company && lead.email.includes("@") && lead.phone.length >= 7

  const input =
    "rounded-xl border border-input bg-background px-3 py-2.5 text-base"
  const label = "flex flex-col gap-1.5 text-sm font-medium"

  return (
    <main className="min-h-screen bg-background px-5 py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">
          The Shelfware Calculator
        </span>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-tight md:text-5xl">
          How much are you paying for software nobody uses?
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Most companies rent 5–10 tools, pay per seat, and watch half those
          seats go unopened. Add up yours — the number is usually worse than
          you think.
        </p>

        {step === "inputs" && (
          <section className="mt-10 grid gap-5 rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
            <label className={label}>
              How many software tools does the business pay for?
              <input type="number" min={1} className={input} value={tools}
                onChange={(e) => setTools(Number(e.target.value) || 0)} />
            </label>
            <label className={label}>
              Total paid seats/licences across those tools
              <input type="number" min={1} className={input} value={paidSeats}
                onChange={(e) => setPaidSeats(Number(e.target.value) || 0)} />
            </label>
            <label className={label}>
              Seats actually used weekly (be honest)
              <input type="number" min={0} className={input} value={activeSeats}
                onChange={(e) => setActiveSeats(Number(e.target.value) || 0)} />
            </label>
            <label className={label}>
              Average price per seat per month (£)
              <input type="number" min={0} className={input} value={pricePerSeat}
                onChange={(e) => setPricePerSeat(Number(e.target.value) || 0)} />
            </label>
            <button
              onClick={() => setStep("gate")}
              className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Show me the damage
            </button>
          </section>
        )}

        {step !== "inputs" && (
          <div className="mt-10 rounded-3xl bg-foreground p-6 text-background md:p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-background/60">
              Paid for, not used
            </div>
            <div className="mt-1 font-serif text-5xl">{gbp(annualWaste)}/yr</div>
            <p className="mt-3 text-sm text-background/70">
              {wastedSeats} of your {paidSeats} paid seats sit idle. And that is
              only the waste — the full report shows what the whole stack costs
              over 5 years, and what owning it outright would cost instead.
            </p>
          </div>
        )}

        {step === "gate" && (
          <section className="mt-6 grid gap-5 rounded-3xl bg-card p-6 ring-1 ring-border md:grid-cols-2 md:p-8">
            <h2 className="font-serif text-2xl md:col-span-2">
              Get the full 5-year payback report
            </h2>
            <label className={label}>Name
              <input className={input} value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })} />
            </label>
            <label className={label}>Company
              <input className={input} value={lead.company}
                onChange={(e) => setLead({ ...lead, company: e.target.value })} />
            </label>
            <label className={label}>Work email
              <input type="email" className={input} value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })} />
            </label>
            <label className={label}>Phone
              <input type="tel" className={input} value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            </label>
            <label className={label}>Team size
              <select className={input} value={lead.teamSize}
                onChange={(e) => setLead({ ...lead, teamSize: e.target.value })}>
                <option value="">Select…</option>
                <option>1–10</option>
                <option>11–50</option>
                <option>51–200</option>
                <option>200+</option>
              </select>
            </label>
            <label className={label}>Budget band for the right system
              <select className={input} value={lead.budgetBand}
                onChange={(e) => setLead({ ...lead, budgetBand: e.target.value })}>
                <option value="">Select…</option>
                <option>Under £25k</option>
                <option>£25k–£75k</option>
                <option>£75k–£200k</option>
                <option>£200k+</option>
              </select>
            </label>
            <button
              onClick={submitLead}
              disabled={!leadValid}
              className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-40 md:col-span-2"
            >
              Send my report
            </button>
          </section>
        )}

        {step === "report" && (
          <section className="mt-6 space-y-6">
            <div className="rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
              <h2 className="font-serif text-2xl">
                {lead.company}: rent vs own
              </h2>
              <dl className="mt-5 space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">
                    Current stack, next 5 years (rented)
                  </dt>
                  <dd className="font-serif text-2xl">{gbp(fiveYearSpend)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">
                    Bespoke system you own outright (indicative)
                  </dt>
                  <dd className="font-serif text-2xl">{gbp(buildEstimate)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">
                    Build pays for itself in
                  </dt>
                  <dd className="font-serif text-2xl">{paybackMonths} months</dd>
                </div>
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                One system, designed around how your team works — CRM,
                ticketing, training, monitoring, whatever the stack currently
                rents badly. One-off build. You own the system and the data.
                No per-seat fees, ever. Changes billed as piece-work, and it
                improves as the technology does.
              </p>
            </div>
            <a
              href={BOOKING_URL}
              className="block rounded-full bg-primary px-8 py-4 text-center text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Book your Design Session — pick a time now
            </a>
            <p className="text-center text-sm text-muted-foreground">
              45 minutes with the people who will spec your build. You leave
              with a scoped price, whether or not you go ahead.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}

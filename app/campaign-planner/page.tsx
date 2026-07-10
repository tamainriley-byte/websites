"use client"

import { useEffect, useState } from "react"
import { buildPlan, type Plan, type PlanInput } from "@/lib/campaign-kb"

/**
 * Campaign Planner — enter a company, get a lead-engine plan.
 * Knowledge base + sizing engine live in lib/campaign-kb.ts.
 * Saved plans persist in the browser (localStorage) as the v1 "database";
 * swap for a real backend (Supabase/Postgres) when multi-user access is needed.
 */

type SavedPlan = { input: PlanInput; plan: Plan; savedAt: string }

const STORAGE_KEY = "campaign-planner-plans"

const emptyInput: PlanInput = {
  companyName: "",
  url: "",
  description: "",
  sector: "",
  avgClientValueGbp: 2000,
  closeRate: 0.5,
  targetAppointmentsPerMonth: 10,
  hasFollowUpMachine: false,
}

function gbp(n: number) {
  return `£${n.toLocaleString("en-GB")}`
}

export default function CampaignPlannerPage() {
  const [input, setInput] = useState<PlanInput>(emptyInput)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [saved, setSaved] = useState<SavedPlan[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSaved(JSON.parse(raw))
    } catch {
      /* corrupted storage — start fresh */
    }
  }, [])

  const set = <K extends keyof PlanInput>(key: K, value: PlanInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }))

  const generate = () => setPlan(buildPlan(input))

  const savePlan = () => {
    if (!plan) return
    const next = [
      { input, plan, savedAt: new Date().toISOString() },
      ...saved.filter((s) => s.input.companyName !== input.companyName),
    ]
    setSaved(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const loadPlan = (s: SavedPlan) => {
    setInput(s.input)
    setPlan(s.plan)
  }

  const deletePlan = (name: string) => {
    const next = saved.filter((s) => s.input.companyName !== name)
    setSaved(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <main className="min-h-screen bg-background px-5 py-16 md:px-8">
      <div className="mx-auto max-w-4xl">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">
          Lead engine planner
        </span>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-tight md:text-5xl">
          Campaign Planner
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Enter a company and its goals. The plan is sized from measured
          benchmarks (real UK lead-gen accounts) and the playbook rules that
          travel to every client. Numbers are starting assumptions — replace
          them with the account&apos;s own data after two weeks of spend.
        </p>

        {/* ---- Intake form ---- */}
        <section className="mt-10 grid gap-5 rounded-3xl bg-card p-6 ring-1 ring-border md:grid-cols-2 md:p-8">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Company name
            <input
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Thornton & Baines"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Website URL
            <input
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://…"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            What does the company do?
            <textarea
              className="min-h-20 rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="One or two sentences on the service and who buys it"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Sector
            <input
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.sector}
              onChange={(e) => set("sector", e.target.value)}
              placeholder="e.g. estate planning, wellness, legal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Target appointments / month
            <input
              type="number"
              min={1}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.targetAppointmentsPerMonth}
              onChange={(e) =>
                set("targetAppointmentsPerMonth", Number(e.target.value) || 0)
              }
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Average client value (£)
            <input
              type="number"
              min={0}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={input.avgClientValueGbp}
              onChange={(e) =>
                set("avgClientValueGbp", Number(e.target.value) || 0)
              }
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Close rate (% of appointments that buy)
            <input
              type="number"
              min={1}
              max={100}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-base"
              value={Math.round(input.closeRate * 100)}
              onChange={(e) =>
                set(
                  "closeRate",
                  Math.min(100, Math.max(1, Number(e.target.value) || 0)) / 100,
                )
              }
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium md:col-span-2">
            <input
              type="checkbox"
              className="size-5"
              checked={input.hasFollowUpMachine}
              onChange={(e) => set("hasFollowUpMachine", e.target.checked)}
            />
            Follow-up machine already live (dated-slot booking + CRM chase
            sequence)
          </label>

          <button
            onClick={generate}
            disabled={!input.companyName || input.targetAppointmentsPerMonth < 1}
            className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-40 md:col-span-2"
          >
            Build the plan
          </button>
        </section>

        {/* ---- Plan output ---- */}
        {plan && (
          <section className="mt-10 space-y-6">
            <div className="rounded-3xl bg-foreground p-6 text-background md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl">
                {input.companyName}: the machine
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Leads needed / mo
                  </div>
                  <div className="mt-1 font-serif text-3xl">
                    {plan.leadsNeededPerMonth}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Ad spend / mo
                  </div>
                  <div className="mt-1 font-serif text-3xl">
                    {gbp(plan.adSpendPerMonthGbp)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Projected revenue
                  </div>
                  <div className="mt-1 font-serif text-3xl">
                    {gbp(plan.projectedRevenueGbp)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Return on spend
                  </div>
                  <div className="mt-1 font-serif text-3xl">
                    {plan.roiMultiple}x
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-background/70">
                Assumes {gbp(plan.cpaUsedGbp)} per lead and a{" "}
                {Math.round(plan.bookingRateUsed * 100)}% lead-to-appointment
                rate. {plan.closersNeeded} closer
                {plan.closersNeeded > 1 ? "s" : ""} needed at ~20 held
                appointments each per month.
              </p>
            </div>

            <div className="rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Staffing
              </span>
              <h3 className="mt-2 font-serif text-2xl">
                {plan.staffing.headline}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {plan.staffing.detail}
              </p>
            </div>

            <div className="rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Channel plan
              </span>
              <ul className="mt-4 space-y-4">
                {plan.channels.map((c) => (
                  <li key={c.name} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">{c.role}</div>
                    </div>
                    <div className="shrink-0 font-serif text-xl">
                      {gbp(c.monthlyBudgetGbp)}/mo
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {plan.warnings.length > 0 && (
              <div className="rounded-3xl bg-accent p-6 ring-1 ring-border md:p-8">
                <span className="text-xs uppercase tracking-[0.3em] text-accent-foreground">
                  Before you spend
                </span>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-accent-foreground">
                  {plan.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                The playbook (non-negotiables)
              </span>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {plan.checklist.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </div>

            <button
              onClick={savePlan}
              className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Save {input.companyName || "plan"} to database
            </button>
          </section>
        )}

        {/* ---- Saved plans ---- */}
        {saved.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl">Saved companies</h2>
            <ul className="mt-4 divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
              {saved.map((s) => (
                <li
                  key={s.input.companyName}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <div className="font-medium">{s.input.companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {s.input.targetAppointmentsPerMonth} appts/mo ·{" "}
                      {s.plan.leadsNeededPerMonth} leads ·{" "}
                      {gbp(s.plan.adSpendPerMonthGbp)}/mo ·{" "}
                      {s.plan.staffing.headline}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => loadPlan(s)}
                      className="rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => deletePlan(s.input.companyName)}
                      className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

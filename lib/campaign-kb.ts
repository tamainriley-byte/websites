/**
 * Campaign Planner knowledge base + sizing engine.
 *
 * Every number in BENCHMARKS was measured on a real account (inheritance-tax.co.uk,
 * Jul 2026) or comes from The Lead Calculator Playbook / Calculator Premortem.
 * They are starting assumptions for a NEW company's plan — real data replaces
 * them after the first two weeks of spend.
 */

export const BENCHMARKS = {
  // Google Search, high-intent calculator/lead-gen funnel (measured)
  search: {
    cpaGoodGbp: 3.5, // proven long-run cost per lead at scale
    cpaStartGbp: 5, // safe planning figure for a new account pre-optimisation
    cpcGbp: 0.45, // typical click cost, UK financial-adjacent niche
    funnelConvRate: 0.133, // clicks -> leads, long-form calculator (measured 13.3%)
    shortFormPenalty: 0.33, // short "frictionless" form cost ~33% more per lead (measured)
    ctr: 0.056,
  },
  bing: {
    volumeVsGoogle: 0.18, // extra volume as share of Google's (~15-20%)
    cpcVsGoogle: 0.7, // CPCs typically 20-40% cheaper
  },
  meta: {
    cpaStartGbp: 12, // cold traffic; improves with lookalikes
    cpaScaledGbp: 8,
    minMonthlyTestGbp: 1500, // £50/day test budget
  },
  conversion: {
    datedSlotBookingRate: 0.64, // confirmed-time booking (measured 64-84%)
    undatedBookingRate: 0.11, // "we'll be in touch" (measured 4-18%)
    blendedBookingRate: 0.35, // realistic mix while follow-up matures
    namedProductLift: 2.5, // named product vs generic offer (measured 2-3x)
    showUpRate: 0.8,
  },
  capacity: {
    apptsPerCloserPerMonth: 20, // one closer/planner can hold ~20 appointments/month
    leadsAiCanChase: 80, // AI email/SMS + self-book calendar copes to here
    leadsPartTimeSetter: 300, // part-time human setter ceiling
    leadsFullTimeSetter: 600,
  },
} as const

/** The playbook rules that travel to every client. Source: Lead Calculator Playbook. */
export const PLAYBOOK_RULES = [
  "Gate the fix, show the problem: reveal the headline figure, trade the full report for name, email and phone.",
  "More questions, not fewer: ~15 small steps build commitment; a 2-minute form loses leads at the capture wall.",
  "Fire the lead event on submit (generate_lead), never on a URL — URL-keyed conversions break silently.",
  "Dated next step or nothing: a confirmed slot books 64-84%; 'we'll be in touch' books 4-18%.",
  "Name the product: a named offer converts 2-3x a generic one.",
  "One campaign per product. Search only. AI-expansion features off until tracking is proven.",
  "Deploy order: page live -> test lead lands in CRM tagged -> tracking verified -> only then publish ads.",
  "Follow-up cadence for non-bookers: day 0 report email, day 1 call, day 3 value email, day 7 call, day 14 straight-talk close.",
  "Tag every lead at capture (source, journey, product); one owner per lead, no double-dials.",
  "Mine the search-terms report weekly: promote converters to exact match, add waste as negatives.",
] as const

export type PlanInput = {
  companyName: string
  url: string
  description: string
  sector: string
  avgClientValueGbp: number
  closeRate: number // 0..1, share of held appointments that become clients
  targetAppointmentsPerMonth: number
  hasFollowUpMachine: boolean // dated-slot booking + CRM chase sequence live?
}

export type StaffingTier = "ai" | "ai-plus-human" | "salesperson" | "team"

export type Plan = {
  leadsNeededPerMonth: number
  bookingRateUsed: number
  adSpendPerMonthGbp: number
  cpaUsedGbp: number
  projectedRevenueGbp: number
  roiMultiple: number
  staffing: {
    tier: StaffingTier
    headline: string
    detail: string
  }
  closersNeeded: number
  channels: { name: string; role: string; monthlyBudgetGbp: number }[]
  warnings: string[]
  checklist: readonly string[]
}

export function buildPlan(input: PlanInput): Plan {
  const b = BENCHMARKS
  const warnings: string[] = []

  const bookingRate = input.hasFollowUpMachine
    ? b.conversion.datedSlotBookingRate
    : b.conversion.blendedBookingRate
  if (!input.hasFollowUpMachine) {
    warnings.push(
      "No follow-up machine yet: plan assumes a 35% lead-to-appointment rate. A dated-slot booking flow nearly doubles it (64%+) — build it before scaling spend.",
    )
  }

  // Appointments held -> appointments booked -> leads needed
  const apptsBooked =
    input.targetAppointmentsPerMonth / b.conversion.showUpRate
  const leadsNeeded = Math.ceil(apptsBooked / bookingRate)

  const cpa = b.search.cpaStartGbp
  const adSpend = Math.ceil(leadsNeeded * cpa)

  const projectedRevenue = Math.round(
    input.targetAppointmentsPerMonth * input.closeRate * input.avgClientValueGbp,
  )
  const roi = adSpend > 0 ? projectedRevenue / adSpend : 0
  if (roi < 3) {
    warnings.push(
      "Projected return is under 3x ad spend. Raise average client value, close rate, or rethink the offer before buying traffic.",
    )
  }

  // Staffing: Terry's rule — a handful of appointments a month, AI books them;
  // ~15+ needs a person whose job is booking and holding the pipeline.
  const appts = input.targetAppointmentsPerMonth
  let tier: StaffingTier
  let headline: string
  let detail: string
  if (appts <= 5 && leadsNeeded <= b.capacity.leadsAiCanChase) {
    tier = "ai"
    headline = "AI can run this end to end"
    detail =
      "Automated follow-up (email + SMS) with a self-serve calendar covers this volume. A human only takes the booked call."
  } else if (appts <= 14 && leadsNeeded <= b.capacity.leadsPartTimeSetter) {
    tier = "ai-plus-human"
    headline = "AI first, human mop-up"
    detail =
      "AI books the easy ones; a part-time setter (a few hours a day) calls the leads who don't self-book. That call is where most of the extra appointments come from."
  } else if (appts <= 30) {
    tier = "salesperson"
    headline = "Hire (or assign) a dedicated booker"
    detail =
      "At 15+ appointments a month the pipeline needs an owner: same-day dialling of every lead, no double-dials, dated next steps locked on every call."
  } else {
    tier = "team"
    headline = "This is a sales floor"
    detail =
      "Volume needs a team: setters feeding closers, one lead owner per lead, capacity planned so promised slots always exist (never promise slots you can't fill)."
  }
  const closersNeeded = Math.max(
    1,
    Math.ceil(appts / b.capacity.apptsPerCloserPerMonth),
  )

  // Channel plan by budget
  const channels: Plan["channels"] = [
    {
      name: "Google Search",
      role: "Core engine — high-intent searches, exact/phrase match, weekly search-term mining",
      monthlyBudgetGbp: adSpend,
    },
  ]
  if (adSpend >= 1500) {
    channels.push({
      name: "Microsoft Ads (Bing)",
      role: "Clone of the Google winner via Google-import. Older audience, ~20-40% cheaper clicks, ~15-20% extra volume",
      monthlyBudgetGbp: Math.ceil(adSpend * b.bing.volumeVsGoogle),
    })
  }
  if (adSpend >= 4000 || leadsNeeded > 500) {
    channels.push({
      name: "Meta (Facebook/Instagram)",
      role: "Scale channel — only after tracking and follow-up are proven. Cold traffic dies without a chase sequence",
      monthlyBudgetGbp: Math.max(b.meta.minMonthlyTestGbp, Math.ceil(adSpend * 0.5)),
    })
  }

  return {
    leadsNeededPerMonth: leadsNeeded,
    bookingRateUsed: bookingRate,
    adSpendPerMonthGbp: adSpend,
    cpaUsedGbp: cpa,
    projectedRevenueGbp: projectedRevenue,
    roiMultiple: Math.round(roi * 10) / 10,
    staffing: { tier, headline, detail },
    closersNeeded,
    channels,
    warnings,
    checklist: PLAYBOOK_RULES,
  }
}

import { getWeeklyStats } from "@/lib/db"

/* ------------------------------------------------------------------ */
/*  Daily owner report: today's leads/bookings plus the rolling       */
/*  7-day economics (cost per lead / per booking) and a plain         */
/*  scale / hold / cut recommendation. Sent by /api/report            */
/*  (Vercel Cron, daily 18:00 UTC = 8pm Mallorca in summer)           */
/*  via Resend's HTTP API.                                            */
/* ------------------------------------------------------------------ */

// The economics gate from the roadmap: a booking is worth ~€35 margin, so
// cost-per-booking must stay comfortably under this for a phase (or more
// spend, or a new city) to make sense.
const MARGIN_EUR = 35

export type PeriodReport = {
  periodDays: number
  from: string
  to: string
  adSpendEur: number
  leads: number
  uniqueLeads: number
  bookings: number
  bookingsAllTime: number
  costPerLeadEur: number | null
  costPerBookingEur: number | null
}

export type DailyDigest = {
  today: PeriodReport
  week: PeriodReport
  // Always derived from the 7-day numbers; a single day is too noisy to act on.
  recommendation: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function recommend(week: PeriodReport): string {
  if (week.uniqueLeads === 0) {
    return "No leads in the last 7 days. Check the Search campaign is running and the site chat is working before reading anything into the numbers."
  }
  if (week.bookings === 0 || week.costPerBookingEur === null) {
    return "No bookings marked in the last 7 days, so cost-per-booking can't be trusted yet. If any of these leads did book, mark them 'Booked' in /admin — that toggle is what makes this number real."
  }
  if (week.costPerBookingEur <= MARGIN_EUR * 0.7) {
    return `SCALE: 7-day cost per booking is comfortably under the ~€${MARGIN_EUR} margin. There's room to raise ad spend or add a therapist.`
  }
  if (week.costPerBookingEur <= MARGIN_EUR) {
    return `HOLD: 7-day cost per booking is close to the ~€${MARGIN_EUR} margin. Keep spend level and watch the next few days before scaling.`
  }
  return `CUT / FIX: 7-day cost per booking is above the ~€${MARGIN_EUR} margin. Cut spend on the weakest keywords or fix the funnel before spending more.`
}

async function buildPeriodReport(days: number): Promise<PeriodReport> {
  const stats = await getWeeklyStats(days)

  // No Google Ads API access, so spend is estimated from the daily budget
  // (€25/day on the Search campaign). Override with ADS_DAILY_BUDGET_EUR.
  const dailyBudget = Number(process.env.ADS_DAILY_BUDGET_EUR || 25)
  const adSpend = round2(dailyBudget * days)

  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)

  return {
    periodDays: days,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    adSpendEur: adSpend,
    leads: stats.leads,
    uniqueLeads: stats.uniqueLeads,
    bookings: stats.booked,
    bookingsAllTime: stats.bookedAllTime,
    costPerLeadEur:
      stats.uniqueLeads > 0 ? round2(adSpend / stats.uniqueLeads) : null,
    costPerBookingEur:
      stats.booked > 0 ? round2(adSpend / stats.booked) : null,
  }
}

export async function buildDailyDigest(): Promise<DailyDigest> {
  const [today, week] = await Promise.all([
    buildPeriodReport(1),
    buildPeriodReport(7),
  ])
  return { today, week, recommendation: recommend(week) }
}

function eur(n: number | null) {
  return n === null ? "—" : `€${n.toFixed(2)}`
}

export function digestText(d: DailyDigest): string {
  return [
    `Calm & Contour — daily report (${d.today.to})`,
    ``,
    `TODAY (last 24h)`,
    `Leads: ${d.today.uniqueLeads} unique (${d.today.leads} enquiries)`,
    `Bookings marked: ${d.today.bookings}`,
    ``,
    `LAST 7 DAYS (${d.week.from} to ${d.week.to})`,
    `Ad spend (est. €${(d.week.adSpendEur / d.week.periodDays).toFixed(0)}/day): €${d.week.adSpendEur.toFixed(2)}`,
    `Leads: ${d.week.uniqueLeads} unique (${d.week.leads} enquiries)`,
    `Cost per lead: ${eur(d.week.costPerLeadEur)}`,
    `Bookings marked: ${d.week.bookings} (${d.week.bookingsAllTime} all time)`,
    `Cost per booking: ${eur(d.week.costPerBookingEur)}`,
    ``,
    `Recommendation: ${d.recommendation}`,
    ``,
    `Mark bookings at https://calmandcontour.com/admin — the toggle is what makes cost-per-booking real.`,
  ].join("\n")
}

export function digestHtml(d: DailyDigest): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;">${label}</td><td style="padding:6px 0;font-weight:600;">${value}</td></tr>`
  const heading = (text: string) =>
    `<h3 style="font-family:Arial,sans-serif;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;color:#6b7280;margin:20px 0 4px;">${text}</h3>`
  return `
  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1f2937;">
    <h2 style="font-weight:500;">Calm &amp; Contour — daily report</h2>
    <p style="color:#6b7280;">${d.today.to}</p>
    ${heading("Today (last 24h)")}
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      ${row("Leads (unique)", `${d.today.uniqueLeads} <span style="font-weight:400;color:#6b7280;">(${d.today.leads} enquiries)</span>`)}
      ${row("Bookings marked", `${d.today.bookings}`)}
    </table>
    ${heading(`Last 7 days (${d.week.from} to ${d.week.to})`)}
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      ${row("Ad spend (estimated)", `€${d.week.adSpendEur.toFixed(2)}`)}
      ${row("Leads (unique)", `${d.week.uniqueLeads} <span style="font-weight:400;color:#6b7280;">(${d.week.leads} enquiries)</span>`)}
      ${row("Cost per lead", eur(d.week.costPerLeadEur))}
      ${row("Bookings marked", `${d.week.bookings} <span style="font-weight:400;color:#6b7280;">(${d.week.bookingsAllTime} all time)</span>`)}
      ${row("Cost per booking", eur(d.week.costPerBookingEur))}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;background:#f3f4f6;border-radius:8px;padding:12px 16px;">
      <strong>Recommendation:</strong> ${d.recommendation}
    </p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;">
      Mark confirmed bookings at <a href="https://calmandcontour.com/admin">calmandcontour.com/admin</a> — that toggle is what makes cost-per-booking real.
    </p>
  </div>`
}

// Sends via Resend (https://resend.com). Needs RESEND_API_KEY; recipient
// defaults to the owner, override with REPORT_EMAIL_TO. Returns false (and
// logs) instead of throwing so the cron never hard-fails.
export async function sendReportEmail(digest: DailyDigest): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[report] RESEND_API_KEY not set, skipping email send")
    return false
  }
  const to = process.env.REPORT_EMAIL_TO || "tamainriley@gmail.com"
  // onboarding@resend.dev works without domain verification (owner inbox only).
  const from =
    process.env.REPORT_EMAIL_FROM || "Calm & Contour <onboarding@resend.dev>"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Calm & Contour daily: ${digest.today.uniqueLeads} leads today, ${digest.today.bookings} booked, 7-day ${
          digest.week.costPerBookingEur === null
            ? "cost/booking n/a"
            : `€${digest.week.costPerBookingEur.toFixed(0)}/booking`
        }`,
        text: digestText(digest),
        html: digestHtml(digest),
      }),
    })
    if (!res.ok) {
      console.error("[report] Resend error", res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error("[report] email send failed", err)
    return false
  }
}

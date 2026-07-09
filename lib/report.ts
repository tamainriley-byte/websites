import { getWeeklyStats } from "@/lib/db"

/* ------------------------------------------------------------------ */
/*  Weekly owner report: leads, bookings, cost per booking, and a     */
/*  plain scale / hold / cut recommendation. Sent by /api/report      */
/*  (Vercel Cron, Mondays) via Resend's HTTP API.                     */
/* ------------------------------------------------------------------ */

// The economics gate from the roadmap: a booking is worth ~€35 margin, so
// cost-per-booking must stay comfortably under this for a phase (or more
// spend, or a new city) to make sense.
const MARGIN_EUR = 35

export type WeeklyReport = {
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
  recommendation: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function recommend(report: {
  leads: number
  bookings: number
  costPerBookingEur: number | null
}): string {
  if (report.leads === 0) {
    return "No leads this week. Check the Search campaign is running and the site chat is working before reading anything into the numbers."
  }
  if (report.bookings === 0 || report.costPerBookingEur === null) {
    return "No bookings marked this week, so cost-per-booking can't be trusted yet. If any of these leads did book, mark them 'Booked' in /admin — that toggle is what makes this number real."
  }
  if (report.costPerBookingEur <= MARGIN_EUR * 0.7) {
    return `SCALE: cost per booking is comfortably under the ~€${MARGIN_EUR} margin. There's room to raise ad spend or add a therapist.`
  }
  if (report.costPerBookingEur <= MARGIN_EUR) {
    return `HOLD: cost per booking is close to the ~€${MARGIN_EUR} margin. Keep spend level and watch next week before scaling.`
  }
  return `CUT / FIX: cost per booking is above the ~€${MARGIN_EUR} margin. Cut spend on the weakest keywords or fix the funnel before spending more.`
}

export async function buildWeeklyReport(days = 7): Promise<WeeklyReport> {
  const stats = await getWeeklyStats(days)

  // No Google Ads API access, so spend is estimated from the daily budget
  // (€25/day on the Search campaign). Override with ADS_DAILY_BUDGET_EUR.
  const dailyBudget = Number(process.env.ADS_DAILY_BUDGET_EUR || 25)
  const adSpend = round2(dailyBudget * days)

  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)

  const costPerLead =
    stats.uniqueLeads > 0 ? round2(adSpend / stats.uniqueLeads) : null
  const costPerBooking =
    stats.booked > 0 ? round2(adSpend / stats.booked) : null

  return {
    periodDays: days,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    adSpendEur: adSpend,
    leads: stats.leads,
    uniqueLeads: stats.uniqueLeads,
    bookings: stats.booked,
    bookingsAllTime: stats.bookedAllTime,
    costPerLeadEur: costPerLead,
    costPerBookingEur: costPerBooking,
    recommendation: recommend({
      leads: stats.uniqueLeads,
      bookings: stats.booked,
      costPerBookingEur: costPerBooking,
    }),
  }
}

function eur(n: number | null) {
  return n === null ? "—" : `€${n.toFixed(2)}`
}

export function reportText(r: WeeklyReport): string {
  return [
    `Calm & Contour — weekly report (${r.from} to ${r.to})`,
    ``,
    `Ad spend (est. €${(r.adSpendEur / r.periodDays).toFixed(0)}/day): €${r.adSpendEur.toFixed(2)}`,
    `Leads: ${r.uniqueLeads} unique (${r.leads} enquiries)`,
    `Cost per lead: ${eur(r.costPerLeadEur)}`,
    `Bookings marked: ${r.bookings} this week (${r.bookingsAllTime} all time)`,
    `Cost per booking: ${eur(r.costPerBookingEur)}`,
    ``,
    `Recommendation: ${r.recommendation}`,
    ``,
    `Mark bookings at https://calmandcontour.com/admin — the toggle is what makes cost-per-booking real.`,
  ].join("\n")
}

export function reportHtml(r: WeeklyReport): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;">${label}</td><td style="padding:6px 0;font-weight:600;">${value}</td></tr>`
  return `
  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1f2937;">
    <h2 style="font-weight:500;">Calm &amp; Contour — weekly report</h2>
    <p style="color:#6b7280;">${r.from} to ${r.to}</p>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      ${row("Ad spend (estimated)", `€${r.adSpendEur.toFixed(2)}`)}
      ${row("Leads (unique)", `${r.uniqueLeads} <span style="font-weight:400;color:#6b7280;">(${r.leads} enquiries)</span>`)}
      ${row("Cost per lead", eur(r.costPerLeadEur))}
      ${row("Bookings marked", `${r.bookings} <span style="font-weight:400;color:#6b7280;">(${r.bookingsAllTime} all time)</span>`)}
      ${row("Cost per booking", eur(r.costPerBookingEur))}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;background:#f3f4f6;border-radius:8px;padding:12px 16px;">
      <strong>Recommendation:</strong> ${r.recommendation}
    </p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;">
      Mark confirmed bookings at <a href="https://calmandcontour.com/admin">calmandcontour.com/admin</a> — that toggle is what makes cost-per-booking real.
    </p>
  </div>`
}

// Sends via Resend (https://resend.com). Needs RESEND_API_KEY; recipient
// defaults to the owner, override with REPORT_EMAIL_TO. Returns false (and
// logs) instead of throwing so the cron never hard-fails.
export async function sendReportEmail(report: WeeklyReport): Promise<boolean> {
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
        subject: `Calm & Contour weekly: ${report.uniqueLeads} leads, ${report.bookings} bookings, ${
          report.costPerBookingEur === null
            ? "cost/booking n/a"
            : `€${report.costPerBookingEur.toFixed(0)}/booking`
        }`,
        text: reportText(report),
        html: reportHtml(report),
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

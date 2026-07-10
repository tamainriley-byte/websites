import { NextResponse } from "next/server"
import { buildDailyDigest, sendReportEmail } from "@/lib/report"
import { isAuthed } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

// Daily owner report. Fired by Vercel Cron (see vercel.json, daily 18:00 UTC
// = 8pm Mallorca in summer) which authenticates with `Authorization: Bearer
// ${CRON_SECRET}` when that env var is set. A signed-in owner can also hit
// /api/report in the browser to preview or resend it. Add ?send=0 to preview
// without emailing.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const auth = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  const isCron = Boolean(cronSecret) && auth === `Bearer ${cronSecret}`
  const isOwner = await isAuthed()

  if (!isCron && !isOwner) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const digest = await buildDailyDigest()
    const shouldSend = url.searchParams.get("send") !== "0"
    const emailed = shouldSend ? await sendReportEmail(digest) : false
    return NextResponse.json({ ...digest, emailed })
  } catch (error) {
    console.error("[report] failed", error)
    return NextResponse.json(
      { error: "Failed to build the daily report." },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { sendGratitudeEmail, currentSlot } from "@/lib/gratitude"
import { isAuthed } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

// Terry's gratitude email, fired four times a day by the GitHub Actions
// schedule (.github/workflows/gratitude.yml). When CRON_SECRET is set the
// caller must present it (Authorization: Bearer or ?key=); when it isn't,
// the endpoint stays open so the schedule works with zero extra setup.
// A signed-in owner can always hit it in the browser; ?send=0 previews.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const auth = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  const secretOk =
    !cronSecret ||
    auth === `Bearer ${cronSecret}` ||
    url.searchParams.get("key") === cronSecret

  if (!secretOk && !(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const shouldSend = url.searchParams.get("send") !== "0"
  const emailed = shouldSend ? await sendGratitudeEmail() : false
  return NextResponse.json({ slot: currentSlot().name, emailed })
}

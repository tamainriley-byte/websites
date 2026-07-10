import { NextResponse } from "next/server"
import { isAuthed } from "@/app/admin/actions"
import { gcalAuthUrl, gcalConfigured } from "@/lib/gcal"

export const dynamic = "force-dynamic"

// Starts the one-time Google Calendar connect for Parissa. Open this while
// signed into /admin; it redirects to Google's consent screen.
export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }
  if (!gcalConfigured()) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set in Vercel yet.",
      },
      { status: 500 },
    )
  }
  const redirectUri = new URL("/api/gcal/callback", request.url).toString()
  return NextResponse.redirect(gcalAuthUrl(redirectUri))
}

import { NextResponse } from "next/server"
import { ensureChatSchema } from "@/lib/db"
import { gcalExchangeCode } from "@/lib/gcal"

export const dynamic = "force-dynamic"

// Google redirects here after consent; we store the refresh token and send
// the owner back to /admin.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  if (!code) {
    return NextResponse.redirect(new URL("/admin?gcal=error", request.url))
  }
  try {
    await ensureChatSchema()
    const redirectUri = new URL("/api/gcal/callback", request.url).toString()
    await gcalExchangeCode(code, redirectUri)
    return NextResponse.redirect(new URL("/admin?gcal=connected", request.url))
  } catch (err) {
    console.error("[gcal] callback failed", err)
    return NextResponse.redirect(new URL("/admin?gcal=error", request.url))
  }
}

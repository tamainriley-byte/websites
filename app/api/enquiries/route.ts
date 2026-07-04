import { NextResponse } from "next/server"
import { createEnquiry } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Please include your mobile number and a message." },
        { status: 400 },
      )
    }

    const enquiry = await createEnquiry(phone, message)
    return NextResponse.json({ enquiry }, { status: 201 })
  } catch (error) {
    console.error("[v0] Failed to save enquiry:", error)
    return NextResponse.json(
      { error: "Something went wrong saving your enquiry." },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getVerificationStatus, markEmailAsVerified } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const record = await getVerificationStatus(token)

    if (!record) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Update user's isVerified flag
    await markEmailAsVerified(record.uEmail)

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (err) {
    console.error("Error verifying email:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserHelixCoins } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log(session)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = "test1"
    const helixCoins = await getUserHelixCoins(userId)

    return NextResponse.json({
      helixCoins,
    })
  } catch (error) {
    console.error("Error fetching coin balance:", error)
    return NextResponse.json({ error: "An error occurred while fetching coin balance" }, { status: 500 })
  }
}

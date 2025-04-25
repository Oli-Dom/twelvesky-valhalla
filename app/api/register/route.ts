import { NextResponse } from "next/server"
import { z } from "zod"
import { getUserByEmail, getUserByUsername, createUser } from "@/lib/db"

// Define validation schema with 32 character limits
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32, "Username cannot exceed 32 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const validation = userSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { username, email, password } = body

    // Check if user already exists by email
    const existingUserByEmail = await getUserByEmail(email)

    if (existingUserByEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Check if username is taken
    const existingUserByUsername = await getUserByUsername(username)

    if (existingUserByUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }

    // Create user with plain text password
    const user = await createUser(username, email, password)

    if (!user) {
      throw new Error("Failed to create user")
    }

    // Return user without password
    return NextResponse.json(
      {
        id: user.id,
        username: user.uID,
        email: user.uEmail,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

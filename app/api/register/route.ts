// import { NextResponse } from "next/server"
// import { z } from "zod"
// import { getUserByEmail, getUserByUsername, createUser } from "@/lib/db"

// // Define validation schema with 32 character limits
// const userSchema = z.object({
//   username: z.string().min(3, "Username must be at least 3 characters").max(32, "Username cannot exceed 32 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
// })

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     // Validate input
//     const validation = userSchema.safeParse(body)
//     if (!validation.success) {
//       return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
//     }

//     const { username, email, password } = body

//     // Check if user already exists by email
//     const existingUserByEmail = await getUserByEmail(email)

//     if (existingUserByEmail) {
//       return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
//     }

//     // Check if username is taken
//     const existingUserByUsername = await getUserByUsername(username)

//     if (existingUserByUsername) {
//       return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
//     }

//     // Create user with plain text password
//     const user = await createUser(username, email, password)

//     if (!user) {
//       throw new Error("Failed to create user")
//     }

//     // Return user without password
//     return NextResponse.json(
//       {
//         id: user.id,
//         username: user.uID,
//         email: user.uEmail,
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     console.error("Registration error:", error)
//     return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { z } from "zod"
import { getUserByEmail, getUserByUsername, createUser, storeVerificationToken } from "@/lib/db"
import { generateToken } from "@/lib/utils" // import the generateToken helper function
const nodemailer = require("nodemailer")

// Define validation schema with 32 character limits
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32, "Username cannot exceed 32 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password cannot exceed 32 characters"),
})

async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `https://valhallasky.org/verify-email?token=${token}`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'valhallaskydev@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: 'valhallaskydev@gmail.com',
    to: email,
    subject: ' TwelveSky Email Verification',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
  })
}

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
    const user = await createUser(username, email, password, 0)

    if (!user) {
      throw new Error("Failed to create user")
    }

    // Generate the verification token
    const token = generateToken()

    // Store the verification token in the database with expiration time
    await storeVerificationToken(email, token)

    // Send the email verification
    await sendVerificationEmail(email, token)

    // Return user without password and indicate the email is not verified yet
    return NextResponse.json(
      {
        id: user.id,
        username: user.uID,
        email: user.uEmail,
        emailVerified: user.isVerified, // Email is not verified yet
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

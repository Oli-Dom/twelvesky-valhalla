import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

// Helper function to get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Helper function to check if the user is authenticated on the server
export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  return session.user
}

// Helper function to require authentication on server components
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

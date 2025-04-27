import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const path = request.nextUrl.pathname

  // Protect the profile page
  if (path === "/profile" && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", "/login")
    return NextResponse.redirect(url)
  }

  // If user is already logged in and tries to access login/register pages
  if ((path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile", "/login", "/register","/store"],
}

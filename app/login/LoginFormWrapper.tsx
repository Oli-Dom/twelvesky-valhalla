// components/LoginFormWrapper.tsx
"use client"

import { useSearchParams } from "next/navigation"
import LoginPage from "./LoginPage"

export default function LoginFormWrapper() {
  const searchParams = useSearchParams()

  const registered = searchParams.get("registered")
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/login"

  return (
    <LoginPage
      registered={registered}
      error={error}
      callbackUrl={callbackUrl}
    />
  )
}

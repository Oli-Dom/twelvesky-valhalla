// app/login/page.tsx
import { Suspense } from "react"
import LoginFormWrapper from "./LoginFormWrapper"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading login...</div>}>
      <LoginFormWrapper />
    </Suspense>
  )
}

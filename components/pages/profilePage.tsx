"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ShoppingCart, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("User is not authenticated, redirecting to login page")
      redirect("/login?callbackUrl=/login")
    },
  })

  const [helixCoins, setHelixCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(() => {
    // console.log("Profile page loaded, session status:", status)
    // console.log("Session data:", session)
  
    if (status === "authenticated") {
      //console.log("User is authenticated, fetching coin balance")
      fetchCoinBalance()
    }
  }, [status, session])

  const fetchCoinBalance = async () => {
    try {
      setLoading(true)
      //console.log("Fetching coin balance...")
      const response = await fetch("/api/coins/balance")

      if (!response.ok) {
        throw new Error("Failed to fetch coin balance")
      }

      const data = await response.json()
      //console.log("Coin balance data:", data)
      setHelixCoins(data.helixCoins)
    } catch (err: any) {
      console.error("Error fetching coin balance:", err)
      setError(err.message || "Failed to load your coin balance")
    } finally {
      setLoading(false)
    }
  }



  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading your profile</h1>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Welcome, {session?.user?.name}!</h1>
            <p className="text-muted-foreground mt-2">Manage your account and purchase Helix Coins</p>
          </div>

          {error && (
            <Alert className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

    
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Your Helix Coins</CardTitle>
                <CardDescription>Current balance and purchase options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg mb-6">
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 mr-4">
                      <Image src="/images/helix_coin.png" alt="Helix Coin" fill className="object-contain" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-3xl font-bold text-primary">{helixCoins.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

           
                <h3 className="font-light"><em>Low on helix coins? Visit the store and stock up!</em></h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

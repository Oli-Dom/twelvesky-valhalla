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
  const [purchaseStatus, setPurchaseStatus] = useState({ success: false, message: "" })
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Coin packages
  const coinPackages = [
    { id: 1, dollars: 5, coins: 750, bonus: 0, popular: false },
    { id: 2, dollars: 10, coins: 1500, bonus: 0, popular: false },
    { id: 3, dollars: 20, coins: 3000, bonus: 0, popular: false },
    { id: 4, dollars: 50, coins: 7500, bonus: 375, popular: true }, // 5% Bonus
    { id: 5, dollars: 100, coins: 15000, bonus: 1500, popular: false }, // 10% Bonus
    { id: 6, dollars: 500, coins: 75000, bonus: 37500, popular: true }, // 50% Bonus
  ]

  // Calculate bonus percentage for display
  const getBonusPercentage = (coins: number, bonus: number) => {
    if (bonus === 0) return null
    return Math.round((bonus / coins) * 100)
  }

  useEffect(() => {
    console.log("Profile page loaded, session status:", status)
    console.log("Session data:", session)
  
    if (status === "authenticated") {
      console.log("User is authenticated, fetching coin balance")
      fetchCoinBalance()
    }
  }, [status, session])

  const fetchCoinBalance = async () => {
    try {
      setLoading(true)
      console.log("Fetching coin balance...")
      const response = await fetch("/api/coins/balance")

      if (!response.ok) {
        throw new Error("Failed to fetch coin balance")
      }

      const data = await response.json()
      console.log("Coin balance data:", data)
      setHelixCoins(data.helixCoins)
    } catch (err: any) {
      console.error("Error fetching coin balance:", err)
      setError(err.message || "Failed to load your coin balance")
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (packageId: number) => {
    try {
      setIsPurchasing(true)
      setPurchaseStatus({ success: false, message: "" })
      console.log("Purchasing coin package:", packageId)

      const response = await fetch("/api/coins/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()
      console.log("Purchase response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed")
      }

      // Update coin balance
      setHelixCoins(data.newBalance)
      setPurchaseStatus({
        success: true,
        message: data.message,
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setPurchaseStatus({ success: false, message: "" })
      }, 5000)
    } catch (err: any) {
      console.error("Purchase error:", err)
      setPurchaseStatus({
        success: false,
        message: err.message || "An error occurred during purchase",
      })
    } finally {
      setIsPurchasing(false)
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

          {purchaseStatus.message && (
            <Alert
              className={`mb-6 ${purchaseStatus.success ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}
            >
              {purchaseStatus.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{purchaseStatus.message}</AlertDescription>
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

                <h3 className="text-xl font-bold mb-4">Purchase Helix Coins</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coinPackages.map((pack) => (
                    <div
                      key={pack.id}
                      className={`bg-card rounded-lg overflow-hidden shadow-lg border coin-card ${
                        pack.popular ? "border-primary animate-pulse-gold" : "border-border"
                      }`}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex justify-center">
                          <div className="relative h-12 w-12">
                            <Image src="/images/helix_coin.png" alt="Helix Coin" fill className="object-contain" />
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-xl font-bold text-primary">{pack.coins.toLocaleString()}</span>
                            <span className="text-muted-foreground">Coins</span>
                          </div>

                          {pack.bonus > 0 && (
                            <div className="mt-1 flex items-center justify-center text-xs text-green-500 font-medium">
                              <span>
                                +{pack.bonus.toLocaleString()} Bonus ({getBonusPercentage(pack.coins, pack.bonus)}%)
                              </span>
                            </div>
                          )}

                          <div className="mt-2 text-center text-lg font-bold">${pack.dollars.toFixed(2)}</div>
                        </div>

                        {pack.popular && (
                          <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded text-center">
                            BEST VALUE
                          </div>
                        )}

                        <Button
                          className="w-full fire-button"
                          // onClick={() => handlePurchase(pack.id)}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                              Processing...
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Purchase
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

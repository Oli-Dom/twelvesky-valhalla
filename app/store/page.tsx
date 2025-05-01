"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalCheckout from "@/components/PaypalCheckout";
import { Package } from "@/types/package";

export default function StorePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/login");
    },
  });

  const coinPackages = [
    {
      id: 1,
      name: "Novice Pouch",
      dollars: 5,
      coins: 750,
      bonus: 0,
      popular: false,
    },
    {
      id: 2,
      name: "Adventurer's Satchel",
      dollars: 10,
      coins: 1500,
      bonus: 0,
      popular: false,
    },
    {
      id: 3,
      name: "Warrior's Stash",
      dollars: 15,
      coins: 2250,
      bonus: 0,
      popular: false,
    },
    {
      id: 4,
      name: "Elite Pack",
      dollars: 20,
      coins: 3000,
      bonus: 0,
      popular: false,
    },
    {
      id: 5,
      name: "Knight's Cache",
      dollars: 25,
      coins: 3750,
      bonus: 0,
      popular: false,
    },
    {
      id: 6,
      name: "Champion's Chest",
      dollars: 30,
      coins: 4500,
      bonus: 0,
      popular: false,
    },
    {
      id: 7,
      name: "Battle-Hardened Bundle",
      dollars: 50,
      coins: 7500,
      bonus: 375,
      popular: true,
    }, // 5% Bonus
    {
      id: 8,
      name: "Crusader's Hoard",
      dollars: 100,
      coins: 15000,
      bonus: 1500,
      popular: false,
    }, // 10% Bonus
    {
      id: 9,
      name: "Warlord's Cache",
      dollars: 150,
      coins: 22500,
      bonus: 3375,
      popular: false,
    }, // 15% Bonus
    {
      id: 10,
      name: "Commander's Vault",
      dollars: 200,
      coins: 30000,
      bonus: 6000,
      popular: false,
    }, // 20% Bonus
    {
      id: 11,
      name: "Guildmaster's Reserve",
      dollars: 250,
      coins: 37500,
      bonus: 9375,
      popular: false,
    }, // 25% Bonus
    {
      id: 12,
      name: "King's Treasury",
      dollars: 300,
      coins: 45000,
      bonus: 13500,
      popular: false,
    }, // 30% Bonus
    {
      id: 13,
      name: "Overlord's Offering",
      dollars: 350,
      coins: 52500,
      bonus: 18375,
      popular: false,
    }, // 35% Bonus
    {
      id: 14,
      name: "Dragon's Vault",
      dollars: 400,
      coins: 60000,
      bonus: 24000,
      popular: false,
    }, // 40% Bonus
    {
      id: 15,
      name: "Legend's Legacy",
      dollars: 450,
      coins: 67500,
      bonus: 30375,
      popular: false,
    }, // 45% Bonus
    {
      id: 16,
      name: "Mythic Chest",
      dollars: 500,
      coins: 75000,
      bonus: 37500,
      popular: true,
    }, // 50% Bonus
  ];

  // Calculate bonus percentage for display
  const getBonusPercentage = (coins: number, bonus: number) => {
    if (bonus === 0) return null;
    return Math.round((bonus / coins) * 100);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // PayPal initialization options
  const paypalInitOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  useEffect(() => {
    // Trigger loading every time component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once on every mount

  const handlePurchaseClick = (packageData: any) => {
    setSelectedPackage(packageData);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = async (details: any) => {

    try {
      const response = await fetch("/api/credit-coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.email,
          coins: details.coins,
        }),
      });

      if (!response.ok) {
        alert("Failed to credit coins to account");
        throw new Error("Failed to credit coins to account");
     
      }

      // Show success toast
      alert("Coins credited successfully!");
    } catch (error) {
    }
  };

  if (isLoading) return <Loading />;

  return (
    <PayPalScriptProvider options={paypalInitOptions}>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <section className="py-12 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary gold-glow">
                  Helix Coin Store
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Purchase Helix Coins to unlock premium items, boost your
                  character, and enhance your gaming experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coinPackages.map((pack) => (
                  <div
                    key={pack.id}
                    className={`bg-card rounded-lg overflow-hidden shadow-lg border coin-card ${
                      pack.popular
                        ? "border-primary animate-pulse-gold"
                        : "border-border"
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex justify-center">
                        <div className="relative h-24 w-24">
                          <Image
                            src="/images/helix_coin.png"
                            alt="Helix Coin"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-2xl font-bold text-primary">
                            {pack.coins.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">Coins</span>
                        </div>

                        {pack.bonus > 0 && (
                          <div className="mt-1 flex items-center justify-center text-sm text-green-500 font-medium">
                            <span>
                              +{pack.bonus.toLocaleString()} Bonus (
                              {getBonusPercentage(pack.coins, pack.bonus)}%)
                            </span>
                          </div>
                        )}

                        <div className="mt-3 text-center text-2xl font-bold">
                          ${pack.dollars.toFixed(2)}
                        </div>
                      </div>

                      {pack.popular && (
                        <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded text-center">
                          BEST VALUE
                        </div>
                      )}

                      <Button
                        className="w-full fire-button"
                        onClick={() => handlePurchaseClick(pack)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />

        {/* PayPal Checkout Modal */}
        <PayPalCheckout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          packageDetails={{
            id: selectedPackage?.id,
            name: selectedPackage?.name,
            coins: selectedPackage?.coins + selectedPackage?.bonus || 0,
            price: selectedPackage?.dollars,
            bonus: selectedPackage?.bonus,
            popular: selectedPackage?.popular,
          }}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </PayPalScriptProvider>
  );
}

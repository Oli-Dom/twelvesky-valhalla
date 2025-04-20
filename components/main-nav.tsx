"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Newspaper, FileText, ShoppingCart, LogIn, Menu, X } from "lucide-react"
import { useState } from "react"

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xs">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image src="/images/game-logo.png" alt="Twelsky Valhalla" fill className="object-contain" />
          </div>
          <span className="font-bold text-lg md:text-xl hidden sm:inline-block text-primary">Twelsky Valhalla</span>
        </Link>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link href="/news" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
            <Newspaper className="mr-2 h-4 w-4" />
            News
          </Link>
          <Link
            href="/patch-notes"
            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <FileText className="mr-2 h-4 w-4" />
            Patch Notes
          </Link>
          <Link href="/store" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Store
          </Link>
          <Link href="/login">
            <Button variant="outline" className="fire-button">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-4">
              <Link
                href="/"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                href="/news"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Newspaper className="mr-2 h-4 w-4" />
                News
              </Link>
              <Link
                href="/patch-notes"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Patch Notes
              </Link>
              <Link
                href="/store"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Store
              </Link>
              <Link
                href="/login"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

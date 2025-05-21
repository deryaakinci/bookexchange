"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Book X Change</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              <Link href="/browse" className="text-sm font-medium transition-colors hover:text-emerald-600">
                Browse
              </Link>
              <Link href="/upload" className="text-sm font-medium transition-colors hover:text-emerald-600">
                Sell
              </Link>
              <Link href="/exchange" className="text-sm font-medium transition-colors hover:text-emerald-600">
                Exchange
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-emerald-600">
                How It Works
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                />
              </div>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-books">My Books</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container py-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/browse"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/upload"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell
            </Link>
            <Link
              href="/exchange"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Exchange
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Register</Button>
              </Link>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Cart</span>
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
              </div>
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

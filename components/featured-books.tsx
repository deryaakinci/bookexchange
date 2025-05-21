"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for featured books
const featuredBooks = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    author: "John Smith",
    price: 25.99,
    condition: "Good",
    location: "Campus Library",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 35.5,
    condition: "Like New",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=150",
    exchange: false,
    sale: true,
  },
  {
    id: 3,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 29.99,
    condition: "Acceptable",
    location: "Economics Building",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
  },
  {
    id: 4,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    price: 40.0,
    condition: "Good",
    location: "Science Hall",
    image: "/placeholder.svg?height=200&width=150",
    exchange: false,
    sale: true,
  },
]

export default function FeaturedBooks() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((bookId) => bookId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Books</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Check out these popular books available for exchange or purchase.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative">
                  <Link href={`/books/${book.id}`}>
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      width={150}
                      height={200}
                      className="h-[200px] w-full object-cover"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 bg-white/80 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90 rounded-full"
                    onClick={() => toggleWishlist(book.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishlist.includes(book.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                      }`}
                    />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Link href={`/books/${book.id}`} className="hover:underline">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">${book.price.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {book.condition}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="mr-1 h-3 w-3" />
                    {book.location}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/books/${book.id}`} className="w-full">
                  <Button variant="outline" className="w-full text-xs">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/browse">
            <Button variant="outline" size="lg">
              View All Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

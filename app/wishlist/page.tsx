"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for wishlist
const initialWishlistItems = [
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
    id: 7,
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    price: 45.0,
    condition: "Like New",
    location: "Physics Lab",
    image: "/placeholder.svg?height=200&width=150",
    exchange: false,
    sale: true,
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)
  const { toast } = useToast()

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
    toast({
      title: "Removed from wishlist",
      description: "The book has been removed from your wishlist.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Books you've saved to revisit later. You can remove items or move them to your cart.
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.map((book) => (
              <Card key={book.id} className="overflow-hidden">
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
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 bg-white/80 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90 rounded-full"
                    onClick={() => removeFromWishlist(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                </div>
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
                    <div className="flex flex-wrap gap-1 pt-1">
                      {book.sale && (
                        <Badge variant="secondary" className="text-xs">
                          For Sale
                        </Badge>
                      )}
                      {book.exchange && (
                        <Badge variant="secondary" className="text-xs">
                          For Exchange
                        </Badge>
                      )}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Browse books and add them to your wishlist to save them for later.
            </p>
            <Link href="/browse">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Browse Books</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MapPin, Search, SlidersHorizontal, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for books
const books = [
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
    category: "Computer Science",
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
    category: "Mathematics",
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
    category: "Economics",
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
    category: "Chemistry",
  },
  {
    id: 5,
    title: "Introduction to Psychology",
    author: "David G. Myers",
    price: 22.5,
    condition: "Good",
    location: "Psychology Department",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
    category: "Psychology",
  },
  {
    id: 6,
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    price: 18.75,
    condition: "Fair",
    location: "History Building",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: false,
    category: "History",
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
    category: "Physics",
  },
  {
    id: 8,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 50.0,
    condition: "Good",
    location: "Computer Science Building",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
    category: "Computer Science",
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    categories: [] as string[],
    conditions: [] as string[],
    forSale: true,
    forExchange: true,
  })

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((bookId) => bookId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  const toggleCategory = (category: string) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== category),
      })
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category],
      })
    }
  }

  const toggleCondition = (condition: string) => {
    if (filters.conditions.includes(condition)) {
      setFilters({
        ...filters,
        conditions: filters.conditions.filter((c) => c !== condition),
      })
    } else {
      setFilters({
        ...filters,
        conditions: [...filters.conditions, condition],
      })
    }
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      categories: [],
      conditions: [],
      forSale: true,
      forExchange: true,
    })
    setSearchTerm("")
  }

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(book.category)

    // Condition filter
    const matchesCondition = filters.conditions.length === 0 || filters.conditions.includes(book.condition)

    // Price range filter
    const matchesPrice = book.price >= filters.priceRange[0] && book.price <= filters.priceRange[1]

    // Listing type filter
    const matchesListingType = (filters.forSale && book.sale) || (filters.forExchange && book.exchange)

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesListingType
  })

  // Get unique categories from books
  const categories = Array.from(new Set(books.map((book) => book.category)))

  // Get unique conditions from books
  const conditions = Array.from(new Set(books.map((book) => book.condition)))

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Browse Books</h1>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search by title, author, or category..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                className={showFilters ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <Card className="p-4">
              <CardContent className="p-0 pt-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Price Range</h3>
                      <span className="text-sm text-gray-500">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={1}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={filters.categories.includes(category) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            filters.categories.includes(category)
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "hover:bg-emerald-100 dark:hover:bg-emerald-900"
                          }`}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Condition</h3>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((condition) => (
                        <Badge
                          key={condition}
                          variant={filters.conditions.includes(condition) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            filters.conditions.includes(condition)
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "hover:bg-emerald-100 dark:hover:bg-emerald-900"
                          }`}
                          onClick={() => toggleCondition(condition)}
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Listing Type</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="for-sale"
                          checked={filters.forSale}
                          onCheckedChange={(checked) => setFilters({ ...filters, forSale: checked as boolean })}
                        />
                        <Label htmlFor="for-sale">For Sale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="for-exchange"
                          checked={filters.forExchange}
                          onCheckedChange={(checked) => setFilters({ ...filters, forExchange: checked as boolean })}
                        />
                        <Label htmlFor="for-exchange">For Exchange</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t mt-4 pt-4 px-0">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
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
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">No books found</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

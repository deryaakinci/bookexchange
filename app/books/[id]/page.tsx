"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MapPin, Share2, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ExchangeModal from "@/components/exchange-modal"
import ReportButton from "@/components/report-button"
import { useSocket } from "@/hooks/use-socket"
import { useToast } from "@/hooks/use-toast"

// Mock book data
const book = {
  id: 1,
  title: "Introduction to Computer Science",
  author: "John Smith",
  price: 25.99,
  condition: "Good",
  location: "Campus Library",
  description:
    "This comprehensive introduction to computer science is perfect for beginners. The book covers fundamental concepts including algorithms, data structures, and programming paradigms. This is the third edition, published in 2021, and includes updated content on modern programming practices. There are some highlights and notes in chapters 3-5, but otherwise the book is in good condition with minimal wear.",
  category: "Computer Science",
  isbn: "978-1234567890",
  publisher: "Academic Press",
  publishedYear: 2021,
  pages: 450,
  exchange: true,
  sale: true,
  images: [
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
  ],
  seller: {
    id: 101,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    joinedDate: "January 2022",
    responseRate: "98%",
    isOnline: true,
  },
  reviews: [
    {
      id: 201,
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "March 15, 2023",
      comment: "The book was in excellent condition, just as described. Fast and easy transaction!",
    },
    {
      id: 202,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "February 2, 2023",
      comment: "Good book, seller was responsive and helpful. Would buy from again.",
    },
  ],
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const { isConnected, send } = useSocket()
  const { toast } = useToast()

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Send typing indicator
    if (value.trim()) {
      if (!isTyping) {
        setIsTyping(true)
        send("typing", {
          conversationId: 1, // Assuming this is conversation ID 1 with Alex Johnson
          isTyping: true,
        })
      }

      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Set timeout to clear typing indicator after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        setIsTyping(false)
        send("typing", {
          conversationId: 1,
          isTyping: false,
        })
      }, 2000)

      setTypingTimeout(timeout)
    } else {
      // If input is empty, clear typing indicator
      if (isTyping) {
        setIsTyping(false)
        send("typing", {
          conversationId: 1,
          isTyping: false,
        })
      }
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setIsSending(true)

      // Clear typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        setTypingTimeout(null)
      }
      setIsTyping(false)
      send("typing", {
        conversationId: 1,
        isTyping: false,
      })

      // Simulate sending message
      setTimeout(() => {
        // Here you would typically send the message to the server
        send("message", {
          conversationId: 1,
          content: message,
        })

        toast({
          title: "Message sent",
          description: "Your message has been sent to the seller.",
        })

        setMessage("")
        setIsSending(false)
      }, 1000)
    }
  }

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  return (
    <div className="container py-8">
      <Link
        href="/browse"
        className="inline-flex items-center mb-6 text-sm font-medium text-emerald-600 hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Browse
      </Link>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Book Images */}
        <div className="space-y-4 md:col-span-1">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={book.images[selectedImage] || "/placeholder.svg"}
              alt={book.title}
              width={300}
              height={400}
              className="h-[400px] w-full object-contain"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {book.images.map((image, index) => (
              <button
                key={index}
                className={`relative min-w-[80px] overflow-hidden rounded-md border ${
                  selectedImage === index ? "ring-2 ring-emerald-600" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${book.title} - Image ${index + 1}`}
                  width={80}
                  height={100}
                  className="h-[100px] w-[80px] object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-6 md:col-span-1">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">by {book.author}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${book.price.toFixed(2)}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{book.condition}</Badge>
                {book.exchange && <Badge variant="secondary">Available for Exchange</Badge>}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${inWishlist ? "text-red-500 border-red-500" : ""}`}
              onClick={toggleWishlist}
            >
              <Heart className={inWishlist ? "fill-red-500" : ""} />
              <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
            </Button>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="mr-1 h-4 w-4" />
            {book.location}
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <ExchangeModal
                bookId={book.id}
                bookTitle={book.title}
                bookImage={book.images[0]}
                bookCondition={book.condition}
              />
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={book.seller.avatar || "/placeholder.svg"} alt={book.seller.name} />
                    <AvatarFallback>{book.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {book.seller.isOnline && (
                    <Badge className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full p-0 bg-emerald-500 border-2 border-white dark:border-gray-950" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{book.seller.name}</p>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{book.seller.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">Joined {book.seller.joinedDate}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Textarea
                  placeholder="Send a message to the seller..."
                  value={message}
                  onChange={handleMessageChange}
                  className="min-h-[100px]"
                  disabled={isSending}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    {!isConnected && (
                      <p className="text-xs text-red-500">
                        You are currently offline. Messages will be sent when you reconnect.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={!message.trim() || isSending}
                  >
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <ReportButton bookId={book.id} />
            </div>
          </div>
        </div>

        {/* Book Information Tabs */}
        <div className="md:col-span-2 lg:col-span-3">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Book Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="whitespace-pre-line">{book.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
                      <p>{book.title}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</p>
                      <p>{book.author}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</p>
                      <p>{book.isbn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</p>
                      <p>{book.publisher}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published Year</p>
                      <p>{book.publishedYear}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pages</p>
                      <p>{book.pages}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                      <p>{book.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition</p>
                      <p>{book.condition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {book.reviews.length > 0 ? (
                      book.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.user.name}</p>
                              <div className="flex items-center">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-4">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No reviews yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

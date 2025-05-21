"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BookOpen, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Mock data for user's books
const userBooks = [
  {
    id: 101,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    condition: "Like New",
    image: "/placeholder.svg?height=60&width=40",
  },
  {
    id: 102,
    title: "Introduction to Psychology",
    author: "David G. Myers",
    condition: "Good",
    image: "/placeholder.svg?height=60&width=40",
  },
  {
    id: 103,
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    condition: "Fair",
    image: "/placeholder.svg?height=60&width=40",
  },
]

interface ExchangeModalProps {
  bookId: number
  bookTitle: string
  bookImage: string
  bookCondition: string
}

export default function ExchangeModal({ bookId, bookTitle, bookImage, bookCondition }: ExchangeModalProps) {
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!selectedBook) {
      toast({
        title: "No book selected",
        description: "Please select a book to exchange",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to your API
    console.log("Exchange request:", {
      requestedBookId: bookId,
      offeredBookId: selectedBook,
      message,
    })

    toast({
      title: "Exchange request sent",
      description: "Your exchange request has been sent to the book owner.",
    })

    // Close the modal and reset form
    setOpen(false)
    setSelectedBook(null)
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <RefreshCw className="mr-2 h-4 w-4" />
          Request Exchange
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Book Exchange</DialogTitle>
          <DialogDescription>Select one of your books to offer in exchange for this book.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 flex items-center space-x-4">
            <div className="text-center">
              <div className="relative h-20 w-16 mx-auto">
                <Image src={bookImage || "/placeholder.svg"} alt={bookTitle} fill className="object-cover rounded-sm" />
              </div>
              <p className="mt-1 text-xs font-medium line-clamp-1">{bookTitle}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {bookCondition}
              </Badge>
            </div>
            <RefreshCw className="h-6 w-6 text-gray-400" />
            <div className="text-center">
              {selectedBook ? (
                userBooks
                  .filter((book) => book.id === selectedBook)
                  .map((book) => (
                    <div key={book.id}>
                      <div className="relative h-20 w-16 mx-auto">
                        <Image
                          src={book.image || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover rounded-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium line-clamp-1">{book.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {book.condition}
                      </Badge>
                    </div>
                  ))
              ) : (
                <div className="flex h-20 w-16 items-center justify-center rounded-sm border border-dashed">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Select a book to exchange:</h3>
              <RadioGroup value={selectedBook?.toString()} onValueChange={(value) => setSelectedBook(Number(value))}>
                <div className="space-y-2">
                  {userBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-2 rounded-md border p-2">
                      <RadioGroupItem value={book.id.toString()} id={`book-${book.id}`} />
                      <Label htmlFor={`book-${book.id}`} className="flex flex-1 items-center space-x-2">
                        <div className="relative h-10 w-8">
                          <Image
                            src={book.image || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {book.condition}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional):</Label>
              <Textarea
                id="message"
                placeholder="Add a message to the book owner..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            Send Exchange Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

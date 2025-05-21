import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, RefreshCw, Upload, Search, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorksPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">How Book X Change Works</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-500 dark:text-gray-400">
            Our platform makes it easy to buy, sell, and exchange textbooks with other students on campus. Follow these
            simple steps to get started.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
                <Upload className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="mt-4">1. List Your Books</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Take photos and add details about the books you want to sell or exchange. Include information about the
                condition, price, and your preferred meeting location.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
                <Search className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="mt-4">2. Browse Books</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Search for books by title, author, course, or location. Filter by price, condition, and whether books
                are available for sale or exchange.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
                <MessageCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="mt-4">3. Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Message the seller to arrange a meeting or discuss details. Our real-time messaging system makes
                communication easy and secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
                <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="mt-4">4. Exchange or Buy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Meet up to exchange books or complete the purchase securely through our platform. Rate your experience
                to help build a trusted community.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Listing Your Books</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Take clear photos of your book from multiple angles</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Provide accurate details about the condition, edition, and any notes/highlights</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Set a fair price based on the book's condition and market value</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Indicate if you're open to exchanges and what books you're looking for</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/upload">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="mr-2 h-4 w-4" />
                    List Your Books
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=300&width=500" alt="Listing books" fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="relative h-[300px] rounded-lg overflow-hidden order-last md:order-first">
              <Image src="/placeholder.svg?height=300&width=500" alt="Browsing books" fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Finding the Right Books</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Use our search and filter tools to find exactly what you need</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Find books near your location for convenient pickup</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Add books to your wishlist to save them for later</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Compare prices and conditions to get the best value</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/browse">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Communicating Safely</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Use our built-in messaging system to keep your personal contact info private</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Discuss details, negotiate prices, or propose exchanges</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Arrange meeting times and locations on campus</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Report any suspicious activity to our moderation team</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/messages">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    View Messages
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=300&width=500" alt="Messaging" fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="relative h-[300px] rounded-lg overflow-hidden order-last md:order-first">
              <Image src="/placeholder.svg?height=300&width=500" alt="Exchanging books" fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Completing Transactions</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Meet in a safe, public location on campus to exchange books</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Use our secure payment system for online transactions</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Confirm receipt of books through the app</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 mt-0.5" />
                  <p>Leave reviews to help build a trusted community</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Star className="mr-2 h-4 w-4" />
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Have more questions? Here are some common inquiries about using BookBuddy.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I know if a book is still available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All listings on our platform are updated in real-time. If you can see a listing, it means the book is
                  still available. Once you start a conversation with the seller, they can confirm availability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a fee to use BookBuddy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  BookBuddy is completely free for students to list and browse books. We only charge a small service fee
                  (5%) on completed sales transactions to maintain the platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do exchanges work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  When viewing a book, click "Request Exchange" and select one of your listed books to offer in
                  exchange. The other user will receive your request and can accept or decline. If accepted, you can
                  arrange a meeting to exchange books.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I have an issue with a transaction?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you encounter any problems with a transaction, please use the "Report" button on the book listing
                  or in your messages. Our support team will review the issue and help resolve it promptly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-lg bg-emerald-600 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mt-2 max-w-2xl">
            Join thousands of students saving money on textbooks every semester. Create an account to start buying,
            selling, and exchanging books today.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-emerald-700">
                Browse Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { MapPin, MessageCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import FeaturedBooks from "@/components/featured-books"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Exchange & Buy Books from Fellow Students
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Save money and reduce waste by trading your used textbooks with other students on campus.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/browse">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Browse Books
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button size="lg" variant="outline">
                    List Your Books
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=500"
                width={500}
                height={400}
                alt="Students exchanging books"
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Book X Change?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform makes exchanging and buying books simple, secure, and sustainable.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <MapPin className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Find Nearby Books</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Discover books available near your location for easy pickup.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <MessageCircle className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Direct Messaging</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Chat with sellers and arrange exchanges securely on the platform.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Star className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Reviews & Ratings</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Build trust with verified reviews from other students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <FeaturedBooks />

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="bg-emerald-600 py-12 md:py-16">
        <div className="container px-4 md:px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Ready to Start Exchanging?
              </h2>
              <p className="max-w-[600px] mx-auto text-emerald-100 md:text-xl/relaxed">
                Join thousands of students saving money on textbooks every semester.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-emerald-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

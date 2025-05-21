import { BookOpen, MessageCircle, RefreshCw, Upload } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Follow these simple steps to start exchanging and buying books.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Upload className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">List Your Books</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload photos and details of the books you want to sell or exchange.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Browse Books</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Search for books by title, author, course, or location on campus.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <MessageCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Connect</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Message the seller to arrange a meeting or discuss details.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Exchange or Buy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Meet up to exchange books or complete the purchase securely through our platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

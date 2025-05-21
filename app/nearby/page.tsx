"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for books with location
const booksWithLocation = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    author: "John Smith",
    price: 25.99,
    condition: "Good",
    location: "Campus Library",
    distance: 0.3, // miles
    coordinates: { lat: 40.7128, lng: -74.006 },
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 35.5,
    condition: "Like New",
    location: "Student Center",
    distance: 0.5,
    coordinates: { lat: 40.7138, lng: -74.008 },
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 29.99,
    condition: "Acceptable",
    location: "Economics Building",
    distance: 0.8,
    coordinates: { lat: 40.7148, lng: -74.003 },
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 4,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    price: 40.0,
    condition: "Good",
    location: "Science Hall",
    distance: 1.2,
    coordinates: { lat: 40.7118, lng: -74.009 },
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 5,
    title: "Introduction to Psychology",
    author: "David G. Myers",
    price: 22.5,
    condition: "Good",
    location: "Psychology Department",
    distance: 1.5,
    coordinates: { lat: 40.7158, lng: -74.002 },
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 6,
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    price: 18.75,
    condition: "Fair",
    location: "History Building",
    distance: 1.7,
    coordinates: { lat: 40.7108, lng: -74.001 },
    image: "/placeholder.svg?height=200&width=150",
  },
]

export default function NearbyBooksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState(5) // miles
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error" | "idle">("idle")
  const { toast } = useToast()

  useEffect(() => {
    // Get user's location when component mounts
    const getUserLocation = () => {
      setLocationStatus("loading")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setLocationStatus("success")
            toast({
              title: "Location found",
              description: "We've found your location and are showing books nearby.",
            })
          },
          (error) => {
            console.error("Error getting location:", error)
            setLocationStatus("error")
            toast({
              title: "Location error",
              description: "We couldn't access your location. Please enable location services.",
              variant: "destructive",
            })
          },
        )
      } else {
        setLocationStatus("error")
        toast({
          title: "Location not supported",
          description: "Your browser doesn't support geolocation.",
          variant: "destructive",
        })
      }
    }

    getUserLocation()
  }, [toast])

  // Filter books based on search term and max distance
  const filteredBooks = booksWithLocation
    .filter(
      (book) =>
        book.distance <= maxDistance &&
        (searchTerm === "" ||
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.location.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => a.distance - b.distance)

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Find Books Nearby</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover books available near your location for easy pickup.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Search by title, author, or location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="distance" className="text-sm font-medium">
                      Maximum Distance
                    </label>
                    <span className="text-sm text-gray-500">{maxDistance} miles</span>
                  </div>
                  <Slider
                    id="distance"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={[maxDistance]}
                    onValueChange={(value) => setMaxDistance(value[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => {
                      if (locationStatus !== "loading") {
                        setLocationStatus("loading")
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setUserLocation({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                              })
                              setLocationStatus("success")
                              toast({
                                title: "Location updated",
                                description: "We've updated your location and refreshed nearby books.",
                              })
                            },
                            (error) => {
                              console.error("Error getting location:", error)
                              setLocationStatus("error")
                              toast({
                                title: "Location error",
                                description: "We couldn't access your location. Please enable location services.",
                                variant: "destructive",
                              })
                            },
                          )
                        }
                      }
                    }}
                    disabled={locationStatus === "loading"}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {locationStatus === "loading" ? "Updating..." : "Update My Location"}
                  </Button>
                  <Badge variant={locationStatus === "success" ? "default" : "outline"} className="h-fit">
                    {locationStatus === "success"
                      ? "Location Found"
                      : locationStatus === "error"
                        ? "Location Error"
                        : locationStatus === "loading"
                          ? "Finding Location..."
                          : "Location Not Set"}
                  </Badge>
                </div>
              </div>

              <div className="relative h-[200px] rounded-lg overflow-hidden border">
                {/* This would be a real map in a production app */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {locationStatus === "success"
                        ? "Map showing books near your location"
                        : locationStatus === "loading"
                          ? "Finding your location..."
                          : "Enable location to see books on a map"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Books Near You</h2>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-[150px] w-full sm:h-auto sm:w-[100px]">
                        <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/books/${book.id}`} className="hover:underline">
                                <h3 className="font-semibold">{book.title}</h3>
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                            </div>
                            <div className="flex items-center">
                              <Badge className="bg-emerald-600">{book.distance.toFixed(1)} mi</Badge>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <Badge variant="outline">{book.condition}</Badge>
                            <span className="text-lg font-medium">${book.price.toFixed(2)}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="mr-1 h-4 w-4" />
                            {book.location}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link href={`/books/${book.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">No books found nearby</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try increasing the distance range or changing your search criteria.
              </p>
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setSearchTerm("")
                  setMaxDistance(5)
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

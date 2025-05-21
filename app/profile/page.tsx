"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Edit, Eye, MapPin, Pencil, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const user = {
  id: 999,
  name: "John Doe",
  email: "john.doe@university.edu",
  avatar: "/placeholder.svg?height=200&width=200",
  bio: "Computer Science student at University. I'm interested in programming, algorithms, and data structures. Looking to exchange textbooks with other students.",
  location: "University Campus, Building A",
  joinedDate: "January 2023",
  rating: 4.7,
  reviewCount: 12,
  phone: "555-123-4567",
  university: "State University",
  major: "Computer Science",
  year: "Junior",
}

// Mock user's listed books
const listedBooks = [
  {
    id: 101,
    title: "Data Structures and Algorithms",
    author: "Robert Sedgewick",
    price: 30.0,
    condition: "Good",
    location: "Campus Library",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
    status: "active",
    views: 24,
    interested: 3,
    listedDate: "2023-04-15",
  },
  {
    id: 102,
    title: "Introduction to Machine Learning",
    author: "Ethem Alpaydin",
    price: 45.0,
    condition: "Like New",
    location: "Computer Science Building",
    image: "/placeholder.svg?height=200&width=150",
    exchange: false,
    sale: true,
    status: "active",
    views: 18,
    interested: 2,
    listedDate: "2023-05-02",
  },
  {
    id: 103,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 25.0,
    condition: "Acceptable",
    location: "Math Department",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: false,
    status: "pending",
    views: 10,
    interested: 1,
    listedDate: "2023-05-10",
  },
  {
    id: 104,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    price: 50.0,
    condition: "Good",
    location: "Campus Library",
    image: "/placeholder.svg?height=200&width=150",
    exchange: true,
    sale: true,
    status: "sold",
    views: 32,
    interested: 5,
    listedDate: "2023-03-20",
    soldDate: "2023-04-05",
  },
]

// Mock notification settings
const initialNotificationSettings = {
  emailMessages: true,
  emailExchangeRequests: true,
  emailBookSold: true,
  emailNewFeatures: false,
  browserMessages: true,
  browserExchangeRequests: true,
  browserBookSold: true,
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({ ...user })
  const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const handleNotificationChange = (setting: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: checked,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const saveProfile = () => {
    // In a real app, you would send this data to your API
    console.log("Saving profile:", profileData)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
    setEditMode(false)
  }

  const saveNotificationSettings = () => {
    // In a real app, you would send this data to your API
    console.log("Saving notification settings:", notificationSettings)
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const changePassword = () => {
    const errors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setPasswordErrors(errors)

    if (Object.keys(errors).length === 0) {
      // In a real app, you would send this data to your API
      console.log("Changing password:", passwordData)
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }

  const deleteBook = (bookId: number) => {
    // In a real app, you would send this request to your API
    console.log("Deleting book:", bookId)
    toast({
      title: "Book deleted",
      description: "The book has been removed from your listings.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your account settings, view your listed books, and update your profile.
          </p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="books">My Books</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-6 top-6"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? <Eye className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                  <span className="sr-only">{editMode ? "View Profile" : "Edit Profile"}</span>
                </Button>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {editMode ? "Edit your profile information below" : "View your profile information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                      <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-bold">{profileData.name}</h3>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{profileData.rating}</span>
                        <span className="text-sm text-gray-500">({profileData.reviewCount} reviews)</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">Member since {profileData.joinedDate}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{profileData.location}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="Your email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          placeholder="Your location on campus"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          name="university"
                          value={profileData.university}
                          onChange={handleProfileChange}
                          placeholder="Your university"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          name="major"
                          value={profileData.major}
                          onChange={handleProfileChange}
                          placeholder="Your major"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          placeholder="Tell others about yourself"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                        <p>{profileData.name}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p>{profileData.email}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                        <p>{profileData.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p>{profileData.location}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">University</h4>
                        <p>{profileData.university}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Major</h4>
                        <p>{profileData.major}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                        <p className="whitespace-pre-line">{profileData.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">My Listed Books</h2>
                <p className="text-sm text-gray-500">Manage your book listings</p>
              </div>
              <Link href="/upload">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  List New Book
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="active" className="space-y-4">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="sold">Sold/Exchanged</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {listedBooks.filter((book) => book.status === "active").length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listedBooks
                      .filter((book) => book.status === "active")
                      .map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                          <div className="flex h-full flex-col">
                            <div className="relative">
                              <Image
                                src={book.image || "/placeholder.svg"}
                                alt={book.title}
                                width={150}
                                height={200}
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                <Badge className="bg-emerald-600">${book.price.toFixed(2)}</Badge>
                                <div className="flex space-x-1">
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
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="space-y-2">
                                <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {book.condition}
                                  </Badge>
                                  <p className="text-xs text-gray-500">Listed on {book.listedDate}</p>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Eye className="mr-1 h-3 w-3" />
                                    {book.views} views
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="mr-1 h-3 w-3" />
                                    {book.interested} interested
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <div className="border-t p-4">
                              <div className="flex space-x-2">
                                <Link href={`/books/${book.id}/edit`} className="flex-1">
                                  <Button variant="outline" className="w-full text-xs">
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  className="text-xs text-red-500 hover:text-red-600"
                                  onClick={() => deleteBook(book.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No active listings</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You don't have any active book listings. List a book to start selling or exchanging.
                    </p>
                    <Link href="/upload" className="mt-4">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">List a Book</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {listedBooks.filter((book) => book.status === "pending").length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listedBooks
                      .filter((book) => book.status === "pending")
                      .map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                          <div className="flex h-full flex-col">
                            <div className="relative">
                              <Image
                                src={book.image || "/placeholder.svg"}
                                alt={book.title}
                                width={150}
                                height={200}
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                <Badge className="bg-yellow-600">${book.price.toFixed(2)}</Badge>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                  Pending
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="space-y-2">
                                <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {book.condition}
                                  </Badge>
                                  <p className="text-xs text-gray-500">Listed on {book.listedDate}</p>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Eye className="mr-1 h-3 w-3" />
                                    {book.views} views
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="mr-1 h-3 w-3" />
                                    {book.interested} interested
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <div className="border-t p-4">
                              <div className="flex space-x-2">
                                <Link href={`/books/${book.id}/edit`} className="flex-1">
                                  <Button variant="outline" className="w-full text-xs">
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  className="text-xs text-red-500 hover:text-red-600"
                                  onClick={() => deleteBook(book.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No pending listings</h3>
                    <p className="mt-2 text-sm text-gray-500">You don't have any books pending approval or exchange.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sold" className="space-y-4">
                {listedBooks.filter((book) => book.status === "sold").length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listedBooks
                      .filter((book) => book.status === "sold")
                      .map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                          <div className="flex h-full flex-col">
                            <div className="relative">
                              <div className="absolute inset-0 z-10 bg-black/40" />
                              <Image
                                src={book.image || "/placeholder.svg"}
                                alt={book.title}
                                width={150}
                                height={200}
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Badge className="bg-gray-800 px-3 py-1 text-base">SOLD</Badge>
                              </div>
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="space-y-2">
                                <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {book.condition}
                                  </Badge>
                                  <p className="text-xs text-gray-500">Sold on {book.soldDate}</p>
                                </div>
                                <p className="text-sm font-medium">${book.price.toFixed(2)}</p>
                              </div>
                            </CardContent>
                            <div className="border-t p-4">
                              <Link href={`/books/${book.id}`}>
                                <Button variant="outline" className="w-full text-xs">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No sold or exchanged books</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You haven't sold or exchanged any books yet. Your completed transactions will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-medium">Email Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailMessages" className="flex-1 cursor-pointer">
                            New messages
                          </Label>
                          <Switch
                            id="emailMessages"
                            checked={notificationSettings.emailMessages}
                            onCheckedChange={(checked) => handleNotificationChange("emailMessages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailExchangeRequests" className="flex-1 cursor-pointer">
                            Exchange requests
                          </Label>
                          <Switch
                            id="emailExchangeRequests"
                            checked={notificationSettings.emailExchangeRequests}
                            onCheckedChange={(checked) => handleNotificationChange("emailExchangeRequests", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailBookSold" className="flex-1 cursor-pointer">
                            Book sold or purchased
                          </Label>
                          <Switch
                            id="emailBookSold"
                            checked={notificationSettings.emailBookSold}
                            onCheckedChange={(checked) => handleNotificationChange("emailBookSold", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailNewFeatures" className="flex-1 cursor-pointer">
                            New features and updates
                          </Label>
                          <Switch
                            id="emailNewFeatures"
                            checked={notificationSettings.emailNewFeatures}
                            onCheckedChange={(checked) => handleNotificationChange("emailNewFeatures", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Browser Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="browserMessages" className="flex-1 cursor-pointer">
                            New messages
                          </Label>
                          <Switch
                            id="browserMessages"
                            checked={notificationSettings.browserMessages}
                            onCheckedChange={(checked) => handleNotificationChange("browserMessages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="browserExchangeRequests" className="flex-1 cursor-pointer">
                            Exchange requests
                          </Label>
                          <Switch
                            id="browserExchangeRequests"
                            checked={notificationSettings.browserExchangeRequests}
                            onCheckedChange={(checked) => handleNotificationChange("browserExchangeRequests", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="browserBookSold" className="flex-1 cursor-pointer">
                            Book sold or purchased
                          </Label>
                          <Switch
                            id="browserBookSold"
                            checked={notificationSettings.browserBookSold}
                            onCheckedChange={(checked) => handleNotificationChange("browserBookSold", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveNotificationSettings}>
                      Save Notification Settings
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={changePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showEmail" className="flex-1 cursor-pointer">
                        Show email to other users
                      </Label>
                      <Switch id="showEmail" defaultChecked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showPhone" className="flex-1 cursor-pointer">
                        Show phone number to other users
                      </Label>
                      <Switch id="showPhone" defaultChecked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowLocationSharing" className="flex-1 cursor-pointer">
                        Allow location sharing for nearby books
                      </Label>
                      <Switch id="allowLocationSharing" defaultChecked={true} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Management</h3>
                  <div className="space-y-2">
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <h4 className="font-medium text-red-800 dark:text-red-300">Danger Zone</h4>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <div className="mt-4">
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

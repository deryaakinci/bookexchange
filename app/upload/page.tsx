"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Upload, ImageIcon } from "lucide-react"

export default function UploadBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    condition: "",
    category: "",
    price: "",
    description: "",
    location: "",
    forSale: true,
    forExchange: false,
    images: [] as File[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Limit to 5 images
      const selectedFiles = filesArray.slice(0, 5)

      setFormData({
        ...formData,
        images: [...formData.images, ...selectedFiles],
      })

      // Create preview URLs
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setImagePreview([...imagePreview, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)

    const newPreviews = [...imagePreview]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)

    setFormData({
      ...formData,
      images: newImages,
    })
    setImagePreview(newPreviews)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required"
    }

    if (!formData.condition) {
      newErrors.condition = "Condition is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.forSale && !formData.price) {
      newErrors.price = "Price is required for books listed for sale"
    } else if (formData.forSale && isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a valid number"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.forSale && !formData.forExchange) {
      newErrors.listingType = "Book must be available for sale or exchange"
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Submit form data to server
      console.log("Form submitted:", formData)
      // Here you would typically make an API call to upload the book
    }
  }

  return (
    <div className="container py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload a Book</CardTitle>
          <CardDescription>Fill in the details about the book you want to sell or exchange</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author*</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                  />
                  {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN (Optional)</Label>
                  <Input id="isbn" name="isbn" placeholder="Enter ISBN" value={formData.isbn} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="textbook">Textbook</SelectItem>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="arts">Arts & Humanities</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition*</Label>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(value) => handleSelectChange("condition", value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="condition-new" />
                    <Label htmlFor="condition-new">New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="like-new" id="condition-like-new" />
                    <Label htmlFor="condition-like-new">Like New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="condition-good" />
                    <Label htmlFor="condition-good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="condition-fair" />
                    <Label htmlFor="condition-fair">Fair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="condition-poor" />
                    <Label htmlFor="condition-poor">Poor</Label>
                  </div>
                </RadioGroup>
                {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about the book, such as edition, highlights, notes, etc."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location*</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Where can the book be picked up?"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={!formData.forSale}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Listing Type*</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="for-sale">Available for Sale</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">List this book for sale</p>
                    </div>
                    <Switch
                      id="for-sale"
                      checked={formData.forSale}
                      onCheckedChange={(checked) => handleSwitchChange("forSale", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="for-exchange">Available for Exchange</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow book exchanges</p>
                    </div>
                    <Switch
                      id="for-exchange"
                      checked={formData.forExchange}
                      onCheckedChange={(checked) => handleSwitchChange("forExchange", checked)}
                    />
                  </div>
                </div>
                {errors.listingType && <p className="text-sm text-red-500">{errors.listingType}</p>}
              </div>

              <div className="space-y-2">
                <Label>Book Images*</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Book preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <span>×</span>
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                      <label
                        htmlFor="image-upload"
                        className="flex cursor-pointer flex-col items-center justify-center p-4"
                      >
                        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500">Add Image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images of the book. First image will be the cover.
                </p>
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Book
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">
            By uploading a book, you agree to our{" "}
            <a href="/terms" className="text-emerald-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

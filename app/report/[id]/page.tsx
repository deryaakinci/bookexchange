"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Flag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock book data
const book = {
  id: 1,
  title: "Introduction to Computer Science",
  author: "John Smith",
  seller: {
    id: 101,
    name: "Alex Johnson",
  },
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    contactEmail: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleReasonChange = (value: string) => {
    setFormData({
      ...formData,
      reason: value,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.reason) {
      newErrors.reason = "Please select a reason for reporting"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide details about the issue"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        console.log("Report submitted:", {
          bookId: params.id,
          ...formData,
        })

        toast({
          title: "Report submitted",
          description: "Thank you for your report. We'll review it as soon as possible.",
        })

        // Reset form
        setFormData({
          reason: "",
          description: "",
          contactEmail: "",
        })
        setIsSubmitting(false)
      }, 1500)
    }
  }

  return (
    <div className="container py-8">
      <Link
        href={`/books/${params.id}`}
        className="inline-flex items-center mb-6 text-sm font-medium text-emerald-600 hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Book
      </Link>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <CardTitle>Report Listing</CardTitle>
          </div>
          <CardDescription>
            Report this listing if you believe it violates our community guidelines or terms of service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">You are reporting:</h3>
              <div className="rounded-md border p-3">
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-gray-500">by {book.author}</p>
                <p className="text-sm text-gray-500">Listed by {book.seller.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-base">
                Reason for reporting*
              </Label>
              <RadioGroup value={formData.reason} onValueChange={handleReasonChange} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="reason-inappropriate" />
                  <Label htmlFor="reason-inappropriate">Inappropriate or offensive content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="misleading" id="reason-misleading" />
                  <Label htmlFor="reason-misleading">Misleading description or images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="counterfeit" id="reason-counterfeit" />
                  <Label htmlFor="reason-counterfeit">Counterfeit or unauthorized copy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fraud" id="reason-fraud" />
                  <Label htmlFor="reason-fraud">Suspected fraud or scam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="reason-other" />
                  <Label htmlFor="reason-other">Other</Label>
                </div>
              </RadioGroup>
              {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Description of the issue*
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide details about why you're reporting this listing..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-base">
                Your email (optional)
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="Enter your email if you'd like us to contact you about this report"
                value={formData.contactEmail}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                We'll only use this to contact you about this specific report if needed.
              </p>
              {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">Thank you for helping keep our community safe and trustworthy.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

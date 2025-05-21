"use client"

import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import Link from "next/link"

interface ReportButtonProps {
  bookId: number | string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ReportButton({ bookId, variant = "ghost", size = "sm" }: ReportButtonProps) {
  return (
    <Link href={`/report/${bookId}`}>
      <Button variant={variant} size={size}>
        <Flag className="mr-2 h-4 w-4" />
        Report Listing
      </Button>
    </Link>
  )
}

import { Check } from "lucide-react"

interface MessageStatusIndicatorProps {
  status: "sending" | "sent" | "delivered" | "read"
  className?: string
}

export default function MessageStatusIndicator({ status, className = "" }: MessageStatusIndicatorProps) {
  if (status === "sending") {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse"></div>
      </div>
    )
  }

  if (status === "sent") {
    return (
      <div className={`flex items-center ${className}`}>
        <Check className="h-3 w-3 text-gray-400" />
      </div>
    )
  }

  if (status === "delivered") {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="relative">
          <Check className="h-3 w-3 text-gray-400" />
          <Check className="h-3 w-3 text-gray-400 absolute top-0 left-0.5" />
        </div>
      </div>
    )
  }

  if (status === "read") {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="relative">
          <Check className="h-3 w-3 text-emerald-500" />
          <Check className="h-3 w-3 text-emerald-500 absolute top-0 left-0.5" />
        </div>
      </div>
    )
  }

  return null
}

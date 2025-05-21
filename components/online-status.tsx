import { Badge } from "@/components/ui/badge"

interface OnlineStatusProps {
  isOnline?: boolean
  lastSeen?: string
  className?: string
}

export default function OnlineStatus({ isOnline, lastSeen, className = "" }: OnlineStatusProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {isOnline ? (
        <div className="flex items-center">
          <Badge className="h-2 w-2 rounded-full p-0 bg-emerald-500 mr-1.5" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400">Online</span>
        </div>
      ) : (
        <span className="text-xs text-gray-500">{lastSeen || "Offline"}</span>
      )}
    </div>
  )
}

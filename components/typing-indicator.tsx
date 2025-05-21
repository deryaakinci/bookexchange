"use client"

import { useEffect, useState } from "react"

export default function TypingIndicator() {
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex max-w-[80%] rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
      <div className="flex space-x-1">
        <div className={`h-2 w-2 rounded-full bg-gray-400 ${dots >= 1 ? "animate-bounce" : ""}`}></div>
        <div
          className={`h-2 w-2 rounded-full bg-gray-400 ${dots >= 2 ? "animate-bounce" : ""}`}
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className={`h-2 w-2 rounded-full bg-gray-400 ${dots >= 3 ? "animate-bounce" : ""}`}
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  )
}

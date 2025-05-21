"use client"

import { useEffect, useState, useCallback } from "react"
import socketClient from "@/lib/socket"

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // In a real production app, we would use a real WebSocket server
    // For now, we'll use a mock URL that won't actually connect
    const mockWsUrl = "ws://mock-websocket-url"

    // Connect to the mock WebSocket server
    socketClient.connect(mockWsUrl)

    // Set up connection status handlers
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    const removeConnectHandler = socketClient.onConnect(handleConnect)
    const removeDisconnectHandler = socketClient.onDisconnect(handleDisconnect)

    // Update initial connection status
    setIsConnected(socketClient.isConnected())

    // Clean up event handlers when the component unmounts
    return () => {
      removeConnectHandler()
      removeDisconnectHandler()
    }
  }, [])

  const on = useCallback((type: string, handler: (data: any) => void) => {
    return socketClient.on(type, handler)
  }, [])

  const send = useCallback((type: string, payload: any) => {
    socketClient.send(type, payload)
  }, [])

  return {
    isConnected,
    on,
    send,
  }
}

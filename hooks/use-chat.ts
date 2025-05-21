"use client"

import { useState, useEffect, useCallback } from "react"
import { useSocket } from "./use-socket"
import { useToast } from "./use-toast"

// Define types for our chat functionality
export interface User {
  id: number
  name: string
  avatar: string
  lastSeen?: string
  isOnline?: boolean
}

export interface Message {
  id: number
  conversationId: number
  sender: "you" | "them"
  senderId: number
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
}

export interface Conversation {
  id: number
  user: User
  book: {
    id: number
    title: string
    image: string
  }
  lastMessage: string
  timestamp: string
  unread: boolean
  messages: Message[]
  isTyping?: boolean
}

// Mock data for conversations (this would come from your API in a real app)
const initialConversations: Conversation[] = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastSeen: "2 min ago",
      isOnline: true,
    },
    book: {
      id: 1,
      title: "Introduction to Computer Science",
      image: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: "Is this book still available?",
    timestamp: "10:23 AM",
    unread: true,
    messages: [
      {
        id: 1,
        conversationId: 1,
        sender: "them",
        senderId: 101,
        content: "Hi there! I'm interested in your Computer Science book.",
        timestamp: "Yesterday, 9:41 AM",
        status: "read",
      },
      {
        id: 2,
        conversationId: 1,
        sender: "them",
        senderId: 101,
        content: "Is this book still available?",
        timestamp: "Today, 10:23 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastSeen: "1 hour ago",
      isOnline: false,
    },
    book: {
      id: 3,
      title: "Principles of Economics",
      image: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: "Would you be interested in exchanging for my Calculus textbook?",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        id: 1,
        conversationId: 2,
        sender: "them",
        senderId: 102,
        content: "Hello! I saw your Economics book listing.",
        timestamp: "2 days ago, 3:15 PM",
        status: "read",
      },
      {
        id: 2,
        conversationId: 2,
        sender: "you",
        senderId: 999, // Current user ID
        content: "Hi Sarah, yes it's still available!",
        timestamp: "2 days ago, 4:22 PM",
        status: "read",
      },
      {
        id: 3,
        conversationId: 2,
        sender: "them",
        senderId: 102,
        content: "Great! Would you be interested in exchanging for my Calculus textbook?",
        timestamp: "Yesterday, 11:05 AM",
        status: "read",
      },
    ],
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastSeen: "3 hours ago",
      isOnline: false,
    },
    book: {
      id: 7,
      title: "Physics for Scientists and Engineers",
      image: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: "Thanks for the quick response! I can meet tomorrow at the library.",
    timestamp: "Monday",
    unread: false,
    messages: [
      {
        id: 1,
        conversationId: 3,
        sender: "them",
        senderId: 103,
        content: "Hi, I'm interested in buying your Physics textbook. Is it still available?",
        timestamp: "Monday, 2:30 PM",
        status: "read",
      },
      {
        id: 2,
        conversationId: 3,
        sender: "you",
        senderId: 999, // Current user ID
        content: "Yes, it's still available! When would you like to meet?",
        timestamp: "Monday, 3:45 PM",
        status: "read",
      },
      {
        id: 3,
        conversationId: 3,
        sender: "them",
        senderId: 103,
        content: "Thanks for the quick response! I can meet tomorrow at the library.",
        timestamp: "Monday, 4:10 PM",
        status: "read",
      },
    ],
  },
]

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, on, send } = useSocket()
  const { toast } = useToast()

  // Set up WebSocket event listeners
  useEffect(() => {
    // We'll simulate WebSocket events for the demo
    // In a real app, these would come from the server

    // Simulate connection status
    if (isConnected) {
      // Simulate a response to a message after a delay
      const simulateResponse = (conversationId: number, message: any) => {
        if (conversationId === 1) {
          setTimeout(() => {
            const responseMessage = {
              id: Date.now() + 1,
              conversationId,
              sender: "them",
              senderId: 101,
              content: "Yes, it's still available! Would you like to meet up to take a look at it?",
              timestamp: "Just now",
              status: "delivered",
            }

            setConversations((prevConversations) => {
              return prevConversations.map((conv) => {
                if (conv.id === conversationId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, responseMessage],
                    lastMessage: responseMessage.content,
                    timestamp: "Just now",
                    unread: activeConversation?.id !== conversationId,
                  }
                }
                return conv
              })
            })

            if (activeConversation?.id === conversationId) {
              setActiveConversation((prev) => {
                if (!prev) return null
                return {
                  ...prev,
                  messages: [...prev.messages, responseMessage],
                  lastMessage: responseMessage.content,
                  timestamp: "Just now",
                  unread: false,
                }
              })
            } else {
              toast({
                title: `New message from Alex Johnson`,
                description:
                  responseMessage.content.substring(0, 50) + (responseMessage.content.length > 50 ? "..." : ""),
              })
            }
          }, 3000)
        }
      }

      // Set up mock event handlers
      const removeMessageHandler = on("message", (data) => {
        simulateResponse(data.conversationId, data.message)
      })

      // Clean up
      return () => {
        removeMessageHandler()
      }
    }
  }, [isConnected, on, send, activeConversation, toast])

  // Set active conversation
  const selectConversation = useCallback(
    (conversationId: number) => {
      const conversation = conversations.find((conv) => conv.id === conversationId)

      if (conversation) {
        setActiveConversation(conversation)

        // Mark conversation as read
        if (conversation.unread) {
          setConversations((prevConversations) => {
            return prevConversations.map((conv) => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  unread: false,
                }
              }
              return conv
            })
          })

          // Send read receipts for all unread messages
          if (isConnected) {
            conversation.messages.forEach((message) => {
              if (message.sender === "them" && message.status !== "read") {
                send("read_receipt", {
                  conversationId,
                  messageId: message.id,
                })
              }
            })
          }
        }
      }
    },
    [conversations, isConnected, send],
  )

  // Send a new message
  const sendMessage = useCallback(
    (conversationId: number, content: string) => {
      if (!content.trim()) return

      // Create a temporary message with a local ID
      const tempId = Date.now()
      const newMessage: Message = {
        id: tempId,
        conversationId,
        sender: "you",
        senderId: 999, // Current user ID
        content,
        timestamp: "Just now",
        status: "sending",
      }

      // Update conversations with the new message
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              timestamp: "Just now",
            }
          }
          return conv
        })
      })

      // Update active conversation if it's the current one
      if (activeConversation?.id === conversationId) {
        setActiveConversation((prev) => {
          if (!prev) return null
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: content,
            timestamp: "Just now",
          }
        })
      }

      // Send the message through WebSocket
      if (isConnected) {
        send("message", {
          tempId,
          conversationId,
          content,
        })
      } else {
        // Handle offline case - show error and mark as failed
        toast({
          title: "Connection error",
          description: "You appear to be offline. Your message will be sent when you reconnect.",
          variant: "destructive",
        })
      }

      // Simulate message status updates for demo purposes
      // In a real app, these would come from the server
      setTimeout(() => {
        setConversations((prevConversations) => {
          return prevConversations.map((conv) => {
            if (conv.id === conversationId) {
              const updatedMessages = conv.messages.map((msg) => {
                if (msg.id === tempId) {
                  return {
                    ...msg,
                    status: "sent",
                  }
                }
                return msg
              })

              return {
                ...conv,
                messages: updatedMessages,
              }
            }
            return conv
          })
        })

        if (activeConversation?.id === conversationId) {
          setActiveConversation((prev) => {
            if (!prev) return null

            const updatedMessages = prev.messages.map((msg) => {
              if (msg.id === tempId) {
                return {
                  ...msg,
                  status: "sent",
                }
              }
              return msg
            })

            return {
              ...prev,
              messages: updatedMessages,
            }
          })
        }
      }, 500)

      setTimeout(() => {
        setConversations((prevConversations) => {
          return prevConversations.map((conv) => {
            if (conv.id === conversationId) {
              const updatedMessages = conv.messages.map((msg) => {
                if (msg.id === tempId) {
                  return {
                    ...msg,
                    status: "delivered",
                  }
                }
                return msg
              })

              return {
                ...conv,
                messages: updatedMessages,
              }
            }
            return conv
          })
        })

        if (activeConversation?.id === conversationId) {
          setActiveConversation((prev) => {
            if (!prev) return null

            const updatedMessages = prev.messages.map((msg) => {
              if (msg.id === tempId) {
                return {
                  ...msg,
                  status: "delivered",
                }
              }
              return msg
            })

            return {
              ...prev,
              messages: updatedMessages,
            }
          })
        }
      }, 1500)

      // Simulate a response for demo purposes
      // In a real app, this would come from the other user
      if (conversationId === 1) {
        setTimeout(() => {
          const responseMessage: Message = {
            id: Date.now() + 1,
            conversationId,
            sender: "them",
            senderId: 101,
            content: "Yes, it's still available! Would you like to meet up to take a look at it?",
            timestamp: "Just now",
            status: "delivered",
          }

          setConversations((prevConversations) => {
            return prevConversations.map((conv) => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  messages: [...conv.messages, responseMessage],
                  lastMessage: responseMessage.content,
                  timestamp: "Just now",
                  unread: activeConversation?.id !== conversationId,
                }
              }
              return conv
            })
          })

          if (activeConversation?.id === conversationId) {
            setActiveConversation((prev) => {
              if (!prev) return null
              return {
                ...prev,
                messages: [...prev.messages, responseMessage],
                lastMessage: responseMessage.content,
                timestamp: "Just now",
              }
            })
          } else {
            toast({
              title: "New message from Alex Johnson",
              description:
                responseMessage.content.substring(0, 50) + (responseMessage.content.length > 50 ? "..." : ""),
            })
          }
        }, 3000)
      }

      return newMessage
    },
    [activeConversation, isConnected, send, toast],
  )

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (conversationId: number, isTyping: boolean) => {
      if (isConnected) {
        send("typing", {
          conversationId,
          isTyping,
        })
      }
    },
    [isConnected, send],
  )

  return {
    conversations,
    activeConversation,
    isLoading,
    isConnected,
    selectConversation,
    sendMessage,
    sendTypingIndicator,
  }
}

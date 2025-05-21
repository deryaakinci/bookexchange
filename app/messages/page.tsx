"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Check, ChevronRight, Search, Send, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useChat } from "@/hooks/use-chat"
import MessageStatusIndicator from "@/components/message-status-indicator"
import TypingIndicator from "@/components/typing-indicator"
import OnlineStatus from "@/components/online-status"
import { MessageCircle } from "lucide-react"
import Image from "next/image"

// Mock data for exchange requests
const exchangeRequests = [
  {
    id: 101,
    user: {
      id: 102,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bookOffered: {
      id: 201,
      title: "Calculus: Early Transcendentals",
      condition: "Like New",
      image: "/placeholder.svg?height=60&width=40",
    },
    bookRequested: {
      id: 3,
      title: "Principles of Economics",
      condition: "Acceptable",
      image: "/placeholder.svg?height=60&width=40",
    },
    status: "pending",
    timestamp: "Yesterday, 11:30 AM",
  },
  {
    id: 102,
    user: {
      id: 104,
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bookOffered: {
      id: 202,
      title: "Introduction to Psychology",
      condition: "Good",
      image: "/placeholder.svg?height=60&width=40",
    },
    bookRequested: {
      id: 8,
      title: "Introduction to Algorithms",
      condition: "Good",
      image: "/placeholder.svg?height=60&width=40",
    },
    status: "pending",
    timestamp: "Monday, 3:15 PM",
  },
]

export default function MessagesPage() {
  const { conversations, activeConversation, isConnected, selectConversation, sendMessage, sendTypingIndicator } =
    useChat()

  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation?.messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      sendMessage(activeConversation.id, newMessage)
      setNewMessage("")

      // Clear typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        setTypingTimeout(null)
      }
      sendTypingIndicator(activeConversation.id, false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // Send typing indicator
    if (activeConversation) {
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Send typing indicator if there's text
      if (value.trim()) {
        sendTypingIndicator(activeConversation.id, true)

        // Set timeout to clear typing indicator after 2 seconds of inactivity
        const timeout = setTimeout(() => {
          sendTypingIndicator(activeConversation.id, false)
        }, 2000)

        setTypingTimeout(timeout)
      } else {
        // If input is empty, clear typing indicator
        sendTypingIndicator(activeConversation.id, false)
      }
    }
  }

  const handleAcceptExchange = (exchangeId: number) => {
    console.log("Exchange accepted:", exchangeId)
    // In a real app, you would update the exchange status in your database
  }

  const handleRejectExchange = (exchangeId: number) => {
    console.log("Exchange declined:", exchangeId)
    // In a real app, you would update the exchange status in your database
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Messages</h1>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "outline"} className="bg-emerald-600">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Communicate with other users about books and arrange exchanges.
          </p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="exchanges">Exchange Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Conversations List */}
              <Card className="md:col-span-1">
                <CardHeader className="p-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search messages..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(80vh-12rem)]">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div key={conversation.id}>
                          <button
                            className={`flex w-full items-start space-x-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              activeConversation?.id === conversation.id ? "bg-gray-100 dark:bg-gray-800" : ""
                            }`}
                            onClick={() => selectConversation(conversation.id)}
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage
                                  src={conversation.user.avatar || "/placeholder.svg"}
                                  alt={conversation.user.name}
                                />
                                <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {conversation.user.isOnline && (
                                <Badge className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full p-0 bg-emerald-500 border-2 border-white dark:border-gray-950" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{conversation.user.name}</p>
                                <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {conversation.isTyping ? "Typing..." : conversation.lastMessage}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="h-3 w-3 text-gray-400" />
                                  <p className="text-xs text-gray-500 line-clamp-1">{conversation.book.title}</p>
                                </div>
                                {conversation.unread && <Badge className="h-2 w-2 rounded-full p-0 bg-emerald-500" />}
                              </div>
                            </div>
                          </button>
                          <Separator />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-gray-500">No conversations found</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Active Conversation */}
              <Card className="md:col-span-2">
                {activeConversation ? (
                  <>
                    <CardHeader className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage
                                src={activeConversation.user.avatar || "/placeholder.svg"}
                                alt={activeConversation.user.name}
                              />
                              <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {activeConversation.user.isOnline && (
                              <Badge className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full p-0 bg-emerald-500 border-2 border-white dark:border-gray-950" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">{activeConversation.user.name}</CardTitle>
                            <OnlineStatus
                              isOnline={activeConversation.user.isOnline}
                              lastSeen={activeConversation.user.lastSeen}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3" />
                            <span className="text-xs">{activeConversation.book.title}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col h-[calc(80vh-16rem)]">
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {activeConversation.messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg p-3 ${
                                    message.sender === "you"
                                      ? "bg-emerald-600 text-white"
                                      : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div
                                    className={`mt-1 flex items-center justify-end space-x-1 text-xs ${
                                      message.sender === "you" ? "text-emerald-100" : "text-gray-500"
                                    }`}
                                  >
                                    <span>{message.timestamp}</span>
                                    {message.sender === "you" && <MessageStatusIndicator status={message.status} />}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {activeConversation.isTyping && (
                              <div className="flex justify-start">
                                <TypingIndicator />
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                        <div className="border-t p-4">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={handleInputChange}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault()
                                  handleSendMessage()
                                }
                              }}
                            />
                            <Button
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim() || !isConnected}
                            >
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Send message</span>
                            </Button>
                          </div>
                          {!isConnected && (
                            <p className="mt-2 text-xs text-red-500">
                              You are currently offline. Messages will be sent when you reconnect.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[calc(80vh-12rem)] p-4 text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No conversation selected</h3>
                    <p className="text-sm text-gray-500 mt-1">Select a conversation from the list to start messaging</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exchanges" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {exchangeRequests.length > 0 ? (
                exchangeRequests.map((exchange) => (
                  <Card key={exchange.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={exchange.user.avatar || "/placeholder.svg"} alt={exchange.user.name} />
                            <AvatarFallback>{exchange.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{exchange.user.name}</p>
                            <p className="text-sm text-gray-500">{exchange.timestamp}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="text-center">
                            <div className="relative h-16 w-12 mx-auto">
                              <Image
                                src={exchange.bookOffered.image || "/placeholder.svg"}
                                alt={exchange.bookOffered.title}
                                fill
                                className="object-cover rounded-sm"
                              />
                            </div>
                            <p className="mt-1 text-xs font-medium line-clamp-1">{exchange.bookOffered.title}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {exchange.bookOffered.condition}
                            </Badge>
                          </div>

                          <ChevronRight className="mx-4 h-6 w-6 text-gray-400" />

                          <div className="text-center">
                            <div className="relative h-16 w-12 mx-auto">
                              <Image
                                src={exchange.bookRequested.image || "/placeholder.svg"}
                                alt={exchange.bookRequested.title}
                                fill
                                className="object-cover rounded-sm"
                              />
                            </div>
                            <p className="mt-1 text-xs font-medium line-clamp-1">{exchange.bookRequested.title}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {exchange.bookRequested.condition}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleAcceptExchange(exchange.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button variant="outline" onClick={() => handleRejectExchange(exchange.id)}>
                            <X className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                    <BookOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">No exchange requests</h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    When someone wants to exchange books with you, their requests will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

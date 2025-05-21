// Base API configuration
const API_URL = "https://api.bookxchange.com/v1" // Replace with your actual API URL

// Types
export interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  condition: string
  category: string
  isbn?: string
  images: string[]
  seller: {
    id: string
    name: string
    avatar?: string
  }
  location: {
    latitude: number
    longitude: number
  }
  createdAt: string
  status: "available" | "sold" | "reserved"
}

export interface User {
  id: number
  name: string
  avatar: string
  rating?: number
  joinedDate?: string
  responseRate?: string
  isOnline?: boolean
  lastSeen?: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
}

export interface Conversation {
  id: number
  user: User
  book: {
    id: string
    title: string
    image: string
  }
  lastMessage: string
  timestamp: string
  unread: boolean
  messages: Message[]
  isTyping?: boolean
}

export interface CartItem {
  id: string
  book: Book
  quantity: number
}

export interface WishlistItem {
  id: string
  book: Book
  addedAt: string
}

// API error handling
class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  headers?: Record<string, string>,
): Promise<T> {
  try {
    const url = `${API_URL}${endpoint}`

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    // For development/demo purposes, add a delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status)
    }

    const result = await response.json()
    return result as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new Error(`Network error: ${error.message}`)
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: User }>("/auth/login", "POST", { email, password })
  },

  register: async (userData: { fullName: string; email: string; password: string }) => {
    return apiRequest<{ token: string; user: User }>("/auth/register", "POST", userData)
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string }>("/auth/forgot-password", "POST", { email })
  },

  getProfile: async () => {
    return apiRequest<User>("/auth/profile", "GET")
  },
}

// Books API
export const booksApi = {
  getBooks: async (params?: {
    search?: string
    category?: string
    condition?: string
    minPrice?: number
    maxPrice?: number
    forSale?: boolean
    forExchange?: boolean
    page?: number
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest<{ books: Book[]; total: number; page: number; limit: number }>(`/books${query}`)
  },

  getBookById: async (id: string) => {
    return apiRequest<Book>(`/books/${id}`)
  },

  getFeaturedBooks: async () => {
    return apiRequest<Book[]>("/books/featured")
  },

  getNearbyBooks: async (latitude: number, longitude: number, distance = 5): Promise<Book[]> => {
    return apiRequest<Book[]>(`/books/nearby?lat=${latitude}&lng=${longitude}&distance=${distance}`)
  },

  createBook: async (bookData: any): Promise<Book> => {
    return apiRequest<Book>("/books", "POST", bookData)
  },

  updateBook: async (id: string, bookData: any): Promise<Book> => {
    return apiRequest<Book>(`/books/${id}`, "PUT", bookData)
  },

  deleteBook: async (id: string) => {
    return apiRequest<{ message: string }>(`/books/${id}`, "DELETE")
  },
}

// Messages API
export const messagesApi = {
  getConversations: async () => {
    return apiRequest<Conversation[]>("/messages/conversations")
  },

  getConversation: async (id: number) => {
    return apiRequest<Conversation>(`/messages/conversations/${id}`)
  },

  sendMessage: async (conversationId: number, content: string) => {
    return apiRequest<Message>(`/messages/conversations/${conversationId}`, "POST", { content })
  },

  markAsRead: async (conversationId: number, messageId: number) => {
    return apiRequest<{ success: boolean }>(`/messages/conversations/${conversationId}/read/${messageId}`, "PUT")
  },

  sendTypingIndicator: async (conversationId: number, isTyping: boolean) => {
    return apiRequest<{ success: boolean }>(`/messages/conversations/${conversationId}/typing`, "POST", { isTyping })
  },
}

// User API
export const userApi = {
  getWishlist: async () => {
    return apiRequest<Book[]>("/user/wishlist")
  },

  addToWishlist: async (bookId: string) => {
    return apiRequest<{ message: string }>("/user/wishlist", "POST", { bookId })
  },

  removeFromWishlist: async (bookId: string) => {
    return apiRequest<{ message: string }>(`/user/wishlist/${bookId}`, "DELETE")
  },

  getListedBooks: async (status?: "active" | "pending" | "sold") => {
    const query = status ? `?status=${status}` : ""
    return apiRequest<Book[]>(`/user/books${query}`)
  },

  updateProfile: async (userData: any) => {
    return apiRequest<User>("/user/profile", "PUT", userData)
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest<{ message: string }>("/user/change-password", "PUT", { currentPassword, newPassword })
  },
}

// Cart API
export const cartApi = {
  getCart: async () => {
    return apiRequest<CartItem[]>("/cart")
  },

  addToCart: async (bookId: string) => {
    return apiRequest<{ message: string }>("/cart", "POST", { bookId })
  },

  removeFromCart: async (itemId: string) => {
    return apiRequest<{ message: string }>(`/cart/${itemId}`, "DELETE")
  },

  updateCartItemQuantity: async (itemId: string, quantity: number) => {
    return apiRequest<{ message: string }>(`/cart/${itemId}`, "PUT", { quantity })
  },

  checkout: async () => {
    return apiRequest<{ message: string }>("/cart/checkout", "POST")
  },
}

// Mock API for development (when real API is not available)
export const mockApi = {
  // Mock data for books
  books: [
    {
      id: "book1",
      title: "Introduction to Computer Science",
      author: "John Smith",
      description: "A comprehensive introduction to computer science principles.",
      price: 45.99,
      condition: "Like New",
      category: "Computer Science",
      isbn: "9781234567890",
      images: ["/placeholder.svg?height=300&width=200"],
      seller: {
        id: "user1",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      createdAt: "2023-05-15T10:30:00Z",
      status: "available",
    },
    {
      id: "book2",
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      description: "A comprehensive calculus textbook covering limits, derivatives, and integrals.",
      price: 75.5,
      condition: "Good",
      category: "Mathematics",
      isbn: "9780538497909",
      images: ["/placeholder.svg?height=300&width=200"],
      seller: {
        id: "user2",
        name: "Bob Williams",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      location: {
        latitude: 40.7282,
        longitude: -73.9942,
      },
      createdAt: "2023-05-10T14:20:00Z",
      status: "available",
    },
    {
      id: "book3",
      title: "Organic Chemistry",
      author: "Paula Bruice",
      description: "A comprehensive guide to organic chemistry principles and reactions.",
      price: 89.99,
      condition: "Very Good",
      category: "Science",
      isbn: "9780134042282",
      images: ["/placeholder.svg?height=300&width=200"],
      seller: {
        id: "user3",
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      location: {
        latitude: 40.73,
        longitude: -73.995,
      },
      createdAt: "2023-05-12T09:15:00Z",
      status: "available",
    },
  ],

  // Mock data for conversations
  conversations: [
    {
      id: 1,
      user: {
        id: 101,
        name: "Alex Johnson",
        avatar: "https://via.placeholder.com/40x40",
        lastSeen: "2 min ago",
        isOnline: true,
      },
      book: {
        id: "book1",
        title: "Introduction to Computer Science",
        image: "https://via.placeholder.com/60x40",
      },
      lastMessage: "Is this book still available?",
      timestamp: "10:23 AM",
      unread: true,
      messages: [
        {
          id: 1,
          conversationId: 1,
          senderId: 101,
          content: "Hi there! I'm interested in your Computer Science book.",
          timestamp: "Yesterday, 9:41 AM",
          status: "read",
        },
        {
          id: 2,
          conversationId: 1,
          senderId: 101,
          content: "Is this book still available?",
          timestamp: "Today, 10:23 AM",
          status: "delivered",
        },
      ],
      isTyping: false,
    },
    {
      id: 2,
      user: {
        id: 102,
        name: "Sarah Williams",
        avatar: "https://via.placeholder.com/40x40",
        lastSeen: "1 hour ago",
        isOnline: false,
      },
      book: {
        id: "book3",
        title: "Organic Chemistry",
        image: "https://via.placeholder.com/60x40",
      },
      lastMessage: "Would you be interested in exchanging for my Calculus textbook?",
      timestamp: "Yesterday",
      unread: false,
      messages: [
        {
          id: 1,
          conversationId: 2,
          senderId: 102,
          content: "Hello! I saw your Economics book listing.",
          timestamp: "2 days ago, 3:15 PM",
          status: "read",
        },
        {
          id: 2,
          conversationId: 2,
          senderId: 999, // Current user ID
          content: "Hi Sarah, yes it's still available!",
          timestamp: "2 days ago, 4:22 PM",
          status: "read",
        },
        {
          id: 3,
          conversationId: 2,
          senderId: 102,
          content: "Great! Would you be interested in exchanging for my Calculus textbook?",
          timestamp: "Yesterday, 11:05 AM",
          status: "read",
        },
      ],
      isTyping: false,
    },
  ],

  // Mock data for cart items
  cartItems: [
    {
      id: "cart1",
      book: {
        id: "book3",
        title: "Organic Chemistry",
        author: "Paula Bruice",
        description: "A comprehensive guide to organic chemistry principles and reactions.",
        price: 89.99,
        condition: "Very Good",
        category: "Science",
        isbn: "9780134042282",
        images: ["/placeholder.svg?height=300&width=200"],
        seller: {
          id: "user3",
          name: "Charlie Brown",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        location: {
          latitude: 40.73,
          longitude: -73.995,
        },
        createdAt: "2023-05-12T09:15:00Z",
        status: "available",
      },
      quantity: 1,
    },
  ],

  // Mock data for wishlist books
  wishlistBooks: [
    {
      id: "book2",
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      description: "A comprehensive calculus textbook covering limits, derivatives, and integrals.",
      price: 75.5,
      condition: "Good",
      category: "Mathematics",
      isbn: "9780538497909",
      images: ["/placeholder.svg?height=300&width=200"],
      seller: {
        id: "user2",
        name: "Bob Williams",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      location: {
        latitude: 40.7282,
        longitude: -73.9942,
      },
      createdAt: "2023-05-10T14:20:00Z",
      status: "available",
    },
  ],

  // Mock functions
  getBooks: function (params?: any) {
    let filteredBooks = [...this.books]

    if (params) {
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.category?.toLowerCase().includes(searchLower),
        )
      }

      if (params.category) {
        filteredBooks = filteredBooks.filter((book) => book.category === params.category)
      }

      if (params.condition) {
        filteredBooks = filteredBooks.filter((book) => book.condition === params.condition)
      }

      if (params.minPrice !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.price >= params.minPrice)
      }

      if (params.maxPrice !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.price <= params.maxPrice)
      }

      if (params.forSale !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.status === "available")
      }

      if (params.forExchange !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.exchange === params.forExchange)
      }
    }

    return {
      books: filteredBooks,
      total: filteredBooks.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    }
  },

  getBookById: function (id: string) {
    const book = this.books.find((book) => book.id === id)
    if (!book) {
      throw new Error(`Book with ID ${id} not found`)
    }
    return book
  },

  getFeaturedBooks: function () {
    return this.books.slice(0, 4)
  },

  getConversations: function () {
    return this.conversations
  },

  getConversation: function (id: number) {
    const conversation = this.conversations.find((conv) => conv.id === id)
    if (!conversation) {
      throw new Error(`Conversation with ID ${id} not found`)
    }
    return conversation
  },

  sendMessage: function (conversationId: number, content: string) {
    const conversation = this.getConversation(conversationId)
    const newMessage = {
      id: Date.now(),
      conversationId,
      senderId: 999, // Current user ID
      content,
      timestamp: "Just now",
      status: "sending" as const,
    }

    conversation.messages.push(newMessage)
    conversation.lastMessage = content
    conversation.timestamp = "Just now"

    return newMessage
  },

  getCart: function () {
    return this.cartItems
  },

  addToCart: (bookId: string) => {
    console.log(`Added book ${bookId} to cart`)
  },

  removeFromCart: (itemId: string) => {
    console.log(`Removed item ${itemId} from cart`)
  },

  updateCartItemQuantity: (itemId: string, quantity: number) => {
    console.log(`Updated item ${itemId} quantity to ${quantity}`)
  },

  checkout: () => {
    console.log("Processing checkout")
  },

  getWishlist: function () {
    return this.wishlistBooks
  },

  addToWishlist: (bookId: string) => {
    console.log(`Added book ${bookId} to wishlist`)
  },

  removeFromWishlist: (bookId: string) => {
    console.log(`Removed book ${bookId} from wishlist`)
  },
}

// Helper function to calculate distance between coordinates (using Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}

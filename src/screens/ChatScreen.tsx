"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Send, BookOpen } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import MessageStatusIndicator from "../components/MessageStatusIndicator"
import TypingIndicator from "../components/TypingIndicator"
import { mockApi, type Conversation, type Message } from "../services/api"

const ChatScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const { conversationId, userName, bookId, bookTitle } = route.params || {}
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    fetchConversation()

    // Set the navigation header title
    navigation.setOptions({
      title: userName || "Chat",
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("BookDetail", { bookId })}>
          <BookOpen stroke={isDarkMode ? "#ffffff" : "#111827"} width={20} height={20} />
        </TouchableOpacity>
      ),
    })
  }, [])

  const fetchConversation = async () => {
    try {
      setLoading(true)
      // In a real app, use the actual API
      // const response = await messagesApi.getConversation(conversationId);
      // setConversation(response);

      // For demo purposes, use mock API
      const response = mockApi.getConversation(conversationId)
      setConversation(response)
      setIsConnected(true)
    } catch (error) {
      console.error("Error fetching conversation:", error)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !conversation) return

    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
    sendTypingIndicator(false)

    // Create a temporary message
    const tempMessage: Message = {
      id: Date.now(),
      conversationId: conversation.id,
      senderId: 999, // Current user ID
      content: newMessage,
      timestamp: "Just now",
      status: "sending",
    }

    // Update local state immediately
    setConversation({
      ...conversation,
      messages: [...conversation.messages, tempMessage],
      lastMessage: newMessage,
      timestamp: "Just now",
    })
    setNewMessage("")

    try {
      // In a real app, send to the API
      // const response = await messagesApi.sendMessage(conversation.id, newMessage);

      // For demo purposes, use mock API
      const response = mockApi.sendMessage(conversation.id, newMessage)

      // Update the message status after a delay
      setTimeout(() => {
        if (conversation) {
          setConversation({
            ...conversation,
            messages: conversation.messages.map((msg) =>
              msg.id === tempMessage.id ? { ...msg, status: "sent" } : msg,
            ),
          })
        }
      }, 500)

      setTimeout(() => {
        if (conversation) {
          setConversation({
            ...conversation,
            messages: conversation.messages.map((msg) =>
              msg.id === tempMessage.id ? { ...msg, status: "delivered" } : msg,
            ),
          })
        }
      }, 1500)

      // Simulate a response for demo purposes
      if (conversation.id === 1) {
        setTimeout(() => {
          const responseMessage: Message = {
            id: Date.now() + 1,
            conversationId: conversation.id,
            senderId: conversation.user.id,
            content: "Yes, it's still available! Would you like to meet up to take a look at it?",
            timestamp: "Just now",
            status: "delivered",
          }

          setConversation((prev) => {
            if (!prev) return null
            return {
              ...prev,
              messages: [...prev.messages, responseMessage],
              lastMessage: responseMessage.content,
              timestamp: "Just now",
            }
          })
        }, 3000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Update the message to show error status
      if (conversation) {
        setConversation({
          ...conversation,
          messages: conversation.messages.map((msg) => (msg.id === tempMessage.id ? { ...msg, status: "error" } : msg)),
        })
      }
    }
  }

  const handleInputChange = (text: string) => {
    setNewMessage(text)

    // Send typing indicator
    if (conversation) {
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Send typing indicator if there's text
      if (text.trim()) {
        sendTypingIndicator(true)

        // Set timeout to clear typing indicator after 2 seconds of inactivity
        const timeout = setTimeout(() => {
          sendTypingIndicator(false)
        }, 2000)

        setTypingTimeout(timeout)
      } else {
        // If input is empty, clear typing indicator
        sendTypingIndicator(false)
      }
    }
  }

  const sendTypingIndicator = (isTyping: boolean) => {
    if (!conversation || !isConnected) return

    // In a real app, send to the API
    // messagesApi.sendTypingIndicator(conversation.id, isTyping);

    // For demo purposes, just log
    console.log(`Typing indicator: ${isTyping ? "typing" : "stopped typing"}`)
  }

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 999 // Current user ID

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <View
          style={[
            styles.messageBubble,
            isCurrentUser
              ? [styles.currentUserBubble, { backgroundColor: "#10b981" }]
              : [styles.otherUserBubble, { backgroundColor: isDarkMode ? "#374151" : "#f3f4f6" }],
          ]}
        >
          <Text style={[styles.messageText, { color: isCurrentUser ? "#ffffff" : isDarkMode ? "#ffffff" : "#111827" }]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTimestamp,
                { color: isCurrentUser ? "rgba(255, 255, 255, 0.7)" : isDarkMode ? "#9ca3af" : "#6b7280" },
              ]}
            >
              {item.timestamp}
            </Text>
            {isCurrentUser && <MessageStatusIndicator status={item.status} />}
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  if (!conversation) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
        <Text style={[styles.errorText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
          Conversation not found or error loading data
        </Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {conversation.isTyping && <TypingIndicator />}

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderTopColor: isDarkMode ? "#374151" : "#e5e7eb" },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
              color: isDarkMode ? "#ffffff" : "#111827",
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
          value={newMessage}
          onChangeText={handleInputChange}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
        >
          <Send stroke="#ffffff" width={20} height={20} />
        </TouchableOpacity>
      </View>

      {!isConnected && (
        <View style={[styles.offlineNotice, { backgroundColor: isDarkMode ? "#ef4444" : "#fee2e2" }]}>
          <Text style={[styles.offlineText, { color: isDarkMode ? "#ffffff" : "#b91c1c" }]}>
            You are currently offline. Messages will be sent when you reconnect.
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  messageTimestamp: {
    fontSize: 12,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#10b981",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  offlineNotice: {
    padding: 8,
    alignItems: "center",
  },
  offlineText: {
    fontSize: 12,
  },
})

export default ChatScreen

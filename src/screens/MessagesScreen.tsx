"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { BookOpen, MessageCircle } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import Badge from "../components/ui/Badge"
import { mockApi, type Conversation } from "../services/api"

const MessagesScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      // In a real app, use the actual API
      // const response = await messagesApi.getConversations();
      // setConversations(response);

      // For demo purposes, use mock API
      const response = mockApi.getConversations()
      setConversations(response)
      setIsConnected(true)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setIsConnected(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchConversations()
  }

  const handleSelectConversation = (conversation: Conversation) => {
    navigation.navigate("Chat", {
      conversationId: conversation.id,
      userName: conversation.user.name,
      bookId: conversation.book.id,
      bookTitle: conversation.book.title,
    })
  }

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
      ]}
      onPress={() => handleSelectConversation(item)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.avatar}
          defaultSource={require("../assets/images/avatar-placeholder.png")}
        />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.userName, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{item.user.name}</Text>
          <Text style={[styles.timestamp, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>{item.timestamp}</Text>
        </View>

        <Text
          style={[
            styles.lastMessage,
            { color: isDarkMode ? "#d1d5db" : "#6b7280" },
            item.isTyping && { fontStyle: "italic" },
          ]}
          numberOfLines={1}
        >
          {item.isTyping ? "Typing..." : item.lastMessage}
        </Text>

        <View style={styles.bookInfo}>
          <BookOpen stroke={isDarkMode ? "#9ca3af" : "#9ca3af"} width={12} height={12} />
          <Text style={[styles.bookTitle, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]} numberOfLines={1}>
            {item.book.title}
          </Text>
          {item.unread && <View style={styles.unreadIndicator} />}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MessageCircle stroke={isDarkMode ? "#6b7280" : "#9ca3af"} width={48} height={48} />
      <Text style={[styles.emptyTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>No conversations yet</Text>
      <Text style={[styles.emptySubtitle, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
        When you message someone about a book, your conversations will appear here.
      </Text>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Messages</Text>
        <View style={styles.connectionStatus}>
          <Badge
            text={isConnected ? "Connected" : "Disconnected"}
            variant={isConnected ? "default" : "outline"}
            color={isConnected ? "#10b981" : undefined}
          />
        </View>
      </View>

      <Text style={[styles.subtitle, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
        Communicate with other users about books and arrange exchanges.
      </Text>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10b981"]} />}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: isDarkMode ? "#374151" : "#e5e7eb" }]} />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  conversationsList: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    padding: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginLeft: 4,
  },
  separator: {
    height: 1,
    marginLeft: 78,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
})

export default MessagesScreen

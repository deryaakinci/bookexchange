"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { api } from "../services/api"
import { Button } from "../components/ui/Button"
import type { Book } from "../services/api"

export default function WishlistScreen() {
  const navigation = useNavigation()
  const [wishlistItems, setWishlistItems] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWishlist = async () => {
    try {
      const data = await api.books.getWishlist()
      setWishlistItems(data)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      Alert.alert("Error", "Failed to load your wishlist. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchWishlist()
  }

  const removeFromWishlist = async (bookId: string) => {
    try {
      await api.books.removeFromWishlist(bookId)
      setWishlistItems(wishlistItems.filter((item) => item.id !== bookId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      Alert.alert("Error", "Failed to remove book from wishlist. Please try again.")
    }
  }

  const addToCart = async (bookId: string) => {
    try {
      await api.cart.addToCart(bookId)
      Alert.alert("Success", "Book added to your cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      Alert.alert("Error", "Failed to add book to cart. Please try again.")
    }
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="heart" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptyStateText}>Books you save will appear here. Browse books to add to your wishlist.</Text>
      <Button onPress={() => navigation.navigate("Browse" as never)} style={styles.browseButton}>
        Browse Books
      </Button>
    </View>
  )

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.images[0] || "/placeholder.svg?height=120&width=80" }} style={styles.bookImage} />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          by {item.author}
        </Text>
        <Text style={styles.bookPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.bookCondition}>{item.condition}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => addToCart(item.id)}>
            <Feather name="shopping-cart" size={16} color="#555" />
            <Text style={styles.actionButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Feather name="trash-2" size={16} color="#ff4d4f" />
            <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c974b",
    marginBottom: 4,
  },
  bookCondition: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "#fff0f0",
  },
  removeButtonText: {
    color: "#ff4d4f",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  browseButton: {
    width: 200,
  },
})

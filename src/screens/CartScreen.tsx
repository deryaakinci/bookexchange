"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { api } from "../services/api"
import { Button } from "../components/ui/Button"

interface CartItem {
  id: string
  book: {
    id: string
    title: string
    author: string
    price: number
    images: string[]
    condition: string
  }
  quantity: number
}

export default function CartScreen() {
  const navigation = useNavigation()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCart = async () => {
    try {
      const data = await api.cart.getCart()
      setCartItems(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      Alert.alert("Error", "Failed to load your cart. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCart()
  }

  const removeFromCart = async (itemId: string) => {
    try {
      await api.cart.removeFromCart(itemId)
      setCartItems(cartItems.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error removing from cart:", error)
      Alert.alert("Error", "Failed to remove book from cart. Please try again.")
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await api.cart.updateCartItemQuantity(itemId, newQuantity)
      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
      Alert.alert("Error", "Failed to update quantity. Please try again.")
    }
  }

  const handleCheckout = () => {
    navigation.navigate("Checkout" as never)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0)
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="shopping-cart" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
      <Text style={styles.emptyStateText}>
        Books you add to your cart will appear here. Browse books to start shopping.
      </Text>
      <Button onPress={() => navigation.navigate("Browse" as never)} style={styles.browseButton}>
        Browse Books
      </Button>
    </View>
  )

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.book.images[0] || "/placeholder.svg?height=120&width=80" }} style={styles.bookImage} />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {item.book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          by {item.book.author}
        </Text>
        <Text style={styles.bookPrice}>${item.book.price.toFixed(2)}</Text>
        <Text style={styles.bookCondition}>{item.book.condition}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Feather name="minus" size={16} color="#555" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Feather name="plus" size={16} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
            <Feather name="trash-2" size={16} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items):</Text>
            <Text style={styles.summaryValue}>${calculateTotal().toFixed(2)}</Text>
          </View>

          <Button onPress={handleCheckout} style={styles.checkoutButton}>
            Proceed to Checkout
          </Button>
        </View>
      )}
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
  cartItem: {
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    padding: 6,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: "auto",
    backgroundColor: "#fff0f0",
    borderRadius: 4,
    padding: 6,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    paddingBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#333",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    marginTop: 8,
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

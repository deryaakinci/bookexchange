"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, MapPin } from "react-native-feather"
import { useTheme } from "./theme-provider"
import Badge from "./ui/Badge"

// Mock data for featured books
const featuredBooks = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    author: "John Smith",
    price: 25.99,
    condition: "Good",
    location: "Campus Library",
    image: require("../assets/images/book-placeholder.png"),
    exchange: true,
    sale: true,
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 35.5,
    condition: "Like New",
    location: "Student Center",
    image: require("../assets/images/book-placeholder.png"),
    exchange: false,
    sale: true,
  },
  {
    id: 3,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 29.99,
    condition: "Acceptable",
    location: "Economics Building",
    image: require("../assets/images/book-placeholder.png"),
    exchange: true,
    sale: true,
  },
  {
    id: 4,
    title: "Organic Chemistry",
    author: "Paula Bruice",
    price: 40.0,
    condition: "Good",
    location: "Science Hall",
    image: require("../assets/images/book-placeholder.png"),
    exchange: false,
    sale: true,
  },
]

const FeaturedBooks = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((bookId) => bookId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  const renderBookItem = ({ item }) => (
    <View
      style={[
        styles.bookCard,
        { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
        style={styles.imageContainer}
      >
        <Image source={item.image} style={styles.bookImage} />
        <TouchableOpacity style={styles.wishlistButton} onPress={() => toggleWishlist(item.id)}>
          <Heart
            stroke={wishlist.includes(item.id) ? "#ef4444" : "#6b7280"}
            fill={wishlist.includes(item.id) ? "#ef4444" : "none"}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.bookInfo}>
        <TouchableOpacity onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}>
          <Text style={[styles.bookTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.bookAuthor, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>{item.author}</Text>

        <View style={styles.priceConditionRow}>
          <Text style={[styles.bookPrice, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            ${item.price.toFixed(2)}
          </Text>
          <Badge text={item.condition} variant="outline" />
        </View>

        <View style={styles.locationContainer}>
          <MapPin stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={12} height={12} />
          <Text style={[styles.locationText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>{item.location}</Text>
        </View>

        <TouchableOpacity
          style={[styles.viewDetailsButton, { borderColor: isDarkMode ? "#374151" : "#e5e7eb" }]}
          onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
        >
          <Text style={[styles.viewDetailsText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Featured Books</Text>
      <Text style={[styles.sectionSubtitle, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
        Check out these popular books available for exchange or purchase.
      </Text>

      <FlatList
        data={featuredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />

      <TouchableOpacity
        style={[styles.viewAllButton, { borderColor: isDarkMode ? "#374151" : "#e5e7eb" }]}
        onPress={() => navigation.navigate("Browse")}
      >
        <Text style={[styles.viewAllText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>View All Books</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  booksList: {
    paddingBottom: 20,
  },
  bookCard: {
    width: 200,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 15,
  },
  imageContainer: {
    position: "relative",
  },
  bookImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceConditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  viewAllButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

export default FeaturedBooks

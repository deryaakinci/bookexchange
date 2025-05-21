"use client"

import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Heart, MapPin } from "react-native-feather"
import type { Book } from "../services/api"
import Badge from "./ui/Badge"

interface BookCardProps {
  book: Book
  onPress: () => void
  onWishlistToggle?: () => void
  inWishlist?: boolean
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress, onWishlistToggle, inWishlist = false }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: book.images[0] || "/placeholder.svg?height=120&width=80" }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          by {book.author}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${book.price.toFixed(2)}</Text>
          <Badge text={book.condition} variant="outline" />
        </View>

        <View style={styles.locationContainer}>
          <MapPin stroke="#6b7280" width={12} height={12} />
          <Text style={styles.location}>{typeof book.location === "string" ? book.location : "Nearby"}</Text>
        </View>

        <View style={styles.badgesContainer}>
          {book.status === "available" && <Badge text="For Sale" variant="secondary" />}
          {book.exchange && <Badge text="For Exchange" variant="secondary" />}
        </View>
      </View>

      {onWishlistToggle && (
        <TouchableOpacity style={styles.wishlistButton} onPress={onWishlistToggle}>
          <Heart
            stroke={inWishlist ? "#ef4444" : "#6b7280"}
            fill={inWishlist ? "#ef4444" : "none"}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  wishlistButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
  },
})

export default BookCard

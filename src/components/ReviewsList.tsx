"use client"

import type React from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import StarRating from "./StarRating"

interface Review {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  isHelpful?: boolean
}

interface ReviewsListProps {
  reviews: Review[]
  bookId?: string
  bookTitle?: string
  sellerId?: string
  sellerName?: string
  onMarkHelpful?: (reviewId: string) => void
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  bookId,
  bookTitle,
  sellerId,
  sellerName,
  onMarkHelpful,
}) => {
  const navigation = useNavigation()

  const handleWriteReview = () => {
    navigation.navigate("Review", {
      bookId,
      bookTitle,
      sellerId,
      sellerName,
    })
  }

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.user.avatar || "/placeholder.svg?height=40&width=40" }} style={styles.avatar} />
        <View style={styles.reviewHeaderInfo}>
          <Text style={styles.reviewerName}>{item.user.name}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <StarRating rating={item.rating} readonly size={16} spacing={2} />
        <Text style={styles.reviewTitle}>{item.title}</Text>
      </View>

      <Text style={styles.reviewContent}>{item.content}</Text>

      <View style={styles.reviewFooter}>
        <TouchableOpacity
          style={[styles.helpfulButton, item.isHelpful && styles.helpfulButtonActive]}
          onPress={() => onMarkHelpful?.(item.id)}
          disabled={item.isHelpful}
        >
          <Text style={[styles.helpfulButtonText, item.isHelpful && styles.helpfulButtonTextActive]}>
            {item.isHelpful ? "Marked as Helpful" : "Mark as Helpful"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.helpfulCount}>
          {item.helpful} {item.helpful === 1 ? "person" : "people"} found this helpful
        </Text>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
      <Text style={styles.emptyStateText}>
        Be the first to review this book and help other students make informed decisions.
      </Text>
      {bookId && (
        <TouchableOpacity style={styles.writeReviewButton} onPress={handleWriteReview}>
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {bookId && (
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <TouchableOpacity style={styles.writeButton} onPress={handleWriteReview}>
            <Text style={styles.writeButtonText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  writeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  writeButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  reviewItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  ratingContainer: {
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  reviewContent: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helpfulButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  helpfulButtonActive: {
    backgroundColor: "#f3f9f7",
    borderColor: "#10b981",
  },
  helpfulButtonText: {
    fontSize: 12,
    color: "#6b7280",
  },
  helpfulButtonTextActive: {
    color: "#10b981",
  },
  helpfulCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  writeReviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  writeReviewButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
})

export default ReviewsList

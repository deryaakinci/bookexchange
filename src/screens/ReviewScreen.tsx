"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"
import StarRating from "../components/StarRating"

export default function ReviewScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { bookId, bookTitle, sellerId, sellerName } = route.params || {}

  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating")
      return
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a review title")
      return
    }

    if (!review.trim()) {
      Alert.alert("Error", "Please enter your review")
      return
    }

    try {
      setSubmitting(true)

      // In a real app, send the review to the API
      // await api.reviews.submitReview({
      //   bookId,
      //   sellerId,
      //   rating,
      //   title,
      //   content: review,
      // });

      // For demo purposes, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      Alert.alert("Review Submitted", "Thank you for your feedback!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error submitting review:", error)
      Alert.alert("Error", "Failed to submit your review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{bookTitle}</Text>
          <Text style={styles.sellerName}>Sold by {sellerName}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Your Rating</Text>
          <StarRating rating={rating} onRatingChange={setRating} size={36} spacing={8} />
          <Text style={styles.ratingDescription}>
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Review Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Summarize your experience"
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.textArea}
            value={review}
            onChangeText={setReview}
            placeholder="Share your experience with this book and seller"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{review.length}/1000</Text>
        </View>

        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Review Guidelines:</Text>
          <View style={styles.guidelineItem}>
            <Feather name="check" size={16} color="#10b981" style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>Focus on the book condition and seller service</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Feather name="check" size={16} color="#10b981" style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>Be specific and honest about your experience</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Feather name="x" size={16} color="#ef4444" style={styles.guidelineIcon} />
            <Text style={styles.guidelineText}>Don't include personal information or offensive language</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="outline" onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          Cancel
        </Button>
        <Button
          onPress={handleSubmit}
          style={styles.submitBtn}
          disabled={submitting || rating === 0 || !title.trim() || !review.trim()}
        >
          {submitting ? (
            <View style={styles.loadingBtnContent}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingBtnText}>Submitting...</Text>
            </View>
          ) : (
            "Submit Review"
          )}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  bookInfo: {
    marginBottom: 24,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: "#6b7280",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  ratingDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 120,
  },
  charCount: {
    position: "absolute",
    bottom: -18,
    right: 0,
    fontSize: 12,
    color: "#9ca3af",
  },
  guidelines: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  guidelineIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
  },
  submitBtn: {
    flex: 2,
    marginLeft: 8,
  },
  loadingBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
})

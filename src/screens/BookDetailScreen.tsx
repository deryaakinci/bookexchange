"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Heart, MapPin, Share2, ShoppingCart, Star, RefreshCw, Flag } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import Badge from "../components/ui/Badge"

// Mock book data
const book = {
  id: 1,
  title: "Introduction to Computer Science",
  author: "John Smith",
  price: 25.99,
  condition: "Good",
  location: "Campus Library",
  description:
    "This comprehensive introduction to computer science is perfect for beginners. The book covers fundamental concepts including algorithms, data structures, and programming paradigms. This is the third edition, published in 2021, and includes updated content on modern programming practices. There are some highlights and notes in chapters 3-5, but otherwise the book is in good condition with minimal wear.",
  category: "Computer Science",
  isbn: "978-1234567890",
  publisher: "Academic Press",
  publishedYear: 2021,
  pages: 450,
  exchange: true,
  sale: true,
  images: [
    require("../assets/images/book-placeholder.png"),
    require("../assets/images/book-placeholder.png"),
    require("../assets/images/book-placeholder.png"),
  ],
  seller: {
    id: 101,
    name: "Alex Johnson",
    avatar: require("../assets/images/avatar-placeholder.png"),
    rating: 4.8,
    joinedDate: "January 2022",
    responseRate: "98%",
    isOnline: true,
  },
  reviews: [
    {
      id: 201,
      user: {
        name: "Sarah Williams",
        avatar: require("../assets/images/avatar-placeholder.png"),
      },
      rating: 5,
      date: "March 15, 2023",
      comment: "The book was in excellent condition, just as described. Fast and easy transaction!",
    },
    {
      id: 202,
      user: {
        name: "Michael Brown",
        avatar: require("../assets/images/avatar-placeholder.png"),
      },
      rating: 4,
      date: "February 2, 2023",
      comment: "Good book, seller was responsive and helpful. Would buy from again.",
    },
  ],
}

const BookDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [selectedImage, setSelectedImage] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("description")

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to the API
      console.log("Sending message:", message)

      // Navigate to chat screen with this seller
      navigation.navigate("Chat", {
        userId: book.seller.id,
        userName: book.seller.name,
        bookId: book.id,
        bookTitle: book.title,
      })

      setMessage("")
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Book Images */}
      <View style={styles.imageSection}>
        <Image source={book.images[selectedImage]} style={styles.mainImage} />

        <FlatList
          data={book.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.thumbnailContainer, selectedImage === index && styles.selectedThumbnail]}
              onPress={() => setSelectedImage(index)}
            >
              <Image source={item} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Book Details */}
      <View style={styles.detailsSection}>
        <Text style={[styles.bookTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.title}</Text>
        <Text style={[styles.bookAuthor, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>by {book.author}</Text>

        <View style={styles.priceWishlistRow}>
          <View>
            <Text style={[styles.bookPrice, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              ${book.price.toFixed(2)}
            </Text>
            <View style={styles.badgesContainer}>
              <Badge text={book.condition} variant="outline" />
              {book.exchange && <Badge text="Available for Exchange" variant="secondary" />}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.wishlistButton,
              inWishlist && styles.wishlistButtonActive,
              { borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
            ]}
            onPress={toggleWishlist}
          >
            <Heart
              stroke={inWishlist ? "#ef4444" : isDarkMode ? "#ffffff" : "#111827"}
              fill={inWishlist ? "#ef4444" : "none"}
              width={20}
              height={20}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.locationContainer}>
          <MapPin stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={16} height={16} />
          <Text style={[styles.locationText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>{book.location}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <ShoppingCart stroke="#ffffff" width={16} height={16} />
            <Text style={styles.primaryButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: isDarkMode ? "#374151" : "#e5e7eb" }]}>
            <RefreshCw stroke={isDarkMode ? "#ffffff" : "#111827"} width={16} height={16} />
            <Text style={[styles.secondaryButtonText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              Request Exchange
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Share2 stroke={isDarkMode ? "#ffffff" : "#111827"} width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* Seller Info */}
        <View
          style={[
            styles.sellerCard,
            { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
        >
          <View style={styles.sellerInfo}>
            <Image source={book.seller.avatar} style={styles.sellerAvatar} />
            <View>
              <Text style={[styles.sellerName, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.seller.name}</Text>
              <View style={styles.ratingContainer}>
                <Star fill="#fbbf24" stroke="#fbbf24" width={16} height={16} />
                <Text style={styles.ratingText}>{book.seller.rating}</Text>
                <Text style={[styles.joinedText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
                  • Joined {book.seller.joinedDate}
                </Text>
              </View>
            </View>
          </View>

          <TextInput
            style={[
              styles.messageInput,
              {
                backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                color: isDarkMode ? "#ffffff" : "#111827",
                borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
              },
            ]}
            placeholder="Send a message to the seller..."
            placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.disabledButton]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.reportButton} onPress={() => console.log("Report listing")}>
          <Flag stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={16} height={16} />
          <Text style={[styles.reportButtonText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>Report Listing</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsHeader}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "description" && styles.activeTabButton,
              { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
            ]}
            onPress={() => setActiveTab("description")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "description" && styles.activeTabButtonText,
                {
                  color: isDarkMode
                    ? activeTab === "description"
                      ? "#10b981"
                      : "#d1d5db"
                    : activeTab === "description"
                      ? "#10b981"
                      : "#6b7280",
                },
              ]}
            >
              Description
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "details" && styles.activeTabButton,
              { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
            ]}
            onPress={() => setActiveTab("details")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "details" && styles.activeTabButtonText,
                {
                  color: isDarkMode
                    ? activeTab === "details"
                      ? "#10b981"
                      : "#d1d5db"
                    : activeTab === "details"
                      ? "#10b981"
                      : "#6b7280",
                },
              ]}
            >
              Book Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "reviews" && styles.activeTabButton,
              { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
            ]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "reviews" && styles.activeTabButtonText,
                {
                  color: isDarkMode
                    ? activeTab === "reviews"
                      ? "#10b981"
                      : "#d1d5db"
                    : activeTab === "reviews"
                      ? "#10b981"
                      : "#6b7280",
                },
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === "description" && (
            <Text style={[styles.descriptionText, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
              {book.description}
            </Text>
          )}

          {activeTab === "details" && (
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Title</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.title}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Author</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.author}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>ISBN</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.isbn}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Publisher</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                  {book.publisher}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Published Year</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                  {book.publishedYear}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Pages</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.pages}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Category</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{book.category}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Condition</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                  {book.condition}
                </Text>
              </View>
            </View>
          )}

          {activeTab === "reviews" && (
            <View style={styles.reviewsContainer}>
              {book.reviews.map((review) => (
                <View
                  key={review.id}
                  style={[styles.reviewItem, { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" }]}
                >
                  <View style={styles.reviewHeader}>
                    <Image source={review.user.avatar} style={styles.reviewerAvatar} />
                    <View>
                      <Text style={[styles.reviewerName, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                        {review.user.name}
                      </Text>
                      <View style={styles.reviewRating}>
                        <View style={styles.starsContainer}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              fill={i < review.rating ? "#fbbf24" : isDarkMode ? "#374151" : "#e5e7eb"}
                              stroke={i < review.rating ? "#fbbf24" : isDarkMode ? "#374151" : "#e5e7eb"}
                              width={16}
                              height={16}
                            />
                          ))}
                        </View>
                        <Text style={[styles.reviewDate, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>
                          {review.date}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    padding: 20,
  },
  mainImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
  },
  thumbnailList: {
    marginTop: 10,
  },
  thumbnailContainer: {
    width: 60,
    height: 80,
    marginRight: 10,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedThumbnail: {
    borderColor: "#10b981",
    borderWidth: 2,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsSection: {
    padding: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    marginBottom: 16,
  },
  priceWishlistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookPrice: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wishlistButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  wishlistButtonActive: {
    borderColor: "#ef4444",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  iconButton: {
    padding: 12,
    borderRadius: 6,
  },
  sellerCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "#fbbf24",
    fontWeight: "600",
  },
  joinedText: {
    marginLeft: 8,
    fontSize: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  reportButtonText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tabsContainer: {
    marginTop: 10,
  },
  tabsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  activeTabButton: {
    borderBottomColor: "#10b981",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: "#10b981",
    fontWeight: "600",
  },
  tabContent: {
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    width: "47%",
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  reviewsContainer: {
    gap: 16,
  },
  reviewItem: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewDate: {
    marginLeft: 8,
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default BookDetailScreen

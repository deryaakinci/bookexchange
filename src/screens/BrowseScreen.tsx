"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, MapPin, Search, SlidersHorizontal, X } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import Badge from "../components/ui/Badge"
import FilterModal from "../components/FilterModal"
import { mockApi, type Book } from "../services/api"

const BrowseScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    categories: [] as string[],
    conditions: [] as string[],
    forSale: true,
    forExchange: true,
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      // In a real app, use the actual API
      // const response = await booksApi.getBooks({
      //   search: searchTerm,
      //   category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
      //   condition: filters.conditions.length > 0 ? filters.conditions.join(',') : undefined,
      //   minPrice: filters.priceRange[0],
      //   maxPrice: filters.priceRange[1],
      //   forSale: filters.forSale,
      //   forExchange: filters.forExchange,
      // });
      // setBooks(response.books);

      // For demo purposes, use mock API
      const response = mockApi.getBooks({
        search: searchTerm,
        category: filters.categories.length > 0 ? filters.categories[0] : undefined,
        condition: filters.conditions.length > 0 ? filters.conditions[0] : undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        forSale: filters.forSale,
        forExchange: filters.forExchange,
      })
      setBooks(response.books)
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchBooks()
  }

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((bookId) => bookId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  const applyFilters = (newFilters) => {
    setFilters(newFilters)
    setShowFilters(false)
    fetchBooks()
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      categories: [],
      conditions: [],
      forSale: true,
      forExchange: true,
    })
    setSearchTerm("")
    fetchBooks()
  }

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bookCard,
        { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
      ]}
      onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.bookImage}
          defaultSource={require("../assets/images/book-placeholder.png")}
        />
        <TouchableOpacity style={styles.wishlistButton} onPress={() => toggleWishlist(item.id)}>
          <Heart
            stroke={wishlist.includes(item.id) ? "#ef4444" : "#6b7280"}
            fill={wishlist.includes(item.id) ? "#ef4444" : "none"}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]} numberOfLines={1}>
          {item.title}
        </Text>
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

        <View style={styles.badgesContainer}>
          {item.sale && <Badge text="For Sale" variant="secondary" />}
          {item.exchange && <Badge text="For Exchange" variant="secondary" />}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Search stroke={isDarkMode ? "#6b7280" : "#9ca3af"} width={48} height={48} />
      <Text style={[styles.emptyTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>No books found</Text>
      <Text style={[styles.emptySubtitle, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
        Try adjusting your search or filter criteria
      </Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Browse Books</Text>

        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Search stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={16} height={16} style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: isDarkMode ? "#ffffff" : "#111827",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
              placeholder="Search by title, author, or category..."
              placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={fetchBooks}
              returnKeyType="search"
            />
            {searchTerm ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchTerm("")
                  fetchBooks()
                }}
              >
                <X stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={16} height={16} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && { backgroundColor: "#10b981" },
              { borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
            ]}
            onPress={() => setShowFilters(true)}
          >
            <SlidersHorizontal
              stroke={showFilters ? "#ffffff" : isDarkMode ? "#ffffff" : "#111827"}
              width={16}
              height={16}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10b981"]} />}
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 36,
  },
  clearButton: {
    position: "absolute",
    right: 12,
    zIndex: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  booksList: {
    padding: 16,
    paddingTop: 0,
  },
  bookCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 150,
  },
  bookImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 6,
  },
  bookInfo: {
    flex: 1,
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
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  emptyContainer: {
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
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
})

export default BrowseScreen

"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Animated,
  Keyboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { mockApi, type Book } from "../services/api"
import BookCard from "../components/BookCard"

// Mock search history and suggestions
const RECENT_SEARCHES = ["calculus", "computer science", "organic chemistry", "psychology", "economics"]

const POPULAR_SEARCHES = ["data structures", "physics", "biology", "statistics", "history"]

const CATEGORIES = [
  { id: "cs", name: "Computer Science", icon: "code" },
  { id: "math", name: "Mathematics", icon: "plus" },
  { id: "science", name: "Science", icon: "thermometer" },
  { id: "business", name: "Business", icon: "briefcase" },
  { id: "arts", name: "Arts & Humanities", icon: "book-open" },
  { id: "engineering", name: "Engineering", icon: "tool" },
]

const SORT_OPTIONS = [
  { id: "relevance", name: "Relevance" },
  { id: "price_low", name: "Price: Low to High" },
  { id: "price_high", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "rating", name: "Highest Rated" },
]

export default function EnhancedSearchScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0])
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [conditions, setConditions] = useState<string[]>([])
  const [forSale, setForSale] = useState(true)
  const [forExchange, setForExchange] = useState(true)

  const searchInputRef = useRef<TextInput>(null)
  const sortOptionsHeight = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (showSortOptions) {
      Animated.timing(sortOptionsHeight, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(sortOptionsHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }, [showSortOptions])

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim() && !selectedCategory) return

    try {
      setLoading(true)
      setShowSuggestions(false)
      Keyboard.dismiss()

      // Add to recent searches if not already there
      if (query.trim() && !recentSearches.includes(query.trim())) {
        setRecentSearches([query.trim(), ...recentSearches.slice(0, 4)])
      }

      // In a real app, use the actual API
      // const response = await api.books.searchBooks({
      //   query,
      //   category: selectedCategory,
      //   minPrice: priceRange[0],
      //   maxPrice: priceRange[1],
      //   conditions,
      //   forSale,
      //   forExchange,
      //   sort: selectedSort.id,
      // });

      // For demo purposes, use mock API
      const response = mockApi.getBooks({
        search: query,
        category: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        forSale,
        forExchange,
      })

      // Sort results based on selected option
      const sortedResults = [...response.books]
      switch (selectedSort.id) {
        case "price_low":
          sortedResults.sort((a, b) => a.price - b.price)
          break
        case "price_high":
          sortedResults.sort((a, b) => b.price - a.price)
          break
        case "newest":
          sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "rating":
          sortedResults.sort((a, b) => (b.seller.rating || 0) - (a.seller.rating || 0))
          break
        default:
          // Relevance is default
          break
      }

      setSearchResults(sortedResults)
    } catch (error) {
      console.error("Error searching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    handleSearch("")
  }

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption)
    setShowSortOptions(false)
    handleSearch()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedCategory(null)
    setShowSuggestions(false)
  }

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search)
    handleSearch(search)
  }

  const renderSearchSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {recentSearches.length > 0 && (
        <View style={styles.suggestionSection}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => setRecentSearches([])}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.suggestionItems}>
            {recentSearches.map((search) => (
              <TouchableOpacity
                key={search}
                style={styles.suggestionItem}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Feather name="clock" size={16} color="#6b7280" style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Popular Searches</Text>
        <View style={styles.suggestionItems}>
          {POPULAR_SEARCHES.map((search) => (
            <TouchableOpacity
              key={search}
              style={styles.suggestionItem}
              onPress={() => handleRecentSearchPress(search)}
            >
              <Feather name="trending-up" size={16} color="#6b7280" style={styles.suggestionIcon} />
              <Text style={styles.suggestionText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )

  const renderCategories = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryItem, selectedCategory === category.id && styles.categoryItemSelected]}
          onPress={() => handleCategorySelect(category.id)}
        >
          <View style={styles.categoryIconContainer}>
            <Feather name={category.icon} size={20} color={selectedCategory === category.id ? "#fff" : "#6b7280"} />
          </View>
          <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextSelected]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderSortOptions = () => (
    <Animated.View style={[styles.sortOptionsContainer, { maxHeight: sortOptionsHeight }]}>
      {SORT_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[styles.sortOption, selectedSort.id === option.id && styles.sortOptionSelected]}
          onPress={() => handleSortSelect(option)}
        >
          <Text style={[styles.sortOptionText, selectedSort.id === option.id && styles.sortOptionTextSelected]}>
            {option.name}
          </Text>
          {selectedSort.id === option.id && <Feather name="check" size={18} color="#10b981" />}
        </TouchableOpacity>
      ))}
    </Animated.View>
  )

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
        </Text>

        <View style={styles.sortFilterContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              setShowSortOptions(!showSortOptions)
              setShowFilters(false)
            }}
          >
            <Feather name="arrow-down" size={16} color="#6b7280" />
            <Text style={styles.sortButtonText}>{selectedSort.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => {
              setShowFilters(!showFilters)
              setShowSortOptions(false)
            }}
          >
            <Feather name="sliders" size={16} color={showFilters ? "#10b981" : "#6b7280"} />
            <Text style={[styles.filterButtonText, showFilters && styles.filterButtonTextActive]}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSortOptions && renderSortOptions()}

      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => navigation.navigate("BookDetail", { bookId: item.id })} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.resultsListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyResults}>
              <Feather name="search" size={48} color="#d1d5db" />
              <Text style={styles.emptyResultsTitle}>No results found</Text>
              <Text style={styles.emptyResultsText}>
                Try adjusting your search or filters to find what you're looking for.
              </Text>
            </View>
          )
        }
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for books, authors, or categories..."
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchQuery ? (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Feather name="x" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {renderCategories()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : showSuggestions && !searchResults.length ? (
        renderSearchSuggestions()
      ) : (
        renderSearchResults()
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#6b7280",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryItemSelected: {
    opacity: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIconContainerSelected: {
    backgroundColor: "#10b981",
  },
  categoryText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: "#10b981",
    fontWeight: "600",
  },
  suggestionsContainer: {
    flex: 1,
    padding: 16,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  clearText: {
    fontSize: 14,
    color: "#6b7280",
  },
  suggestionItems: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: "#4b5563",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultsCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  sortFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  sortButtonText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  filterButtonActive: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: "#10b981",
  },
  sortOptionsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    overflow: "hidden",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortOptionSelected: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#4b5563",
  },
  sortOptionTextSelected: {
    color: "#10b981",
    fontWeight: "600",
  },
  resultsListContent: {
    padding: 16,
  },
  emptyResults: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
  },
  emptyResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyResultsText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
})

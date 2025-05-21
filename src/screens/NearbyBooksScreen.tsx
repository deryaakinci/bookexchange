"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { Feather } from "@expo/vector-icons"
import { api } from "../services/api"
import type { Book } from "../services/api"
import { Button } from "../components/ui/Button"

const { width } = Dimensions.get("window")

interface BookWithDistance extends Book {
  distance: number
}

export default function NearbyBooksScreen() {
  const navigation = useNavigation()
  const mapRef = useRef<MapView>(null)
  const [books, setBooks] = useState<BookWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookWithDistance | null>(null)
  const [distanceFilter, setDistanceFilter] = useState<number>(10) // 10 miles

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    setLocationPermission(status === "granted")

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({})
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    } else {
      Alert.alert("Location Permission Required", "This feature requires location permission to find books near you.", [
        { text: "OK" },
      ])
    }
  }

  const fetchNearbyBooks = async () => {
    if (!userLocation) return

    try {
      const data = await api.books.getNearbyBooks(userLocation.latitude, userLocation.longitude, distanceFilter)
      setBooks(data)
    } catch (error) {
      console.error("Error fetching nearby books:", error)
      Alert.alert("Error", "Failed to load nearby books. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBooks()
    }
  }, [userLocation, distanceFilter])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNearbyBooks()
  }

  const handleMarkerPress = (book: BookWithDistance) => {
    setSelectedBook(book)

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: book.location.latitude,
          longitude: book.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      )
    }
  }

  const handleBookPress = (bookId: string) => {
    navigation.navigate("BookDetail" as never, { id: bookId } as never)
  }

  const renderBookItem = ({ item }: { item: BookWithDistance }) => (
    <TouchableOpacity style={styles.bookCard} onPress={() => handleBookPress(item.id)}>
      <Image source={{ uri: item.images[0] || "/placeholder.svg?height=120&width=80" }} style={styles.bookImage} />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          by {item.author}
        </Text>
        <Text style={styles.bookPrice}>${item.price.toFixed(2)}</Text>

        <View style={styles.bookMeta}>
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>

          <Text style={styles.distanceText}>{item.distance.toFixed(1)} miles away</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderDistanceFilters = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Distance:</Text>
      {[5, 10, 25, 50].map((distance) => (
        <TouchableOpacity
          key={distance}
          style={[styles.filterButton, distanceFilter === distance && styles.activeFilterButton]}
          onPress={() => setDistanceFilter(distance)}
        >
          <Text style={[styles.filterButtonText, distanceFilter === distance && styles.activeFilterButtonText]}>
            {distance} mi
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {userLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
        >
          {books.map((book) => (
            <Marker
              key={book.id}
              coordinate={{
                latitude: book.location.latitude,
                longitude: book.location.longitude,
              }}
              title={book.title}
              description={`$${book.price.toFixed(2)} - ${book.distance.toFixed(1)} miles away`}
              onPress={() => handleMarkerPress(book)}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.locationPermissionContainer}>
          <Feather name="map-pin" size={64} color="#ccc" />
          <Text style={styles.locationPermissionTitle}>Location Access Required</Text>
          <Text style={styles.locationPermissionText}>We need access to your location to show books near you.</Text>
          <Button onPress={requestLocationPermission} style={styles.locationPermissionButton}>
            Enable Location
          </Button>
        </View>
      )}

      {selectedBook && (
        <View style={styles.selectedBookContainer}>
          <TouchableOpacity style={styles.selectedBookCard} onPress={() => handleBookPress(selectedBook.id)}>
            <Image
              source={{ uri: selectedBook.images[0] || "/placeholder.svg?height=80&width=60" }}
              style={styles.selectedBookImage}
            />

            <View style={styles.selectedBookInfo}>
              <Text style={styles.selectedBookTitle} numberOfLines={1}>
                {selectedBook.title}
              </Text>
              <Text style={styles.selectedBookAuthor} numberOfLines={1}>
                by {selectedBook.author}
              </Text>
              <Text style={styles.selectedBookPrice}>${selectedBook.price.toFixed(2)}</Text>
              <Text style={styles.selectedBookDistance}>{selectedBook.distance.toFixed(1)} miles away</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedBook(null)}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Books</Text>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "map" && styles.activeViewToggleButton]}
            onPress={() => setViewMode("map")}
          >
            <Feather name="map" size={18} color={viewMode === "map" ? "#fff" : "#666"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "list" && styles.activeViewToggleButton]}
            onPress={() => setViewMode("list")}
          >
            <Feather name="list" size={18} color={viewMode === "list" ? "#fff" : "#666"} />
          </TouchableOpacity>
        </View>
      </View>

      {renderDistanceFilters()}

      {viewMode === "map" ? (
        renderMapView()
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Feather name="book" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No books nearby</Text>
                <Text style={styles.emptyStateText}>
                  There are no books available within {distanceFilter} miles of your location. Try increasing the
                  distance or check back later.
                </Text>
              </View>
            ) : null
          }
        />
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeViewToggleButton: {
    backgroundColor: "#2c974b",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#e6f7ee",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#666",
  },
  activeFilterButtonText: {
    color: "#2c974b",
    fontWeight: "500",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedBookContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  selectedBookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedBookImage: {
    width: 60,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  selectedBookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  selectedBookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedBookAuthor: {
    fontSize: 14,
    color: "#666",
  },
  selectedBookPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c974b",
  },
  selectedBookDistance: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
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
  bookMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conditionBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionText: {
    fontSize: 12,
    color: "#666",
  },
  distanceText: {
    fontSize: 12,
    color: "#666",
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
  locationPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  locationPermissionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  locationPermissionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  locationPermissionButton: {
    width: 200,
  },
})

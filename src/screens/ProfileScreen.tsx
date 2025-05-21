"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Edit, MapPin, Star, Eye, Pencil } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import { mockApi, type Book } from "../services/api"
import Badge from "../components/ui/Badge"

// Mock user data
const user = {
  id: 999,
  name: "John Doe",
  email: "john.doe@university.edu",
  avatar: "https://via.placeholder.com/200x200",
  bio: "Computer Science student at University. I'm interested in programming, algorithms, and data structures. Looking to exchange textbooks with other students.",
  location: "University Campus, Building A",
  joinedDate: "January 2023",
  rating: 4.7,
  reviewCount: 12,
  phone: "555-123-4567",
  university: "State University",
  major: "Computer Science",
  year: "Junior",
}

const ProfileScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState(user)
  const [listedBooks, setListedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeBookTab, setActiveBookTab] = useState("active")

  useEffect(() => {
    fetchUserData()
    fetchListedBooks()
  }, [])

  const fetchUserData = async () => {
    try {
      // In a real app, use the actual API
      // const userData = await userApi.getProfile();
      // setProfileData(userData);

      // For demo purposes, use mock data
      setProfileData(user)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchListedBooks = async () => {
    try {
      setLoading(true)
      // In a real app, use the actual API
      // const books = await userApi.getListedBooks(activeBookTab);
      // setListedBooks(books);

      // For demo purposes, use mock data
      setListedBooks(mockApi.books)
    } catch (error) {
      console.error("Error fetching listed books:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchUserData()
    fetchListedBooks()
  }

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profileData.avatar }}
            style={styles.avatar}
            defaultSource={require("../assets/images/avatar-placeholder.png")}
          />
          {editMode && (
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit stroke="#ffffff" width={16} height={16} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{profileData.name}</Text>
          <View style={styles.ratingContainer}>
            <Star fill="#fbbf24" stroke="#fbbf24" width={16} height={16} />
            <Text style={styles.ratingText}>{profileData.rating}</Text>
            <Text style={[styles.reviewCount, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>
              ({profileData.reviewCount} reviews)
            </Text>
          </View>
          <Text style={[styles.joinedDate, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>
            Member since {profileData.joinedDate}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin stroke={isDarkMode ? "#9ca3af" : "#6b7280"} width={14} height={14} />
            <Text style={[styles.locationText, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>
              {profileData.location}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: isDarkMode ? "#374151" : "#e5e7eb" }]} />

      <View style={styles.profileDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Email</Text>
          <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{profileData.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Phone</Text>
          <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{profileData.phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>University</Text>
          <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            {profileData.university}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Major</Text>
          <Text style={[styles.detailValue, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{profileData.major}</Text>
        </View>

        <View style={styles.bioContainer}>
          <Text style={[styles.detailLabel, { color: isDarkMode ? "#9ca3af" : "#6b7280" }]}>Bio</Text>
          <Text style={[styles.bioText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>{profileData.bio}</Text>
        </View>
      </View>
    </View>
  )

  const renderBooksTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.booksHeader}>
        <Text style={[styles.booksTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>My Listed Books</Text>
        <TouchableOpacity
          style={[styles.listBookButton, { backgroundColor: "#10b981" }]}
          onPress={() => navigation.navigate("Upload")}
        >
          <Text style={styles.listBookButtonText}>List New Book</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.booksTabs}>
        <TouchableOpacity
          style={[
            styles.booksTabButton,
            activeBookTab === "active" && styles.activeBookTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveBookTab("active")}
        >
          <Text
            style={[
              styles.booksTabText,
              activeBookTab === "active" && styles.activeBookTabText,
              {
                color: isDarkMode
                  ? activeBookTab === "active"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeBookTab === "active"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.booksTabButton,
            activeBookTab === "pending" && styles.activeBookTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveBookTab("pending")}
        >
          <Text
            style={[
              styles.booksTabText,
              activeBookTab === "pending" && styles.activeBookTabText,
              {
                color: isDarkMode
                  ? activeBookTab === "pending"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeBookTab === "pending"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.booksTabButton,
            activeBookTab === "sold" && styles.activeBookTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveBookTab("sold")}
        >
          <Text
            style={[
              styles.booksTabText,
              activeBookTab === "sold" && styles.activeBookTabText,
              {
                color: isDarkMode
                  ? activeBookTab === "sold"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeBookTab === "sold"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            Sold/Exchanged
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : listedBooks.length > 0 ? (
        <View style={styles.booksList}>
          {listedBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={[
                styles.bookCard,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
              onPress={() => navigation.navigate("BookDetail", { bookId: book.id })}
            >
              <Image
                source={{ uri: book.images[0] }}
                style={styles.bookImage}
                defaultSource={require("../assets/images/book-placeholder.png")}
              />
              <View style={styles.bookInfo}>
                <Text style={[styles.bookTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>{book.author}</Text>
                <View style={styles.bookDetails}>
                  <Badge text={book.condition} variant="outline" />
                  <Text style={[styles.bookPrice, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                    ${book.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity
                    style={[styles.bookActionButton, { borderColor: isDarkMode ? "#374151" : "#e5e7eb" }]}
                  >
                    <Text style={[styles.bookActionText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyBooksContainer}>
          <Text style={[styles.emptyBooksTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            No {activeBookTab} listings
          </Text>
          <Text style={[styles.emptyBooksSubtitle, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
            {activeBookTab === "active"
              ? "You don't have any active book listings. List a book to start selling or exchanging."
              : activeBookTab === "pending"
                ? "You don't have any books pending approval or exchange."
                : "You haven't sold or exchanged any books yet."}
          </Text>
          {activeBookTab === "active" && (
            <TouchableOpacity
              style={[styles.listBookButton, { backgroundColor: "#10b981", marginTop: 16 }]}
              onPress={() => navigation.navigate("Upload")}
            >
              <Text style={styles.listBookButtonText}>List a Book</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={[styles.settingsSectionTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
          Notification Preferences
        </Text>

        <View style={styles.settingsGroup}>
          <Text style={[styles.settingsGroupTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            Email Notifications
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>New messages</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                Exchange requests
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                Book sold or purchased
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>
        </View>

        <View style={styles.settingsGroup}>
          <Text style={[styles.settingsGroupTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            Push Notifications
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>New messages</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                Exchange requests
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: isDarkMode ? "#374151" : "#e5e7eb" }]} />

      <View style={styles.settingsSection}>
        <Text style={[styles.settingsSectionTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
          Privacy Settings
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              Show email to other users
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#10b981" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#3e3e3e"
            value={false}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              Show phone number to other users
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#10b981" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#3e3e3e"
            value={false}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Text style={[styles.settingLabel, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              Allow location sharing for nearby books
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#10b981" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#3e3e3e"
            value={true}
          />
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: isDarkMode ? "#374151" : "#e5e7eb" }]} />

      <View style={styles.dangerZone}>
        <Text style={[styles.dangerZoneTitle, { color: isDarkMode ? "#f87171" : "#ef4444" }]}>Danger Zone</Text>
        <Text style={[styles.dangerZoneDescription, { color: isDarkMode ? "#fca5a5" : "#f87171" }]}>
          Once you delete your account, there is no going back. Please be certain.
        </Text>
        <TouchableOpacity style={[styles.deleteAccountButton, { backgroundColor: isDarkMode ? "#7f1d1d" : "#fee2e2" }]}>
          <Text style={[styles.deleteAccountButtonText, { color: isDarkMode ? "#fca5a5" : "#ef4444" }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? "#ffffff" : "#111827" }]}>My Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
          {editMode ? (
            <Eye stroke={isDarkMode ? "#ffffff" : "#111827"} width={20} height={20} />
          ) : (
            <Pencil stroke={isDarkMode ? "#ffffff" : "#111827"} width={20} height={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "profile" && styles.activeTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveTab("profile")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "profile" && styles.activeTabText,
              {
                color: isDarkMode
                  ? activeTab === "profile"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeTab === "profile"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "books" && styles.activeTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveTab("books")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "books" && styles.activeTabText,
              {
                color: isDarkMode
                  ? activeTab === "books"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeTab === "books"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            My Books
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "settings" && styles.activeTab,
            { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
          onPress={() => setActiveTab("settings")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "settings" && styles.activeTabText,
              {
                color: isDarkMode
                  ? activeTab === "settings"
                    ? "#10b981"
                    : "#d1d5db"
                  : activeTab === "settings"
                    ? "#10b981"
                    : "#6b7280",
              },
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10b981"]} />}
      >
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "books" && renderBooksTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: "#10b981",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10b981",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: "#fbbf24",
    fontWeight: "600",
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 12,
  },
  joinedDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  profileDetails: {
    gap: 16,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  bioContainer: {
    marginTop: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  booksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  booksTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listBookButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  listBookButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  booksTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  booksTabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  activeBookTab: {
    borderBottomColor: "#10b981",
  },
  booksTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeBookTabText: {
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  booksList: {
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: "cover",
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
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
  bookDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  bookActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  bookActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  bookActionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyBooksContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyBooksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyBooksSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingsGroup: {
    marginBottom: 16,
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
  },
  dangerZone: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dangerZoneDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  deleteAccountButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteAccountButtonText: {
    fontWeight: "600",
  },
})

export default ProfileScreen

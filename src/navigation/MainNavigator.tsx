import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Feather } from "@expo/vector-icons"

// Import screens
import HomeScreen from "../screens/HomeScreen"
import BrowseScreen from "../screens/BrowseScreen"
import BookDetailScreen from "../screens/BookDetailScreen"
import MessagesScreen from "../screens/MessagesScreen"
import ChatScreen from "../screens/ChatScreen"
import ProfileScreen from "../screens/ProfileScreen"
import UploadScreen from "../screens/UploadScreen"
import WishlistScreen from "../screens/WishlistScreen"
import CartScreen from "../screens/CartScreen"
import NearbyBooksScreen from "../screens/NearbyBooksScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

const BrowseStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BrowseScreen" component={BrowseScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

const UploadStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UploadScreen" component={UploadScreen} />
  </Stack.Navigator>
)

const WishlistStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartScreen" component={CartScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    <Stack.Screen name="Checkout" component={CartScreen} /> // Replace with actual Checkout screen when available
  </Stack.Navigator>
)

const NearbyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NearbyBooksScreen" component={NearbyBooksScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
  </Stack.Navigator>
)

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = "home"
          } else if (route.name === "Browse") {
            iconName = "search"
          } else if (route.name === "Messages") {
            iconName = "message-circle"
          } else if (route.name === "Profile") {
            iconName = "user"
          } else if (route.name === "Upload") {
            iconName = "plus-circle"
          } else if (route.name === "Wishlist") {
            iconName = "heart"
          } else if (route.name === "Cart") {
            iconName = "shopping-cart"
          } else if (route.name === "Nearby") {
            iconName = "map-pin"
          }

          return <Feather name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#2c974b",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Browse" component={BrowseStack} />
      <Tab.Screen name="Nearby" component={NearbyStack} />
      <Tab.Screen name="Wishlist" component={WishlistStack} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Upload" component={UploadStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  )
}

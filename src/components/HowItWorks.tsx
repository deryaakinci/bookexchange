"use client"
import { View, Text, StyleSheet } from "react-native"
import { BookOpen, MessageCircle, RefreshCw, Upload } from "react-native-feather"
import { useTheme } from "./theme-provider"

const HowItWorks = () => {
  const { isDarkMode } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }]}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>How It Works</Text>
      <Text style={[styles.sectionSubtitle, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
        Follow these simple steps to start exchanging and buying books.
      </Text>

      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#065f46" : "#d1fae5" }]}>
            <Upload stroke={isDarkMode ? "#34d399" : "#059669"} width={32} height={32} />
          </View>
          <Text style={[styles.stepTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>List Your Books</Text>
          <Text style={[styles.stepDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
            Upload photos and details of the books you want to sell or exchange.
          </Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#065f46" : "#d1fae5" }]}>
            <BookOpen stroke={isDarkMode ? "#34d399" : "#059669"} width={32} height={32} />
          </View>
          <Text style={[styles.stepTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Browse Books</Text>
          <Text style={[styles.stepDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
            Search for books by title, author, course, or location on campus.
          </Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#065f46" : "#d1fae5" }]}>
            <MessageCircle stroke={isDarkMode ? "#34d399" : "#059669"} width={32} height={32} />
          </View>
          <Text style={[styles.stepTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Connect</Text>
          <Text style={[styles.stepDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
            Message the seller to arrange a meeting or discuss details.
          </Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#065f46" : "#d1fae5" }]}>
            <RefreshCw stroke={isDarkMode ? "#34d399" : "#059669"} width={32} height={32} />
          </View>
          <Text style={[styles.stepTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Exchange or Buy</Text>
          <Text style={[styles.stepDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
            Meet up to exchange books or complete the purchase securely through our platform.
          </Text>
        </View>
      </View>
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
  stepsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  step: {
    width: "48%",
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    textAlign: "center",
  },
})

export default HowItWorks

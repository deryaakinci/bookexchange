"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { MapPin, MessageCircle, Star } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import FeaturedBooks from "../components/FeaturedBooks"
import HowItWorks from "../components/HowItWorks"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: isDarkMode ? "#064e3b" : "#ecfdf5" }]}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
              Exchange & Buy Books from Fellow Students
            </Text>
            <Text style={[styles.heroSubtitle, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
              Save money and reduce waste by trading your used textbooks with other students on campus.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Browse")}>
                <Text style={styles.primaryButtonText}>Browse Books</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: isDarkMode ? "#ffffff" : "#10b981" }]}
                onPress={() => navigation.navigate("Upload")}
              >
                <Text style={[styles.secondaryButtonText, { color: isDarkMode ? "#ffffff" : "#10b981" }]}>
                  List Your Books
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image source={require("../assets/images/hero-image.png")} style={styles.heroImage} resizeMode="cover" />
        </View>

        {/* Features Section */}
        <View style={[styles.featuresSection, { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
            Why Choose Book X Change?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
            Our platform makes exchanging and buying books simple, secure, and sustainable.
          </Text>

          <View style={styles.featuresContainer}>
            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
            >
              <MapPin stroke="#10b981" width={48} height={48} />
              <Text style={[styles.featureTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                Find Nearby Books
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
                Discover books available near your location for easy pickup.
              </Text>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
            >
              <MessageCircle stroke="#10b981" width={48} height={48} />
              <Text style={[styles.featureTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Direct Messaging</Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
                Chat with sellers and arrange exchanges securely on the platform.
              </Text>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
            >
              <Star stroke="#10b981" width={48} height={48} />
              <Text style={[styles.featureTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>
                Reviews & Ratings
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? "#d1d5db" : "#4b5563" }]}>
                Build trust with verified reviews from other students.
              </Text>
            </View>
          </View>
        </View>

        {/* Featured Books Section */}
        <FeaturedBooks />

        {/* How It Works Section */}
        <HowItWorks />

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Start Exchanging?</Text>
          <Text style={styles.ctaSubtitle}>Join thousands of students saving money on textbooks every semester.</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.ctaButtonText}>Sign Up Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaSecondaryButton} onPress={() => navigation.navigate("HowItWorks")}>
              <Text style={styles.ctaSecondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  secondaryButtonText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 16,
  },
  heroImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
  },
  featuresSection: {
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
  featuresContainer: {
    gap: 20,
  },
  featureCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  ctaSection: {
    backgroundColor: "#10b981",
    padding: 30,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  ctaButtonText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 16,
  },
  ctaSecondaryButton: {
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  ctaSecondaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default HomeScreen

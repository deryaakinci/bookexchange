"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"
import LottieView from "lottie-react-native"

export default function OrderConfirmationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { orderId, total, shippingMethod } = route.params || {}

  useEffect(() => {
    // Clear the cart after successful order
    // In a real app, this would be handled by the API
    // api.cart.clearCart();
  }, [])

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    })
  }

  const handleViewOrder = () => {
    navigation.navigate("OrderDetails", { orderId })
  }

  const formatDate = (daysToAdd) => {
    const date = new Date()
    date.setDate(date.getDate() + Number.parseInt(daysToAdd))
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  const estimatedDelivery = () => {
    const days = shippingMethod.days.split("-")
    if (days.length === 1) {
      return formatDate(days[0])
    } else {
      return `${formatDate(days[0])} - ${formatDate(days[1])}`
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../assets/animations/order-success.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully. We've sent you an email with all the details.
        </Text>

        <View style={styles.orderInfoCard}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Number:</Text>
            <Text style={styles.orderInfoValue}>{orderId}</Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Total:</Text>
            <Text style={styles.orderInfoValue}>${total.toFixed(2)}</Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Payment Method:</Text>
            <Text style={styles.orderInfoValue}>Credit Card (•••• 1234)</Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Shipping Method:</Text>
            <Text style={styles.orderInfoValue}>{shippingMethod.name}</Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
            <Text style={styles.orderInfoValue}>{estimatedDelivery()}</Text>
          </View>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Feather name="mail" size={20} color="#10b981" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Order Confirmation Email</Text>
              <Text style={styles.stepDescription}>You'll receive an email with your order details shortly.</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Feather name="package" size={20} color="#10b981" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Order Processing</Text>
              <Text style={styles.stepDescription}>
                We're preparing your order for shipment. You'll receive updates on its progress.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Feather name="truck" size={20} color="#10b981" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Shipping</Text>
              <Text style={styles.stepDescription}>
                Your order will be shipped via {shippingMethod.name}. Estimated delivery: {estimatedDelivery()}.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="outline" onPress={handleViewOrder} style={styles.viewOrderBtn}>
          View Order
        </Button>
        <Button onPress={handleContinueShopping} style={styles.continueBtn}>
          Continue Shopping
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  animationContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  orderInfoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  orderInfoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  nextStepsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  viewOrderBtn: {
    flex: 1,
    marginRight: 8,
  },
  continueBtn: {
    flex: 1,
    marginLeft: 8,
  },
})

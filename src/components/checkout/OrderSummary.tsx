"use client"

import type React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { Feather } from "@expo/vector-icons"

interface OrderSummaryProps {
  cartItems: any[]
  subtotal: number
  shippingMethod: {
    id: string
    name: string
    price: number
    days: string
  }
  address: {
    fullName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  paymentMethod: {
    type: string
    cardNumber: string
    expiryDate: string
    cvv: string
    nameOnCard: string
  }
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, subtotal, shippingMethod, address, paymentMethod }) => {
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return ""
    const lastFour = cardNumber.replace(/\s/g, "").slice(-4)
    return `•••• ${lastFour}`
  }

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod.type) {
      case "creditCard":
        return `Credit Card (${formatCardNumber(paymentMethod.cardNumber)})`
      case "paypal":
        return "PayPal"
      case "applePay":
        return "Apple Pay"
      default:
        return "Unknown payment method"
    }
  }

  const formatAddress = () => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      `${address.city}, ${address.state} ${address.zipCode}`,
    ].filter(Boolean)

    return parts.join(", ")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Summary</Text>

      <View style={styles.itemsContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image
              source={{ uri: item.book.images[0] || "/placeholder.svg?height=60&width=40" }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.book.title}
              </Text>
              <Text style={styles.itemAuthor} numberOfLines={1}>
                by {item.book.author}
              </Text>
              <Text style={styles.itemCondition}>{item.book.condition}</Text>
            </View>
            <View style={styles.itemPriceContainer}>
              <Text style={styles.itemPrice}>${item.book.price.toFixed(2)}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {shippingMethod.price === 0 ? "FREE" : `$${shippingMethod.price.toFixed(2)}`}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${(subtotal * 0.08).toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(subtotal + shippingMethod.price + subtotal * 0.08).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Feather name="map-pin" size={16} color="#6b7280" style={styles.detailIcon} />
            <Text style={styles.detailTitle}>Shipping Address</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailText}>{address.fullName}</Text>
            <Text style={styles.detailText}>{formatAddress()}</Text>
            <Text style={styles.detailText}>{address.phone}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Feather name="truck" size={16} color="#6b7280" style={styles.detailIcon} />
            <Text style={styles.detailTitle}>Shipping Method</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailText}>{shippingMethod.name}</Text>
            <Text style={styles.detailText}>
              Estimated delivery: {shippingMethod.days} business day{shippingMethod.days !== "1" && "s"}
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Feather name="credit-card" size={16} color="#6b7280" style={styles.detailIcon} />
            <Text style={styles.detailTitle}>Payment Method</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailText}>{getPaymentMethodDisplay()}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemImage: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  itemAuthor: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  itemCondition: {
    fontSize: 12,
    color: "#6b7280",
  },
  itemPriceContainer: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  detailsContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  detailContent: {
    paddingLeft: 24,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
})

export default OrderSummary

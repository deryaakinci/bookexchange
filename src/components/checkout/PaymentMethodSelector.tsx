"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native"
import { Feather } from "@expo/vector-icons"

interface PaymentMethodSelectorProps {
  paymentMethod: {
    type: string
    cardNumber: string
    expiryDate: string
    cvv: string
    nameOnCard: string
  }
  onPaymentMethodChange: (field: string, value: string) => void
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ paymentMethod, onPaymentMethodChange }) => {
  const [selectedType, setSelectedType] = useState(paymentMethod.type)

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    onPaymentMethodChange("type", type)
  }

  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")

    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")

    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }

    return cleaned
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[styles.paymentOption, selectedType === "creditCard" && styles.selectedPaymentOption]}
          onPress={() => handleTypeChange("creditCard")}
        >
          <View style={styles.paymentOptionContent}>
            <Image source={require("../../assets/images/credit-card.png")} style={styles.paymentIcon} />
            <Text style={styles.paymentOptionText}>Credit Card</Text>
          </View>
          {selectedType === "creditCard" && <Feather name="check" size={18} color="#10b981" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, selectedType === "paypal" && styles.selectedPaymentOption]}
          onPress={() => handleTypeChange("paypal")}
        >
          <View style={styles.paymentOptionContent}>
            <Image source={require("../../assets/images/paypal.png")} style={styles.paymentIcon} />
            <Text style={styles.paymentOptionText}>PayPal</Text>
          </View>
          {selectedType === "paypal" && <Feather name="check" size={18} color="#10b981" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, selectedType === "applePay" && styles.selectedPaymentOption]}
          onPress={() => handleTypeChange("applePay")}
        >
          <View style={styles.paymentOptionContent}>
            <Image source={require("../../assets/images/apple-pay.png")} style={styles.paymentIcon} />
            <Text style={styles.paymentOptionText}>Apple Pay</Text>
          </View>
          {selectedType === "applePay" && <Feather name="check" size={18} color="#10b981" />}
        </TouchableOpacity>
      </View>

      {selectedType === "creditCard" && (
        <View style={styles.cardDetailsContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={paymentMethod.cardNumber}
              onChangeText={(text) => onPaymentMethodChange("cardNumber", formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={paymentMethod.expiryDate}
                onChangeText={(text) => onPaymentMethodChange("expiryDate", formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                value={paymentMethod.cvv}
                onChangeText={(text) => onPaymentMethodChange("cvv", text.replace(/\D/g, ""))}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name on Card</Text>
            <TextInput
              style={styles.input}
              value={paymentMethod.nameOnCard}
              onChangeText={(text) => onPaymentMethodChange("nameOnCard", text)}
              placeholder="John Doe"
              autoCapitalize="words"
            />
          </View>
        </View>
      )}

      {selectedType === "paypal" && (
        <View style={styles.alternativePaymentContainer}>
          <Text style={styles.alternativePaymentText}>
            You will be redirected to PayPal to complete your payment securely.
          </Text>
        </View>
      )}

      {selectedType === "applePay" && (
        <View style={styles.alternativePaymentContainer}>
          <Text style={styles.alternativePaymentText}>
            You will be prompted to confirm payment with Apple Pay when you place your order.
          </Text>
        </View>
      )}

      <View style={styles.securityNote}>
        <Feather name="lock" size={16} color="#6b7280" style={styles.securityIcon} />
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure. We never store your full card details.
        </Text>
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
  paymentOptions: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  paymentOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  cardDetailsContainer: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formGroupHalf: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#4b5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  alternativePaymentContainer: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 24,
  },
  alternativePaymentText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  securityIcon: {
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
})

export default PaymentMethodSelector

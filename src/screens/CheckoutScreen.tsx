"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"
import { mockApi } from "../services/api"
import AddressForm from "../components/checkout/AddressForm"
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector"
import OrderSummary from "../components/checkout/OrderSummary"

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", price: 4.99, days: "3-5" },
  { id: "express", name: "Express Shipping", price: 9.99, days: "1-2" },
  { id: "pickup", name: "Campus Pickup", price: 0, days: "1" },
]

export default function CheckoutScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_OPTIONS[0])
  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState({
    type: "creditCard",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const [processingOrder, setProcessingOrder] = useState(false)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      // In a real app, use the actual API
      // const items = await api.cart.getCart();

      // For demo purposes, use mock data
      const items = mockApi.getCart()
      setCartItems(items)

      // Calculate subtotal
      const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
      setSubtotal(total)
    } catch (error) {
      console.error("Error fetching cart:", error)
      Alert.alert("Error", "Failed to load your cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method)
  }

  const handleAddressChange = (field, value) => {
    setAddress({ ...address, [field]: value })
  }

  const handlePaymentMethodChange = (field, value) => {
    setPaymentMethod({ ...paymentMethod, [field]: value })
  }

  const validateAddress = () => {
    const requiredFields = ["fullName", "addressLine1", "city", "state", "zipCode", "phone"]
    for (const field of requiredFields) {
      if (!address[field]) {
        Alert.alert("Missing Information", `Please enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }
    return true
  }

  const validatePayment = () => {
    if (paymentMethod.type === "creditCard") {
      const requiredFields = ["cardNumber", "expiryDate", "cvv", "nameOnCard"]
      for (const field of requiredFields) {
        if (!paymentMethod[field]) {
          Alert.alert("Missing Information", `Please enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
          return false
        }
      }

      // Basic validation for credit card
      if (paymentMethod.cardNumber.replace(/\s/g, "").length !== 16) {
        Alert.alert("Invalid Card", "Please enter a valid 16-digit card number")
        return false
      }

      if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        Alert.alert("Invalid Expiry Date", "Please enter expiry date in MM/YY format")
        return false
      }

      if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
        Alert.alert("Invalid CVV", "Please enter a valid CVV code")
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (step === 1 && !validateAddress()) return
    if (step === 2 && !validatePayment()) return
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const placeOrder = async () => {
    try {
      setProcessingOrder(true)

      // In a real app, send the order to the API
      // const response = await api.orders.createOrder({
      //   items: cartItems,
      //   shippingAddress: address,
      //   shippingMethod: shippingMethod.id,
      //   paymentMethod: paymentMethod,
      //   subtotal,
      //   shippingCost: shippingMethod.price,
      //   total: subtotal + shippingMethod.price,
      // });

      // For demo purposes, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to confirmation screen
      navigation.navigate("OrderConfirmation", {
        orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        total: subtotal + shippingMethod.price,
        shippingMethod,
      })
    } catch (error) {
      console.error("Error placing order:", error)
      Alert.alert("Error", "Failed to place your order. Please try again.")
    } finally {
      setProcessingOrder(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.stepIndicator}>
        <View style={[styles.stepCircle, step >= 1 && styles.activeStep]}>
          <Text style={[styles.stepNumber, step >= 1 && styles.activeStepNumber]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.activeStepLine]} />
        <View style={[styles.stepCircle, step >= 2 && styles.activeStep]}>
          <Text style={[styles.stepNumber, step >= 2 && styles.activeStepNumber]}>2</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.activeStepLine]} />
        <View style={[styles.stepCircle, step >= 3 && styles.activeStep]}>
          <Text style={[styles.stepNumber, step >= 3 && styles.activeStepNumber]}>3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && <AddressForm address={address} onAddressChange={handleAddressChange} />}

        {step === 2 && (
          <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={handlePaymentMethodChange} />
        )}

        {step === 3 && (
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingMethod={shippingMethod}
            address={address}
            paymentMethod={paymentMethod}
          />
        )}

        {step === 1 && (
          <View style={styles.shippingOptions}>
            <Text style={styles.sectionTitle}>Shipping Method</Text>

            {SHIPPING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.shippingOption, shippingMethod.id === option.id && styles.selectedShippingOption]}
                onPress={() => handleShippingMethodChange(option)}
              >
                <View style={styles.shippingOptionInfo}>
                  <Text style={styles.shippingOptionName}>{option.name}</Text>
                  <Text style={styles.shippingOptionDays}>
                    {option.days} business day{option.days !== "1" && "s"}
                  </Text>
                </View>
                <View style={styles.shippingOptionPrice}>
                  <Text style={styles.shippingOptionPriceText}>
                    {option.price === 0 ? "FREE" : `$${option.price.toFixed(2)}`}
                  </Text>
                  {shippingMethod.id === option.id && (
                    <Feather name="check" size={18} color="#10b981" style={styles.checkIcon} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <Button variant="outline" onPress={prevStep} style={styles.backBtn}>
            Back
          </Button>
        )}

        {step < 3 ? (
          <Button onPress={nextStep} style={styles.nextBtn}>
            Continue
          </Button>
        ) : (
          <Button onPress={placeOrder} style={styles.placeOrderBtn} disabled={processingOrder}>
            {processingOrder ? (
              <View style={styles.loadingBtnContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.loadingBtnText}>Processing...</Text>
              </View>
            ) : (
              "Place Order"
            )}
          </Button>
        )}
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  activeStep: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  stepNumber: {
    color: "#6b7280",
    fontWeight: "bold",
  },
  activeStepNumber: {
    color: "#fff",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#d1d5db",
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: "#10b981",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  shippingOptions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  shippingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedShippingOption: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  shippingOptionInfo: {
    flex: 1,
  },
  shippingOptionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  shippingOptionDays: {
    fontSize: 14,
    color: "#6b7280",
  },
  shippingOptionPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  shippingOptionPriceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  checkIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  backBtn: {
    flex: 1,
    marginRight: 8,
  },
  nextBtn: {
    flex: 2,
    marginLeft: 8, // Updated marginLeft to always be 8
  },
  placeOrderBtn: {
    flex: 2,
    marginLeft: 8,
    backgroundColor: "#10b981",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  loadingBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
})

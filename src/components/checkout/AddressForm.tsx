"use client"

import type React from "react"
import { View, Text, StyleSheet, TextInput } from "react-native"

interface AddressFormProps {
  address: {
    fullName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  onAddressChange: (field: string, value: string) => void
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onAddressChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={address.fullName}
          onChangeText={(text) => onAddressChange("fullName", text)}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address Line 1</Text>
        <TextInput
          style={styles.input}
          value={address.addressLine1}
          onChangeText={(text) => onAddressChange("addressLine1", text)}
          placeholder="Street address, P.O. box, company name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address Line 2 (Optional)</Text>
        <TextInput
          style={styles.input}
          value={address.addressLine2}
          onChangeText={(text) => onAddressChange("addressLine2", text)}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={address.city}
            onChangeText={(text) => onAddressChange("city", text)}
            placeholder="City"
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={address.state}
            onChangeText={(text) => onAddressChange("state", text)}
            placeholder="State"
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={address.zipCode}
            onChangeText={(text) => onAddressChange("zipCode", text)}
            placeholder="ZIP Code"
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>

        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={address.phone}
            onChangeText={(text) => onAddressChange("phone", text)}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
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
})

export default AddressForm

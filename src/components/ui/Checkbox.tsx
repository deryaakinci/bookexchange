"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Check } from "react-native-feather"
import { useTheme } from "../theme-provider"

interface CheckboxProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

const Checkbox = ({ label, checked, onCheckedChange, disabled = false }: CheckboxProps) => {
  const { isDarkMode } = useTheme()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onCheckedChange(!checked)}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? "#10b981" : "transparent",
            borderColor: checked ? "#10b981" : isDarkMode ? "#6b7280" : "#d1d5db",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {checked && <Check stroke="#ffffff" width={14} height={14} />}
      </View>
      <Text
        style={[
          styles.label,
          {
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
})

export default Checkbox

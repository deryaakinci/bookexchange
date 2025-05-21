"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../theme-provider"

interface BadgeProps {
  text: string
  variant?: "default" | "outline" | "secondary"
  color?: string
}

const Badge: React.FC<BadgeProps> = ({ text, variant = "default", color }) => {
  const { isDarkMode } = useTheme()

  const getStyles = () => {
    switch (variant) {
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: isDarkMode ? "#374151" : "#e5e7eb",
          },
          text: {
            color: isDarkMode ? "#d1d5db" : "#6b7280",
          },
        }
      case "secondary":
        return {
          container: {
            backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
          },
          text: {
            color: isDarkMode ? "#d1d5db" : "#6b7280",
          },
        }
      default:
        return {
          container: {
            backgroundColor: color || "#10b981",
          },
          text: {
            color: "#ffffff",
          },
        }
    }
  }

  const badgeStyles = getStyles()

  return (
    <View style={[styles.badge, badgeStyles.container]}>
      <Text style={[styles.text, badgeStyles.text]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
})

export default Badge

"use client"

import type React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Star } from "react-native-feather"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: number
  spacing?: number
  readonly?: boolean
  color?: string
  emptyColor?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 24,
  spacing = 4,
  readonly = false,
  color = "#fbbf24",
  emptyColor = "#d1d5db",
}) => {
  const handlePress = (selectedRating: number) => {
    if (readonly) return

    // If user taps the same star twice, clear the rating
    if (selectedRating === rating) {
      onRatingChange?.(0)
    } else {
      onRatingChange?.(selectedRating)
    }
  }

  return (
    <View style={[styles.container, { gap: spacing }]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
        >
          <Star
            width={size}
            height={size}
            fill={star <= rating ? color : "none"}
            stroke={star <= rating ? color : emptyColor}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default StarRating

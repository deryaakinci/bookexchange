"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { useTheme } from "./theme-provider"

const TypingIndicator = () => {
  const { isDarkMode } = useTheme()
  const [dot1] = useState(new Animated.Value(0))
  const [dot2] = useState(new Animated.Value(0))
  const [dot3] = useState(new Animated.Value(0))

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start()
    }

    const startAnimation = () => {
      animateDot(dot1, 0)
      animateDot(dot2, 200)
      animateDot(dot3, 400)
    }

    startAnimation()
    const interval = setInterval(startAnimation, 1200)

    return () => clearInterval(interval)
  }, [dot1, dot2, dot3])

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: isDarkMode ? "#374151" : "#f3f4f6" }]}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: isDarkMode ? "#9ca3af" : "#6b7280" },
              {
                transform: [
                  {
                    translateY: dot1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: isDarkMode ? "#9ca3af" : "#6b7280" },
              {
                transform: [
                  {
                    translateY: dot2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: isDarkMode ? "#9ca3af" : "#6b7280" },
              {
                transform: [
                  {
                    translateY: dot3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bubble: {
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 12,
    maxWidth: "80%",
    borderBottomLeftRadius: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 16,
    width: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
})

export default TypingIndicator

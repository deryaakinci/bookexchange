import { View, StyleSheet } from "react-native"
import { Check } from "react-native-feather"

interface MessageStatusIndicatorProps {
  status: "sending" | "sent" | "delivered" | "read" | "error"
}

const MessageStatusIndicator = ({ status }: MessageStatusIndicatorProps) => {
  if (status === "sending") {
    return (
      <View style={styles.container}>
        <View style={styles.sendingDot} />
      </View>
    )
  }

  if (status === "sent") {
    return (
      <View style={styles.container}>
        <Check stroke="rgba(255, 255, 255, 0.7)" width={12} height={12} />
      </View>
    )
  }

  if (status === "delivered") {
    return (
      <View style={styles.container}>
        <View style={styles.doubleCheckContainer}>
          <Check stroke="rgba(255, 255, 255, 0.7)" width={12} height={12} />
          <Check stroke="rgba(255, 255, 255, 0.7)" width={12} height={12} style={styles.secondCheck} />
        </View>
      </View>
    )
  }

  if (status === "read") {
    return (
      <View style={styles.container}>
        <View style={styles.doubleCheckContainer}>
          <Check stroke="#10b981" width={12} height={12} />
          <Check stroke="#10b981" width={12} height={12} style={styles.secondCheck} />
        </View>
      </View>
    )
  }

  if (status === "error") {
    return (
      <View style={styles.container}>
        <View style={styles.errorDot} />
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 2,
  },
  sendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    opacity: 0.7,
  },
  doubleCheckContainer: {
    position: "relative",
    width: 16,
    height: 12,
  },
  secondCheck: {
    position: "absolute",
    left: 4,
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
})

export default MessageStatusIndicator

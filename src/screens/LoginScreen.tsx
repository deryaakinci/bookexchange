"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Eye, EyeOff, BookOpen } from "react-native-feather"
import { useTheme } from "../components/theme-provider"
import CheckBox from "@react-native-community/checkbox"

const LoginScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, you would call your authentication API here
      console.log("Form submitted:", formData)
      // Navigate to main app
      // navigation.navigate('Home');
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }]}
      >
        <View style={styles.logoContainer}>
          <BookOpen stroke="#10b981" width={48} height={48} />
        </View>

        <Text style={[styles.title, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Login to your account</Text>

        <Text style={[styles.subtitle, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
          Enter your email and password to login
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  color: isDarkMode ? "#ffffff" : "#111827",
                  borderColor: errors.email ? "#ef4444" : isDarkMode ? "#374151" : "#e5e7eb",
                },
              ]}
              placeholder="john@example.com"
              placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={[styles.label, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Password</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                    color: isDarkMode ? "#ffffff" : "#111827",
                    borderColor: errors.password ? "#ef4444" : isDarkMode ? "#374151" : "#e5e7eb",
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={20} height={20} />
                ) : (
                  <Eye stroke={isDarkMode ? "#d1d5db" : "#6b7280"} width={20} height={20} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={formData.rememberMe}
              onValueChange={(value) => handleChange("rememberMe", value)}
              tintColors={{ true: "#10b981", false: isDarkMode ? "#6b7280" : "#9ca3af" }}
            />
            <Text style={[styles.checkboxLabel, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>Remember me</Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#10b981",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  registerText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
})

export default LoginScreen

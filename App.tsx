import { StatusBar } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "./src/components/theme-provider"
import MainNavigator from "./src/navigation/MainNavigator"
import AuthNavigator from "./src/navigation/AuthNavigator"

// For demo purposes, we'll assume the user is not authenticated
const isAuthenticated = false

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>{isAuthenticated ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App

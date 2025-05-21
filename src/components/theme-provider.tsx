"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  isDarkMode: false,
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("system")
  const systemColorScheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark")

  useEffect(() => {
    if (theme === "system") {
      setIsDarkMode(systemColorScheme === "dark")
    } else {
      setIsDarkMode(theme === "dark")
    }
  }, [theme, systemColorScheme])

  return <ThemeContext.Provider value={{ theme, isDarkMode, setTheme }}>{children}</ThemeContext.Provider>
}

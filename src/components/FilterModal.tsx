"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native"
import { X } from "react-native-feather"
import { useTheme } from "./theme-provider"
import Slider from "@react-native-community/slider"
import Badge from "./ui/Badge"
import Checkbox from "./ui/Checkbox"

// Mock data for categories and conditions
const categories = [
  "Computer Science",
  "Mathematics",
  "Economics",
  "Physics",
  "Chemistry",
  "Psychology",
  "History",
  "Engineering",
]

const conditions = ["New", "Like New", "Good", "Fair", "Acceptable"]

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  filters: {
    priceRange: [number, number]
    categories: string[]
    conditions: string[]
    forSale: boolean
    forExchange: boolean
  }
  onApply: (filters: any) => void
  onReset: () => void
}

const FilterModal = ({ visible, onClose, filters, onApply, onReset }: FilterModalProps) => {
  const { isDarkMode } = useTheme()
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const toggleCategory = (category: string) => {
    if (localFilters.categories.includes(category)) {
      setLocalFilters({
        ...localFilters,
        categories: localFilters.categories.filter((c) => c !== category),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        categories: [...localFilters.categories, category],
      })
    }
  }

  const toggleCondition = (condition: string) => {
    if (localFilters.conditions.includes(condition)) {
      setLocalFilters({
        ...localFilters,
        conditions: localFilters.conditions.filter((c) => c !== condition),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        conditions: [...localFilters.conditions, condition],
      })
    }
  }

  const handleApply = () => {
    onApply(localFilters)
  }

  const handleReset = () => {
    onReset()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X stroke={isDarkMode ? "#ffffff" : "#111827"} width={24} height={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Text style={[styles.filterTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Price Range</Text>
                <Text style={[styles.priceRangeText, { color: isDarkMode ? "#d1d5db" : "#6b7280" }]}>
                  ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={5}
                value={localFilters.priceRange[1]}
                onValueChange={(value) => setLocalFilters({ ...localFilters, priceRange: [0, value] })}
                minimumTrackTintColor="#10b981"
                maximumTrackTintColor={isDarkMode ? "#4b5563" : "#d1d5db"}
                thumbTintColor="#10b981"
              />
            </View>

            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Categories</Text>
              <View style={styles.badgesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity key={category} onPress={() => toggleCategory(category)}>
                    <Badge
                      text={category}
                      variant={localFilters.categories.includes(category) ? "default" : "outline"}
                      color={localFilters.categories.includes(category) ? "#10b981" : undefined}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Conditions */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Condition</Text>
              <View style={styles.badgesContainer}>
                {conditions.map((condition) => (
                  <TouchableOpacity key={condition} onPress={() => toggleCondition(condition)}>
                    <Badge
                      text={condition}
                      variant={localFilters.conditions.includes(condition) ? "default" : "outline"}
                      color={localFilters.conditions.includes(condition) ? "#10b981" : undefined}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Listing Type */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Listing Type</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  label="For Sale"
                  checked={localFilters.forSale}
                  onCheckedChange={(checked) => setLocalFilters({ ...localFilters, forSale: checked })}
                />
                <Checkbox
                  label="For Exchange"
                  checked={localFilters.forExchange}
                  onCheckedChange={(checked) => setLocalFilters({ ...localFilters, forExchange: checked })}
                />
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              {
                borderTopColor: isDarkMode ? "#374151" : "#e5e7eb",
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: isDarkMode ? "#374151" : "#e5e7eb" }]}
              onPress={handleReset}
            >
              <Text style={[styles.resetButtonText, { color: isDarkMode ? "#ffffff" : "#111827" }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  priceRangeText: {
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  checkboxContainer: {
    gap: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
})

export default FilterModal

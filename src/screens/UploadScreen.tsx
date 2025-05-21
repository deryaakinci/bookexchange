"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Camera } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Feather } from "@expo/vector-icons"
import { api } from "../services/api"
import { Button } from "../components/ui/Button"
import { Picker } from "@react-native-picker/picker"

const conditions = ["New", "Like New", "Very Good", "Good", "Acceptable"]
const categories = [
  "Textbook",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Mathematics",
  "Computer Science",
  "Engineering",
  "Business",
  "Arts",
  "Other",
]

export default function UploadScreen() {
  const navigation = useNavigation()
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState(conditions[0])
  const [category, setCategory] = useState(categories[0])
  const [isbn, setIsbn] = useState("")
  const [loading, setLoading] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setCameraPermission(status === "granted")
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera permission is needed to take photos")
    } else {
      setCameraVisible(true)
    }
  }

  const takePicture = async (camera: any) => {
    if (camera) {
      const photo = await camera.takePictureAsync()
      setImages([...images, photo.uri])
      setCameraVisible(false)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async () => {
    if (!title || !author || !price || images.length === 0) {
      Alert.alert("Missing information", "Please fill all required fields and add at least one image")
      return
    }

    setLoading(true)
    try {
      // Format the book data
      const bookData = {
        title,
        author,
        description,
        price: Number.parseFloat(price),
        condition,
        category,
        isbn,
        images: images, // In a real app, you'd upload these images to a server
      }

      // Call the API to create a new book listing
      await api.books.createBook(bookData)

      Alert.alert("Success!", "Your book has been listed successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Error uploading book:", error)
      Alert.alert("Error", "Failed to upload your book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => {
            if (ref) {
              const cameraRef = ref
              return (
                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.cameraButton} onPress={() => takePicture(cameraRef)}>
                    <Feather name="camera" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
                    <Feather name="x" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )
            }
            return null
          }}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              const cameraRef = Camera
              takePicture(cameraRef)
            }}
          >
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>List Your Book</Text>

      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Book Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                <Feather name="x-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 5 && (
            <View style={styles.addImageContainer}>
              <TouchableOpacity style={styles.addImageButton} onPress={requestCameraPermission}>
                <Feather name="camera" size={24} color="#666" />
                <Text style={styles.addImageText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Feather name="image" size={24} color="#666" />
                <Text style={styles.addImageText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Book Details</Text>

        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter book title" />

        <Text style={styles.label}>Author *</Text>
        <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Enter author name" />

        <Text style={styles.label}>ISBN (Optional)</Text>
        <TextInput
          style={styles.input}
          value={isbn}
          onChangeText={setIsbn}
          placeholder="Enter ISBN"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your book, including any highlights or damage"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Condition *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={condition}
            onValueChange={(itemValue) => setCondition(itemValue)}
            style={styles.picker}
          >
            {conditions.map((cond) => (
              <Picker.Item key={cond} label={cond} value={cond} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <Button onPress={handleSubmit} disabled={loading} style={styles.submitButton}>
        {loading ? "Uploading..." : "List Book for Sale"}
      </Button>

      <View style={styles.footer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  imageScroll: {
    flexDirection: "row",
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  addImageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    borderStyle: "dashed",
    alignItems: "center",
  },
  addImageButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  addImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  submitButton: {
    marginBottom: 30,
  },
  footer: {
    height: 50,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
})

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("Guest");
  const [loading, setLoading] = useState(true);

  // Function to fetch user details from AsyncStorage and backend
  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("Stored User ID:", storedUserId); // Debug log

      if (!storedUserId) {
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "OK", onPress: () => navigation.replace("Login") },
        ]);
        return;
      }

      // Fetch users from backend
      const response = await fetch("https://fitter-me-backend-1.onrender.com/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const users = await response.json();
      console.log("Fetched users:", users); // Debug log

      // Find the user with the stored userId
      const user = users.find((u) => u.id.toString() === storedUserId);
      console.log("Found User:", user); // Debug log

      if (user) {
        setUsername(user.username);
      } else {
        // Clear invalid user ID
        await AsyncStorage.removeItem("userId");
        setUsername("Guest");
        Alert.alert("User Not Found", "Please log in again.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use focus effect to fetch user details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserDetails();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { width: Dimensions.get("window").width * 0.8 }]}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff6600" />
        ) : (
          <>
            <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("WorkoutScreens")}>
              <Text style={styles.buttonText}>Go to Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Progress")}>
              <Text style={styles.buttonText}>View Progress</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// Example login function to store user ID in AsyncStorage
export const handleLogin = async (userId) => {
  try {
    await AsyncStorage.setItem("userId", userId.toString());
    console.log("User ID stored:", userId); // Debug log
    // Navigate to HomeScreen or perform other actions
  } catch (error) {
    console.error("Failed to store userId:", error);
  }
};

// Example logout function to clear user ID from AsyncStorage
export const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("userId");
    console.log("User ID removed on logout"); // Debug log
  } catch (error) {
    console.error("Failed to remove userId:", error);
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  logo: { height: 150, alignSelf: "center", marginTop: 50 },
  formContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 10 },
  button: { backgroundColor: "#ff6600", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

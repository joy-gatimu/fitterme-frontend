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

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const storedUserId = await AsyncStorage.getItem("userId");

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
      console.log("Fetched users:", users);

      // Find the user with the stored userId
      const user = users.find((u) => u.id.toString() === storedUserId);

      if (user) {
        setUsername(user.username);
      } else {
        setUsername("Guest");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  logo: { height: 150, alignSelf: "center", marginTop: 50 },
  formContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 10 },
  button: { backgroundColor: "#ff6600", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

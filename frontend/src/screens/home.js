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
  ScrollView
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
      console.log("Stored User ID:", storedUserId);

      if (!storedUserId) {
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "OK", onPress: () => navigation.replace("Login") },
        ]);
        return;
      }

      const response = await fetch("https://fitter-me-backend-1.onrender.com/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const users = await response.json();
      console.log("Fetched users:", users);

      const user = users.find((u) => u.id.toString() === storedUserId);
      console.log("Found User:", user);

      if (user) {
        setUsername(user.username);
      } else {
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserDetails();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: Dimensions.get("window").width }]}
          resizeMode="cover"
        />

        <View style={styles.formContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff6600" />
          ) : (
            <>
            <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            <Text style={styles.welcomeMessage}>Welcome To Fitter Me App where we are dedicated to monitor your fitness journey.
              We give you a variety of workouts where you can select from.The workouts have constant time and constant calories which you will burn.
              The only thing you need to do is record yourself doing the workout</Text>
            <View style={styles.imageContainer}>
                <Image source={require("../assets/m1.png")} style={styles.image} />
                <Image source={require("../assets/m2.png")} style={styles.image} />
                <Image source={require("../assets/m3.png")} style={styles.image} />
                <Image source={require("../assets/m4.png")} style={styles.image} />
              </View>
              
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("WorkoutScreens")}>
                <Text style={styles.buttonText}>Go to Workout</Text>
              </TouchableOpacity>
              
              
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export const handleLogin = async (userId) => {
  try {
    await AsyncStorage.setItem("userId", userId.toString());
    console.log("User ID stored:", userId);
  } catch (error) {
    console.error("Failed to store userId:", error);
  }
};

export const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("userId");
    console.log("User ID removed on logout");
  } catch (error) {
    console.error("Failed to remove userId:", error);
  }
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "#fff" },
  logo: { height: 150, alignSelf: "center" },
  formContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 40, fontWeight: "bold", color: "white", marginBottom: 10,backgroundColor:"#00008B" },
  welcomeMessage:{fontSize: 15, color: "black", marginBottom: 10,fontFamily:"Apple Chancery, cursive"},
  button: { backgroundColor: "#ff6600", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 },
  image: { width: 100, height: 100, margin: 5, borderRadius: 10 },
});

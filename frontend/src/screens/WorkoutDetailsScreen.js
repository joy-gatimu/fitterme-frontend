import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function WorkoutDetailsScreen({ route }) {
  const { userId, workout } = route.params || {}; // Handle missing params safely
  const navigation = useNavigation();

  useEffect(() => {
    if (!workout) {
      console.error("Workout data is missing");
      Alert.alert("Error", "Workout details not available.");
      navigation.goBack();
    } else {
      console.log("User ID:", userId);
      console.log("Workout ID:", workout.id);
    }
  }, [workout]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* App Logo */}
      <Image source={require("../assets/logo.png")} style={[styles.logo, { width: screenWidth * 0.8 }]} resizeMode="contain" />

      {/* Calories and Duration */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={28} color="red" />
          <Text style={styles.statText}>{workout?.calories_burned ?? "N/A"} cal</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={28} color="black" />
          <Text style={styles.statText}>{workout?.duration ?? "N/A"} min</Text>
        </View>
      </View>

      {/* Workout Details */}
      <Text style={styles.title}>Let's Get Started</Text>
      <View style={styles.workoutCard}>
        <Text style={styles.workoutName}>{workout?.name ?? "No Name"}</Text>
        <Text style={styles.workoutDescription}>{workout?.description ?? "No description available."}</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Preparation Tips</Text>
        <Text style={styles.instructionText}>✅ Find a spacious workout area.</Text>
        <Text style={styles.instructionText}>✅ Ensure your full body is visible in the video.</Text>
      </View>

      {/* Open Camera Button */}
      <TouchableOpacity 
        style={styles.recordButton} 
        onPress={() => navigation.navigate("Camera", { userId, workoutId: workout?.id })}
      >
        <Text style={styles.recordButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: { position: "absolute", top: 40, left: 20 },
  logo: { height: 150, alignSelf: "center" },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  statItem: { alignItems: "center" },
  statText: { fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  workoutCard: { backgroundColor: "#f5f5f5", padding: 20, borderRadius: 10, marginBottom: 20, alignItems: "center" },
  workoutName: { fontSize: 18, fontWeight: "bold" },
  workoutDescription: { fontSize: 14, color: "gray", textAlign: "center", marginTop: 5 },
  recordButton: { backgroundColor: "#ff6600", padding: 15, borderRadius: 8, marginTop: 20, alignSelf: "center", width: "80%", alignItems: "center" },
  recordButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

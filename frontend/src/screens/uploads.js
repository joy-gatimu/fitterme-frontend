import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://fitter-me-backend-1.onrender.com/workouts-done"; //backend URL

const BarGraph = ({ weeklyProgress }) => {
  return (
    <View style={styles.barGraphContainer}>
      {weeklyProgress.map((day, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={[styles.bar, { height: `${day.progress}%` }]} />
          <Text style={styles.barLabel}>{day.day}</Text>
        </View>
      ))}
    </View>
  );
};

export default function UploadScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const initialWeeklyProgress = [
    { day: "Mon", progress: 0 },
    { day: "Tue", progress: 0 },
    { day: "Wed", progress: 0 },
    { day: "Thu", progress: 0 },
    { day: "Fri", progress: 0 },
    { day: "Sat", progress: 0 },
    { day: "Sun", progress: 0 },
  ];

  const [weeklyProgress, setWeeklyProgress] = useState(initialWeeklyProgress);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          console.log("User ID from AsyncStorage:", storedUserId);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWorkoutData(userId);
    }
  }, [userId]);

  const fetchWorkoutData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Workouts Data:", data);

      const workoutCounts = data.reduce((acc, workout) => {
        const day = new Date(workout.workout_date).toLocaleDateString("en-US", { weekday: "short" });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const updatedProgress = initialWeeklyProgress.map((day) => ({
        ...day,
        progress: (workoutCounts[day.day] || 0) * 10,
      }));

      setWeeklyProgress(updatedProgress);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require("../assets/logo.png")} style={[styles.logo, { width: screenWidth }]} resizeMode="cover" />
        </View>
        
        <Text style={styles.sectionTitle}>Weekly Workout Progress</Text>
        <BarGraph weeklyProgress={weeklyProgress} />

     
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  logo: { height: 150 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  barGraphContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 150, marginBottom: 20 },
  barContainer: { alignItems: "center", width: "12%" },
  bar: { width: "80%", backgroundColor: "#4caf50", borderRadius: 5 },
  barLabel: { marginTop: 5, fontSize: 14, color: "#666" },

  goBackButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

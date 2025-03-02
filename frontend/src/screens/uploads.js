import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

export default function UploadScreen({ navigation }) {
  const [videoUri, setVideoUri] = useState(null);
  const [caloriesBurned, setCaloriesBurned] = useState(3500); // Track calories burned
  const totalCalories = 5000; // Total calories goal

  // Simulated progress data for each day of the week
  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: "Mon", progress: 60 }, // Progress in percentage
    { day: "Tue", progress: 40 },
    { day: "Wed", progress: 80 },
    { day: "Thu", progress: 30 },
    { day: "Fri", progress: 90 },
    { day: "Sat", progress: 50 },
    { day: "Sun", progress: 70 },
  ]);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      navigation.navigate("CalorieEstimator", { videoUri: result.assets[0].uri });

      // Simulate calories burned increase (e.g., +500 calories per upload)
      setCaloriesBurned((prevCalories) => Math.min(prevCalories + 500, totalCalories));

      // Simulate progress update for the current day (e.g., increase progress by 10%)
      const updatedProgress = weeklyProgress.map((day) => {
        if (day.day === "Mon") {
          return { ...day, progress: Math.min(day.progress + 10, 100) };
        }
        return day;
      });
      setWeeklyProgress(updatedProgress);
    }
  };

  const progressPercentage = (caloriesBurned / totalCalories) * 100; // Calculate progress percentage

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IFITTERME</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter by</Text>
        </TouchableOpacity>
      </View>

      {/* User Name */}
      <Text style={styles.userName}>JOHN DOE</Text>

      {/* Monthly Progress Section */}
      <Text style={styles.sectionTitle}>Monthly Progress</Text>
      <View style={styles.barGraphContainer}>
        {weeklyProgress.map((day, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: `${day.progress}%` }]} />
            <Text style={styles.barLabel}>{day.day}</Text>
          </View>
        ))}
      </View>

      {/* Calories Burned Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Calories Burned: {caloriesBurned}/{totalCalories}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>

      {/* Video Upload Section */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Text style={styles.uploadButtonText}>Upload Workout Video</Text>
      </TouchableOpacity>

      {/* Display the selected video */}
      {videoUri && <Video source={{ uri: videoUri }} style={styles.video} shouldPlay />}

      {/* Buttons */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Progress</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  barGraphContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150, // Fixed height for the bar graph
    marginBottom: 20,
  },
  barContainer: {
    alignItems: "center",
    width: "12%", // Equal width for each bar
  },
  bar: {
    width: "80%",
    backgroundColor: "#4caf50", // Green color for bars
    borderRadius: 5,
  },
  barLabel: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50", // Green color for progress
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  video: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  goBackButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
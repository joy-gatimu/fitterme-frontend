import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";

export default function WorkoutDetailsScreen({ route, navigation }) {
  const { workout } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null);

  // Request Camera Permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          "Camera Permission Denied",
          "Please enable camera access in settings to record workouts."
        );
      }
    })();
  }, []);

  // Open Camera
  const handleOpenCamera = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
    } else {
      Alert.alert("Permission Required", "Camera access is needed to record workouts.");
    }
  };

  // Close Camera
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* App Logo */}
      <Text style={styles.logo}>FITNESS PRO</Text>

      {/* Calories and Duration */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={28} color="red" />
          <Text style={styles.statText}>{workout.calories_burned} cal</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={28} color="black" />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
      </View>

      {/* Workout Details */}
      <Text style={styles.title}>Let's Get Started</Text>
      <View style={styles.workoutCard}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDescription}>{workout.description}</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Preparation Tips</Text>
        <Text style={styles.instructionText}>✅ Find a spacious workout area.</Text>
        <Text style={styles.instructionText}>✅ Ensure your full body is visible in the video.</Text>
      </View>

      {/* Start Recording Button */}
      <TouchableOpacity style={styles.recordButton} onPress={handleOpenCamera}>
        <Text style={styles.recordButtonText}>Start Recording</Text>
      </TouchableOpacity>

      {/* Camera View */}
      {isCameraOpen && (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} ref={cameraRef}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </Camera>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 40,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  workoutCard: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  workoutDescription: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },
  instructionBox: {
    backgroundColor: "black",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  instructionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  recordButton: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
    width: "80%",
    alignItems: "center",
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});

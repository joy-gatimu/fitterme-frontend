import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";

export default function WorkoutScreen({ route, navigation }) {
  const { workoutName = "Workout", markWorkoutAsDone = () => {} } = route.params || {};
  const [cameraPermission, setCameraPermission] = useState(null);
  const cameraRef = useRef(null);
  const [videoUri, setVideoUri] = useState(null);
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // ✅ Set default camera type

  // 🔹 Request Camera Permissions
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    };
    requestPermission();
  }, []);

  // 🔹 Handle Missing Camera Permissions
  if (cameraPermission === null) return <View />;
  if (cameraPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required to record workouts.</Text>
        <TouchableOpacity style={styles.button} onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Function to Start Recording Video
  const recordVideo = async () => {
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera not ready.");
      return;
    }

    try {
      setRecording(true);
      setIsProcessing(true);
      const video = await cameraRef.current.recordAsync();
      setRecording(false);
      setVideoUri(video.uri);

      // 🔹 Simulate Calories Burned (1 min = 100 cal)
      const durationInMinutes = video.duration ? video.duration / 60000 : 1; // ✅ Prevents NaN
      const caloriesBurned = Math.round(durationInMinutes * 100);

      // 🔹 Update Diary & Progress
      markWorkoutAsDone(workoutName, caloriesBurned);
      navigation.navigate("CalorieEstimator", { videoUri: video.uri, caloriesBurned });
    } catch (error) {
      Alert.alert("Recording Error", "Failed to record video.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔹 Function to Stop Recording Video
  const stopRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording(); // ✅ Await stopRecording()
      setRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record {workoutName}</Text>

      {/* 🔹 Camera Preview */}
      <Camera style={styles.camera} type={cameraType} ref={cameraRef} />

      <View style={styles.controls}>
        {/* 🔹 Record / Stop Button */}
        <TouchableOpacity
          style={[styles.button, recording && styles.recording]}
          onPress={recording ? stopRecording : recordVideo}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>{recording ? "Stop Recording" : "Start Recording"}</Text>
        </TouchableOpacity>

        {/* 🔹 Flip Camera Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setCameraType(
              cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
            )
          }
        >
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Show Loading Indicator While Processing */}
      {isProcessing && <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />}

      {/* 🔹 Show Recorded Video */}
      {videoUri && <Video source={{ uri: videoUri }} style={styles.video} shouldPlay />}
    </View>
  );
}

// ✅ Styles for Better UI
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  camera: { width: "90%", height: 400, borderRadius: 10, overflow: "hidden" },
  controls: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  button: { backgroundColor: "#ff6600", padding: 12, borderRadius: 8, marginHorizontal: 10 },
  recording: { backgroundColor: "red" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  permissionText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  video: { width: "90%", height: 300, marginTop: 20 },
});

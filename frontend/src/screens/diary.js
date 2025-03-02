import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateWorkoutScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
    fetchWorkouts();
    fetchLevels();
  }, []);

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        navigation.replace("Login");
        return;
      }
      setUserId(storedUserId);
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve user ID.");
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/workouts");
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch workouts.");
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/levels");
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch levels.");
    }
  };

  const handleCreateWorkout = async () => {
    if (!selectedWorkout || !selectedLevel || !userId) {
      return Alert.alert("Error", "Please select a workout, level, and ensure you are logged in.");
    }
  
    const workoutDetails = {
      user_id: userId,
      workout_id: selectedWorkout.id, // Sending ID instead of full object
      workout_date: date.toISOString().split("T")[0], // Changed to workout_date as per your backend
    };
  
    console.log("📤 Sending workout data:", JSON.stringify(workoutDetails));
  
    setIsLoading(true);
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/workouts-done", { // Updated URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutDetails),
      });
  
      const responseData = await response.json();
      setIsLoading(false);
  
      if (response.ok) {
        Alert.alert("✅ Success", "Workout done added successfully!");
        navigation.goBack();
      } else {
        console.error("Error details:", responseData); // Log error details
        Alert.alert("🚨 Error", responseData.message || "Failed to create workout done record.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("🔥 Workout creation error:", error); // Log error in console
      Alert.alert("❌ Error", "Network error. Please try again.");
    }
  };
  
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Workout</Text>

        <Text style={styles.label}>Select Workout</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedWorkout} onValueChange={(itemValue) => setSelectedWorkout(itemValue)} style={styles.picker}>
            <Picker.Item label="Select a Workout" value={null} />
            {workouts.map((workout) => (
              <Picker.Item key={workout.id} label={workout.name} value={workout} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Level</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedLevel} onValueChange={(itemValue) => setSelectedLevel(itemValue)} style={styles.picker}>
            <Picker.Item label="Select a Level" value={null} />
            {levels.map((level) => (
              <Picker.Item key={level.id} label={level.name} value={level.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleCreateWorkout} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  scrollContainer: { flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  pickerContainer: { borderColor: "#ccc", borderWidth: 1, borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  button: { backgroundColor: "#ff6600", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  dateButton: { backgroundColor: "#ddd", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  dateButtonText: { fontSize: 16, color: "#333" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});

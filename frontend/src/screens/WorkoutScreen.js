import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GoalSelectionScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch workouts from Flask API
  useEffect(() => {
    fetch("https://fitter-me-backend-1.onrender.com/workouts")
      .then((response) => response.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching workouts:", error);
        setLoading(false);
      });
  }, []);

  // Navigate to details screen
  const handleWorkoutPress = (workout) => {
    navigation.navigate("WorkoutDetailsScreen", { workout });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Workout</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleWorkoutPress(item)}
            >
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer} // Add this to style the FlatList content
        />
      )}

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10, // Adjusted margin
    width: "100%", // Adjusted width
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  listContainer: {
    flexGrow: 1, // Ensures the FlatList content takes up the available space
  },
});
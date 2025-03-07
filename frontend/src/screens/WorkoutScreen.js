import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutScreen({ navigation, route }) {
  const { userId } = route.params || {}; // Extract userId from route params
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fitter-me-backend-1.onrender.com/workouts")
      .then((response) => response.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching workouts:", error);
        Alert.alert("Error", "Failed to load workouts. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleWorkoutPress = (workout) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }
    navigation.navigate("WorkoutDetailsScreen", {
      userId,
      workout,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Workout</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" />
      ) : workouts.length > 0 ? (
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
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noWorkouts}>No workouts available</Text>
      )}
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backButton: { position: "absolute", top: 40, left: 20 },
  listContainer: { flexGrow: 1 },
  noWorkouts: { textAlign: "center", fontSize: 18, color: "gray", marginTop: 20 },
});

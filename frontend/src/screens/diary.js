import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKOUTS = {
  weight_loss: ["Running", "Jump Rope", "HIIT", "Cycling"],
  muscle_gain: ["Squats", "Push-ups", "Deadlifts", "Bench Press"],
  endurance: ["Swimming", "Rowing", "Hiking", "Stair Climbing"],
};

export default function DiaryScreen({ navigation }) {
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  useEffect(() => {
    generateWorkoutPlan();
    loadCompletedWorkouts();
  }, []);

  const generateWorkoutPlan = async () => {
    const goal = await AsyncStorage.getItem("userGoal") || "weight_loss";
    const exercises = WORKOUTS[goal];
    const plan = exercises.map((exercise) => ({ name: exercise, completed: false, caloriesBurned: 0 }));
    setWorkoutPlan(plan);
  };

  const loadCompletedWorkouts = async () => {
    const savedWorkouts = await AsyncStorage.getItem("completedWorkouts");
    setCompletedWorkouts(savedWorkouts ? JSON.parse(savedWorkouts) : []);
  };

  const markWorkoutAsDone = async (workoutName, caloriesBurned) => {
    const updatedPlan = workoutPlan.map((workout) =>
      workout.name === workoutName ? { ...workout, completed: true, caloriesBurned } : workout
    );
    setWorkoutPlan(updatedPlan);

    const updatedCompleted = [...completedWorkouts, { workoutName, caloriesBurned }];
    setCompletedWorkouts(updatedCompleted);

    await AsyncStorage.setItem("completedWorkouts", JSON.stringify(updatedCompleted));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Workout Plan</Text>
      <FlatList
        data={workoutPlan}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.workoutItem, item.completed && styles.completed]}
            onPress={() => navigation.navigate("Workout", { workoutName: item.name, markWorkoutAsDone })}
          >
            <Text style={styles.workoutText}>{item.name}</Text>
            {item.completed && <Text style={styles.calories}>🔥 {item.caloriesBurned} cal</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  workoutItem: { padding: 15, backgroundColor: "#ff6600", borderRadius: 8, marginVertical: 5 },
  workoutText: { color: "#fff", fontSize: 18 },
  completed: { backgroundColor: "#32CD32" },
  calories: { fontSize: 14, color: "#fff", marginTop: 5 },
});

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// MET values for different exercises
const MET_VALUES = {
  jumpingJacks: 8,
  squats: 5,
  running: 9.8,
};

export default function CalorieEstimator({ route }) {
  const { exerciseType, exerciseCount, userWeight = 70 } = route.params;
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    const estimateCalories = () => {
        if (!exerciseCount) return 0;
        const MET = MET_VALUES[exerciseType] || 5;
        const duration = exerciseCount * 3;
        const hours = duration / 3600;
        return MET * userWeight * hours;
      };
      
      

    const saveCalories = async (calories) => {
      const today = new Date().toISOString().split("T")[0];
      let storedData = await AsyncStorage.getItem("progressData");
      let progressData = storedData ? JSON.parse(storedData) : [];
      progressData.push({ date: today, calories });
      await AsyncStorage.setItem("progressData", JSON.stringify(progressData));
    };

    if (exerciseCount > 0) {
      const estimatedCalories = estimateCalories();
      setCaloriesBurned(estimatedCalories);
      saveCalories(estimatedCalories);
    }
  }, [exerciseCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Exercise Type: {exerciseType}</Text>
      <Text style={styles.text}>Reps: {exerciseCount}</Text>
      <Text style={styles.text}>Estimated Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  text: { fontSize: 18, marginVertical: 10 },
});

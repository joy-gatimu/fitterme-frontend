import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function FitnessRoutineScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (!selectedOption) {
      return Alert.alert("Error", "Please select an option.");
    }

    navigation.navigate("GoalSelection"); // ✅ Redirects to Goal Selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do you follow a fitness routine?</Text>

      <TouchableOpacity
        style={[styles.button, selectedOption === "Yes" && styles.selected]}
        onPress={() => setSelectedOption("Yes")}
      >
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedOption === "No" && styles.selected]}
        onPress={() => setSelectedOption("No")}
      >
        <Text style={styles.buttonText}>No</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#ddd", padding: 15, borderRadius: 8, marginTop: 10, width: "80%", alignItems: "center" },
  selected: { backgroundColor: "#ff6600" },
  nextButton: { backgroundColor: "#ff6600", padding: 15, borderRadius: 8, marginTop: 20, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

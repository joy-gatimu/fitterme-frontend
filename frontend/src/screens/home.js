import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Workout Section */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Workout")}
      >
        <Text style={styles.buttonText}>Go to Workout</Text>
      </TouchableOpacity>


      {/* Progress Section */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Progress")}
      >
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

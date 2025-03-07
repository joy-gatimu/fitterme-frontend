import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions, 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GoalSelectionScreen({ navigation }) {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const screenWidth = Dimensions.get("window").width;

  const handleGoalSelection = async () => {
    if (!selectedGoal) {
      return Alert.alert("Error", "Please select a goal!");
    }

    await AsyncStorage.setItem("userGoal", selectedGoal);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} 
        style={[styles.logo, { width: screenWidth }]} 
        resizeMode="cover"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>What is your primary fitness goal?</Text>

        <TouchableOpacity
          style={[styles.button, selectedGoal === "Weight Loss" && styles.selected]}
          onPress={() => setSelectedGoal("Weight Loss")}
        >
          <Text style={styles.buttonText}>Weight Loss</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedGoal === "Muscle Gain" && styles.selected]}
          onPress={() => setSelectedGoal("Muscle Gain")}
        >
          <Text style={styles.buttonText}>Muscle Gain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedGoal === "Endurance" && styles.selected]}
          onPress={() => setSelectedGoal("Endurance")}
        >
          <Text style={styles.buttonText}>Endurance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleGoalSelection}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    height: 150, 
    alignSelf: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#2196f3",
  },
  nextButton: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
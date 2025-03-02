import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions, // Import Dimensions to get screen width
} from "react-native";

export default function FitnessRoutineScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Get the screen width using Dimensions
  const screenWidth = Dimensions.get("window").width;

  const handleNext = () => {
    if (!selectedOption) {
      return Alert.alert("Error", "Please select an option.");
    }

    navigation.navigate("GoalSelection"); // ✅ Redirects to Goal Selection
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top of the screen */}
      <Image
        source={require("../assets/logo.png")} // Update the path to your logo
        style={[styles.logo, { width: screenWidth }]} // Set width to screen width
        resizeMode="cover" // Ensure the logo scales properly
      />

      <View style={styles.formContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    height: 150, // Adjust the height as needed
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
    backgroundColor: "#ff6600",
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
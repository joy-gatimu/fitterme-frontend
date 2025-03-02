import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions, // Import Dimensions to get screen width
} from "react-native";

export default function HomeScreen({ navigation }) {
  // Get the screen width using Dimensions
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* Logo at the top of the screen */}
      <Image
        source={require("../assets/logo.png")} // Update the path to your logo
        style={[styles.logo, { width: screenWidth }]} // Set width to screen width
        resizeMode="cover" // Ensure the logo scales properly
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Workout Section */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WorkoutScreens")}
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
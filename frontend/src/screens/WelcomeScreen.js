import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions, // Import Dimensions to get screen dimensions
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  // Get the screen dimensions using Dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <ImageBackground
      source={require("../assets/welcome.jpg")} // Update the path to your background image
      style={styles.background}
      resizeMode="cover" // Ensure the image covers the entire screen
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome To{"\n"}Fitter Me</Text>
        <Text style={styles.tagline}>"Where we monitor your fitness journey"</Text>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%", // Ensure the background covers the entire width
    height: "100%", // Ensure the background covers the entire height
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Add a semi-transparent overlay for better readability
    padding: 20,
  },
  title: {
    fontSize: 32, // Increased font size for better visibility
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18, // Increased font size for better visibility
    fontStyle: "italic",
    color: "#444",
    textAlign: "center",
    marginBottom: 40, // Increased margin for better spacing
  },
  nextButton: {
    backgroundColor: "#C62828",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8, // Slightly rounded corners
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
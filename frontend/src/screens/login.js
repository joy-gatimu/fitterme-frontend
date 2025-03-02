import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Image,
  Dimensions, // Import Dimensions to get screen width
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Get the screen width using Dimensions
  const screenWidth = Dimensions.get("window").width;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        navigation.replace("MainTabs", { userId: data.id });
      } else {
        Alert.alert("Error", data.error || "Login failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Logo at the top of the screen */}
        <Image
          source={require("../assets/logo.png")} // Update the path to your logo
          style={[styles.logo, { width: screenWidth }]} // Set width to screen width
          resizeMode="cover" // Ensure the logo scales properly
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 15,
    alignItems: "center",
  },
  signupText: {
    color: "#007BFF",
    fontSize: 16,
  },
});
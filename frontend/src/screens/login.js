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
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

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
        console.log("Login Response Data:", data); // Log the response from the server

        if (response.ok) {
            await AsyncStorage.setItem("userId", data.id.toString());
            const storedUserId = await AsyncStorage.getItem("userId");
            console.log("Stored User ID:", storedUserId); // Log the stored user ID

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
        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: screenWidth }]}
          resizeMode="cover"
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
    height: 150,
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

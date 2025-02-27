import React from "react";
import { View, Text, TouchableOpacity, StyleSheet,ImageBackground } from "react-native";

export default function SecondScreen({ navigation }) {
  return (
    <ImageBackground
    source={require("../assets/fun-illustration-3d-cartoon-backpacker.jpg")} 
    style={styles.background}
    resizeMode="cover">
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitApp</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#ff6600", padding: 15, borderRadius: 8, marginTop: 10, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

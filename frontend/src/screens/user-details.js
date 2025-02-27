import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from "react-native";

export default function UserDetailsScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [Age,setAge] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");
  const [duration, setDuration] = useState("");

  const handleNext = () => {
    if (!firstName || !lastName || !username || !Age || !currentWeight || !targetWeight || !height || !duration) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
  
    Alert.alert("Success", "Profile updated!");
    navigation.navigate("FitnessRoutine"); // ✅ Redirects to Fitness Routine
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Complete Your Profile</Text>

        <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
       <TextInput  style={styles.input} placeholder="Age" keyboardType="numeric" value={Age} onChangeText={setAge}/>
        <TextInput style={styles.input} placeholder="Current Weight (kg)" keyboardType="numeric" value={currentWeight} onChangeText={setCurrentWeight} />
        <TextInput style={styles.input} placeholder="Target Weight (kg)" keyboardType="numeric" value={targetWeight} onChangeText={setTargetWeight} />
        <TextInput style={styles.input} placeholder="Height (ft)" keyboardType="numeric" value={height} onChangeText={setHeight} />
        <TextInput style={styles.input} placeholder="Program Duration (weeks)" keyboardType="numeric" value={duration} onChangeText={setDuration} />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
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
});

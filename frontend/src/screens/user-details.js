import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function UserDetailsScreen({ route, navigation }) {
  const { user_id } = route.params || {};
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [current_weight, setCurrentWeight] = useState("");
  const [target_weight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");
  const [program_duration, setProgramDuration] = useState("");
  const [gender_id, setGender] = useState(null);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(false);

  const role_id = 2;
  const achievement_id = 1;

  useEffect(() => {
    console.log("📌 User ID received from route:", user_id);
    if (!user_id) {
      Alert.alert("Error", "User ID is missing.");
      navigation.goBack();
      return;
    }
    fetchGenders();
  }, []);

  const fetchGenders = async () => {
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/genders");
      const data = await response.json();
      setGenders(data);
    } catch (error) {
      console.error("❌ Error fetching genders:", error);
      Alert.alert("Error", "Failed to fetch gender options.");
    }
  };

  const handleSubmit = async () => {
    if (!first_name || !last_name || !birthdate || !current_weight || !target_weight || !height || !program_duration || !gender_id) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    if (!birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return Alert.alert("Error", "Birthdate must be in YYYY-MM-DD format.");
    }

    const userDetails = {
      user_id,
      first_name,
      last_name,
      birthdate: new Date(birthdate).toISOString().split("T")[0],
      current_weight: Number(current_weight),
      target_weight: Number(target_weight),
      height: Number(height),
      program_duration: Number(program_duration),
      gender_id,
      role_id,
      achievement_id,
    };

    console.log("🚀 Sending user details:", JSON.stringify(userDetails, null, 2));

    setLoading(true);

    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const text = await response.text();
      console.log("📥 User Details Raw Response:", text);

      try {
        const data = JSON.parse(text);

        setLoading(false);

        if (response.ok) {
          Alert.alert("Success", "Profile updated!");
          navigation.navigate("FitnessRoutine");
        } else {
          Alert.alert("Error", data.error || "Failed to update profile.");
        }
      } catch (jsonError) {
        console.error("❌ JSON Parsing Error:", jsonError);
        Alert.alert("Error", "Unexpected server response.");
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ User Details Submission Error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Complete Your Profile</Text>

        <TextInput style={styles.input} placeholder="First Name" value={first_name} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Last Name" value={last_name} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Birthdate (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} />
        <TextInput style={styles.input} placeholder="Current Weight (kg)" keyboardType="numeric" value={current_weight} onChangeText={setCurrentWeight} />
        <TextInput style={styles.input} placeholder="Target Weight (kg)" keyboardType="numeric" value={target_weight} onChangeText={setTargetWeight} />
        <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
        <TextInput style={styles.input} placeholder="Program Duration (weeks)" keyboardType="numeric" value={program_duration} onChangeText={setProgramDuration} />

        <Text style={styles.label}>Select Gender</Text>
        <Picker selectedValue={gender_id} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
          <Picker.Item label="Select Gender" value={null} />
          {genders.map((g) => (
            <Picker.Item key={g.id} label={g.name} value={g.id} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
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
    fontSize: 28,
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
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

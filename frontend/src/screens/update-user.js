import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpdateUserDetailsScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");
  const [programDuration, setProgramDuration] = useState("");
  const [genderId, setGenderId] = useState(null);
  const [genders, setGenders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserId();
  }, []);

  // Fetch the user ID from AsyncStorage
  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        navigation.replace("Login");
        return;
      }

      setUserId(storedUserId);
      fetchUserDetails(storedUserId);
      fetchGenders();
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve user ID.");
    }
  };

  // Fetch user details from the backend
  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(`https://fitter-me-backend-1.onrender.com/user-details/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user details");

      const userData = await response.json();
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setBirthdate(userData.birthdate || "");
      setCurrentWeight(String(userData.current_weight || ""));
      setTargetWeight(String(userData.target_weight || ""));
      setHeight(String(userData.height || ""));
      setProgramDuration(String(userData.program_duration || ""));
      setGenderId(userData.gender_id || null);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available gender options
  const fetchGenders = async () => {
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/genders");
      if (!response.ok) throw new Error("Failed to fetch genders");

      const data = await response.json();
      setGenders(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch gender options.");
    }
  };

  // Handle updating user details
  const handleUpdate = async () => {
    if (!firstName || !lastName || !birthdate || !currentWeight || !targetWeight || !height || !programDuration || !genderId) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      return Alert.alert("Error", "Birthdate must be in YYYY-MM-DD format.");
    }

    const updatedDetails = {
      first_name: firstName,
      last_name: lastName,
      birthdate,
      current_weight: parseFloat(currentWeight),
      target_weight: parseFloat(targetWeight),
      height: parseFloat(height),
      program_duration: parseInt(programDuration),
      gender_id: genderId,
    };

    setIsLoading(true);
    try {
      const response = await fetch(`https://fitter-me-backend-1.onrender.com/user-details/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDetails),
      });

      const responseData = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", responseData.error || "Failed to update profile.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to update user details.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Update Your Profile</Text>

        {isLoading ? <ActivityIndicator size="large" color="#ff6600" /> : (
          <>
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput style={styles.input} placeholder="Birthdate (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} />
            <TextInput style={styles.input} placeholder="Current Weight (kg)" keyboardType="numeric" value={currentWeight} onChangeText={setCurrentWeight} />
            <TextInput style={styles.input} placeholder="Target Weight (kg)" keyboardType="numeric" value={targetWeight} onChangeText={setTargetWeight} />
            <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
            <TextInput style={styles.input} placeholder="Program Duration (weeks)" keyboardType="numeric" value={programDuration} onChangeText={setProgramDuration} />

            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={genderId} onValueChange={(itemValue) => setGenderId(itemValue)} style={styles.picker}>
                <Picker.Item label="Select Gender" value={null} />
                {genders.map((gender) => (
                  <Picker.Item key={gender.id} label={gender.name} value={gender.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update</Text>}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  scrollContainer: { flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { backgroundColor: "#ff6600", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

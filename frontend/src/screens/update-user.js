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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Update Your Profile</Text>

        {isLoading ? <ActivityIndicator size="large" color="#ff6600" /> : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />
            
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} />
            
            <Text style={styles.label}>Birthdate (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={birthdate} onChangeText={setBirthdate} />
            
            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput style={styles.input} placeholder="Enter Current Weight" keyboardType="numeric" value={currentWeight} onChangeText={setCurrentWeight} />
            
            <Text style={styles.label}>Target Weight (kg)</Text>
            <TextInput style={styles.input} placeholder="Enter Target Weight" keyboardType="numeric" value={targetWeight} onChangeText={setTargetWeight} />
            
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput style={styles.input} placeholder="Enter Height" keyboardType="numeric" value={height} onChangeText={setHeight} />
            
            <Text style={styles.label}>Program Duration (weeks)</Text>
            <TextInput style={styles.input} placeholder="Enter Program Duration" keyboardType="numeric" value={programDuration} onChangeText={setProgramDuration} />
            
            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={genderId} onValueChange={(itemValue) => setGenderId(itemValue)} style={styles.picker}>
                <Picker.Item label="Select Gender" value={null} />
                {genders.length > 0 ? genders.map((gender) => (
                  <Picker.Item key={gender.id} label={gender.name} value={gender.id} />
                )) : <Picker.Item label="Loading..." value={null} />}
              </Picker>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Updated Successfully!")}> 
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  scrollContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  formContainer: { width: "100%", backgroundColor: "#f9f9f9", padding: 20, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  input: { height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, backgroundColor: "#fff" },
  button: { backgroundColor: "#ff6600", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10, shadowColor: "#ff6600", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 5, elevation: 2 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5, color: "#555" },
  pickerContainer: { borderColor: "#ddd", borderWidth: 1, borderRadius: 8, marginBottom: 15, backgroundColor: "#fff" },
  picker: { height: 50, width: "100%" },
});

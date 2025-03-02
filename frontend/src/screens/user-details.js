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
  Image,
  Dimensions,
  ScrollView, // Add ScrollView for scrollable content
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For dropdown selection

export default function UserDetailsScreen({ route, navigation }) {
  // Extract user ID from navigation route
  const { user_id } = route.params || {};

  // State for user details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");
  const [programDuration, setProgramDuration] = useState("");
  const [genderId, setGenderId] = useState(null); // Selected gender ID
  const [genders, setGenders] = useState([]); // List of genders from the server
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  // Constants for user role and achievement (hardcoded for now)
  const roleId = 2; // Default role ID
  const achievementId = 1; // Default achievement ID

  // Get screen width for responsive design
  const screenWidth = Dimensions.get("window").width;

  // Fetch genders from the server when the component mounts
  useEffect(() => {
    console.log("📌 User ID received from route:", user_id);

    // Check if user ID is missing
    if (!user_id) {
      Alert.alert("Error", "User ID is missing. Please try again.");
      navigation.goBack(); // Go back to the previous screen
      return;
    }

    fetchGenders(); // Fetch gender options from the server
  }, []);

  // Fetch gender options from the server
  const fetchGenders = async () => {
    try {
      const response = await fetch("https://fitter-me-backend-1.onrender.com/genders");
      const data = await response.json();
      setGenders(data); // Update the list of genders
    } catch (error) {
      console.error("❌ Error fetching genders:", error);
      Alert.alert("Error", "Failed to fetch gender options. Please check your connection.");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields are filled
    if (!firstName || !lastName || !birthdate || !currentWeight || !targetWeight || !height || !programDuration || !genderId) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    // Validate birthdate format (YYYY-MM-DD)
    if (!birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return Alert.alert("Error", "Birthdate must be in YYYY-MM-DD format.");
    }

    // Prepare user details for submission
    const userDetails = {
      user_id,
      first_name: firstName,
      last_name: lastName,
      birthdate: new Date(birthdate).toISOString().split("T")[0], // Format birthdate
      current_weight: Number(currentWeight),
      target_weight: Number(targetWeight),
      height: Number(height),
      program_duration: Number(programDuration),
      gender_id: genderId,
      role_id: roleId,
      achievement_id: achievementId,
    };

    console.log("🚀 Sending user details:", JSON.stringify(userDetails, null, 2));

    setIsLoading(true); // Show loading spinner

    try {
      // Send user details to the server
      const response = await fetch("https://fitter-me-backend-1.onrender.com/user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const responseText = await response.text();
      console.log("📥 Server Response:", responseText);

      try {
        const responseData = JSON.parse(responseText);

        setIsLoading(false); // Hide loading spinner

        if (response.ok) {
          Alert.alert("Success", "Profile updated successfully!");
          navigation.navigate("FitnessRoutine"); // Navigate to the next screen
        } else {
          Alert.alert("Error", responseData.error || "Failed to update profile. Please try again.");
        }
      } catch (jsonError) {
        console.error("❌ Error parsing server response:", jsonError);
        Alert.alert("Error", "Unexpected server response. Please try again.");
      }
    } catch (error) {
      setIsLoading(false); // Hide loading spinner
      console.error("❌ Error submitting user details:", error);
      Alert.alert("Error", "Failed to connect to the server. Please check your connection.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Wrap the entire content in a ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Logo at the top of the screen */}
          <Image
            source={require("../assets/logo.png")} // Path to your logo
            style={[styles.logo, { width: screenWidth }]} // Full-width logo
            resizeMode="cover" // Scale the logo to fit
          />

          {/* Screen title */}
          <Text style={styles.title}>Complete Your Profile</Text>

          {/* Input fields for user details */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)"
            value={birthdate}
            onChangeText={setBirthdate}
          />
          <TextInput
            style={styles.input}
            placeholder="Current Weight (kg)"
            keyboardType="numeric"
            value={currentWeight}
            onChangeText={setCurrentWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Target Weight (kg)"
            keyboardType="numeric"
            value={targetWeight}
            onChangeText={setTargetWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Program Duration (weeks)"
            keyboardType="numeric"
            value={programDuration}
            onChangeText={setProgramDuration}
          />

          {/* Gender selection dropdown */}
          <Text style={styles.label}>Select Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genderId}
              onValueChange={(itemValue) => setGenderId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value={null} />
              {genders.map((gender) => (
                <Picker.Item key={gender.id} label={gender.name} value={gender.id} />
              ))}
            </Picker>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" /> // Show loading spinner
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Allow the content to scroll
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    height: 150, // Adjust height as needed
    alignSelf: "center",
    marginBottom: 20, // Spacing below the logo
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
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    width: "100%",
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
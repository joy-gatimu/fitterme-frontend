import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

export default function UploadScreen({ navigation }) {
  const [videoUri, setVideoUri] = useState(null);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      navigation.navigate("CalorieEstimator", { videoUri: result.assets[0].uri }); // ✅ Now it navigates correctly
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Workout Video</Text>
      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Select Video</Text>
      </TouchableOpacity>

      {videoUri && <Video source={{ uri: videoUri }} style={styles.video} shouldPlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 16 },
  video: { width: "90%", height: 300, marginTop: 20 },
});

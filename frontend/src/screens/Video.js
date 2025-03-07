import { Video } from "expo-av";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { useRef, useState } from "react";

const TELEGRAM_BOT_TOKEN = "7797207140:AAHA5LAd53Pj9k8DOisK4NCn6O9SRRZFZho";
const TELEGRAM_CHAT_ID = "1626752175";
const BACKEND_URL = "https://fitter-me-backend-1.onrender.com/workouts-done";

export default function VideoScreen({ route }) {
  const { uri, userId, workoutId } = route.params;
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideoToTelegram = async () => {
    try {
      if (isUploading) return;
      setIsUploading(true);
      console.log("🔄 Preparing to upload video...");

      // Step 1: Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("❌ File does not exist at the given path");
      }

      console.log("✅ File found, size:", fileInfo.size);

      // Step 2: Upload video to Telegram
      console.log("📤 Uploading video to Telegram...");
      const uploadUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`;

      const result = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: "POST",
        fieldName: "video",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        parameters: { chat_id: TELEGRAM_CHAT_ID },
      });

      console.log("📩 Telegram response:", result.body);

      // Step 3: Parse Telegram response
      const telegramResponse = JSON.parse(result.body);
      if (!telegramResponse.ok) {
        throw new Error("❌ Failed to upload video: " + result.body);
      }

      const fileId = telegramResponse.result.video.file_id;
      console.log("🎥 Video uploaded successfully, file_id:", fileId);

      // Step 4: Get file URL from Telegram (optional)
      console.log("🔗 Requesting video URL...");
      const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`;
      const fileResponse = await fetch(getFileUrl);
      const fileData = await fileResponse.json();

      if (!fileData.ok) {
        throw new Error("❌ Failed to retrieve video URL: " + fileResponse.body);
      }

      const videoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
      console.log("🌐 Video URL:", videoUrl);

      // Step 5: Ensure userId & workoutId are present
      if (!userId || !workoutId) {
        throw new Error("❌ Missing required fields: userId or workoutId is undefined!");
      }

      // Step 6: Generate today's date for workout_date
      const workoutDate = new Date().toISOString().split("T")[0];

      // Step 7: Send video data to the backend
      console.log("📡 Sending video URL to backend...");
      const backendResponse = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          workout_id: workoutId,
          video_path: videoUrl, // Use the actual video URL instead of file_id
          workout_date: workoutDate,
        }),
      });

      // Step 8: Handle Backend Response
      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error("❌ Backend error: " + errorText);
      }

      const jsonResponse = await backendResponse.json();
      console.log("✅ Backend Response:", jsonResponse);

      Alert.alert("✅ Success", "Video uploaded and stored in the database!");
      navigation.goBack();

    } catch (error) {
      console.error("⚠️ Upload error:", error);
      Alert.alert("❌ Error", error.message || "Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        shouldPlay
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={uploadVideoToTelegram} style={styles.btn}>
          <Ionicons name="save-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: 350,
    height: 275,
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
});

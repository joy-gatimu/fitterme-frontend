import React from "react";
import { View } from "react-native";
import { Video } from "expo-av";

export default function VideoScreen({ route }) {
  const { uri } = route.params; // Receive the video URI

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Video
        source={{ uri }}
        style={{ width: "100%", height: 300 }}
        useNativeControls
        resizeMode="contain"
      />
    </View>
  );
}

// 🔹 How It Works
// Another screen navigates to VideoScreen and passes a video file URL as route.params.uri.
// The VideoScreen component extracts uri and loads the video.
// The video is displayed with full width, a height of 300, and built-in controls.
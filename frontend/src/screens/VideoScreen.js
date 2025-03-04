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

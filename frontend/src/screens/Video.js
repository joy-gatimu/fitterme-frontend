import { Video } from "expo-av";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";

export default function VideoScreen({ route }) {
  const { uri } = route.params;
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const saveVideo = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(uri);
      navigation.navigate("Camera");
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
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
      <View style={styles.controlsContainer}>
        <Button title={isPlaying ? "Pause" : "Play"} onPress={togglePlayPause} />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={saveVideo} style={styles.btn}>
          <Ionicons name="save-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Camera")} style={styles.btn}>
          <Ionicons name="trash-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
});

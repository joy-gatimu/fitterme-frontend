import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";

export default function CameraFunction() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [micPermission, setMicPermission] = useState(null);
  const [cameraMode, setCameraMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [flashMode, setFlashMode] = useState("on");
  const [recording, setRecording] = useState(false);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve userId and workoutId from route params
  const { userId, workoutId } = route.params || {};

  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Workout ID:", workoutId);
  }, [userId, workoutId]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();

      setCameraPermission(cameraStatus === "granted");
      setMediaLibraryPermission(mediaStatus === "granted");
      setMicPermission(micStatus === "granted");
    })();
  }, []);

  useEffect(() => {
    if (video) {
      navigation.navigate("Video", {
        uri: video.uri,
        userId,  // Pass userId
        workoutId, // Pass workoutId
      });
    }
  }, [video, navigation]);
  

  if (!cameraPermission || !mediaLibraryPermission || !micPermission) {
    return <Text>Requesting permissions...</Text>;
  }

  if (cameraPermission === false) {
    return <Text>Permission for camera not granted. Please enable it in settings.</Text>;
  }

  const toggleCameraFacing = () => setFacing((prev) => (prev === "back" ? "front" : "back"));
  const toggleFlash = () => setFlashMode((prev) => (prev === "on" ? "off" : "on"));

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const options = { quality: 1, base64: true, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  const recordVideo = async () => {
    if (!cameraRef.current) return;
    setRecording(true);
    try {
      const newVideo = await cameraRef.current.recordAsync({ maxDuration: 30 });
      setVideo(newVideo);
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current) return;
    setRecording(false);
    cameraRef.current.stopRecording();
  };

  if (photo) {
    const savePhoto = async () => {
      if (mediaLibraryPermission) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setPhoto(null);
      }
    };

    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <View style={styles.btnContainer}>
          {mediaLibraryPermission && (
            <TouchableOpacity style={styles.btn} onPress={savePhoto}>
              <Ionicons name="save-outline" size={30} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn} onPress={() => setPhoto(null)}>
            <Ionicons name="trash-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} flash={flashMode} mode={cameraMode} zoom={zoom}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="cyan"
          maximumTrackTintColor="white"
          value={zoom}
          onValueChange={setZoom}
        />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setCameraMode("picture")}>
            <Ionicons name="camera-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setCameraMode("video")}>
            <Ionicons name="videocam-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={flashMode === "on" ? "flash-outline" : "flash-off-outline"} size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.shutterContainer}>
          {cameraMode === "picture" ? (
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
              <Ionicons name="aperture-outline" size={50} color="white" />
            </TouchableOpacity>
          ) : recording ? (
            <TouchableOpacity style={styles.shutterButton} onPress={stopRecording}>
              <Ionicons name="stop-circle-outline" size={50} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.shutterButton} onPress={recordVideo}>
              <Ionicons name="play-circle-outline" size={50} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  slider: {
    width: "100%",
    height: 40,
    position: "absolute",
    top: "75%",
  },
  controls: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  iconButton: {
    padding: 10,
  },
  shutterButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    alignSelf: "stretch",
    width: "auto",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
});

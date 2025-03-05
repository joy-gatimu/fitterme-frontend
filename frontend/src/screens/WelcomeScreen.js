import React from "react";
import {
View,
Text,
ImageBackground,
StyleSheet,
TouchableOpacity,
Dimensions, 
} from "react-native";

export default function WelcomeScreen({ navigation }) {
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

return (
<ImageBackground
source={require("../assets/welcome1.png")} 
style={styles.background}
resizeMode="cover" 
>
<View style={styles.overlay}>
<Text style={styles.title}>Welcome To{"\n"}Fitter Me</Text>
<Text style={styles.tagline}>"Where we monitor your fitness journey"</Text>

<TouchableOpacity
style={styles.nextButton}
onPress={() => navigation.navigate("Login")}
>
<Text style={styles.nextButtonText}>Next</Text>
</TouchableOpacity>
</View>
</ImageBackground>
);
}

const styles = StyleSheet.create({
background: {
flex: 1,
width: "100%", 
height: "100%", 
},
overlay: {
flex: 1,
justifyContent: "center",
alignItems: "center",
padding: 20,
},
title: {
fontSize: 32,
fontWeight: "bold",
color: "#333",
textAlign: "center",
marginBottom: 10,
},
tagline: {
fontSize: 18, 
fontStyle: "italic",
color: "#444",
textAlign: "center",
marginBottom: 40, 
},
nextButton: {
backgroundColor: "#C62828",
paddingVertical: 15,
paddingHorizontal: 50,
borderRadius: 8, 
marginTop: 20,
},
nextButtonText: {
color: "#fff",
fontSize: 18,
fontWeight: "bold",
},
});

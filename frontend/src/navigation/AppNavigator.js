import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Import Ionicons
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/login";
import SignupScreen from "../screens/signup";
import UserDetailsScreen from "../screens/user-details";
import FitnessRoutineScreen from "../screens/FitnessRoutineScreen";
import GoalSelectionScreen from "../screens/GoalSelectionScreen";
import HomeScreen from "../screens/home";
import WorkoutScreen from "../screens/WorkoutScreen";
import DiaryScreen from "../screens/diary";
import UploadScreen from "../screens/uploads";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import UpdateUserDetailsScreen from "../screens/update-user";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 Bottom Navigation with Icons
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Diary") {
            iconName = "book-outline";
          } else if (route.name === "Uploads") {
            iconName = "cloud-upload-outline";
          } else if (route.name === "Update User") {
            iconName = "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff6600", // Orange for active tab
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Uploads" component={UploadScreen} />
      <Tab.Screen name="Update User" component={UpdateUserDetailsScreen} />
    </Tab.Navigator>
  );
}

// 🔹 Main Stack Navigation
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔹 First Screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        <Stack.Screen name="FitnessRoutine" component={FitnessRoutineScreen} />
        <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
        {/* 🔹 Redirect to Home after completing Goal Selection */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="WorkoutScreens" component={WorkoutScreen} />
        <Stack.Screen name="WorkoutDetailsScreen" component={WorkoutDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/login";
import SignupScreen from "../screens/signup";
import UserDetailsScreen from "../screens/user-details";
import FitnessRoutineScreen from "../screens/FitnessRoutineScreen";
import GoalSelectionScreen from "../screens/GoalSelectionScreen";
import HomeScreen from "../screens/home";
import WorkoutScreen from "../screens/WorkoutScreen";
import DiaryScreen from "../screens/diary";
import ProgressScreen from "../screens/progress";
import UploadScreen from "../screens/uploads";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 Bottom Navigation: Home Contains Diary, Workout & Progress
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="uploads" component={UploadScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screen/HomeScreen";
import LoginScreen from "./src/screen/LoginScreen";
import SignupScreen from "./src/screen/SignupScreen";
import SplashScreen from "./src/screen/SplashScreen";
import Quiz from "./src/screen/QuizScreen"; // Ensure this file exports the Quiz component
import CustomBottomBar from "./src/screen/CustomBottomBar"; // Custom Tab Bar
import UrinarySystemScreen from "./src/screen/UrinarySystemScreen";
import RespiratorySystemScreen from "./src/screen/RespiratorySystemScreen";
import DigestiveSystemScreen from "./src/screen/DigestiveSystemScreen";
import Profile from "./src/screen/ProfileScreen";
import OTPScreen from "./src/screen/OTPScreen";
import BasicQuiz from "./src/screen/BaiscQuizScreen";

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Nested Stack Navigator for Home Tab
const HomeStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="UrinarySystemScreen" component={UrinarySystemScreen} />
    <Stack.Screen name="DigestiveSystemScreen" component={DigestiveSystemScreen} />
    <Stack.Screen name="RespiratorySystemScreen" component={RespiratorySystemScreen} />
  </Stack.Navigator>
);

// Tab Navigator with Home, Quiz, and Profile
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <CustomBottomBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Quiz" component={Quiz} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

// Linking configuration
const linking = {
  prefixes: ["bioscope://"],
  config: {
    screens: {
      Splash: "splash",
      LOGIN: "login",
      SIGNUP: "signup",
      HOME: {
        path: "home",
        screens: {
          HomeMain: "",
          UrinarySystemScreen: "urinary",
          DigestiveSystemScreen: "digestive",
          RespiratorySystemScreen: "respiratory",
        },
      },
      Quiz: "Quiz",
      Profile: "profile",
    },
  },
};

// Main App with Stack Navigation
const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Stack Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />

        {/* Use TabNavigator for the HOME route */}
        <Stack.Screen name="HOME" component={TabNavigator} />

        {/* Add screens for direct navigation */}
        <Stack.Screen name="UrinarySystemScreen" component={UrinarySystemScreen} />
        <Stack.Screen name="DigestiveSystemScreen" component={DigestiveSystemScreen} />
        <Stack.Screen name="RespiratorySystemScreen" component={RespiratorySystemScreen} />

        {/* Basic Quiz */}
        <Stack.Screen name="BasicQuiz" component={BasicQuiz} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

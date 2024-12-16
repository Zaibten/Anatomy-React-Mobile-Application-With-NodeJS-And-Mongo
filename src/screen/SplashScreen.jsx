import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  const [scaleValue] = useState(new Animated.Value(0)); // Initial scale is 0

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Animate the splash logo
        Animated.timing(scaleValue, {
          toValue: 1, // Scale up to normal size
          duration: 1500, // Animation duration
          useNativeDriver: true,
        }).start(async () => {
          // Retrieve token and email after animation
          const token = await AsyncStorage.getItem("userToken");
          const email = await AsyncStorage.getItem("userEmail");

          // Print token and email in console
          console.log("Token:", token || "No token found");
          console.log("Email:", email || "No email found");

          // Add a short delay before navigating
          setTimeout(() => {
            if (email) {
              navigation.replace("HOME"); // Navigate to Home if email exists
            } else {
              navigation.replace("LOGIN"); // Navigate to Login if no email
            }
          }, 500);
        });
      } catch (error) {
        console.error("Error retrieving token or email:", error);
        navigation.replace("LOGIN"); // Redirect to Login on error
      }
    };

    checkLoginStatus();
  }, [scaleValue, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/1-removebg-preview.png")} // Splash logo
        style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001f3f", // Splash background color
  },
  logo: {
    width: 350,
    height: 350,
  },
});

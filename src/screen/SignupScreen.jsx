import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ToastAndroid, // For showing a toast message
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import the navigation hook

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser"; // For handling OAuth redirects
import * as AuthSession from "expo-auth-session"; // For session handling

WebBrowser.maybeCompleteAuthSession();

function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastBackPressed, setLastBackPressed] = useState(null); // Track the last back press time

  const SERVER_URL = "https://anatomy-two.vercel.app";

  const handleGoogleLogin = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({ scheme: "bioscope" });
      const authUrl = `${SERVER_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  
      // Open the WebBrowser for Google authentication
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
  
      if (result.type === "success" && result.url) {
        const params = new URLSearchParams(result.url.split("?")[1]);
        const token = params.get("token");
  
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const email = payload.email;
  
          console.log("Google Login Successful!");
          console.log("Email:", email);
          console.log("Token:", token);
  
          await AsyncStorage.setItem("userToken", token);
  
          // Navigate to HOME if login is successful
          navigation.reset({
            index: 0,
            routes: [{ name: "HOME" }],
          });
        } else {
          throw new Error("No token received!");
        }
      } else {
        console.log("User canceled Google Login");
        // Ensure the user is brought back to the login screen if canceled
        navigation.navigate("LOGIN");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Failed to login with Google. Please try again.");
      navigation.navigate("OTPScreen");
      setShowModal(true);
    } finally {
      WebBrowser.dismissBrowser();
      navigation.navigate("OTPScreen");
    }
  };
  

  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      const now = Date.now();

      if (lastBackPressed && now - lastBackPressed <= 2000) {
        // If back is pressed twice within 2 seconds, exit the app
        BackHandler.exitApp();
        return true;
      }

      setLastBackPressed(now);
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      return true; // Prevent default back navigation
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    // Clean up the event listener on component unmount
    return () => backHandler.remove();
  }, [lastBackPressed]);

  const validateForm = () => {
    if (!name || !email || !password) {
      setErrorMessage("All fields are required!");
      setShowModal(true);
      return false;
    }

    const nameRegex = /^[A-Za-z\s]{1,25}$/;
    if (!nameRegex.test(name)) {
      setErrorMessage("Name should contain only alphabets and be at most 25 characters long.");
      setShowModal(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setShowModal(true);
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      setErrorMessage("");
      setShowModal(false);
      try {
        const response = await fetch("https://anatomy-two.vercel.app/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Signup successful!");
          // Replace current screen with Login Screen
          navigation.replace("LOGIN"); // Replace with Login screen
        } else {
          setErrorMessage(data.error);
          setShowModal(true);
        }
      } catch (error) {
        setErrorMessage("Error: " + error.message);
        setShowModal(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/man.png")} style={styles.decoratedGif} />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Continue with Google Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require("../assets/google.png")} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate("LOGIN")}>
        <Text style={styles.linkText}>Do have an account? Login</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={require("../assets/1.png")} style={styles.modalLogo} />
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  decoratedGif: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    borderColor: "#ced4da",
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#17a2b8",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
  linkText: {
    color: "#007bff",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
modalLogo: {
  width: 80,
  height: 80,
  marginBottom: 15,
  borderRadius: 50, // Half of the width/height to make it round
},
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#17a2b8",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SignupScreen;

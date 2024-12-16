import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  BackHandler,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser"; // For handling OAuth redirects
import * as AuthSession from "expo-auth-session"; // For session handling

WebBrowser.maybeCompleteAuthSession();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  
  const deepLinkUrl = "bioscope://login";

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("All fields are required!");
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
  
  
  
  
  
  
  

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("https://anatomy-two.vercel.app/login", {
          email,
          password,
        });

        if (response.status === 200) {
          const { token } = response.data;

          await AsyncStorage.setItem("userToken", token);
          await AsyncStorage.setItem("userEmail", email);

          alert("Login successful!");
          navigation.navigate("HOME", { email });
        }
      } catch (error) {
        console.error("Login error: ", error);

        let errorMessage = "Failed to login. Please try again.";
        if (error.response) {
          errorMessage = error.response?.data?.error || "An error occurred. Please try again.";
        } else if (error.request) {
          errorMessage = "No response from the server. Please try again later.";
        }

        setErrorMessage(errorMessage);
        setShowModal(true);
      }
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce) {
        BackHandler.exitApp();
      } else {
        setBackPressedOnce(true);
        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [backPressedOnce]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/man.png")}
        style={styles.decoratedGif}
      />
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* <Text style={styles.deepLinkText}>
        Deep Link: {deepLinkUrl}
      </Text> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={require("../assets/google.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SIGNUP")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../assets/1.png")}
              style={styles.modalLogo}
            />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#d9534f",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#17a2b8",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "50%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});


export default LoginScreen;

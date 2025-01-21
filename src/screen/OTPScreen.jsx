import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CELL_COUNT = 5;

// Custom animated loader component
const CustomLoader = () => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Pulsating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinAnim, scaleAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.loader,
          {
            transform: [{ rotate: spin }, { scale: scaleAnim }],
          },
        ]}
      />
    </View>
  );
};

const OTPScreen = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [timer, setTimer] = useState(30); // Timer starts at 30 seconds
  const timerAnimation = useRef(new Animated.Value(0)).current;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  // Typing effect
  useEffect(() => {
    const text = "Input OTP to enter in virtual 3D world";
    let index = 0;
    let isDeleting = false;

    const typingInterval = setInterval(() => {
      setDisplayText((prev) => {
        if (!isDeleting) {
          const nextText = text.slice(0, index + 1);
          if (nextText === text) {
            isDeleting = true;
          }
          index++;
          return nextText;
        } else {
          const prevText = prev.slice(0, -1);
          if (prevText === "") {
            isDeleting = false;
            index = 0;
          }
          return prevText;
        }
      });
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            // Navigate to login screen after timer ends
            navigation.navigate("LOGIN");
          }, 500); // A small delay before navigating
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [navigation]);
  

  // Animate Timer
  useEffect(() => {
    Animated.timing(timerAnimation, {
      toValue: 1,
      duration: timer * 1000,
      useNativeDriver: false,
    }).start();
  }, [timer]);

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleSubmit();
    }
  }, [value]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://anatomy-fawn.vercel.app/verify", {
        otp: value,
      });

      const { token, email } = response.data;

      console.log("Token:", token);
      console.log("Email:", email);

      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userToken", token);

      Alert.alert("OTP Verified", `Welcome, ${email}!`);
      navigation.navigate("HOME", { email });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", error.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const animatedWidth = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View style={styles.logoContainer}>
        <Image
          source={require("../assets/1-removebg-preview (1).png")}
          style={styles.logo}
        />
      </Animated.View>

      <View style={styles.titleContainer}>
        <Text style={styles.subtitle}>{displayText}</Text>
      </View>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time Remaining: {timer}s</Text>
        <Animated.View
          style={[styles.timerBar, { width: animatedWidth }]}
        />
      </View>

      <View style={styles.actionContainer}>
        {isLoading ? (
          <CustomLoader />
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("LOGIN")}>
            <Text style={styles.loginLink}>Back to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  subtitle: {
    fontSize: 18,
    color: "#B0B0B0",
    textAlign: "center",
  },
  codeFieldRoot: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: 55,
    height: 55,
    lineHeight: 53,
    fontSize: 22,
    borderWidth: 1,
    borderColor: "#333333",
    textAlign: "center",
    backgroundColor: "#2C2C2C",
    marginHorizontal: 8,
    borderRadius: 12,
    color: "#ffffff",
  },
  focusCell: {
    borderColor: "#4CAF50",
    backgroundColor: "#3E8E41",
  },
  actionContainer: {
    marginTop: 40,
  },
  loginLink: {
    fontSize: 16,
    color: "#4CAF50",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
  },
  loader: {
    height: 60,
    width: 60,
    borderWidth: 6,
    borderColor: "#4CAF50",
    borderRadius: 30,
    borderLeftColor: "transparent",
  },
  timerContainer: {
    marginTop: 50,
    alignItems: "center",
    width: "100%",
  },
  timerText: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  timerBar: {
    height: 4,
    backgroundColor: "#D3D3D3",
    alignSelf: "flex-start",
  },
});

export default OTPScreen;

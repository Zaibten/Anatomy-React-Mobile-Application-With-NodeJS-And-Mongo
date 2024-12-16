import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const UrinarySystemScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const webviewRef = useRef(null);

  // Set up the animation for continuous rotation
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Rotate the image continuously
  useEffect(() => {
    const rotateImage = () => {
      rotateValue.setValue(0); // Reset the rotation value to 0
      Animated.timing(rotateValue, {
        toValue: 1, // Rotate 1 full turn
        duration: 3000, // Set the duration to 3 seconds (for one full rotation)
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => rotateImage()); // Repeat the animation after each rotation
    };

    rotateImage(); // Start the continuous rotation
  }, [rotateValue]);

  // Fetch data from AsyncStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // HTML content for the 3D model (Sketchfab)
  const sketchfabHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background-color: #000; /* Black background */
          }
          iframe {
            border: none;
            width: 100%;
            height: 100%;
          }
          #controls {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;
            background-color: #1a1a1a;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
          }
          .control-btn {
            flex: 1;
            margin: 0 5px;
            padding: 10px 0;
            background-color: #1a1a1a;
            color: #d4d4d4;
            font-size: 14px;
            border-radius: 8px;
            border: 1px solid #333;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
            text-align: center;
          }
          .control-btn:hover {
            background-color: #292929;
            color: #ffffff;
            transform: translateY(-3px);
            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.7);
          }
          .control-btn:active {
            transform: translateY(1px);
            background-color: #333;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
        </style>
      </head>
      <body>
        <iframe
          title="Human Anatomy Final Version"
          id="sketchfab-iframe"
      src="https://sketchfab.com/models/6bd76e32ae2b4bccb810a08d3679e502/embed?autostart=1&annotations_visible=1"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        ></iframe>
        <div id="controls">
          <button class="control-btn" onclick="sendMessage('anatomy')">Anatomy</button>
          <button class="control-btn" onclick="sendMessage('digestive')">Digestive</button>
          <button class="control-btn" onclick="sendMessage('respiratory')">Respiratory</button>
          <button class="control-btn" onclick="sendMessage('urinary')">Urinary</button>
        </div>
        <script>
          function sendMessage(action) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action }));
          }
        </script>
      </body>
    </html>
  `;

  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Refresh Button */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          {
            
          },
        ]}
        onPress={handleRefresh}
      >
        <Animated.Image
          source={require("../assets/refresh.png")}
          style={[
            styles.refreshIcon,
            {
              transform: [
                {
                  rotate: rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"], // 360-degree rotation
                  }),
                },
              ],
            },
          ]}
        />
      </TouchableOpacity>

      {/* 3D Model Section */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: sketchfabHTML }}
          style={styles.webview}
          onMessage={(event) => {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.action) {
              case "anatomy":
                navigation.navigate("Home", { screen: "HomeMain" });
                break;
              case "digestive":
                navigation.navigate("DigestiveSystemScreen");
                break;
              case "respiratory":
                navigation.navigate("RespiratorySystemScreen");
                break;
              case "urinary":
                navigation.navigate("UrinarySystemScreen");
                break;
              default:
                console.log("Unhandled action:", message.action);
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  refreshButton: {
    position: "absolute",
    top: 600,
    right: 10,
    zIndex: 10,
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  refreshIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
  webviewContainer: {
    flex: 1,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  webview: {
    flex: 1,
  },
});

export default UrinarySystemScreen;

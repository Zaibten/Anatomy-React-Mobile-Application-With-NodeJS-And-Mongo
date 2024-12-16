import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WebViewLogin = ({ route, navigation }) => {
  const { authUrl, redirectUri } = route.params;
  const [loading, setLoading] = useState(true);

  const handleWebViewNavigationStateChange = (event) => {
    if (event.url.startsWith(redirectUri)) {
      const urlParams = new URLSearchParams(event.url.split("?")[1]);
      const token = urlParams.get("token");

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.email;

        console.log("Google Login Successful!");
        console.log("Email:", email);
        console.log("Token:", token);

        AsyncStorage.setItem("userToken", token).then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "HOME" }],
          });
        });
      } else {
        console.error("No token received!");
        navigation.navigate("LOGIN");
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        source={{ uri: authUrl }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewLogin;

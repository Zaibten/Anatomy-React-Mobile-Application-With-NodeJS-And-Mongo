import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userEmail");
    navigation.navigate("LOGIN");
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Home!</Text>
      {/* {userEmail && <Text>Your Email: {userEmail}</Text>}
      {userToken && <Text>Your Token: {userToken}</Text>} */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

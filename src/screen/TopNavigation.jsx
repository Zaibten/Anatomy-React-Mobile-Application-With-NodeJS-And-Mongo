import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TopNavBar = ({ email }) => {
  return (
    <View style={styles.navBar}>
      <Text style={styles.navText}>Welcome, {email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    padding: 10,
    backgroundColor: "#17a2b8", // Change this to your desired color
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  navText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TopNavBar;

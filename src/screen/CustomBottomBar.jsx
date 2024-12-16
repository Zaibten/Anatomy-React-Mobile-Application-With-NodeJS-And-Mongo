import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Image } from "react-native";

const CustomBottomBar = ({ state, descriptors, navigation }) => {
  const [activeTab, setActiveTab] = useState(state.index);
  const [scales, setScales] = useState(state.routes.map(() => new Animated.Value(1))); // Animation for scale effect

  const handlePress = (index, routeName) => {
    if (state.index !== index) {
      setActiveTab(index); // Update the active tab index
      navigation.navigate(routeName);
      animateTabPress(index);
    }
  };

  const animateTabPress = (index) => {
    // Reset previous scales to normal
    scales.forEach((scale, i) => {
      Animated.spring(scale, {
        toValue: i === index ? 1.2 : 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index, route.name)}
            style={[styles.tabButton, isFocused && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[ 
                styles.iconContainer,
                isFocused && styles.activeIconContainer,
                {
                  transform: [{ scale: scales[index] }], // Apply scale animation
                },
              ]}
            >
              {/* Custom icons with images */}
              <Image
                source={
                  route.name === "Home"
                    ? require("../assets/home.png")  // Home icon

                    : route.name === "Quiz"
                    ? require("../assets/quiz.png")  // Quiz icon

                    : route.name === "Profile"
                    ? require("../assets/profile.png")  // Profile icon
                    
                    : require("../assets/home.png") // Default icon for others
                }
                style={[styles.icon, isFocused && styles.activeIcon]} 
              />
            </Animated.View>

            <Animated.Text style={[styles.label, isFocused && styles.activeLabel]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#f6f6f6",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 27,
    height: 27,
  },
  label: {
    fontSize: 12,
    color: "#888", // Default label color
  },
  activeTab: {
    backgroundColor: "#D3D3D3", // Active tab background
    borderRadius: 30, // Rounded corners for active tab
  },
  activeIconContainer: {
    padding: 5,
    borderRadius: 25,
  },
  activeIcon: {
  },
  activeLabel: {
    color: "#007AFF", // Active label color
    fontWeight: "bold", // Bold active label text
  },
});

export default CustomBottomBar;

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Modal, Image, ScrollView, TouchableOpacity } from 'react-native'; // Add TouchableOpacity import here
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const Quiz = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [basicScore, setBasicScore] = useState('--');
  const [advanceScore, setAdvanceScore] = useState('--');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          setUserEmail(storedEmail);
          fetchScores(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);


  const fetchScores = async (email) => {
    try {
      const response = await axios.post('https://anatomy-two.vercel.app/fetchquizscores', { email });
  
      if (response.data) {
        setBasicScore(response.data.BasicQuizMarks !== undefined ? response.data.BasicQuizMarks : '--');
        setAdvanceScore(response.data.AdvanceQuizMarks !== undefined ? response.data.AdvanceQuizMarks : '--');
      } else {
        setBasicScore('--');
        setAdvanceScore('--');
      }
    } catch (error) {
      console.error('Error fetching quiz scores:', error);
      setBasicScore('--');
      setAdvanceScore('--');
    }
  };
  


  const navigation = useNavigation();

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(5); // Example score (you can replace it with your actual score state)
  
  // Modal message based on score
  const errorMessage = "You must complete the Basic Quiz before proceeding to the Advance Quiz.";

  // Animation effect for the button
  const scaleValue = new Animated.Value(1);
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Function to navigate to Advancequiz
  const handleNavigateToAdvancequiz = () => {
    // Check if score is not available ("--") or is less than 15
    if (basicScore === '--' || basicScore < 15) {
      setShowModal(true); // Show modal if basicScore is "--" or less than 15
    } else {
      navigation.navigate('AdvanceQuiz'); // Navigate to Advance Quiz otherwise
    }
  };

// Dynamic styling for Advance Quiz button
const advanceButtonStyle = {
  backgroundColor: basicScore === '--' || basicScore < 15 ? 'grey' : '#17a2b8', // Grey if basicScore is "--" or < 15, else teal
  ...styles.button, // Add existing button styles
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require('../assets/1-removebg-preview (1).png')} style={styles.logo} />
        <Text style={styles.title}>Quiz Dashboard</Text>
        <Text style={styles.subtitle}>Anatomy Quiz</Text>
      </View>

      {/* Score Cards */}
      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Quiz Score</Text>
          <Text style={styles.cardValue}>{basicScore}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Advance Quiz Score</Text>
          <Text style={styles.cardValue}>{advanceScore}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{userEmail}</Text>

      {/* Interactive Buttons in Row */}
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#17a2b8' }]} // Keeping original color for Basic Quiz button
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigation.navigate('BasicQuiz')}
          >
            <Text style={styles.buttonText}>Start Basic Quiz</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
  style={advanceButtonStyle}
  onPress={handleNavigateToAdvancequiz}
>
            <Text style={styles.buttonText}>Start Advance Quiz</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Instructional Text */}
      <Text style={styles.instructionText}>
        Press 'Basic Quiz' if you are new to the quiz, and if you've already completed it, click 'Advance Quiz' to demonstrate your expertise.
      </Text>

      {/* Modal for error */}
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
            <Text style={styles.modalTitle}>ANATOMY ALERT</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6F9', // Light background for better contrast
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    width: '100%',
    backgroundColor: '#344955', // Dark slate background for header
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    marginTop: -10,
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#E6EFF1',
    textAlign: 'center',
    marginTop: 8,
  },
  cards: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    marginBottom: 25,
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#607D8B',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D92A6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  button: {
    width: '100%', // Ensures buttons are side by side
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#607D8B', // Grey color for instruction text
    textAlign: 'center',
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

export default Quiz;

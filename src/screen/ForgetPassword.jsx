import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state for email not found
  const navigation = useNavigation();

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (email && validateEmail(email)) {
      try {
        // Send email to backend for validation
        const response = await axios.post('https://anatomy-two.vercel.app/check-email', { email });
        if (response.data.success) {
          setShowModal(true); // Show success modal
        } else {
          setShowModal(true); // Show failure modal even if email is not found
        }
      } catch (error) {
        setShowModal(true);
      }
    }
  };

  const fetchSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setIsEmailDisabled(true);
      }
    } catch (error) {
      console.log('Error fetching saved email:', error);
    }
  };

  useEffect(() => {
    fetchSavedEmail();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/1.png')} style={styles.logo} />

      {/* Heading */}
      <Text style={styles.heading}>Forgot Password?</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, isEmailDisabled && styles.disabledInput]}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isEmailDisabled}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Success/Failure Modal for Email Not Found */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={require('../assets/1.png')} style={styles.modalLogo} />
            <Text style={styles.modalTitle}>Forget Password</Text>
            <Text style={styles.modalMessage}>
              {email ? 'A password reset link has been sent to your email if you are registred user otherwise register yourself !!!' : 'The email you entered does not exist in our database.'}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.successModalButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, // Rounded border
    marginBottom: 20,
    borderWidth: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745', // Red color for "Email Status"
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  successModalButton: {
    backgroundColor: '#28a745', // Red color for modal
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalLogo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Rounded border for the modal logo
    marginBottom: 15,
    borderWidth: 2,
  },
});

export default ForgetPassword;

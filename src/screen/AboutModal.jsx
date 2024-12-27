import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const AboutModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer2}>
          <Text style={styles.modalTitle}>About Anatomy 3D</Text>
          <Text style={styles.modalDescription}>
            Welcome to Anatomy 3D React Mobile Application! This is a feature-rich mobile application designed to make learning about human anatomy interactive and engaging. With a 3D model interface, quizzes, and an integrated admin panel, users can dive deep into the Urinary, Digestive, and Respiratory Systems with ease. 🚀
          </Text>
          <Text style={styles.modalDescription}>
            🌟 Features:{"\n"}
            - Built with React Native and Expo for seamless cross-platform support.{"\n"}
            - Interactive 3D anatomy models created in Blender and rendered in-app, covering:{"\n"}
            Urinary System 💧, Digestive System 🍽️, Respiratory System 🌬️.{"\n"}
            - Quizzes for users to test their knowledge: Urinary System, Digestive System, Respiratory System.{"\n"}
            - Email integration via SMTP to send quiz results.{"\n"}
            - Admin panel hosted at Zaibten Admin Panel to manage quizzes and users.{"\n"}
            - Backend hosted at Anatomy Backend to handle APIs, authentication, and email functionality.{"\n"}
            🚀 Technologies Used:{"\n"}
            - Frontend (Mobile App): React Native, Expo{"\n"}
            - Admin Panel: React.js{"\n"}
            - Backend: Node.js, Express.js{"\n"}
            - Database: MongoDB{"\n"}
            - 3D Models: Blender{"\n"}
            - Email Service: SMTP
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#1E2A38",
    paddingVertical: 20, // reduced padding for a smaller modal
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    height: 200, // Set a fixed height for the modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFB84D',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFB84D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default AboutModal;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Particle = ({ style }) => {
  const translateX = useState(new Animated.Value(Math.random() * width))[0];
  const translateY = useState(new Animated.Value(Math.random() * height))[0];
  const scale = useState(new Animated.Value(Math.random() * 1))[0];

  useEffect(() => {
    const animateParticle = () => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: Math.random() * width,
          duration: 4000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Math.random() * height,
          duration: 4000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: Math.random() * 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animateParticle());
    };
    animateParticle();
  }, [translateX, translateY, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
};

const Profile = () => {
  const [userEmail, setUserEmail] = useState("User");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navigation = useNavigation();

  const fadeAnim = useState(new Animated.Value(0))[0];

  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          setUserEmail(storedEmail);
          const response = await fetch(`https://anatomy-fawn.vercel.app/quiz-history?email=${storedEmail}`);
          const data = await response.json();

          if (response.ok) {
            setQuizHistory(data.history);
          } else {
            console.error("Error fetching quiz history:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizHistory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedEmail) setUserEmail(storedEmail);
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) {
          const response = await fetch(`https://anatomy-fawn.vercel.app/user?email=${storedEmail}`);
          const data = await response.json();

          if (response.ok) {
            setUsername(data.username);
          } else {
            console.error("Error fetching username:", data.error);
          }
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
    

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const confirmLogout = () => setShowModal(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setShowModal(false);
      navigation.replace("LOGIN");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Particle Effect */}
      {Array(30)
        .fill(0)
        .map((_, index) => (
          <Particle key={index} />
        ))}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
          <Image
            source={require("../assets/1-removebg-preview (1).png")}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>ANATOMY 3D</Text>
          <Text style={styles.emailText}>Profile Section</Text>
        </Animated.View>

        {/* User Info Section */}
        <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
          <Text style={styles.label}>Your Email</Text>
          <Text style={styles.value}>{userEmail || "Not available"}</Text>
        </Animated.View>

        <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username || "Not available"}</Text>
        </Animated.View>

        {/* Show User Quiz History */}
        <View style={styles.container}>
      <Text style={styles.header}>Last 3 Quiz History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFB84D" />
      ) : quizHistory.length > 0 ? (
        <ScrollView horizontal contentContainerStyle={styles.historyContainer}>
          {quizHistory.map((quiz, index) => (
            <View key={index} style={styles.quizCard}>
              <Text style={styles.attemptText}>Quiz History {quiz.attempt}</Text>
              <Text style={styles.quizText}>Basic Quiz: {quiz.BasicQuiz ? "Yes" : "No"}</Text>
              <Text style={styles.quizText}>Basic Quiz Marks: {quiz.BasicQuizMarks}</Text>
              <Text style={styles.quizText}>Advanced Quiz: {quiz.AdvanceQuiz ? "Yes" : "No"}</Text>
              <Text style={styles.quizText}>Advanced Quiz Marks: {quiz.AdvanceQuizMarks}</Text>
              <Text style={styles.dateText}>Date: {quiz.date}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>No quiz history found.</Text>
      )}
    </View>

        {/* Navigation Links */}
        <View style={styles.linkContainer}>
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
              <Text style={styles.linkText}>Forget Password</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => setShowAboutModal(true)}>
              <Text style={styles.linkText}>About Us</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutModalButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About Us Modal */}
      <Modal visible={showAboutModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer2}>
            <Text style={styles.modalTitle}>About App</Text>
            <ScrollView>
              <Text style={styles.modalMessage}>
                Welcome to Anatomy 3D React Mobile Application! This is a
                feature-rich mobile application designed to make learning about
                human anatomy interactive and engaging. 🚀
              </Text>
              <Text style={styles.modalMessage}>
                🌟 Features:
                {"\n"}- Interactive 3D anatomy models
                {"\n"}- Quizzes to test your knowledge
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton2]}
              onPress={() => setShowAboutModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
header: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#FFB84D",
  marginBottom: 20,
  textAlign: "center",  // Centers text horizontally
  alignSelf: "center",  // Ensures the element is centered
},

  historyContainer: {
    flexDirection: "row", // Align cards in a row
    alignItems: "center",
    paddingVertical: 20,
  },
  quizCard: {
    width: 200, // Set fixed width for consistency
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10, // Space between boxes
    elevation: 5, // Shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  attemptText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFB84D",
    marginBottom: 5,
  },
  quizText: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 3,
  },
  dateText: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 5,
  },
  noDataText: {
    fontSize: 18,
    color: "#FFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#0D2538",
  },
  content: {
    paddingTop: 40,
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFB84D",
  },
  profileCard: {
    backgroundColor: "#26334B",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFB84D",
    marginVertical: 10,
  },
  emailText: {
    fontSize: 18,
    color: "#A1C4D4",
  },

  infoCard: {
    backgroundColor: "#26334B",
    width: "90%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    color: "#FFB84D",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    color: "#E4E8E1",
    fontSize: 16,
  },
  linkContainer: {
    // marginTop: 20,
  },
  linkText: {
    color: "#FFB84D", // Gold color for links
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    paddingTop:8,
  },
  logoutButton: {
    backgroundColor: "#cc0000",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#1E2A38",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalContainer2: {
    width: "80%",
    backgroundColor: "#1E2A38",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: 370, // Set a fixed height for the modal
  },
  modalTitle: {
    color: "#FFB84D",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalMessage: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#FFB84D",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButton2: {
    backgroundColor: "#FFB84D",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutModalButton: {
    backgroundColor: "#cc0000",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Profile;

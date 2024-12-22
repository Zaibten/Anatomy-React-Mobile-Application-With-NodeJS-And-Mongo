import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  ScrollView,
  Modal,
  BackHandler,
} from "react-native";
import axios from "axios"; // Import axios for making the POST request
import quizData from "../quiz.json"; // Adjust the path based on your project structure
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import ParticleEffect from "./ParticleEffect";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [incorrectLinks, setIncorrectLinks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const correctIcon = require("../assets/check.png");
  const incorrectIcon = require("../assets/cross.png");
  const [timer, setTimer] = useState(120);
  const [userEmail, setUserEmail] = useState("");
  const [userToken, setUserToken] = useState(""); // Store user token
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false); // State for the exit modal
  const [errorMessage, setErrorMessage] = useState(""); // Add this line


  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    } else {
      // Trigger the next question or handle timeout
      setQuizCompleted(true);
      setTimeout(() => {
        setShowScore(true); // Show the score after completion
      }, 500); // Delay showing score
      setTimer(120); // Reset timer for the next question if needed, but won't trigger a quiz restart
    }
  }, [timer]);

  // useEffect to handle the sending of the email once the quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      sendEmail(); // Send email when the quiz is completed
    }
  }, [quizCompleted]);
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
  
  const sendEmail = async () => {
    try {
      // Save Basic Quiz data in MongoDB
      const email = userEmail; // Replace with the logged-in user's email
      await axios.post("https://anatomy-two.vercel.app/save-basic-quiz", {
        email,
        score, // BasicQuizMarks
      });
  
      console.log("Quiz data saved successfully!");
  
      // Send the completion email
      await axios.post("https://anatomy-two.vercel.app/send-quiz-completion-email", {
        email, 
        score,
        incorrectLinks,
      });
  
      console.log("Email sent successfully!");
    } catch (error) {
      //console.error("Error saving quiz data or sending email:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    const shuffledQuestions = quizData.questions.sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    if (!quizCompleted && questions.length > 0) {
      loadRandomQuestion();
    }
  }, [quizCompleted, questions]);

  const loadRandomQuestion = () => {
    if (answeredQuestions.length === 20) {
      setQuizCompleted(true); // Set quiz as completed after 20 questions
      setTimeout(() => {
        setShowScore(true); // Show score after completion
      }, 500);
      return;
    }
  
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (answeredQuestions.includes(randomIndex));
  
    setAnsweredQuestions([...answeredQuestions, randomIndex]);
    setCurrentQuestion(questions[randomIndex]);
    setAnswerStatus(null);
    setSelectedAnswer(null);
    setDisabled(false);
  };

  const resetQuiz = () => {
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setShowScore(false);
    setProgress(new Animated.Value(0));
    setIncorrectLinks([]);
  };

  const handleAnswer = (selectedAnswer) => {
    setSelectedAnswer(selectedAnswer);
    setDisabled(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setAnswerStatus("correct");
    } else {
      setIncorrectLinks([
        ...incorrectLinks,
        { question: currentQuestion.question, link: currentQuestion.link },
      ]);
      setAnswerStatus("incorrect");
    }

    setTimeout(() => {
      loadRandomQuestion();
    }, 2000);
    animateProgress();
  };

  const animateProgress = () => {
    Animated.timing(progress, {
      toValue: answeredQuestions.length / 20,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };


  useEffect(() => {
    const backAction = () => {
      setShowExitModal(true); // Show the exit modal when the back button is pressed
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove(); // Cleanup the event listener when the component is unmounted
  }, []);

  const handleExitConfirmation = (exit) => {
    if (exit) {
      navigation.navigate("HOME", { screen: "Quiz" }); // Navigate to HOME screen if user confirms exit
    }
    setShowExitModal(false); // Close the modal after user's choice
  };
  
  
  if (quizCompleted) {
    return (
      <View style={styles.container}>
       <ParticleEffect imageSource={require("../assets/particles.png")} />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.resultText}>🎉 Quiz Completed!</Text>
          <Text style={styles.resultText}>Your Score: {score}/20</Text>
          {score >= 17 ? (
            <Text style={styles.emoji}>🏆</Text>
          ) : score >= 14 ? (
            <Text style={styles.emoji}>👏</Text>
          ) : (
            <Text style={styles.emoji}>💡</Text>
          )}
          {incorrectLinks.length > 0 && (
            <View style={styles.linksContainer}>
              <Text style={styles.linksHeader}>Improve Your Knowledge:</Text>
              {incorrectLinks.map((item, index) => (
                <Text key={index} style={styles.linkText}>
                  {item.question}: {item.link}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.emailSuccessText}>
            📧 Email sent to you successfully!
          </Text>
        </ScrollView>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HOME", { screen: "Quiz" })}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
      </View>
    );
  }


  if (showScore) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Your Score: {score}/20</Text>
      </View>
    );
  }

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      {!quizCompleted && (
        <Image
          source={require("../assets/quiz-bg.png")}
          style={styles.image}
        />
      )}
      
      <Text style={styles.timerText}>⏳ Time Left: {timer}s</Text>
      {/* <Text style={styles.title}>🧠 Basic Quiz</Text> */}
      <Text style={styles.score}>⭐ Score: {score}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Exit Confirmation Modal */}
{/* Exit Confirmation Modal */}
<Modal
  visible={showExitModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowExitModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Image
        source={require("../assets/1.png")} // Replace with your actual image path
        style={styles.modalLogo}
      />
      <Text style={styles.modalTitle}>Are you sure you want to exit?</Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => handleExitConfirmation(true)}
        >
          <Text style={styles.modalButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => handleExitConfirmation(false)}
        >
          <Text style={styles.modalButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>



      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let optionStyle = styles.optionButton;
          let icon = null;
          if (selectedAnswer) {
            if (selectedAnswer === currentQuestion.correctAnswer) {
              if (option === selectedAnswer) {
                optionStyle = [optionStyle, { backgroundColor: "#32cd32" }];
                icon = correctIcon;
              } else {
                optionStyle = [optionStyle, { backgroundColor: "#9e9e9e" }];
              }
            } else {
              if (option === selectedAnswer) {
                optionStyle = [optionStyle, { backgroundColor: "#f44336" }];
                icon = incorrectIcon;
              } else if (option === currentQuestion.correctAnswer) {
                optionStyle = [optionStyle, { backgroundColor: "#32cd32" }];
                icon = correctIcon;
              } else {
                optionStyle = [optionStyle, { backgroundColor: "#9e9e9e" }];
              }
            }
          }

          const labels = ["A", "B", "C", "D"];

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleAnswer(option)}
              disabled={disabled}
            >
              <Text style={styles.optionLabel}>{labels[index]}</Text>
              <Text style={styles.optionText}>{option}</Text>
              {icon && <Image source={icon} style={styles.icon} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  score: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 15,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6347", // Tomato red for urgency
    marginVertical: 10,
    textAlign: "center",
  },
  optionLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  progressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#32cd32",
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 40,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  emailSuccessText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32cd32",
    marginTop: 20,
    textAlign: "center",
  },
  linksContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  linksHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emoji: {
    fontSize: 50,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#2196F3', // Blue color
    borderRadius: 30, // Rounded corners
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 20,
    elevation: 5, // Shadow effect on Android
    shadowColor: '#000', // Shadow effect on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White color
    textAlign: 'center',
  },
modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
  fontSize: 18,
  fontWeight: "bold",
  color: "#d9534f", // Error red color
  marginBottom: 15,
  textAlign: "center",
},
modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},
modalButton: {
  backgroundColor: "#17a2b8", // Teal button color
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
  width: "45%", // Adjust width for two buttons
},
modalButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},

});
export default Quiz;

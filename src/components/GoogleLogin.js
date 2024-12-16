import { Image, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const GoogleSigninScreen = () => {
  useEffect(() => {
    // Configure GoogleSignin with your Web Client ID
    GoogleSignin.configure({
      webClientId: '231264600518-373kfub3ssbur7ontvgh74ivlpv2c295.apps.googleusercontent.com', // Replace with your Web Client ID
    });
  }, []);

  const signIn = async () => {
    try {
      // Ensure that Play Services are available before continuing
      await GoogleSignin.hasPlayServices();

      // Sign in using Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      
      // Optionally, revoke access if you want to clean up
      await GoogleSignin.revokeAccess();
      
      console.warn(userInfo.user); // Handle the signed-in user info
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User canceled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else {
        console.log(error); // Handle any other errors
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.signupButton} onPress={() => { signIn(); console.log('Button clicked'); }}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require('../assets/1.png')} // Replace with your logo or icon
        />
      </Pressable>
    </View>
  );
};

export default GoogleSigninScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
  },
  signupButton: {
    justifyContent: 'center',
    backgroundColor: 'pink',
    width: 300,
    height: 46,
    borderRadius: 15,
    marginTop: 25,
    alignItems: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  // We are using Anonymous Login for Expo Go testing because Native Google Sign-In 
  // requires you to build a custom Dev Client (npx expo run:android).
  const signIn = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-sky-50 px-8">
      <Text className="text-5xl font-extrabold text-sky-900 mb-4 tracking-tight">DoIT</Text>
      <Text className="text-base text-sky-700 mb-12 text-center leading-relaxed">
        Stay organized with an automated cleaning rotation and never fight over chores again.
      </Text>
      
      <TouchableOpacity 
        onPress={signIn}
        disabled={loading}
        className="w-full bg-white flex-row items-center justify-center px-6 py-4 rounded-2xl shadow-sm border border-sky-100 flex-none"
      >
        {loading ? (
          <ActivityIndicator color="#0ea5e9" />
        ) : (
          <Text className="text-lg font-bold text-sky-900 ml-2 text-center">
            Log in to Test App (Expo Go)
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

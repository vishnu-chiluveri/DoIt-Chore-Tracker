import './global.css';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './src/services/firebase';
import * as Linking from 'expo-linking';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = Linking.useURL();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle Deep Linking / Invite URLs
  useEffect(() => {
    const handleInvite = async () => {
      if (url && user) {
        try {
          const parsedUrl = Linking.parse(url);
          // check if it's the invite path
          if (parsedUrl.path === 'invite') {
            const groupId = parsedUrl.queryParams?.groupId || parsedUrl.queryParams?.groupid;
            if (groupId) {
              // Join the group in Firestore
              const docRef = doc(db, 'groups', groupId);
              await updateDoc(docRef, {
                members: arrayUnion(user.uid),
                [`memberNames.${user.uid}`]: user.displayName || 'New Member',
                messages: arrayUnion({
                  text: `${user.displayName || 'New Member'} joined the room`,
                  timestamp: new Date().toISOString()
                })
              });
              Alert.alert("Success", "You have joined the household!");
            }
          }
        } catch (error) {
          console.error("Deep link handler error:", error);
          Alert.alert("Invite Error", "Could not join the group. It may no longer exist.");
        }
      }
    };
    
    // We only want to handle the invite if we have a resolved user.
    // If user is null, they will be sent to the login screen, and this will re-run after login.
    if (!loading) {
        handleInvite();
    }
  }, [url, user, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Define generic navigation linking configuration
  const prefix = Linking.createURL('/');
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'home',
        Dashboard: 'dashboard',
        CreateGroup: 'create',
        Login: 'login',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <RootNavigator user={user} />
    </NavigationContainer>
  );
}

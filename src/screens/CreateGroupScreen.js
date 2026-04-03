import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking as NativeLinking } from 'react-native';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import * as Linking from 'expo-linking';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }

    // Assign a random cool name to anonymous users if they don't have one
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    const displayName = user.displayName || 'Admin';

    try {
      setLoading(true);

      const groupData = {
        name: groupName,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        tasks: [], // Tasks are now blank
        taskIcons: [],
        members: [user.uid],
        memberNames: { [user.uid]: displayName },
        initialOrder: [],
        rotationStartDate: null,
        messages: [{
          text: `${displayName} created the room`,
          timestamp: new Date().toISOString()
        }]
      };

      const docRef = await addDoc(collection(db, 'groups'), groupData);
      
      const expUrl = Linking.createURL('invite', { queryParams: { groupId: docRef.id } });
      const message = `Join my chore group on DoIT! Copy this link and paste it in Chrome: ${expUrl}`;
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

      Alert.alert(
        'Group Created!',
        `Your group was created successfully.`,
        [
          { 
            text: 'Share via WhatsApp', 
            onPress: () => {
              NativeLinking.canOpenURL(whatsappUrl).then(supported => {
                if (supported) {
                  NativeLinking.openURL(whatsappUrl);
                } else {
                  Alert.alert("WhatsApp not installed", expUrl);
                }
              });
              navigation.replace('Dashboard');
            }
          },
          { text: 'Go to Room', onPress: () => navigation.replace('Dashboard', { groupId: docRef.id }) }
        ]
      );

    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter a Group ID.');
      return;
    }
    const user = auth.currentUser;
    if (!user) return;

    setJoining(true);
    try {
      const docRef = doc(db, 'groups', joinCode.trim());
      await updateDoc(docRef, {
        members: arrayUnion(user.uid),
        [`memberNames.${user.uid}`]: user.displayName || 'New Member',
        messages: arrayUnion({
          text: `${user.displayName || 'New Member'} joined the room`,
          timestamp: new Date().toISOString()
        })
      });
      Alert.alert('Success', 'You joined the group!');
      navigation.replace('Dashboard', { groupId: joinCode.trim() });
    } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Could not join. Check if the Group ID is correct.');
    } finally {
        setJoining(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6 pt-12">
      <Text className="text-3xl font-bold text-gray-900 mb-2">Add a Room</Text>
      <Text className="text-gray-500 mb-8">Join an existing household or create a brand new one.</Text>

      {/* JOIN EXISTING SECTION */}
      <View className="w-full bg-indigo-50 p-5 rounded-3xl mb-8 border border-indigo-100 shadow-sm">
        <Text className="text-indigo-800 font-bold mb-3 text-lg">Join Existing Group</Text>
        <TextInput
          className="bg-white border border-indigo-200 rounded-xl px-4 py-3 mb-3 text-base"
          placeholder="Paste Group ID here..."
          value={joinCode}
          onChangeText={setJoinCode}
        />
        <TouchableOpacity 
          className="bg-indigo-600 px-6 py-4 rounded-xl shadowflex flex-row justify-center items-center"
          onPress={handleJoinByCode}
          disabled={joining}
        >
          {joining ? (
              <ActivityIndicator color="white" />
          ) : (
              <Text className="text-white text-center font-bold text-lg">Join by Code</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-gray-400 font-bold text-center mb-8 uppercase tracking-widest text-xs">Or completely new</Text>

      {/* CREATE NEW SECTION */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Create New Household</Text>
        <TextInput 
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg"
          placeholder="e.g. Test Household"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      <TouchableOpacity 
        className="bg-blue-600 rounded-xl py-4 flex-row justify-center items-center shadow-md mb-8 mt-2"
        onPress={handleCreateGroup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Create Group & Get Invite Link</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 mb-12">
          <Text className="text-center text-gray-500">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

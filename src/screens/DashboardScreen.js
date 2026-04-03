import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { calculateCurrentAssignments, getCurrentWeekNumber } from '../services/rotation';

export default function DashboardScreen({ route, navigation }) {
  const { groupId } = route.params || {};
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin Panel State
  const [customTasks, setCustomTasks] = useState(['', '', '', '']); // Start with 4 blank inputs
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !groupId) return;

    const docRef = doc(db, 'groups', groupId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().members.includes(user.uid)) {
        setGroup({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Group was deleted or user left
        setGroup(null);
        navigation.replace('Home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);



  const handleAddCustomTaskRow = () => {
    setCustomTasks([...customTasks, '']);
  };

  const updateCustomTask = (text, index) => {
    const newTasks = [...customTasks];
    newTasks[index] = text;
    setCustomTasks(newTasks);
  };

  const shuffleArray = (array) => {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const handleStartCycle = async () => {
    const finalTasks = customTasks.filter(t => t.trim() !== '');
    if (finalTasks.length === 0) {
      Alert.alert('Error', 'Please define at least one task before starting.');
      return;
    }

    const user = auth.currentUser;
    
    // Assign random initial order
    const numMembers = group.members.length;
    const initialOrder = shuffleArray(Array.from({length: numMembers}, (_, i) => i));
    const icons = finalTasks.map(() => '📋');

    try {
      const docRef = doc(db, 'groups', group.id);
      await updateDoc(docRef, {
        tasks: finalTasks,
        taskIcons: icons,
        initialOrder: initialOrder,
        rotationStartDate: serverTimestamp(),
        messages: [...(group.messages || []), {
          text: `${user.displayName || 'Admin'} finalized tasks and started the cycle!`,
          timestamp: new Date().toISOString()
        }]
      });
      Alert.alert('Success', 'The weekly cycle has begun!');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group? It will be permanently removed for everyone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'groups', group.id));
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this household?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Leave", 
          style: "destructive",
          onPress: async () => {
             try {
                const user = auth.currentUser;
                const newMembers = group.members.filter(uid => uid !== user.uid);
                await updateDoc(doc(db, 'groups', group.id), {
                   members: newMembers,
                   messages: arrayUnion({
                      text: `${user.displayName || 'A member'} left the room.`,
                      timestamp: new Date().toISOString()
                   })
                });
             } catch (e) {
                Alert.alert("Error", e.message);
             }
          }
        }
      ]
    );
  };



  if (!group || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const user = auth.currentUser;
  const isAdmin = group.createdBy === user?.uid;
  const isStarted = group.tasks && group.tasks.length > 0 && group.rotationStartDate;
  
  const assignments = isStarted ? calculateCurrentAssignments(group) : null;
  const weekNumber = isStarted ? getCurrentWeekNumber(group.rotationStartDate) : 0;
  const myAssignment = assignments ? assignments[user?.uid] : null;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6 pt-12">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.navigate('Home')} className="mr-4 p-2 bg-gray-200 rounded-full">
          <Text className="text-gray-600 font-bold px-2 text-lg">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 font-medium">Hello, {user?.displayName || 'Test User'}</Text>
          <Text className="text-3xl font-black text-gray-900">{group.name}</Text>
          <Text className="text-xs text-gray-400 mt-1">{group.members.length} members in this room</Text>
        </View>
      </View>

      {/* BEFORE ROTATION STARTS - WAITING / ADMIN STATE */}
      {!isStarted && (
        <View className="bg-amber-50 p-6 rounded-3xl border border-amber-200 mb-8 shadow-sm">
          <Text className="text-xl font-bold text-amber-900 mb-2">Cycle hasn't started yet</Text>
          
          {isAdmin ? (
            <View>
              <Text className="text-amber-800 mb-6 font-medium">As the admin, define the chores for your house below and start the cycle.</Text>
              
              {customTasks.map((t, idx) => (
                <TextInput
                  key={idx}
                  className="bg-white border border-amber-300 rounded-xl px-4 py-3 mb-3 text-base text-gray-800"
                  placeholder={`e.g. Kitchen Cleaning (Task ${idx + 1})`}
                  value={customTasks[idx]}
                  onChangeText={(val) => updateCustomTask(val, idx)}
                />
              ))}

              <TouchableOpacity onPress={handleAddCustomTaskRow} className="mb-6 self-start mt-1">
                <Text className="text-amber-600 font-bold px-2 py-1">+ Add Another Work</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-amber-500 px-6 py-4 rounded-xl shadow-md w-full"
                onPress={handleStartCycle}
              >
                <Text className="text-white text-center font-bold text-lg">Start Cycle 🎲</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-amber-800 font-medium">
              Waiting for the Admin to set up the chores and start the weekly schedule. 
              Hang tight! Once they click physical start, you will get assigned randomly.
            </Text>
          )}
        </View>
      )}

      {/* AFTER ROTATION STARTS - MY DASHBOARD */}
      {isStarted && (
        <>
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
            <View className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-10 -mt-10"></View>
            <Text className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">Your Chore • Week {weekNumber}</Text>
            {myAssignment ? (
              <View className="flex-row items-center mt-2">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-3xl">{myAssignment.taskIcon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-black text-gray-900 leading-tight">{myAssignment.taskName}</Text>
                  <Text className="text-gray-500 font-medium mt-1">Don't forget to do it this week! 💪</Text>
                </View>
              </View>
            ) : (
              <View className="py-4">
                <Text className="text-xl font-bold text-gray-800">No task this week</Text>
                <Text className="text-gray-500 mt-2">You get a break! 🛋️</Text>
              </View>
            )}
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-4 px-1">Roommate Cycle</Text>
          
          <View className="mb-8">
            {group.members.map((memberUid) => {
              const assignment = assignments ? assignments[memberUid] : null;
              const memberName = group.memberNames?.[memberUid] || 'Unknown';
              const isMe = memberUid === user.uid;

              return (
                <View key={memberUid} className={`flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border ${isMe ? 'border-indigo-200 bg-indigo-50/20' : 'border-gray-50'}`}>
                  <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">{assignment ? assignment.taskIcon : '⏳'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base">{memberName} {isMe && '(You)'}</Text>
                    <Text className="text-gray-500">{assignment ? assignment.taskName : 'Pending'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* ACTIVITY FEED */}
      <View className="mb-12">
        <Text className="text-lg font-bold text-gray-900 mb-4 px-1">Room Activity</Text>
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
          {group.messages && group.messages.length > 0 ? (
            group.messages
              .slice()
              .reverse()
              .map((msg, idx) => {
                const date = new Date(msg.timestamp);
                const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                return (
                  <View key={idx} className="flex-row items-center border-b border-gray-50 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                    <Text className="text-gray-400 text-xs mr-3 w-12">{timeStr}</Text>
                    <Text className="text-gray-700 text-sm font-medium flex-1">{msg.text}</Text>
                  </View>
                );
              })
          ) : (
            <Text className="text-gray-500 text-sm italic">No activity yet.</Text>
          )}
        </View>
      </View>

      {/* ADMIN PERIPHERALS */}
      {isAdmin ? (
        <TouchableOpacity 
          onPress={handleDeleteGroup}
          className="border border-red-200 bg-white rounded-2xl p-4 mb-16 flex-row justify-center shadow-sm"
        >
          <Text className="text-red-500 font-bold text-center">Delete Group (Admin Only)</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={handleLeaveGroup}
          className="border border-red-200 bg-white rounded-2xl p-4 mb-16 flex-row justify-center shadow-sm"
        >
          <Text className="text-red-500 font-bold text-center">Leave Household</Text>
        </TouchableOpacity>
      )}

      <View className="h-16" />
    </ScrollView>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedGroups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(fetchedGroups);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 relative">
      <ScrollView className="flex-1 p-6 pt-12">
        <View className="flex-row justify-between items-start mb-8">
          <View>
            <Text className="text-sm text-gray-500 font-medium">Hello, {auth.currentUser?.displayName || 'Test User'}</Text>
            <Text className="text-3xl font-black text-gray-900">Your Rooms</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            <Text className="text-red-500 font-bold text-sm">Log out</Text>
          </TouchableOpacity>
        </View>

        {groups.length === 0 ? (
          <View className="bg-white p-8 rounded-3xl border border-gray-100 items-center justify-center mt-10 shadow-sm">
            <Text className="text-4xl mb-4">🏠</Text>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Rooms Yet</Text>
            <Text className="text-gray-500 text-center mb-6">You aren't in any households. Tap the + icon below to create or join one!</Text>
          </View>
        ) : (
          <View className="space-y-4 mb-24">
            {groups.map(group => (
              <TouchableOpacity 
                key={group.id}
                onPress={() => navigation.navigate('Dashboard', { groupId: group.id })}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{group.name}</Text>
                  <Text className="text-sm text-gray-500">{group.members.length} members</Text>
                </View>
                <Text className="text-2xl text-gray-300">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('CreateGroup')}
        className="absolute bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-300"
      >
        <Text className="text-white text-4xl leading-none font-light mb-1">+</Text>
      </TouchableOpacity>
    </View>
  );
}

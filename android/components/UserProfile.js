import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { URL_BASE } from '@env';

function UserProfile() {
  const accessToken = useSelector((state) => state.token.accessToken);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${URL_BASE}/profile/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        Alert.alert('Failed to fetch profile', 'Check your internet connection');
        return;
      }

      const data = await response.json();
      setUsername(data.username);
      setEmail(data.email);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${URL_BASE}/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
        }),
      });

      if (!response.ok) {
        Alert.alert('Failed to update profile', 'Check your internet connection');
        return;  
      }

      Alert.alert("Successfully",'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 220,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default UserProfile;

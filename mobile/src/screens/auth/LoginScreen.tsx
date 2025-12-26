import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AuthService } from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore
const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      await AuthService.requestOTP(phoneNumber);
      navigation.navigate('OTP', { phoneNumber });
    } catch (error) {
      Alert.alert('Error', 'Failed to request OTP. Check your network.');
    }
  };

  const handleVisitorAccess = async () => {
    // Clear any existing session to ensure we are truly a visitor
    await AuthService.logout();

    // Navigate to the 'AppTabs' screen which is defined in the RootNavigator
    // We use dispatch with reset to clear the history so the user can't go back to login
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to R Community</Text>
      <Text style={styles.subtitle}>The dedicated space for Riders</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button title="Get OTP" onPress={handleLogin} />

      <View style={styles.footer}>
        <Text style={styles.link} onPress={handleVisitorAccess}>
          Continue as Visitor
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark mode background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#4FA5F5',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

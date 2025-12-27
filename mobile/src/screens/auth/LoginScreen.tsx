import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AuthService } from '../../services/auth.service';

// @ts-ignore
const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    if (phoneNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      await AuthService.requestOTP(phoneNumber);
      setIsLoading(false);
      navigation.navigate('OTP', { phoneNumber });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to request OTP. Please check your connection and try again.');
    }
  };

  const handleVisitorAccess = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Clear any existing session to ensure we are truly a visitor
    await AuthService.logout();

    setIsLoading(false);

    // Navigate to the 'AppTabs' screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
          <View style={styles.contentContainer}>
              <Text style={styles.title}>R Community</Text>
              <Text style={styles.subtitle}>The dedicated space for Riders</Text>

              <View style={styles.formContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 9876543210"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={10}
                  />

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Get OTP</Text>
                    )}
                  </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity onPress={handleVisitorAccess} disabled={isLoading}>
                    <Text style={styles.link}>Continue as Visitor</Text>
                </TouchableOpacity>
              </View>
          </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 48,
    textAlign: 'center',
  },
  formContainer: {
      marginBottom: 24,
  },
  label: {
      color: '#ddd',
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
      backgroundColor: '#2196F3',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
  },
  buttonDisabled: {
      backgroundColor: '#1565C0',
      opacity: 0.7,
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: '#64B5F6', // Light blue
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

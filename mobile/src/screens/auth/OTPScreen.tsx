import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AuthService } from '../../services/auth.service';

// @ts-ignore
const OTPScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 6) {
        Alert.alert('Error', 'OTP must be 6 digits');
        return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await AuthService.verifyOTP(phoneNumber, otp);
      setIsLoading(false);
      if (response.success) {
        // Successful login, navigate to the main App Tabs
        // Reset the navigation state to ensure the user can't go back to the OTP screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AppTabs' }],
          })
        );
      } else {
        Alert.alert('Error', response.message || 'Invalid OTP');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>Enter the 6-digit code sent to {phoneNumber}</Text>

              <View style={styles.formContainer}>
                  <Text style={styles.label}>OTP Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 123456"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                  />

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleVerify}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Verify & Login</Text>
                    )}
                  </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                    <Text style={styles.link}>Back to Login</Text>
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
    fontSize: 28,
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
      color: '#64B5F6',
      fontSize: 16,
  }
});

export default OTPScreen;

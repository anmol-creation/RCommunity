import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { VerificationService } from '../../services/verification.service';
import { AuthService } from '../../services/auth.service';

const VerificationScreen = () => {
  const [status, setStatus] = useState('UNVERIFIED');
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useFocusEffect(
      useCallback(() => {
          checkStatus();
      }, [])
  );

  const checkStatus = async () => {
      try {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
          if (user) setStatus(user.verificationStatus);

          const req = await VerificationService.getStatus();
          if (req) {
             setStatus(req.status);
             setRequestId(req.id);
          }
      } catch (e) {}
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      // Try simulation upload first for this environment
      await VerificationService.uploadSimulation();

      Alert.alert('Success', 'Verification submitted! We will notify you once approved.');
      checkStatus(); // Refresh status
    } catch (error) {
      Alert.alert('Error', 'Failed to upload verification request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAdminApproval = async () => {
      if (!requestId) return;
      setLoading(true);
      await VerificationService.debugApprove(requestId);
      Alert.alert('Admin Action', 'Request Approved via Simulation!');

      // Update local user session to reflect verified status
      if (currentUser) {
          currentUser.verificationStatus = 'VERIFIED';
          // Save back to storage
          const Async = require('@react-native-async-storage/async-storage').default;
          await Async.setItem('user_data', JSON.stringify(currentUser));
      }

      await checkStatus();
      setLoading(false);
  };

  if (status === 'VERIFIED') {
      return (
          <View style={styles.container}>
              <Text style={styles.title}>✅ Verified Rider</Text>
              <Text style={styles.text}>You have full access to R Community.</Text>
          </View>
      )
  }

  if (status === 'PENDING') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.text}>Your document is under review.</Text>
        <Text style={styles.text}>You can continue to use the app in Visitor mode.</Text>

        {/* Debug Button for Demo */}
        <TouchableOpacity style={styles.debugButton} onPress={handleSimulateAdminApproval}>
            <Text style={styles.debugText}>[DEBUG] Simulate Admin Approval</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rider Verification</Text>
      <Text style={styles.text}>
        To unlock full features (posting, commenting), we need to verify you are a delivery rider.
      </Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>How to Verify:</Text>
        <Text style={styles.instructionText}>1. Open your Delivery App (Zomato, Swiggy, etc.)</Text>
        <Text style={styles.instructionText}>2. Go to your Profile.</Text>
        <Text style={styles.instructionText}>3. Take a screenshot showing your Name and Active Status.</Text>
        <Text style={styles.instructionText}>4. Upload it here.</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={loading}>
          {loading ? (
              <ActivityIndicator color="#FFF" />
          ) : (
              <Text style={styles.uploadButtonText}>Simulate Screenshot Upload</Text>
          )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionBox: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
  },
  instructionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  instructionText: {
    color: '#bbb',
    marginBottom: 5,
    fontSize: 14,
  },
  uploadButton: {
      backgroundColor: '#4FA5F5',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
  },
  uploadButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
  },
  debugButton: {
      marginTop: 40,
      padding: 10,
      borderWidth: 1,
      borderColor: '#FFAB40',
      borderRadius: 5,
  },
  debugText: {
      color: '#FFAB40',
      fontFamily: 'monospace',
  }
});

export default VerificationScreen;

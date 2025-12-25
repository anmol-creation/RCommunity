import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { VerificationService } from '../../services/verification.service';

const VerificationScreen = () => {
  const [status, setStatus] = useState('UNVERIFIED');
  // Mock User ID for this session
  const userId = 'user-123';

  const handleUpload = async () => {
    // In a real app, we would use react-native-image-picker here.
    // For this stub, we send a dummy base64 string.
    const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    try {
      Alert.alert('Uploading...', 'Please wait while we verify your ID.');
      const response = await VerificationService.uploadProof(userId, mockImage);

      if (response.success) {
        setStatus('PENDING');
        Alert.alert('Success', 'Verification submitted! We will notify you once approved.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload verification proof.');
    }
  };

  if (status === 'PENDING') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.text}>Your document is under review.</Text>
        <Text style={styles.text}>You can continue to use the app in Visitor mode.</Text>
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

      <Button title="Select Screenshot & Upload" onPress={handleUpload} color="#4FA5F5" />
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
  }
});

export default VerificationScreen;

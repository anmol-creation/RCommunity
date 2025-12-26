import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserService } from '../../services/user.service';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { profile } = route.params as { profile: any };

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [yearsExperience, setYearsExperience] = useState(profile?.yearsExperience?.toString() || '0');
  const [vehicleType, setVehicleType] = useState(profile?.vehicleType || 'BIKE');
  // Simple comma separated for now
  const [platforms, setPlatforms] = useState(profile?.platforms?.join(', ') || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
      try {
          setSaving(true);

          const platformArray = platforms.split(',').map(s => s.trim()).filter(s => s.length > 0);

          await UserService.updateProfile({
              displayName,
              yearsExperience: parseInt(yearsExperience) || 0,
              vehicleType,
              platforms: platformArray
          });

          Alert.alert('Success', 'Profile updated');
          navigation.goBack();
      } catch (error) {
          Alert.alert('Error', 'Failed to update profile');
      } finally {
          setSaving(false);
      }
  };

  const VehicleOption = ({ type, label }: { type: string, label: string }) => (
      <TouchableOpacity
        style={[styles.option, vehicleType === type && styles.optionSelected]}
        onPress={() => setVehicleType(type)}
      >
          <Text style={[styles.optionText, vehicleType === type && styles.optionTextSelected]}>{label}</Text>
      </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            value={yearsExperience}
            onChangeText={setYearsExperience}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.optionsContainer}>
              <VehicleOption type="BIKE" label="Bike" />
              <VehicleOption type="SCOOTER" label="Scooter" />
              <VehicleOption type="EV_SCOOTER" label="EV" />
              <VehicleOption type="CYCLE" label="Cycle" />
          </View>
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Platforms (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={platforms}
            onChangeText={setPlatforms}
            placeholder="Zomato, Swiggy, Zepto..."
            placeholderTextColor="#666"
          />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
              <ActivityIndicator color="#FFF" />
          ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  formGroup: {
      marginBottom: 20,
  },
  label: {
      color: '#BBB',
      marginBottom: 5,
  },
  input: {
      backgroundColor: '#1E1E1E',
      color: '#FFF',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#333',
  },
  optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  option: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#4DB6AC',
      marginRight: 10,
      marginBottom: 10,
  },
  optionSelected: {
      backgroundColor: '#4DB6AC',
  },
  optionText: {
      color: '#4DB6AC',
  },
  optionTextSelected: {
      color: '#FFF',
      fontWeight: 'bold',
  },
  saveButton: {
      backgroundColor: '#4FA5F5',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
  },
  saveButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
  },
});

export default EditProfileScreen;

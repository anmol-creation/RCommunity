import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
  requestOTP: async (phoneNumber: string) => {
    try {
      const response = await api.post('/auth/login', { phoneNumber });
      return response.data;
    } catch (error) {
      console.error('Login Error', error);
      throw error;
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify', { phoneNumber, otp });

      if (response.data.success) {
        // For Phase 1 (Stub), the backend might not send a "token",
        // but it sends the user object.
        // We agreed to use the User ID (or mock-jwt-token) as the token.
        const token = response.data.token || response.data.user.id;

        await AsyncStorage.setItem('user_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Verify Error', error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
  },

  getCurrentUser: async () => {
    const data = await AsyncStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }
};

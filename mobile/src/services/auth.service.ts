import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
  getDeviceId: async () => {
      let deviceId = await AsyncStorage.getItem('device_id');
      if (!deviceId) {
          deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          await AsyncStorage.setItem('device_id', deviceId);
      }
      return deviceId;
  },

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
      const deviceId = await AuthService.getDeviceId();
      const response = await api.post('/auth/verify', { phoneNumber, otp, deviceId });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data;

        if (accessToken) {
            await AsyncStorage.setItem('access_token', accessToken);
        }
        if (refreshToken) {
            await AsyncStorage.setItem('refresh_token', refreshToken);
        }
        if (user) {
            await AsyncStorage.setItem('user_data', JSON.stringify(user));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Verify Error', error);
      throw error;
    }
  },

  logout: async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
    } catch (e) {
        // Ignore logout errors
    }
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user_data');
  },

  getCurrentUser: async () => {
    try {
        const data = await AsyncStorage.getItem('user_data');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
  },

  getRefreshToken: async () => {
      return await AsyncStorage.getItem('refresh_token');
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
  }
};

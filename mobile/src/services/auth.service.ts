import api from './api';

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
      return response.data;
    } catch (error) {
      console.error('Verify Error', error);
      throw error;
    }
  },
};

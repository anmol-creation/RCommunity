import api from './api';

export const VerificationService = {
  uploadProof: async (userId: string, imageBase64: string) => {
    try {
      const response = await api.post('/verification/upload', { userId, imageBase64 });
      return response.data;
    } catch (error) {
      console.error('Upload Error', error);
      throw error;
    }
  },

  checkStatus: async (userId: string) => {
    try {
      const response = await api.get(`/verification/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Status Check Error', error);
      throw error;
    }
  }
};

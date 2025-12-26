import api from './api';

export const VerificationService = {
  uploadScreenshot: async (formData: FormData) => {
    try {
      const response = await api.post('/verification/request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Verification Upload Error', error);
      throw error;
    }
  },

  uploadSimulation: async () => {
      try {
          const response = await api.post('/verification/request', { isSimulation: true });
          return response.data;
      } catch (error) {
          console.error('Simulation Upload Error', error);
          throw error;
      }
  },

  getStatus: async () => {
      try {
          const response = await api.get('/verification/status');
          return response.data.data;
      } catch (error) {
          console.error('Get Verification Status Error', error);
          return null;
      }
  },

  // Simulating Admin Action from Mobile (Debug only)
  debugApprove: async (requestId: string) => {
      try {
          const response = await api.post(`/verification/${requestId}/review`, { status: 'VERIFIED' });
          return response.data;
      } catch (error) {
          console.error('Debug Approve Error', error);
      }
  }
};

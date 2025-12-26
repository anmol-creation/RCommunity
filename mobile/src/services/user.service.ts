import api from './api';

export const UserService = {
  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data.data;
    } catch (error) {
      console.error('UserService getMyProfile error:', error);
      throw error;
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.patch('/users/me', data);
      return response.data.data;
    } catch (error) {
      console.error('UserService updateProfile error:', error);
      throw error;
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('UserService getUserProfile error:', error);
      throw error;
    }
  }
};

import api from './api';

export const ReportService = {
  createReport: async (data: { postId?: string; commentId?: string; reason: string }) => {
    try {
      const response = await api.post('/reports', data);
      return response.data;
    } catch (error) {
      console.error('Report Error', error);
      throw error;
    }
  }
};

import api from './api';

export const FeedService = {
  getFeed: async (page: number = 1) => {
    try {
      const response = await api.get(`/feed?page=${page}`);
      return response.data.data;
    } catch (error) {
      console.error('FeedService getFeed error:', error);
      throw error;
    }
  },

  createPost: async (content: string, imageUrl?: string) => {
    try {
      // userId is now handled via Authorization header
      const response = await api.post('/feed', { content, imageUrl });
      return response.data;
    } catch (error) {
      console.error('FeedService createPost error:', error);
      throw error;
    }
  }
};

import api from './api';

export const FeedService = {
  getFeed: async (page: number = 1, sortBy: 'latest' | 'trending' = 'latest') => {
    try {
      const response = await api.get(`/feed?page=${page}&sortBy=${sortBy}`);
      return response.data.data;
    } catch (error) {
      console.error('FeedService getFeed error:', error);
      throw error;
    }
  },

  createPost: async (content: string, imageUrl?: string) => {
    try {
      const response = await api.post('/feed', { content, imageUrl });
      return response.data;
    } catch (error) {
      console.error('FeedService createPost error:', error);
      throw error;
    }
  },

  toggleLike: async (postId: string) => {
    try {
      const response = await api.post(`/feed/${postId}/like`);
      return response.data.data; // { liked: boolean }
    } catch (error) {
      console.error('FeedService toggleLike error:', error);
      throw error;
    }
  },

  getComments: async (postId: string) => {
    try {
      const response = await api.get(`/feed/${postId}/comments`);
      return response.data.data;
    } catch (error) {
      console.error('FeedService getComments error:', error);
      throw error;
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const response = await api.post(`/feed/${postId}/comments`, { content });
      return response.data.data;
    } catch (error) {
      console.error('FeedService addComment error:', error);
      throw error;
    }
  }
};

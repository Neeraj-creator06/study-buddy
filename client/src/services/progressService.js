import api from './api';

export const progressService = {
  async getProgressStats() {
    const res = await api.get('/progress');
    return res.data;
  },
};

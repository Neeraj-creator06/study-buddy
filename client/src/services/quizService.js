import api from './api';

export const quizService = {
  async getQuizzes() {
    const res = await api.get('/quizzes');
    return res.data;
  },

  async getQuizById(id) {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  },

  async submitQuiz(id, answers, timeSpentSeconds) {
    const res = await api.post(`/quizzes/${id}/submit`, { answers, timeSpentSeconds });
    return res.data;
  },

  async getQuizResults() {
    const res = await api.get('/quizzes/results/history');
    return res.data;
  },
};

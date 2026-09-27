import api from './api';

export const aiService = {
  async generateSummary({ materialId, text }) {
    const res = await api.post('/ai/summary', { materialId, text });
    return res.data;
  },

  async generateFlashcards({ materialId, text, count = 10, difficulty = 'medium', deckTitle }) {
    const res = await api.post('/ai/flashcards', { materialId, text, count, difficulty, deckTitle });
    return res.data;
  },

  async generateQuiz({ materialId, text, count = 10, difficulty = 'medium', questionType = 'multiple_choice', title }) {
    const res = await api.post('/ai/quiz', { materialId, text, count, difficulty, questionType, title });
    return res.data;
  },

  async generateStudyPlan(data) {
    const res = await api.post('/ai/study-plan', data);
    return res.data;
  },

  async askAi({ materialId, question, chatId }) {
    const res = await api.post('/ai/ask', { materialId, question, chatId });
    return res.data;
  },

  async generateImportantQuestions({ materialId, text, difficulty = 'all' }) {
    const res = await api.post('/ai/important-questions', { materialId, text, difficulty });
    return res.data;
  },

  async explainConcept({ concept, isBeginner = true }) {
    const res = await api.post('/ai/explain', { concept, isBeginner });
    return res.data;
  },
};

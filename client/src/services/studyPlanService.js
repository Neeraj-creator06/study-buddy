import api from './api';

export const studyPlanService = {
  async getStudyPlans() {
    const res = await api.get('/study-plans');
    return res.data;
  },

  async updateTaskStatus(planId, taskId, isCompleted) {
    const res = await api.put(`/study-plans/${planId}/tasks/${taskId}`, { isCompleted });
    return res.data;
  },

  async deleteStudyPlan(id) {
    const res = await api.delete(`/study-plans/${id}`);
    return res.data;
  },
};

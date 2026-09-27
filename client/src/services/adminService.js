import api from './api';

export const adminService = {
  async getAdminStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getAllUsers(params) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async toggleUserStatus(userId) {
    const res = await api.put(`/admin/users/${userId}/status`);
    return res.data;
  },

  async deleteUser(userId) {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },
};

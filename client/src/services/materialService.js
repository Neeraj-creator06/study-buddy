import api from './api';

export const materialService = {
  async uploadMaterial(file, title, tags) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (tags) formData.append('tags', tags);

    const res = await api.post('/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getMaterials() {
    const res = await api.get('/materials');
    return res.data;
  },

  async getMaterialById(id) {
    const res = await api.get(`/materials/${id}`);
    return res.data;
  },

  async deleteMaterial(id) {
    const res = await api.delete(`/materials/${id}`);
    return res.data;
  },
};

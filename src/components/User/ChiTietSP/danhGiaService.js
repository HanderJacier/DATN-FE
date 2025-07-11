import apiClient from '/src/api.js';

export default {
  getBySanPham(id) {
    return apiClient.get(`/danhgia/${id}`);
  },
  create(data) {
    return apiClient.post('/danhgia/create', data);
  },
  delete(id) {
    return apiClient.delete(`/danhgia/${id}`);
  },
};
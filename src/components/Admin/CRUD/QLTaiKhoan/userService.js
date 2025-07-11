// src/services/userService.js
import apiClient from '/src/api.js';

const endpoint = '/taikhoan'

const userService = {
  // ✅ Lấy tất cả người dùng
  getAll() {
    return apiClient.get(`${endpoint}/all`)
  },

  // ✅ Lấy người dùng theo ID
  getById(id) {
    return apiClient.get(`${endpoint}/${id}`)
  },

  // ✅ Thêm người dùng mới
  create(user) {
    return apiClient.post(`${endpoint}/create`, user)
  },

  // ✅ Cập nhật người dùng theo ID
  update(id, user) {
    return apiClient.put(`${endpoint}/update/${id}`, user)
  },

  // ✅ Xóa người dùng
  remove(id) {
    return apiClient.delete(`${endpoint}/delete/${id}`)
  },

  // ✅ Lấy thông tin tài khoản từ session
  getCurrentUser() {
    return apiClient.get(`${endpoint}/thongtin`)
  },

  // ✅ Cập nhật thông tin người dùng đang đăng nhập
  updateCurrentUser(data) {
    return apiClient.put(`${endpoint}/capnhat`, data)
  },

  // ✅ Đổi mật khẩu
  changePassword(payload) {
    return apiClient.put(`${endpoint}/doi-mat-khau`, payload)
  }
}

export default userService

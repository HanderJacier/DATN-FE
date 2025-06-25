<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4 text-primary">Đăng nhập Admin</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Tên đăng nhập hoặc email</label>
          <input type="text" id="email" class="form-control" v-model="email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-control"
            v-model="password"
            required
          />
        </div>
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" v-model="showPassword" id="show-password" />
          <label for="show-password" class="form-check-label">Hiện mật khẩu</label>
        </div>
        <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/api.js';
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await apiClient.post('/xacthuc/dangnhap', {
          tenDangNhap: this.email,
          matKhau: this.password
        });

        const data = response.data;
        if (data.vaiTro === 1) {
          // Lưu tên nếu cần dùng sau
          sessionStorage.setItem('hoVaTen', data.hoVaTen);
          sessionStorage.setItem('vaiTro', data.vaiTro);
          this.$router.push('/admin');
        } else {
          this.errorMessage = 'Bạn không phải admin';
        }
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Lỗi đăng nhập.';
      }
    }
  }
};
</script>

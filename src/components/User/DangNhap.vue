<template>
  <div id="app" class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h3 class="text-center text-primary mb-4">Đăng nhập</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Email hoặc SĐT</label>
          <input type="text" class="form-control" v-model="email" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="password" required />
        </div>
        <div class="form-check mb-2">
          <input type="checkbox" class="form-check-input" v-model="showPassword" id="showPassword" />
          <label class="form-check-label" for="showPassword">Hiện mật khẩu</label>
        </div>
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe" />
          <label class="form-check-label" for="rememberMe">Ghi nhớ đăng nhập</label>
        </div>
        <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
      </form>

      <div class="text-center mt-4">
        <p>Bạn chưa có tài khoản?
          <router-link to="/DangKyUser">Đăng ký ngay</router-link>
        </p>
        <p class="text-muted">Hoặc đăng nhập bằng</p>
        <!-- Chỗ này có thể thêm social login sau -->
      </div>
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
      rememberMe: false,
      errorMessage: '',
    };
  },
  methods: {
  async handleLogin() {
    try {
      const response = await apiClient.post('/xacthuc/dangnhap', {
        tenDangNhap: this.email,
        matKhau: this.password,
      });

      const user = response.data;

      // Xóa user cũ (nếu có)
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      // Lưu user mới
      const storage = this.rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));

      // Chuyển hướng và reload
      if (user.vaiTro === 1) {
        this.$router.push('/admin');
      } else {
        this.$router.push('/');
        setTimeout(() => window.location.reload(), 100); // Reload để cập nhật Header
      }
    } catch (error) {
      this.errorMessage = error.response?.data?.message || 'Lỗi đăng nhập.';
    }
  }
}

};
</script>


<!-- Không cần scoped nếu bạn dùng Bootstrap -->
<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>

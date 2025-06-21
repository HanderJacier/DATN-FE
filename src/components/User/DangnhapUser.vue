<template>
  <div id="app">
    <div class="login-container card p-4 shadow border-warning" style="max-width: 400px;">
      <h3 class="text-center text-warning fw-bold">Đăng nhập</h3>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email/Số điện thoại</label>
          <input
            type="text"
            id="email"
            v-model="email"
            class="form-control border-warning"
            placeholder="Nhập email hoặc số điện thoại"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="form-control border-warning"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <div class="mb-3 d-flex justify-content-between align-items-center">
          <div class="form-check">
            <input type="checkbox" v-model="showPassword" id="show-password" class="form-check-input" />
            <label for="show-password" class="form-check-label">Hiện mật khẩu</label>
          </div>
          <div class="form-check">
            <input type="checkbox" v-model="rememberMe" id="remember-me" class="form-check-input" />
            <label for="remember-me" class="form-check-label">Ghi nhớ tôi</label>
          </div>
          <router-link to="/quen-mat-khau" class="text-warning text-decoration-none">Quên mật khẩu?</router-link>
        </div>
        <button type="submit" class="btn btn-warning w-100 fw-bold">Đăng nhập</button>
      </form>
      <div class="alternative-login text-center mt-3">
        <p class="text-muted">
          Chưa có tài khoản? <router-link to="/dangky-user" class="fw-bold text-warning">Đăng ký ngay</router-link>
        </p>
        <p>Hoặc đăng nhập bằng</p>
        
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../../api';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await apiClient.post('/xacthuc/dangnhap', {
          tenDangNhap: this.email,
          matKhau: this.password,
        });

        const data = response.data;
        // Xử lý phân quyền
        if (data.vaiTro === 1) {
          this.$router.push('/dashboard');
        } else {
          this.$router.push('/trang-chu');
        }

      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Đăng nhập thất bại';
        } else {
          this.errorMessage = 'Không thể kết nối đến máy chủ';
        }
      }
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-container {
  background-color: white;
  border-radius: 8px;
}

.logo-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
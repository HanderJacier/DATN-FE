<template>
  <div id="app">
    <div class="register-container">
      <h1>Đăng ký</h1>
      <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Họ và tên" v-model="fullName" required />
        <input type="text" placeholder="Email/Số điện thoại" v-model="email" required />
        <input type="password" placeholder="Mật khẩu" v-model="password" required />
        <input type="password" placeholder="Nhập lại mật khẩu" v-model="confirmPassword" required />
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit">Đăng ký</button>
      </form>
      <div class="alternative-login">
        <p>Bạn đã có tài khoản? 
          <router-link to="/DangNhapUser">Đăng nhập</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/api.js';

export default {
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Mật khẩu không khớp';
        return;
      }

      try {
        const response = await apiClient.post('/xacthuc/dangky', {
          tenDangNhap: this.email,
          matKhau: this.password,
          hoVaTen: this.fullName,
          email: this.email.includes('@') ? this.email : null,
          soDienThoai: !this.email.includes('@') ? this.email : null
        });

        if (response.data.message === 'Đăng ký thành công') {
          this.$router.push('/DangNhapUser');
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Lỗi đăng ký.';
      }
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.register-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2d6cdf;
}

.register-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-container button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-container button:hover {
  background-color: #0056b3;
}

.alternative-login {
  text-align: center;
  margin-top: 15px;
}

.alternative-login p {
  margin: 10px 0;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>


<template>
  <div class="login-container">
    <h2>Đăng nhập Admin</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email hoặc Tên đăng nhập</label>
        <input
          type="text"
          id="email"
          v-model="email"
          placeholder="Nhập email hoặc tên đăng nhập"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary">Đăng nhập</button>
    </form>
    <p>
      Chưa có tài khoản? <router-link to="/DangkyUser">Đăng ký</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenDangNhap: this.email,
            matKhau: this.password,
          }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.message === 'Đăng nhập thành công') {
          if (data.vaiTro === 'ADMIN') {
            sessionStorage.setItem('vaiTro', data.vaiTro);
            sessionStorage.setItem('hoVaTen', data.hoVaTen);
            this.errorMessage = '';
            this.$router.push('/dashboard');
          } else {
            this.errorMessage = 'Tài khoản không phải admin';
          }
        } else {
          this.errorMessage = data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        }
      } catch (error) {
        this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  margin-bottom: 10px;
}
.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #0056b3;
}
</style>

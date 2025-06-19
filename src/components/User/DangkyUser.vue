
<template>
  <div id="app">
    <div class="register-container">
      <h1>Đăng ký</h1>
      <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Họ và tên" v-model="fullName" required />
        <input type="text" placeholder="Email/Số điện thoại" v-model="email" required />
        <input type="password" placeholder="Mật khẩu" v-model="password" required />
        <input type="password" placeholder="Nhập lại mật khẩu" v-model="confirmPassword" required />
        <button type="submit">Đăng ký</button>
      </form>
      <div class="alternative-login">
        <p>Bạn đã có tài khoản? <a href="#">Đăng nhập</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    handleRegister() {
      // Xử lý đăng ký ở đây
      alert(`Đăng ký với: ${this.fullName}, ${this.email}`);
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0; /* Màu nền */
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-container {
  background-color: white;
  border: 0px solid ; /* Đường viền màu xanh */
  border-radius: 8px; /* Bo góc */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px; /* Chiều rộng cố định */
}

.register-container h1 {
  text-align: center;
  margin-bottom: 20px;
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
  background-color: #007bff; /* Màu nút */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-container button:hover {
  background-color: #0056b3; /* Màu khi hover */
}

.alternative-login {
  text-align: center;
  margin-top: 15px;
}

.alternative-login p {
  margin: 10px 0;
}
</style>
<template>
  <div id="app">
    <div class="login-container">
      <h1>Đăng nhập</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Email/Số điện thoại" v-model="email" required />
        <input type="password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" v-model="password" required />
        <div class="checkbox-container">
          <input type="checkbox" v-model="showPassword" id="show-password" />
          <label for="show-password">Hiện mật khẩu</label>
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    handleLogin() {
      alert(`Đăng nhập với: ${this.email}`);
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

.login-container {
  background-color: white;
   border: 0px solid ; /* Đường viền màu xanh */
  border-radius: 8px; /* Bo góc */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px; /* Chiều rộng cố định */
}

.login-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.checkbox-container input {
  margin-left: 5px; /* Khoảng cách giữa checkbox và label */
  
}

.checkbox-container label {
  margin-left: -170px; /* Đặt lại khoảng cách */
  font-size: 16px; /* Kích thước chữ */
  line-height: 1.5; /* Căn chỉnh với checkbox */
  display: block; /* Để label nằm ngang với checkbox */
}

.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #007bff; /* Màu nút */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #0056b3; /* Màu khi hover */
}
</style>
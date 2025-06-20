
<template>
  <div id="app">
    <div class="login-container">
      <h1>Đăng nhập</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Email/Số điện thoại" v-model="email" required />
        <input type="password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" v-model="password" required />
        <div class="checkbox-container">
          <input type="checkbox" v-model="showPassword" id="show-password" />
          <label for="show-password ">Hiện mật khẩu</label>
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <div class="alternative-login">
        <p>Bạn chưa có tài khoản? <a href="#">Đăng ký ngay</a></p>
        <p>Hoặc đăng nhập bằng</p>
        <div class="social-login">
     <button class="google">
     <img src="/src/assets/th (1).jpg"alt="" class="logo-icon"> 
     Google
</button>

<button class="facebook">
  <img src="/src/assets/th.jpg" alt="" class="logo-icon">
  Facebook
</button>
        </div>
      </div>
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
      // Xử lý đăng nhập ở đây
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
  height: 300vh;
}

.login-container {
  background-color: white;
  border: 0px solid ; /* Đường viền màu xanh */
  border-radius: 8px; /* Bo góc */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  width: 400px; /* Chiều rộng cố định */
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
  margin-right: 5px; /* Khoảng cách giữa checkbox và label */
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

.alternative-login {
  text-align: center;
  margin-top: 15px;
}

.alternative-login p {
  margin: 10px 0;
}

.social-login {
  display: flex;
  justify-content: space-between;

}
.logo-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.social-login button {
  flex: 1;
  margin: 0 5px; /* Khoảng cách giữa các nút */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.social-login .google {
  background-color: white; /* Màu Google */
  color: black;
}

.social-login .facebook {
  background-color: white; /* Màu Facebook */
  color: black;
}
</style>
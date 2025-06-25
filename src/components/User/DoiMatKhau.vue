<template>
  <div class="container my-5">
    <h4 class="fw-bold mb-4">Đổi mật khẩu</h4>
    <div class="bg-white border rounded p-4 shadow-sm">
      <form @submit.prevent="doiMatKhau">
        <div class="mb-3">
          <label class="form-label">Mật khẩu hiện tại</label>
          <input type="password" class="form-control" v-model="matKhauCu" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" class="form-control" v-model="matKhauMoi" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Xác nhận mật khẩu mới</label>
          <input type="password" class="form-control" v-model="xacNhanMatKhauMoi" required />
        </div>

        <div class="text-end">
          <button type="submit" class="btn btn-primary">Đổi mật khẩu</button>
        </div>

        <div v-if="message" class="alert mt-3" :class="alertClass">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/api.js';
export default {
  name: "DoiMatKhauPage",
  data() {
    return {
      matKhauCu: "",
      matKhauMoi: "",
      xacNhanMatKhauMoi: "",
      message: "",
      success: false,
    };
  },
  computed: {
    alertClass() {
      return this.success ? "alert alert-success" : "alert alert-danger";
    },
    username() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.tenDangNhap || null;
    },
  },
  methods: {
    async doiMatKhau() {
      if (this.matKhauMoi !== this.xacNhanMatKhauMoi) {
        this.message = "Mật khẩu xác nhận không khớp.";
        this.success = false;
        return;
      }

      try {
  const res = await apiClient.put('/taikhoan/doi-mat-khau', {
    matKhauCu: this.matKhauCu,
    matKhauMoi: this.matKhauMoi,
    xacNhanMatKhauMoi: this.xacNhanMatKhauMoi,
  });
  const data = res.data;
  this.message = data.message;
  this.success = true;

  // Reset form nếu thành công
  this.matKhauCu = "";
  this.matKhauMoi = "";
  this.xacNhanMatKhauMoi = "";
} catch (err) {
  this.message = err.response?.data?.message || "Lỗi kết nối máy chủ";
  this.success = false;
}
    },
  },
};
</script>

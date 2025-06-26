<template>


  <!--Nav-->
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Trang chủ</a>
      </li>
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Tài khoản</a>
      </li>
      <li class="breadcrumb-item active text-muted" aria-current="page">Đổi mật khẩu</li>
    </ol>
  </nav>

  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <div class="bg-light rounded p-3">
          <div class="text-center mb-3">
            <div class="d-flex align-items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar" class="me-2" />
              <h5 class="fw-bold mb-0">Hồ sơ của tôi</h5>
            </div>
          </div>
          <hr />
          <div class="ps-4">
            <h6 class="fw-bold"><i class="bi bi-person-fill"></i> Tài khoản của tôi</h6>
            <ul class="list-unstyled ps-3 mb-3">
              <li><router-link to="/thongtintk" class="text-dark text-decoration-none">Thông tin cá
                  nhân</router-link></li>
              <li><router-link to="/diachinguoidung" class="text-dark text-decoration-none">Địa
                  chỉ</router-link>
              </li>
              <li><router-link to="/doimatkhau" class="text-primary text-decoration-none">> Đổi
                  mật
                  khẩu</router-link></li>
            </ul>

            <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
            <ul class="list-unstyled ps-3 mb-3">
              <li>Lịch sử mua hàng</li>
              <li>Hóa đơn mua hàng</li>
            </ul>

            <router-link to="/sanphamyeuthich" class="text-dark text-decoration-none">
              <h6 class="fw-bold text-danger mb-0">
                <i class="bi bi-heart-fill"></i> Sản phẩm yêu thích
              </h6>
            </router-link>
            <h6 class="fw-bold text-warning mt-3"><i class="bi bi-box-arrow-right"></i> Đăng xuất</h6>
          </div>
        </div>
      </div>

      <!--trang Đổi mật khẩu-->
      <div class="col-md-8">
        <h4 class="fw-bold mb-4">Xác minh tài khoản</h4>
        <div class="bg-white border rounded p-4 shadow-sm">
          <form @submit.prevent="doiMatKhau">

            <div class="text-center mb-auto">
              <img src="https://cdn-icons-png.flaticon.com/512/2874/2874106.png" width="55" alt="shield" class="mb-1" />
              <h5 class="fw-bold">Đổi mật khẩu</h5>
            </div>

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

<template>
  <!-- Nội dung -->
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-8">
        <h4 class="fw-bold mb-4">Thông tin cá nhân</h4>
        <div class="bg-white border rounded p-4 shadow-sm">
          <form @submit.prevent="submitForm">
            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Tên đăng nhập</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="username" disabled />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Họ và tên</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="hoVaTen" />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Email</label>
              <div class="col-sm-9">
                <input type="email" class="form-control" v-model="email" />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Số điện thoại</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="phone" />
              </div>
            </div>

            <div class="text-center w-75 mx-auto">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-pencil-square me-1"></i> Cập nhật thông tin
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue';
import apiClient from '/src/api.js';

export default {
  components: { Slidebar },
  name: 'PersonalInfoPage',
  data() {
    return {
      username: '',
      hoVaTen: '',
      email: '',
      phone: '',
    };
  },
  mounted() {
    this.layThongTinTaiKhoan();
  },
  methods: {
    async layThongTinTaiKhoan() {
      try {
        const res = await apiClient.get('/taikhoan/thongtin', {
          withCredentials: true
        });
        const data = res.data;
        this.username = data.tenDangNhap;
        this.email = data.email;
        this.phone = data.soDienThoai;
        this.hoVaTen = data.hoVaTen;
      } catch (err) {
        console.error(err);
        alert("Không thể tải thông tin tài khoản.");
      }
    },

    async submitForm() {
      try {
        const res = await apiClient.put('/taikhoan/capnhat',
          {
            hoVaTen: this.hoVaTen,
            email: this.email,
            soDienThoai: this.phone
          },
          { withCredentials: true }
        );

        alert("Thông tin đã được cập nhật!");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi cập nhật thông tin");
      }
    }
  }
};
</script>

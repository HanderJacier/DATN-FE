<template>
  <!-- Breadcrumb -->
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Trang chủ</a>
      </li>
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Tài khoản</a>
      </li>
      <li class="breadcrumb-item active text-muted" aria-current="page">Thông tin cá nhân</li>
    </ol>
  </nav>

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
            <div class="text-center mb-3">
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar" class="mb-2" />
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Tên đăng nhập</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="username" />
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

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Giới tính</label>
              <div class="col-sm-9 d-flex align-items-center gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="nam" value="Nam" v-model="gender" />
                  <label class="form-check-label" for="nam">Nam</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="nu" value="Nữ" v-model="gender" />
                  <label class="form-check-label" for="nu">Nữ</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="khac" value="Khác" v-model="gender" />
                  <label class="form-check-label" for="khac">Khác</label>
                </div>
              </div>
            </div>

            <div class="text-end w-75 mx-auto">
              <button type="submit" class="btn btn-primary">Chỉnh sửa thông tin</button>
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
            email: '',
            phone: '',
            gender: '',
            hoVaTen: '',
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

                // 👇 nếu bạn lưu giới tính trong trường khác thì xử lý thêm
                // this.gender = data.gioiTinh;
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

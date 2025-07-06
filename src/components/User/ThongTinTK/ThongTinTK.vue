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

export default {
  components: { Slidebar },
  data() {
    return {
      username: 'Thuy Tien',
      email: 'tranthithuytien@gmail.com',
      phone: '0789 345 123',
      gender: 'Nữ',
    };
  },
  methods: {
    submitForm() {
      alert(`Thông tin đã cập nhật:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}`);
    },
  },
};
</script>

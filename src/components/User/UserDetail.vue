<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb p-2" style="background-color: #eaf0fc;">
      <li class="breadcrumb-item"><router-link to="/" class="text-primary">Trang chủ</router-link></li>
      <li class="breadcrumb-item"><router-link to="/taikhoan" class="text-primary">Tài khoản</router-link></li>
      <li class="breadcrumb-item active text-muted" aria-current="page">Thông tin cá nhân</li>
    </ol>
  </nav>

  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <div class="bg-light rounded p-3">
          <div class="d-flex align-items-center mb-3">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar" class="me-2" />
            <h5 class="fw-bold mb-0">{{ user.hoVaTen }}</h5>
          </div>
          <hr />
          <div class="ps-4">
            <h6 class="fw-bold"><i class="bi bi-person-fill"></i> Tài khoản của tôi</h6>
            <ul class="list-unstyled ps-3 mb-3">
              <li><router-link to="/userDetail" class="text-decoration-none text-primary">› Thông tin cá nhân</router-link></li>
              <li><router-link to="/userAddress" class="text-decoration-none text-dark">Địa chỉ</router-link></li>
              <li><router-link to="/doimatkhau" class="text-decoration-none text-dark">Đổi mật khẩu</router-link></li>
            </ul>

            <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
            <ul class="list-unstyled ps-3 mb-3">
              <li><router-link to="/" class="text-decoration-none text-dark">Lịch sử mua hàng</router-link></li>
              <li><router-link to="/" class="text-decoration-none text-dark">Hóa đơn mua hàng</router-link></li>
            </ul>

            <h6 class="fw-bold text-danger">
              <router-link to="/" class="text-danger text-decoration-none"><i class="bi bi-heart-fill"></i> Sản phẩm yêu thích</router-link>
            </h6>

            <h6 class="fw-bold text-warning mt-3" role="button" @click="logout"><i class="bi bi-box-arrow-right"></i> Đăng xuất</h6>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="col-md-8">
        <h4 class="fw-bold mb-4">Thông tin cá nhân</h4>
        <div class="bg-white border rounded p-4 shadow-sm">
          <form @submit.prevent="submitForm">
            <div class="text-center mb-3">
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar" />
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Họ và tên</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.hoVaTen" required />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Email</label>
              <div class="col-sm-9">
                <input type="email" class="form-control" v-model="form.email" required />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Số điện thoại</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.soDienThoai" required />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Giới tính</label>
              <div class="col-sm-9 d-flex gap-3 align-items-center">
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="Nam" v-model="form.gioiTinh" />
                  <label class="form-check-label">Nam</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="Nữ" v-model="form.gioiTinh" />
                  <label class="form-check-label">Nữ</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="Khác" v-model="form.gioiTinh" />
                  <label class="form-check-label">Khác</label>
                </div>
              </div>
            </div>

            <div class="text-end w-75 mx-auto">
              <button type="submit" class="btn btn-primary">Cập nhật thông tin</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <FooterComponent />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from '../User/Title/Footer.vue'

const router = useRouter()
const user = ref({})
const form = ref({
  hoVaTen: '',
  email: '',
  soDienThoai: '',
  gioiTinh: '',
})

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user'))
  if (!userData) {
    router.push('/dangnhap')
  } else {
    user.value = userData
    form.value.hoVaTen = userData.hoVaTen
    form.value.email = userData.email
    form.value.soDienThoai = userData.soDienThoai
    form.value.gioiTinh = userData.gioiTinh || ''
  }
})

const submitForm = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/taikhoan/capnhat', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // để gửi session
      body: JSON.stringify(form.value),
    })

    const resData = await response.json()
    alert(resData.message || 'Cập nhật thành công')

    const updatedUser = {
      ...user.value,
      hoVaTen: form.value.hoVaTen,
      email: form.value.email,
      soDienThoai: form.value.soDienThoai,
      gioiTinh: form.value.gioiTinh,
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    user.value = updatedUser
  } catch (error) {
    console.error(error)
    alert('Lỗi khi cập nhật thông tin!')
  }
}

const logout = () => {
  localStorage.removeItem('user')
  router.push('/dangnhap')
}
</script>

<style scoped>
/* Style gợi ý (có thể giữ nguyên style của bạn ở trên) */
</style>

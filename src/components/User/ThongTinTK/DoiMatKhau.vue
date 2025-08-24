<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-8">
        <h4 class="fw-bold mb-4">Đổi mật khẩu</h4>
        <div class="bg-white border rounded p-4">
          <form @submit.prevent="submitForm">
            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-4 col-form-label">Mật khẩu hiện tại</label>
              <div class="col-sm-8">
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="formData.oldPassword"
                  required
                />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-4 col-form-label">Mật khẩu mới</label>
              <div class="col-sm-8">
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="formData.newPassword"
                  minlength="6"
                  required
                />
                <div class="form-text">Mật khẩu phải có ít nhất 6 ký tự</div>
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-4 col-form-label">Xác nhận mật khẩu mới</label>
              <div class="col-sm-8">
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="formData.confirmPassword"
                  required
                />
              </div>
            </div>

            <div class="text-center w-75 mx-auto">
              <button type="submit" class="btn btn-primary" :disabled="changeLoading">
                <i class="bi bi-key me-1"></i> 
                {{ changeLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
              </button>
            </div>

            <!-- Thông báo -->
            <div v-if="changeSuccess" class="alert alert-success mt-3 w-75 mx-auto">
              ✅ Đổi mật khẩu thành công!
            </div>
            <div v-if="changeError" class="alert alert-danger mt-3 w-75 mx-auto">
              ❌ {{ changeError }}
            </div>
            <div v-if="validationError" class="alert alert-warning mt-3 w-75 mx-auto">
              ⚠️ {{ validationError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import useChangePassword from '../LoadDB/useChangePassword.js'

export default {
  components: { Slidebar },
  name: 'ChangePasswordPage',
  setup() {
    const {
      changeSuccess,
      changeError,
      changeLoading,
      changePassword
    } = useChangePassword()

    const formData = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const validationError = ref('')

    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const validateForm = () => {
      validationError.value = ''

      if (formData.newPassword.length < 6) {
        validationError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        validationError.value = 'Mật khẩu xác nhận không khớp'
        return false
      }

      if (formData.oldPassword === formData.newPassword) {
        validationError.value = 'Mật khẩu mới phải khác mật khẩu cũ'
        return false
      }

      return true
    }

    const submitForm = async () => {
      if (!validateForm()) return

      const userId = getCurrentUserId()
      if (!userId) {
        validationError.value = 'Vui lòng đăng nhập lại'
        return
      }

      await changePassword(userId, formData.oldPassword, formData.newPassword)

      if (changeSuccess.value) {
        // Reset form
        formData.oldPassword = ''
        formData.newPassword = ''
        formData.confirmPassword = ''
      }
    }

    return {
      formData,
      changeSuccess,
      changeError,
      changeLoading,
      validationError,
      submitForm
    }
  }
}
</script>

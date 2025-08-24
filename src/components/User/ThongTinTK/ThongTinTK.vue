<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-lg-8">
        <h4 class="fw-bold mb-4">Thông tin tài khoản</h4>
        <div class="card border-1 overflow-hidden">
          <!-- Body -->
          <div class="p-4 bg-white">
            <!-- Loading -->
            <div v-if="profileLoading" class="text-center py-5">
              <div class="spinner-border" role="status" />
              <div class="mt-2 text-muted">Đang tải thông tin...</div>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="submitForm" class="mx-auto" style="max-width: 720px;">
              <!-- Username (disabled) -->
              <div class="mb-3">
                <label class="form-label fw-medium">Tên đăng nhập</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    :value="userInfo?.tendangnhap"
                    disabled
                  />
                </div>
              </div>

              <!-- Họ tên -->
              <div class="mb-3">
                <label class="form-label fw-medium">Họ và tên</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="formData.hoveten"
                    placeholder="VD: Nguyễn Văn A"
                    :class="{'is-invalid': nameError}"
                    @blur="validateName"
                  />
                  <div class="invalid-feedback">{{ nameError }}</div>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label fw-medium">Email</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    placeholder="ten@example.com"
                    autocomplete="email"
                    :class="{'is-invalid': emailError}"
                    @input="validateEmail"
                    @blur="validateEmail"
                  />
                  <div class="invalid-feedback">{{ emailError }}</div>
                </div>
              </div>

              <!-- Số điện thoại -->
              <div class="mb-4">
                <label class="form-label fw-medium">Số điện thoại</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="formData.sodienthoai"
                    placeholder="VD: 0901234567"
                    :class="{'is-invalid': phoneError}"
                    @blur="validatePhone"
                  />
                  <div class="invalid-feedback">{{ phoneError }}</div>
                </div>
                <small class="text-muted">Hỗ trợ định dạng Việt Nam: bắt đầu bằng 0, dài 10–11 số.</small>
              </div>

              <!-- Actions -->
              <div class="d-flex align-items-center gap-2">
                <button
                  type="submit"
                  class="btn btn-primary px-4"
                  :disabled="updateLoading"
                >
                  <i class="bi bi-pencil-square me-2"></i>
                  {{ updateLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
                </button>

                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="updateLoading"
                  @click="resetForm"
                  title="Thiết lập lại như ban đầu"
                >
                  <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast container (SweetAlert2 dùng riêng, không cần element) -->
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import Slidebar from '../Title/Slidebar.vue'
import useUserProfile from '../LoadDB/useUserProfile.js'

export default {
  components: { Slidebar },
  name: 'PersonalInfoPage',
  setup() {
    const {
      userInfo,
      updateSuccess,
      updateError,
      profileLoading,
      updateLoading,
      fetchUserProfile,
      updateUserProfile
    } = useUserProfile()

    const original = reactive({
      hoveten: '',
      email: '',
      sodienthoai: ''
    })

    const formData = reactive({
      hoveten: '',
      email: '',
      sodienthoai: ''
    })

    // ===== SweetAlert2 toast helper =====
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true
    })

    // ===== Validation =====
    const emailError = ref('')
    const phoneError = ref('')
    const nameError  = ref('')

    const normalizeEmail = (v) => (v ?? '').trim().toLowerCase()
    const basicEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/

    const isValidEmail = (email) => {
      const e = normalizeEmail(email)
      if (!basicEmailRegex.test(e)) return false
      if (/\s/.test(e)) return false
      if (e.includes('..')) return false
      const [local, domain] = e.split('@')
      if (!local || !domain) return false
      if (local.startsWith('.') || local.endsWith('.')) return false
      if (domain.startsWith('.') || domain.endsWith('.')) return false
      if (!domain.includes('.')) return false
      if (local.length > 64) return false
      if (e.length > 254) return false
      return true
    }

    const validateEmail = () => {
      const e = normalizeEmail(formData.email)
      formData.email = e
      if (!e) emailError.value = 'Email không được để trống'
      else if (!isValidEmail(e)) emailError.value = 'Email không hợp lệ. Ví dụ: ten@example.com'
      else emailError.value = ''
    }

    const isValidVNPhone = (v) => /^0\d{9,10}$/.test(v || '')
    const validatePhone = () => {
      const p = (formData.sodienthoai || '').trim()
      if (!p) { phoneError.value = 'Số điện thoại không được để trống'; return }
      if (!isValidVNPhone(p)) phoneError.value = 'SĐT phải bắt đầu bằng 0 và dài 10–11 số'
      else phoneError.value = ''
    }

    const validateName = () => {
      const n = (formData.hoveten || '').trim()
      if (!n) nameError.value = 'Họ và tên không được để trống'
      else if (n.length < 2) nameError.value = 'Họ và tên quá ngắn'
      else nameError.value = ''
    }

    const validateAll = () => {
      validateName()
      validateEmail()
      validatePhone()
      return !(emailError.value || phoneError.value || nameError.value)
    }

    // ===== Data load & helpers =====
    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const fillFormFromUserInfo = () => {
      formData.hoveten     = userInfo.value?.hoveten || ''
      formData.email       = normalizeEmail(userInfo.value?.email || '')
      formData.sodienthoai = userInfo.value?.sodienthoai || ''
      // lưu bản gốc để hoàn tác
      original.hoveten     = formData.hoveten
      original.email       = formData.email
      original.sodienthoai = formData.sodienthoai
    }

    const loadUserProfile = async () => {
      const userId = getCurrentUserId()
      if (userId) {
        await fetchUserProfile(userId)
        if (userInfo.value) fillFormFromUserInfo()
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Phiên đăng nhập hết hạn',
          text: 'Vui lòng đăng nhập lại.',
          confirmButtonText: 'OK'
        })
      }
    }

    const resetForm = () => {
      formData.hoveten     = original.hoveten
      formData.email       = original.email
      formData.sodienthoai = original.sodienthoai
      emailError.value = ''
      phoneError.value = ''
      nameError.value  = ''
      toast.fire({ icon: 'info', title: 'Đã hoàn tác thay đổi' })
    }

    const submitForm = async () => {
      // Validate trước
      if (!validateAll()) {
        Swal.fire({
          icon: 'error',
          title: 'Thông tin chưa hợp lệ',
          html: `
            <div class="text-start">
              <div>${nameError.value ? '• ' + nameError.value : ''}</div>
              <div>${emailError.value ? '• ' + emailError.value : ''}</div>
              <div>${phoneError.value ? '• ' + phoneError.value : ''}</div>
            </div>
          `,
          confirmButtonText: 'Đã hiểu'
        })
        return
      }

      // Confirm
      const { isConfirmed } = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận cập nhật?',
        text: 'Bạn có chắc muốn lưu thay đổi thông tin cá nhân?',
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        reverseButtons: true
      })
      if (!isConfirmed) return

      const userId = getCurrentUserId()
      if (!userId) {
        Swal.fire({
          icon: 'warning',
          title: 'Phiên đăng nhập hết hạn',
          text: 'Vui lòng đăng nhập lại.',
          confirmButtonText: 'OK'
        })
        return
      }

      await updateUserProfile(userId, formData)

      // Hiển thị theo kết quả từ composable
      if (updateError.value) {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại',
          text: updateError.value || 'Đã có lỗi xảy ra.'
        })
      } else if (updateSuccess.value) {
        toast.fire({ icon: 'success', title: 'Cập nhật thành công' })
        // Cập nhật lại "bản gốc" để nút Hoàn tác hợp lý
        fillFormFromUserInfo()
      } else {
        // Trường hợp không set message trong composable
        toast.fire({ icon: 'success', title: 'Đã lưu thay đổi' })
      }
    }

    onMounted(loadUserProfile)

    return {
      userInfo,
      formData,
      updateSuccess,
      updateError,
      profileLoading,
      updateLoading,
      submitForm,
      resetForm,
      emailError,
      phoneError,
      nameError,
      validateEmail,
      validatePhone,
      validateName
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 20px;
}
.fw-medium { font-weight: 600; }
</style>

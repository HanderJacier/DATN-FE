<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Main -->
      <div class="col-lg-8">
        <h4 class="fw-bold mb-4">Đổi mật khẩu</h4>
        <div class="card border-1 overflow-hidden">
          <div class="p-4 bg-white">
            <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 680px;">
              <!-- Mật khẩu hiện tại -->
              <div class="mb-3">
                <label class="form-label fw-medium">Mật khẩu hiện tại</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input
                    :type="showOld ? 'text' : 'password'"
                    class="form-control"
                    v-model.trim="formData.oldPassword"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="showOld = !showOld" :aria-label="showOld ? 'Ẩn' : 'Hiện'">
                    <i :class="showOld ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Mật khẩu mới -->
              <div class="mb-3">
                <label class="form-label fw-medium">Mật khẩu mới</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-key"></i></span>
                  <input
                    :type="showNew ? 'text' : 'password'"
                    class="form-control"
                    v-model.trim="formData.newPassword"
                    placeholder="Tối thiểu 6 ký tự"
                    @input="updateStrength"
                    minlength="6"
                    required
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="showNew = !showNew" :aria-label="showNew ? 'Ẩn' : 'Hiện'">
                    <i :class="showNew ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>

                <!-- Thanh strength -->
                <div class="mt-2">
                  <div class="progress" style="height: 8px;">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{width: strength.percent + '%'}"
                      :class="strength.barClass"
                    ></div>
                  </div>
                  <small :class="strength.textClass">{{ strength.label }}</small>
                </div>
              </div>

              <!-- Xác nhận mật khẩu mới -->
              <div class="mb-4">
                <label class="form-label fw-medium">Xác nhận mật khẩu mới</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-check2-circle"></i></span>
                  <input
                    :type="showConfirm ? 'text' : 'password'"
                    class="form-control"
                    v-model.trim="formData.confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    :class="{'is-invalid': confirmInvalid}"
                    @input="confirmInvalid = false"
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Ẩn' : 'Hiện'">
                    <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div class="invalid-feedback">Mật khẩu xác nhận không khớp</div>
                </div>
                <small class="text-muted">Gợi ý: kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt để mật khẩu mạnh hơn.</small>
              </div>

              <!-- Actions -->
              <div class="d-flex align-items-center gap-2">
                <button type="submit" class="btn btn-primary px-4" :disabled="changeLoading">
                  <i class="bi bi-arrow-repeat me-2" v-if="changeLoading"></i>
                  <i class="bi bi-key me-2" v-else></i>
                  {{ changeLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" :disabled="changeLoading" @click="resetForm()">
                  <i class="bi bi-arrow-counterclockwise me-1"></i> Hoàn tác
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>  
</template>

<script>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import Slidebar from '@/components/User/Title/Slidebar.vue'
import useChangePassword from '../LoadDB/useChangePassword.js'

export default {
  components: { Slidebar },
  name: 'ChangePasswordPage',
  setup() {
    const { changeSuccess, changeError, changeLoading, changePassword } = useChangePassword()

    const formData = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const showOld = ref(false)
    const showNew = ref(false)
    const showConfirm = ref(false)

    const confirmInvalid = ref(false)

    // SweetAlert2 toast
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true
    })

    // Strength meter (nâng cấp)
    const strength = reactive({
      percent: 0,
      label: 'Yếu',
      barClass: 'bg-danger',
      textClass: 'text-danger'
    })
    const updateStrength = () => {
      const v = formData.newPassword || ''
      let score = 0

      // 1) Độ dài: 6/10/14 ký tự -> 1/2/3 điểm
      if (v.length >= 6)  score += 1
      if (v.length >= 10) score += 1
      if (v.length >= 14) score += 1

      // 2) Đa dạng ký tự: thường / HOA / số / đặc biệt (0..4)
      const hasLower   = /[a-z]/.test(v)
      const hasUpper   = /[A-Z]/.test(v)
      const hasDigit   = /\d/.test(v)
      const hasSpecial = /[^A-Za-z0-9]/.test(v)
      const types = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length
      score += Math.max(0, types - 1) // +0..3

      // 3) Penalty
      if (/(\w)\1{2,}/.test(v)) score -= 1                // 3 ký tự giống nhau liên tiếp
      if (/(0123|1234|2345|3456|4567|5678|6789)/.test(v)) score -= 1 // chuỗi số liên tiếp
      if (/(abcd|qwer|asdf|zxcv)/i.test(v)) score -= 1     // pattern bàn phím

      // chuẩn hoá 0..6
      score = Math.max(0, Math.min(score, 6))

      // Map điểm -> %
      const pctMap = [0, 25, 45, 65, 80, 90, 100]
      const pct = pctMap[score]
      strength.percent = pct

      if (pct < 25) {
        strength.label = 'Rất yếu'; strength.barClass = 'bg-danger';  strength.textClass = 'text-danger'
      } else if (pct < 50) {
        strength.label = 'Yếu';     strength.barClass = 'bg-danger';  strength.textClass = 'text-danger'
      } else if (pct < 70) {
        strength.label = 'Trung bình'; strength.barClass = 'bg-warning'; strength.textClass = 'text-warning'
      } else if (pct < 90) {
        strength.label = 'Mạnh';     strength.barClass = 'bg-info';    strength.textClass = 'text-info'
      } else {
        strength.label = 'Rất mạnh';  strength.barClass = 'bg-success'; strength.textClass = 'text-success'
      }
    }

    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const validateForm = () => {
      if ((formData.newPassword || '').length < 6) {
        Swal.fire({ icon: 'warning', title: 'Mật khẩu mới quá ngắn', text: 'Cần ít nhất 6 ký tự.' })
        return false
      }
      if (formData.oldPassword === formData.newPassword) {
        Swal.fire({ icon: 'warning', title: 'Mật khẩu trùng lặp', text: 'Mật khẩu mới phải khác mật khẩu hiện tại.' })
        return false
      }
      if (formData.newPassword !== formData.confirmPassword) {
        confirmInvalid.value = true
        Swal.fire({ icon: 'error', title: 'Xác nhận không khớp', text: 'Vui lòng nhập lại mật khẩu xác nhận.' })
        return false
      }
      return true
    }

    // resetForm: có tham số silent để không bắn toast khi reset sau khi thành công
    const resetForm = (silent = false) => {
      formData.oldPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
      confirmInvalid.value = false
      updateStrength()
      if (!silent) {
        toast.fire({ icon: 'info', title: 'Đã hoàn tác' })
      }
    }

    const submitForm = async () => {
      if (!validateForm()) return

      const userId = getCurrentUserId()
      if (!userId) {
        Swal.fire({ icon: 'warning', title: 'Phiên đăng nhập hết hạn', text: 'Vui lòng đăng nhập lại.' })
        return
      }

      // Xác nhận
      const { isConfirmed } = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận đổi mật khẩu?',
        text: 'Bạn sẽ dùng mật khẩu mới ở lần đăng nhập tiếp theo.',
        showCancelButton: true,
        confirmButtonText: 'Đổi mật khẩu',
        cancelButtonText: 'Hủy',
        reverseButtons: true
      })
      if (!isConfirmed) return

      await changePassword(userId, formData.oldPassword, formData.newPassword)

      if (changeError.value) {
        Swal.fire({ icon: 'error', title: 'Thất bại', text: changeError.value || 'Đã có lỗi xảy ra.' })
        return
      }

      // THÀNH CÔNG: chỉ hiển thị 1 toast thành công, reset form im lặng
      if (changeSuccess.value) {
        toast.fire({ icon: 'success', title: 'Đổi mật khẩu thành công' })
        resetForm(true) // im lặng, không hiển thị “Đã hoàn tác”
      }
      // Không có nhánh else “Đã cập nhật” để tránh gây hiểu nhầm.
    }

    return {
      formData,
      changeSuccess,
      changeError,
      changeLoading,
      submitForm,
      resetForm,
      showOld, showNew, showConfirm,
      strength,
      updateStrength,
      confirmInvalid
    }
  }
}
</script>

<style scoped>
.fw-medium { font-weight: 600; }
.progress { background: #f2f3f5; }
</style>

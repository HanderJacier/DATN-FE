<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-4" 
       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    
    <div class="card shadow-lg border-0" 
         style="border-radius: 20px; overflow: hidden; max-width: 900px; width: 100%;">
      
      <div class="row g-0">
        <!-- Image Section -->
        <div class="col-lg-6 d-none d-lg-flex">
          <div class="d-flex flex-column justify-content-center align-items-center text-white p-5 h-100 position-relative"
               style="background: linear-gradient(45deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)); min-height: 700px;">
            
            <!-- Background Pattern -->
            <div class="position-absolute top-0 start-0 w-100 h-100 opacity-25"
                 style="background-image: url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.4%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
            </div>
            
            <!-- Welcome Content -->
            <div class="text-center position-relative">
              <div class="mb-4">
                <i class="fas fa-user-plus" style="font-size: 4rem; opacity: 0.9;"></i>
              </div>
              <h2 class="fw-bold mb-3" style="font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Tham gia cùng chúng tôi!
              </h2>
              <p class="lead mb-4" style="opacity: 0.9;">
                Tạo tài khoản để truy cập vào hệ thống và trải nghiệm những tính năng tuyệt vời
              </p>
              <div class="d-flex justify-content-center gap-3">
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-users fa-lg"></i>
                </div>
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-star fa-lg"></i>
                </div>
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-gift fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="col-lg-6">
          <div class="p-5">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-2">Đăng ký</h3>
              <p class="text-muted">Tạo tài khoản mới để bắt đầu</p>
            </div>

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">
                  <i class="fas fa-user me-2 text-primary"></i>
                  Họ và tên
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg border-2"
                  style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                  v-model="fullName"
                  placeholder="Nhập họ và tên của bạn"
                  required 
                />
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">
                    <i class="fas fa-envelope me-2 text-primary"></i>
                    Email
                  </label>
                  <input 
                    type="email" 
                    class="form-control form-control-lg border-2"
                    style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                    v-model="email"
                    placeholder="Nhập email"
                    required 
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">
                    <i class="fas fa-phone me-2 text-primary"></i>
                    Số điện thoại
                  </label>
                  <input 
                    type="tel" 
                    class="form-control form-control-lg border-2"
                    style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                    v-model="soDienThoai"
                    placeholder="Nhập số điện thoại"
                    required 
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">
                    <i class="fas fa-lock me-2 text-primary"></i>
                    Mật khẩu
                  </label>
                  <div class="position-relative">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control form-control-lg border-2 pe-5"
                      style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                      v-model="password"
                      placeholder="Nhập mật khẩu"
                      required 
                    />
                    <button
                      type="button"
                      class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-2"
                      style="border: none; background: none;"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">
                    <i class="fas fa-lock me-2 text-primary"></i>
                    Nhập lại mật khẩu
                  </label>
                  <div class="position-relative">
                    <input 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      class="form-control form-control-lg border-2 pe-5"
                      style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                      v-model="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      required 
                    />
                    <button
                      type="button"
                      class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-2"
                      style="border: none; background: none;"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Password Strength Indicator -->
              <div class="mb-3" v-if="password">
                <div class="d-flex align-items-center">
                  <small class="text-muted me-2">Độ mạnh mật khẩu:</small>
                  <div class="progress flex-grow-1" style="height: 4px;">
                    <div 
                      class="progress-bar" 
                      :class="passwordStrengthClass"
                      :style="`width: ${passwordStrength}%`"
                    ></div>
                  </div>
                  <small class="ms-2" :class="passwordStrengthTextClass">{{ passwordStrengthText }}</small>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="form-check mb-4">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="agreeTerms" 
                  v-model="agreeTerms"
                  style="border-radius: 4px;"
                  required
                />
                <label class="form-check-label text-muted" for="agreeTerms">
                  Tôi đồng ý với 
                  <a href="#" class="text-decoration-none text-primary">Điều khoản sử dụng</a> 
                  và 
                  <a href="#" class="text-decoration-none text-primary">Chính sách bảo mật</a>
                </label>
              </div>

              <div 
                v-if="errorMessage"
                :class="[
                  'alert d-flex align-items-center mb-4',
                  errorMessage.toLowerCase().includes('thành công') ? 'alert-success' : 'alert-danger'
                ]"
                role="alert"
              >
                <i class="fas me-2"
                  :class="errorMessage.toLowerCase().includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                {{ errorMessage }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-100 mb-4"
                style="border-radius: 10px; background: linear-gradient(45deg, #667eea, #764ba2); border: none; padding: 12px 0; font-weight: 600; transition: all 0.3s ease;"
                :disabled="isSubmitting"
              >
                <i class="fas fa-user-plus me-2" v-if="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin me-2" v-if="isSubmitting"></i>
                {{ isSubmitting ? 'Đang xử lý...' : 'Đăng ký' }}
              </button>
            </form>

            <!-- Social Login -->
            <div class="text-center mb-4">
              <div class="d-flex align-items-center mb-3">
                <hr class="flex-grow-1">
                <span class="px-3 text-muted small">Hoặc đăng ký bằng</span>
                <hr class="flex-grow-1">
              </div>
              
              <div class="d-flex gap-2">
                <button class="btn btn-outline-danger flex-fill" style="border-radius: 10px;">
                  <i class="fab fa-google me-2"></i>
                  Google
                </button>
                <button class="btn btn-outline-primary flex-fill" style="border-radius: 10px;">
                  <i class="fab fa-facebook me-2"></i>
                  Facebook
                </button>
              </div>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-muted mb-0">
                Bạn đã có tài khoản?
                <router-link to="/DangNhap" class="text-decoration-none fw-semibold">
                  Đăng nhập ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import useDangKy from '@/components/User/LoadDB/DangKy.js'

export default {
  setup() {
    const fullName = ref('')
    const email = ref('')
    const soDienThoai = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const agreeTerms = ref(false)

    const router = useRouter()
    const { isSubmitting, errorMessage, handleRegister } = useDangKy()

    const passwordStrength = computed(() => {
      let strength = 0
      if (password.value.length >= 8) strength += 25
      if (/[a-z]/.test(password.value)) strength += 25
      if (/[A-Z]/.test(password.value)) strength += 25
      if (/[0-9]/.test(password.value)) strength += 25
      return strength
    })

    const passwordStrengthClass = computed(() => {
      if (passwordStrength.value < 50) return 'bg-danger'
      if (passwordStrength.value < 75) return 'bg-warning'
      return 'bg-success'
    })

    const passwordStrengthText = computed(() => {
      if (passwordStrength.value < 50) return 'Yếu'
      if (passwordStrength.value < 75) return 'Trung bình'
      return 'Mạnh'
    })

    const passwordStrengthTextClass = computed(() => {
      if (passwordStrength.value < 50) return 'text-danger'
      if (passwordStrength.value < 75) return 'text-warning'
      return 'text-success'
    })

    const submitForm = async () => {
      // Validate input
      if (!fullName.value || !email.value || !soDienThoai.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'Vui lòng nhập đầy đủ thông tin.'
        return
      }
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Mật khẩu không khớp'
        return
      }
      if (password.value.length < 6) {
        errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự'
        return
      }
      if (!agreeTerms.value) {
        errorMessage.value = 'Vui lòng đồng ý với điều khoản sử dụng'
        return
      }

      const result = await handleRegister({
        fullName: fullName.value,
        email: email.value,
        soDienThoai: soDienThoai.value,
        password: password.value
      })

      if (result.success) {
        await Swal.fire({
          title: 'Thành công!',
          text: result.message,
          icon: 'success'
        })
        router.push('/dangnhap')
      }
    }

    return {
      fullName,
      email,
      soDienThoai,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      agreeTerms,
      errorMessage,
      isSubmitting,
      passwordStrength,
      passwordStrengthClass,
      passwordStrengthText,
      passwordStrengthTextClass,
      submitForm
    }
  }
}
</script>


<style scoped>
/* Custom focus styles */
.form-control:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
  background-color: white !important;
}

/* Button hover effects */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  transform: none;
  box-shadow: none;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .card {
    margin: 20px;
  }
  
  .p-5 {
    padding: 2rem !important;
  }
}

@media (max-width: 767.98px) {
  .row .col-md-6 {
    margin-bottom: 1rem;
  }
}

@media (max-width: 575.98px) {
  .p-5 {
    padding: 1.5rem !important;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .d-flex.gap-2 .btn {
    margin-bottom: 0.5rem;
  }
}

/* Animation for form elements */
.form-control {
  transition: all 0.3s ease;
}

.form-control:focus {
  transform: translateY(-1px);
}

/* Custom checkbox styling */
.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Progress bar styling */
.progress {
  border-radius: 10px;
}

.progress-bar {
  transition: width 0.3s ease;
}
</style>
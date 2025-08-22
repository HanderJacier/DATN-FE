<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-4"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">

    <div class="card shadow-lg border-0" style="border-radius: 20px; overflow: hidden; max-width: 900px; width: 100%;">

      <div class="row g-0">
        <!-- Image Section -->
        <div class="col-lg-6 d-none d-lg-flex">
          <div
            class="d-flex flex-column justify-content-center align-items-center text-white p-5 h-100 position-relative"
            style="background: linear-gradient(45deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)); min-height: 600px;">

            <!-- Background Pattern -->
            <div class="position-absolute top-0 start-0 w-100 h-100 opacity-25"
              style="background-image: url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.4%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
            </div>

            <!-- Welcome Content -->
            <div class="text-center position-relative">
              <div class="mb-4">
                <i class="fas fa-user-circle" style="font-size: 4rem; opacity: 0.9;"></i>
              </div>
              <h2 class="fw-bold mb-3" style="font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Chào mừng trở lại!
              </h2>
              <p class="lead mb-4" style="opacity: 0.9;">
                Đăng nhập để tiếp tục trải nghiệm dịch vụ tuyệt vời của chúng tôi
              </p>
              <div class="d-flex justify-content-center gap-3">
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-shield-alt fa-lg"></i>
                </div>
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-rocket fa-lg"></i>
                </div>
                <div class="bg-white bg-opacity-25 rounded-circle p-3">
                  <i class="fas fa-heart fa-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="col-lg-6">
          <div class="p-5">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-2">Đăng nhập</h3>
              <p class="text-muted">Nhập thông tin để truy cập tài khoản</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark">
                  <i class="fas fa-envelope me-2 text-primary"></i>
                  Email hoặc SĐT
                </label>
                <input type="text" class="form-control form-control-lg border-2"
                  style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                  v-model="email" placeholder="Nhập email hoặc số điện thoại" required />
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold text-dark">
                  <i class="fas fa-lock me-2 text-primary"></i>
                  Mật khẩu
                </label>
                <div class="position-relative">
                  <input :type="showPassword ? 'text' : 'password'" class="form-control form-control-lg border-2 pe-5"
                    style="border-radius: 10px; background-color: #f8f9fa; border: 2px solid #e9ecef; transition: all 0.3s ease;"
                    v-model="password" placeholder="Nhập mật khẩu" required />
                  <button type="button" class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-2"
                    style="border: none; background: none;" @click="showPassword = !showPassword">
                    <i :class="`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`"></i>
                  </button>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-6">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe"
                      style="border-radius: 4px;" />
                    <label class="form-check-label text-muted" for="rememberMe">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                </div>
                <div class="col-6 text-end">
                  <a href="#" class="text-decoration-none text-primary">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 mb-4"
                style="border-radius: 10px; background: linear-gradient(45deg, #667eea, #764ba2); border: none; padding: 12px 0; font-weight: 600; transition: all 0.3s ease;">
                <i class="fas fa-sign-in-alt me-2"></i>
                Đăng nhập
              </button>
            </form>

            <!-- Social Login -->
            <div class="text-center mb-4">
              <div class="d-flex align-items-center mb-3">
                <hr class="flex-grow-1">
                <span class="px-3 text-muted small">Hoặc đăng nhập bằng</span>
                <hr class="flex-grow-1">
              </div>

              <div class="d-flex gap-2">
                <div class="flex-fill">
                  <GoogleLoginButton />
                </div>
                <button class="btn btn-outline-primary flex-fill" style="border-radius: 10px;">
                  <i class="fab fa-facebook me-2"></i>
                  Facebook
                </button>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-muted mb-0">
                Bạn chưa có tài khoản?
                <router-link to="/dangky" class="text-decoration-none fw-semibold">
                  Đăng ký ngay
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
import useLogin from './LoadDB/useLogin'
import GoogleLoginButton from './GoogleLoginButton.vue'

export default {
  components: {
    GoogleLoginButton
  },
  setup() {
    const { userData: normalUserData, loginError: normalLoginError, login } = useLogin()

    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const showPassword = ref(false)

    const router = useRouter()

    const errorMessage = computed(() => {
      return normalLoginError.value
    })

    const handleLogin = async () => {
      await login(email.value, password.value)
      processLoginResult(normalUserData.value)
    }

    const processLoginResult = (userData) => {
      if (userData) {
        const userToStore = {
          ...userData,
          ...(userData.login_type === 'google' && {
            google_name: userData.google_name,
            google_picture: userData.google_picture,
            login_type: 'google'
          })
        }

        if (userData.vaitro === true) {
          sessionStorage.setItem('user', JSON.stringify(userToStore))
        } else {
          localStorage.setItem('user', JSON.stringify(userToStore))
        }

        const vaiTro = userData.vaitro
        if (vaiTro === true) {
          router.push('/admin').then(() => window.location.reload())
        } else {
          router.push('/').then(() => window.location.reload())
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: errorMessage.value,
        })
      }
    }

    return {
      email,
      password,
      rememberMe,
      showPassword,
      handleLogin,
      errorMessage,
    }
  }
}
</script>

<style scoped>
.form-control:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
  background-color: white !important;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

@media (max-width: 991.98px) {
  .card {
    margin: 20px;
  }

  .p-5 {
    padding: 2rem !important;
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

.form-control {
  transition: all 0.3s ease;
}

.form-control:focus {
  transform: translateY(-1px);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-check-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>

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
                <input type="text" class="form-control" :value="userInfo?.tendangnhap" disabled />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Họ và tên</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="formData.hoveten" />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Email</label>
              <div class="col-sm-9">
                <input type="email" class="form-control" v-model="formData.email" />
              </div>
            </div>

            <div class="mb-3 row w-75 mx-auto">
              <label class="col-sm-3 col-form-label">Số điện thoại</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="formData.sodienthoai" />
              </div>
            </div>

            <div class="text-center w-75 mx-auto">
              <button type="submit" class="btn btn-primary" :disabled="updateLoading">
                <i class="bi bi-pencil-square me-1"></i> 
                {{ updateLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
              </button>
            </div>

            <!-- Thông báo -->
            <div v-if="updateSuccess" class="alert alert-success mt-3 w-75 mx-auto">
              ✅ Cập nhật thông tin thành công!
            </div>
            <div v-if="updateError" class="alert alert-danger mt-3 w-75 mx-auto">
              ❌ {{ updateError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
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

    const formData = reactive({
      hoveten: '',
      email: '',
      sodienthoai: ''
    })

    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const loadUserProfile = async () => {
      const userId = getCurrentUserId()
      if (userId) {
        await fetchUserProfile(userId)
        
        // Cập nhật form data khi có thông tin user
        if (userInfo.value) {
          formData.hoveten = userInfo.value.hoveten || ''
          formData.email = userInfo.value.email || ''
          formData.sodienthoai = userInfo.value.sodienthoai || ''
        }
      }
      console.log('User profile loaded:', formData)
    }

    const submitForm = async () => {
      const userId = getCurrentUserId()
      if (!userId) {
        alert('Vui lòng đăng nhập lại')
        return
      }

      await updateUserProfile(userId, formData)
    }

    onMounted(() => {
      loadUserProfile()
    })

    return {
      userInfo,
      formData,
      updateSuccess,
      updateError,
      profileLoading,
      updateLoading,
      submitForm
    }
  }
}
</script>

import { ref } from 'vue'
import apiClient from '@/api'

export default function useRegister() {
  const isSubmitting = ref(false)
  const errorMessage = ref('')

  const handleRegister = async ({ fullName, email, soDienThoai, password }) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      const response = await apiClient.post('/xacthuc/dangky', {
        tenDangNhap: email,
        matKhau: password,
        hoVaTen: fullName,
        email,
        soDienThoai
      })

      if (response.data.status === 'success') {
        return { success: true, message: response.data.message }
      } else {
        errorMessage.value = response.data.message || 'Đăng ký thất bại.'
        return { success: false, message: errorMessage.value }
      }

    } catch (err) {
      errorMessage.value = err.response?.data?.message || 'Lỗi đăng ký. Vui lòng thử lại.'
      return { success: false, message: errorMessage.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    errorMessage,
    handleRegister
  }
}

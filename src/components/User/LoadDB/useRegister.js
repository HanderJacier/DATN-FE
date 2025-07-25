// src/composables/useRegister.js
import { ref } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useRegister() {
  const registerSuccess = ref(false)
  const registerError = ref(null)

  const { data, callAPI } = usePostData()

  const register = async ({ tendangnhap, matkhau, hoveten, sodienthoai, email }) => {
    try {
      await callAPI('WBH_US_CRT_CREATE_ACCOUNT', {
        params: {
          p_tendangnhap: tendangnhap,
          p_matkhau: matkhau,
          p_hoveten: hoveten,
          p_sodienthoai: sodienthoai,
          p_email: email,
          p_vaitro: false,
          p_trangthai: false,
        },
      })
      console.log('Kết quả trả về:', data.value)
      

      const result = data.value?.[0]
      if (!result) {
        registerSuccess.value = false
        registerError.value = 'Không nhận được phản hồi từ hệ thống'
        return
      }

      const rtn = result.rtn_value
      switch (rtn) {
        case 0:
          registerSuccess.value = true
          registerError.value = null
          break
        case -1:
          registerError.value = 'Tên đăng nhập đã tồn tại'
          break
        case -2:
          registerError.value = 'Số điện thoại đã được sử dụng'
          break
        case -3:
          registerError.value = 'Email đã được đăng ký'
          break
        case -4:
          registerError.value = 'Định dạng email không hợp lệ'
          break
        case -5:
          registerError.value = 'Số điện thoại không hợp lệ'
          break
        default:
          registerError.value = 'Đăng ký thất bại'
      }

      registerSuccess.value = rtn === 0

    } catch (err) {
      console.error('Lỗi đăng ký:', err)
      registerSuccess.value = false
      registerError.value = 'Lỗi hệ thống'
    }
  }

  return {
    register,
    registerSuccess,
    registerError,
  }
}

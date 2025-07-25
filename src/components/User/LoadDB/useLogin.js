import { ref } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useLogin() {
  const userData = ref(null)
  const loginError = ref(null)

  const { data, callAPI } = usePostData()

  const login = async (tendangnhap, matkhau) => {
    try {
      await callAPI('WBH_US_SEL_LOGIN_USER', {
        params: {
          p_tendangnhap: tendangnhap,
          p_matkhau: matkhau,
        },
      })

      console.log('Kết quả trả về:', data.value)

      if (Array.isArray(data.value) && data.value.length > 0) {
        userData.value = data.value[0]
        loginError.value = null
      } else {
        userData.value = null
        loginError.value = 'Sai tài khoản hoặc mật khẩu'
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err)
      loginError.value = 'Lỗi hệ thống'
      userData.value = null
    }
  }

  return {
    userData,
    loginError,
    login,
  }
}

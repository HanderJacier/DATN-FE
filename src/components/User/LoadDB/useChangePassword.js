// src/components/User/LoadDB/useChangePassword.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useChangePassword() {
  const changeSuccess = ref(false)
  const changeError = ref(null)

  const {
    data: changeData,
    callAPI: changePasswordAPI,
    loading: changeLoading,
    error: changePasswordError,
  } = usePostData()

  // Đổi mật khẩu
  const changePassword = async (userId, oldPassword, newPassword) => {
    changeSuccess.value = false
    changeError.value = null

    try {
      await changePasswordAPI("WBH_US_UPD_DOI_MAT_KHAU", {
        params: {
          p_id_tk: userId,
          p_matkhau_cu: oldPassword,
          p_matkhau_moi: newPassword,
        },
      })

      if (changeData.value && Array.isArray(changeData.value) && changeData.value.length > 0) {
        const result = changeData.value[0]
        if (result.rtn_value === 0) {
          changeSuccess.value = true
        } else {
          // Handle error codes
          const errorMessages = {
            "-1": "Tài khoản không tồn tại",
            "-2": "Mật khẩu cũ không đúng",
            "-3": "Mật khẩu mới phải có ít nhất 6 ký tự",
          }
          changeError.value = errorMessages[result.rtn_value] || "Đổi mật khẩu thất bại"
        }
      }
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err)
      changeError.value = "Lỗi hệ thống"
    }
  }

  return {
    changeSuccess,
    changeError,
    changeLoading,
    changePasswordError,
    changePassword,
  }
}

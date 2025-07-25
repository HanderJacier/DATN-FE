// src/components/User/LoadDB/useUserProfile.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useUserProfile() {
  const userInfo = ref(null)
  const updateSuccess = ref(false)
  const updateError = ref(null)

  const { data: profileData, callAPI: fetchProfileAPI, loading: profileLoading, error: profileError } = usePostData()
  const {
    data: updateData,
    callAPI: updateProfileAPI,
    loading: updateLoading,
    error: updateProfileError,
  } = usePostData()

  // Lấy thông tin tài khoản
  const fetchUserProfile = async (userId) => {
    try {
      await fetchProfileAPI("WBH_US_SEL_THONG_TIN_TAI_KHOAN", {
        params: { p_id_tk: userId },
      })

      if (profileData.value && Array.isArray(profileData.value) && profileData.value.length > 0) {
        userInfo.value = profileData.value[0]
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin tài khoản:", err)
    }
  }

  // Cập nhật thông tin tài khoản
  const updateUserProfile = async (userId, profileData) => {
    updateSuccess.value = true
    updateError.value = null

    try {
      await updateProfileAPI("WBH_US_UPD_THONG_TIN_TAI_KHOAN", {
        params: {
          p_id_tk: userId,
          p_hoveten: profileData.hoveten,
          p_sodienthoai: profileData.sodienthoai,
          p_email: profileData.email,
        },
      })

      if (updateData.value && Array.isArray(updateData.value) && updateData.value.length > 0) {
        const result = updateData.value[0]
        if (result.rtn_value === 0) {
          updateSuccess.value = true
          // Refresh user info
          await fetchUserProfile(userId)
        } else {
          // Handle error codes
          const errorMessages = {
            "-1": "Số điện thoại đã tồn tại",
            "-2": "Email đã tồn tại",
            "-3": "Email không hợp lệ",
            "-4": "Số điện thoại không hợp lệ",
          }
          updateError.value = errorMessages[result.rtn_value] || "Cập nhật thất bại"
        }
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err)
      updateError.value = "Lỗi hệ thống"
    }
  }

  return {
    userInfo,
    updateSuccess,
    updateError,
    profileLoading,
    profileError,
    updateLoading,
    updateProfileError,
    fetchUserProfile,
    updateUserProfile,
  }
}

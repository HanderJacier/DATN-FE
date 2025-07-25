import { ref } from 'vue'
import { usePostData } from '../../../component_callApi/callAPI'

export function useAdminUserService() {
  const users = ref([])
  const userDetail = ref(null)
  const actionResult = ref(null)

  const { data, callAPI, loading, error } = usePostData()

  const fetchAllUsers = async (pageNo = 1, pageSize = 10, keyword = null) => {
    try {
      await callAPI('WBH_AD_SEL_DANH_SACH_NGUOI_DUNG', {
        params: {
          p_pageNo: pageNo,
          p_pageSize: pageSize,
          p_keyword: keyword,
        },
      })
      if (data.value) {
        users.value = Array.isArray(data.value) ? data.value : []
      }
    } catch (err) {
      console.error('Error fetching all users:', err)
    }
  }

  const fetchUserDetail = async (userId) => {
    try {
      await callAPI('WBH_US_SEL_THONG_TIN_TAI_KHOAN', {
        params: { p_id_tk: userId },
      })
      if (data.value && data.value.length > 0) {
        userDetail.value = data.value[0]
      }
    } catch (err) {
      console.error('Error fetching user detail:', err)
    }
  }

  const toggleUserStatus = async (userId, status) => {
    try {
      await callAPI('WBH_AD_UPD_TRANG_THAI_TAI_KHOAN', {
        params: {
          p_id_tk: userId,
          p_trangthai: status,
        },
      })
      if (data.value && data.value.length > 0) {
        actionResult.value = data.value[0]
        return actionResult.value.affected_rows > 0
      }
      return false
    } catch (err) {
      console.error('Error toggling user status:', err)
      return false
    }
  }

  const updateUserRole = async (userId, role) => {
    try {
      await callAPI('WBH_AD_UPD_VAI_TRO_TAI_KHOAN', {
        params: {
          p_id_tk: userId,
          p_vaitro: role,
        },
      })
      if (data.value && data.value.length > 0) {
        actionResult.value = data.value[0]
        return actionResult.value.affected_rows > 0
      }
      return false
    } catch (err) {
      console.error('Error updating user role:', err)
      return false
    }
  }

  const deleteUser = async (userId) => {
    try {
      await callAPI('WBH_AD_DEL_TAI_KHOAN', {
        params: { p_id_tk: userId },
      })
      if (data.value && data.value.length > 0) {
        actionResult.value = data.value[0]
        return actionResult.value.success === 1
      }
      return false
    } catch (err) {
      console.error('Error deleting user:', err)
      return false
    }
  }

  return {
    users,
    userDetail,
    actionResult,
    loading,
    error,
    fetchAllUsers,
    fetchUserDetail,
    toggleUserStatus,
    updateUserRole,
    deleteUser,
  }
}

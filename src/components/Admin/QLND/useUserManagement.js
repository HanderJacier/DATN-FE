import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useUserManagement() {
  const users = ref([])
  const userDetail = ref(null) // Re-introduced for fetching single user details
  const actionResult = ref(null)

  const { data: usersData, callAPI: fetchUsersAPI, loading: usersLoading, error: usersError } = usePostData()
  const { data: detailData, callAPI: fetchDetailAPI, loading: detailLoading, error: detailError } = usePostData()
  const { data: actionData, callAPI: performActionAPI, loading: actionLoading, error: actionError } = usePostData()

  // Lấy danh sách người dùng (có phân trang và tìm kiếm)
  const fetchUsers = async (pageNo = 1, pageSize = 10, keyword = null) => {
    console.log(`[useUserManagement] Fetching users with pageNo: ${pageNo}, pageSize: ${pageSize}, keyword: ${keyword}`)
    try {
      await fetchUsersAPI("WBH_AD_SEL_DANH_SACH_NGUOI_DUNG", {
        // Assuming this procedure can handle pagination and keyword
        params: {
          p_pageNo: pageNo,
          p_pageSize: pageSize,
          p_keyword: keyword,
        },
      })

      if (usersData.value) {
        users.value = Array.isArray(usersData.value) ? usersData.value : []
        console.log("[useUserManagement] Users fetched successfully:", users.value)
      } else {
        console.log("[useUserManagement] No users data returned from fetchUsersAPI.")
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy danh sách người dùng:", err)
      usersError.value = err
    }
  }

  // Lấy tất cả tài khoản (cho admin, không phân trang)
  const fetchAllUsers = async () => {
    console.log("[useUserManagement] Fetching all users (admin view).")
    try {
      await fetchUsersAPI("WBH_AD_SEL_getTAIKHOAN", {
        // Assuming this procedure gets all users
        params: {},
      })
      if (usersData.value) {
        users.value = Array.isArray(usersData.value) ? usersData.value : []
        console.log("[useUserManagement] All users fetched successfully:", users.value)
      } else {
        console.log("[useUserManagement] No all users data returned from fetchUsersAPI.")
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy tất cả tài khoản:", err)
      usersError.value = err
    }
  }

  // Lấy thông tin chi tiết người dùng
  const fetchUserDetail = async (userId) => {
    console.log(`[useUserManagement] Fetching user detail for ID: ${userId}`)
    try {
      await fetchDetailAPI("WBH_US_SEL_THONG_TIN_TAI_KHOAN", {
        // Assuming this procedure gets single user detail
        params: { p_id_tk: userId },
      })

      if (detailData.value && Array.isArray(detailData.value) && detailData.value.length > 0) {
        userDetail.value = detailData.value[0]
        console.log("[useUserManagement] User detail fetched successfully:", userDetail.value)
      } else {
        console.log("[useUserManagement] No user detail data returned for ID:", userId)
       
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy thông tin chi tiết người dùng:", err)
      detailError.value = err
     
    }
  }

  // Thêm người dùng mới
  const createUser = async (userData) => {
    console.log("[useUserManagement] Creating new user:", userData)
    try {
      await performActionAPI("WBH_AD_INS_TAI_KHOAN", {
        // Assuming this is the procedure for inserting a new user
        params: {
          p_tendangnhap: userData.tendangnhap,
          p_matkhau: userData.matkhau,
          p_hoveten: userData.hoveten,
          p_email: userData.email,
          p_sodienthoai: userData.sodienthoai,
          p_vaitro: userData.vaitro,
          p_trangthai: userData.trangthai,
        },
      })
      if (actionData.value && Array.isArray(actionData.value) && actionData.value.length > 0) {
        actionResult.value = actionData.value[0]
        console.log("[useUserManagement] Create user API response:", actionResult.value)
        return actionResult.value.success === 1 // Assuming success is indicated by a 'success' field
      } else {
        console.log("[useUserManagement] No action data returned for user creation.")
        actionResult.value = { success: false, message: "Không có dữ liệu phản hồi từ API." }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi thêm người dùng:", err)
      actionError.value = err
      actionResult.value = { success: false, message: `Lỗi: ${err.message || "Không xác định"}` }
      return false
    }
  }

  // Cập nhật thông tin người dùng
  const updateUser = async (userId, userData) => {
    console.log(`[useUserManagement] Updating user ID: ${userId} with data:`, userData)
    try {
      await performActionAPI("WBH_AD_UPD_TAI_KHOAN", {
        // Assuming this is the procedure for updating user info
        params: {
          p_id_tk: userId,
          p_tendangnhap: userData.tendangnhap,
          p_hoveten: userData.hoveten,
          p_email: userData.email,
          p_sodienthoai: userData.sodienthoai,
          p_vaitro: userData.vaitro,
          p_trangthai: userData.trangthai,
          // p_matkhau: userData.matkhau, // Password update might be a separate procedure or handled conditionally
        },
      })
      if (actionData.value && Array.isArray(actionData.value) && actionData.value.length > 0) {
        actionResult.value = actionData.value[0]
        console.log("[useUserManagement] Update user API response:", actionResult.value)
        return actionResult.value.affected_rows > 0 // Assuming affected_rows indicates success
      } else {
        console.log("[useUserManagement] No action data returned for user update.")
        actionResult.value = { success: false, message: "Không có dữ liệu phản hồi từ API." }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi cập nhật người dùng:", err)
      actionError.value = err
      actionResult.value = { success: false, message: `Lỗi: ${err.message || "Không xác định"}` }
      return false
    }
  }

  // Xóa tài khoản
  const deleteUser = async (userId) => {
    console.log(`[useUserManagement] Deleting user with ID: ${userId}`)
    try {
      await performActionAPI("WBH_AD_DEL_TAI_KHOAN", {
        // Existing procedure for deletion
        params: {
          p_id_tk: userId,
        },
      })
      if (actionData.value && Array.isArray(actionData.value) && actionData.value.length > 0) {
        actionResult.value = actionData.value[0]
        console.log("[useUserManagement] Delete user API response:", actionResult.value)
        return actionResult.value.success === 1
      } else {
        console.log("[useUserManagement] No action data returned for user deletion.")
        actionResult.value = { success: false, message: "Không có dữ liệu phản hồi từ API." }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi xóa tài khoản:", err)
      actionError.value = err
      actionResult.value = { success: false, message: `Lỗi: ${err.message || "Không xác định"}` }
      return false
    }
  }

  return {
    users,
    userDetail, // Now available
    actionResult,
    usersLoading,
    usersError,
    detailLoading, // Now available
    detailError, // Now available
    actionLoading,
    actionError,
    fetchUsers,
    fetchAllUsers,
    fetchUserDetail, // Now available
    createUser,
    updateUser,
    deleteUser,
  }
}

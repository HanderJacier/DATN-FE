import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useUserManagement() {
  const users = ref([])
  const userDetail = ref(null)
  const actionResult = ref(null)

  const { data: usersData, callAPI: fetchUsersAPI, loading: usersLoading, error: usersError } = usePostData()
  const { data: detailData, callAPI: fetchDetailAPI, loading: detailLoading, error: detailError } = usePostData()
  const { data: actionData, callAPI: performActionAPI, loading: actionLoading, error: actionError } = usePostData()

  // Lấy danh sách người dùng (có phân trang và tìm kiếm)
  const fetchUsers = async (pageNo = 1, pageSize = 10, keyword = null) => {
    console.log(`[useUserManagement] Fetching users with pageNo: ${pageNo}, pageSize: ${pageSize}, keyword: ${keyword}`)
    try {
      await fetchUsersAPI("WBH_AD_SEL_DANH_SACH_NGUOI_DUNG", {
        params: {
          p_pageNo: pageNo,
          p_pageSize: pageSize,
          p_keyword: keyword,
        },
      })

      if (usersData.value) {
        // Xử lý response data với nhiều format khác nhau
        if (Array.isArray(usersData.value)) {
          users.value = usersData.value
        } else if (usersData.value.data && Array.isArray(usersData.value.data)) {
          users.value = usersData.value.data
        } else if (usersData.value.result && Array.isArray(usersData.value.result)) {
          users.value = usersData.value.result
        } else {
          users.value = []
        }
        console.log("[useUserManagement] Users fetched successfully:", users.value)
      } else {
        users.value = []
        console.log("[useUserManagement] No users data returned from fetchUsersAPI.")
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy danh sách người dùng:", err)
      users.value = []
    }
  }

  // Lấy tất cả tài khoản (cho admin, không phân trang)
  const fetchAllUsers = async () => {
    console.log("[useUserManagement] Fetching all users (admin view).")
    try {
      await fetchUsersAPI("WBH_AD_SEL_getTAIKHOAN", {
        params: {},
      })

      if (usersData.value) {
        if (Array.isArray(usersData.value)) {
          users.value = usersData.value
        } else if (usersData.value.data && Array.isArray(usersData.value.data)) {
          users.value = usersData.value.data
        } else if (usersData.value.result && Array.isArray(usersData.value.result)) {
          users.value = usersData.value.result
        } else {
          users.value = []
        }
        console.log("[useUserManagement] All users fetched successfully:", users.value)
      } else {
        users.value = []
        console.log("[useUserManagement] No all users data returned from fetchUsersAPI.")
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy tất cả tài khoản:", err)
      users.value = []
    }
  }

  // Lấy thông tin chi tiết người dùng
  const fetchUserDetail = async (userId) => {
    console.log(`[useUserManagement] Fetching user detail for ID: ${userId}`)
    try {
      await fetchDetailAPI("WBH_US_SEL_THONG_TIN_TAI_KHOAN", {
        params: { p_id_tk: userId },
      })

      if (detailData.value) {
        if (Array.isArray(detailData.value) && detailData.value.length > 0) {
          userDetail.value = detailData.value[0]
        } else if (detailData.value.data && Array.isArray(detailData.value.data) && detailData.value.data.length > 0) {
          userDetail.value = detailData.value.data[0]
        } else if (!Array.isArray(detailData.value)) {
          userDetail.value = detailData.value
        } else {
          userDetail.value = null
        }
        console.log("[useUserManagement] User detail fetched successfully:", userDetail.value)
      } else {
        userDetail.value = null
        console.log("[useUserManagement] No user detail data returned for ID:", userId)
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi lấy thông tin chi tiết người dùng:", err)
      userDetail.value = null
    }
  }

  // Validate dữ liệu người dùng
  const validateUserData = (userData) => {
    const errors = []

    // Kiểm tra tên đăng nhập
    if (!userData.tendangnhap || userData.tendangnhap.trim().length < 3) {
      errors.push("Tên đăng nhập phải có ít nhất 3 ký tự")
    }

    // Kiểm tra mật khẩu (chỉ khi thêm mới)
    if (!userData.id_tk && (!userData.matkhau || userData.matkhau.length < 6)) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự")
    }

    // Kiểm tra họ tên
    if (!userData.hoveten || userData.hoveten.trim().length < 2) {
      errors.push("Họ tên phải có ít nhất 2 ký tự")
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push("Email không hợp lệ")
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/
    if (!userData.sodienthoai || !phoneRegex.test(userData.sodienthoai)) {
      errors.push("Số điện thoại phải có 10-11 chữ số")
    }

    return errors
  }

  // Thêm người dùng mới
  const createUser = async (userData) => {
    console.log("[useUserManagement] Creating new user:", userData)

    // Validate dữ liệu
    const validationErrors = validateUserData(userData)
    if (validationErrors.length > 0) {
      actionResult.value = {
        success: false,
        message: validationErrors.join(", "),
      }
      return false
    }

    try {
      await performActionAPI("WBH_US_CRT_CREATE_ACCOUNT", {
        params: {
          p_tendangnhap: userData.tendangnhap.trim(),
          p_matkhau: userData.matkhau,
          p_hoveten: userData.hoveten.trim(),
          p_email: userData.email.trim(),
          p_sodienthoai: userData.sodienthoai.trim(),
          p_vaitro: userData.vaitro || 0,
          p_trangthai: userData.trangthai !== undefined ? userData.trangthai : 1,
        },
      })

      console.log("[useUserManagement] Create user API response:", actionData.value)

      if (actionData.value) {
        let result = null

        // Xử lý response với nhiều format
        if (Array.isArray(actionData.value) && actionData.value.length > 0) {
          result = actionData.value[0]
        } else if (actionData.value.data && Array.isArray(actionData.value.data) && actionData.value.data.length > 0) {
          result = actionData.value.data[0]
        } else if (actionData.value.rtn_value !== undefined) {
          result = actionData.value
        } else {
          result = actionData.value
        }

        // Xử lý kết quả dựa trên stored procedure WBH_US_CRT_CREATE_ACCOUNT
        if (result && result.rtn_value !== undefined) {
          const rtnValue = result.rtn_value

          switch (rtnValue) {
            case 0:
              actionResult.value = {
                success: true,
                message: "Tạo tài khoản thành công",
              }
              return true
            case -1:
              actionResult.value = {
                success: false,
                message: "Tên đăng nhập đã tồn tại",
              }
              return false
            case -2:
              actionResult.value = {
                success: false,
                message: "Số điện thoại đã tồn tại",
              }
              return false
            case -3:
              actionResult.value = {
                success: false,
                message: "Email đã tồn tại",
              }
              return false
            case -4:
              actionResult.value = {
                success: false,
                message: "Email không hợp lệ",
              }
              return false
            case -5:
              actionResult.value = {
                success: false,
                message: "Số điện thoại không hợp lệ",
              }
              return false
            default:
              actionResult.value = {
                success: false,
                message: `Lỗi không xác định (mã: ${rtnValue})`,
              }
              return false
          }
        } else {
          actionResult.value = {
            success: false,
            message: "Không nhận được phản hồi từ server",
          }
          return false
        }
      } else {
        actionResult.value = {
          success: false,
          message: "Không có dữ liệu phản hồi từ API",
        }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi thêm người dùng:", err)
      actionResult.value = {
        success: false,
        message: `Lỗi kết nối: ${err.message || "Không xác định"}`,
      }
      return false
    }
  }

  // Cập nhật thông tin người dùng
  const updateUser = async (userId, userData) => {
    console.log(`[useUserManagement] Updating user ID: ${userId} with data:`, userData)

    // Validate dữ liệu (không cần validate mật khẩu khi update)
    const validationErrors = validateUserData({ ...userData, matkhau: "dummy" })
    if (validationErrors.length > 0) {
      actionResult.value = {
        success: false,
        message: validationErrors.join(", "),
      }
      return false
    }

    try {
      await performActionAPI("WBH_US_UPD_THONG_TIN_TAI_KHOAN", {
        params: {
          p_id_tk: userId,
          p_hoveten: userData.hoveten.trim(),
          p_sodienthoai: userData.sodienthoai.trim(),
          p_email: userData.email.trim(),
        },
      })

      console.log("[useUserManagement] Update user API response:", actionData.value)

      if (actionData.value) {
        let result = null

        if (Array.isArray(actionData.value) && actionData.value.length > 0) {
          result = actionData.value[0]
        } else if (actionData.value.data && Array.isArray(actionData.value.data) && actionData.value.data.length > 0) {
          result = actionData.value.data[0]
        } else if (actionData.value.rtn_value !== undefined) {
          result = actionData.value
        } else {
          result = actionData.value
        }

        if (result && result.rtn_value !== undefined) {
          const rtnValue = result.rtn_value

          switch (rtnValue) {
            case 0:
              actionResult.value = {
                success: true,
                message: "Cập nhật thông tin thành công",
              }
              return true
            case -1:
              actionResult.value = {
                success: false,
                message: "Số điện thoại đã tồn tại",
              }
              return false
            case -2:
              actionResult.value = {
                success: false,
                message: "Email đã tồn tại",
              }
              return false
            case -3:
              actionResult.value = {
                success: false,
                message: "Email không hợp lệ",
              }
              return false
            case -4:
              actionResult.value = {
                success: false,
                message: "Số điện thoại không hợp lệ",
              }
              return false
            default:
              actionResult.value = {
                success: false,
                message: `Lỗi không xác định (mã: ${rtnValue})`,
              }
              return false
          }
        } else if (result && result.affected_rows !== undefined) {
          const success = result.affected_rows > 0
          actionResult.value = {
            success: success,
            message: success ? "Cập nhật thông tin thành công" : "Không có thay đổi nào được thực hiện",
          }
          return success
        } else {
          actionResult.value = {
            success: false,
            message: "Không nhận được phản hồi từ server",
          }
          return false
        }
      } else {
        actionResult.value = {
          success: false,
          message: "Không có dữ liệu phản hồi từ API",
        }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi cập nhật người dùng:", err)
      actionResult.value = {
        success: false,
        message: `Lỗi kết nối: ${err.message || "Không xác định"}`,
      }
      return false
    }
  }

  // Cập nhật trạng thái người dùng (khóa/mở khóa)
  const updateUserStatus = async (userId, status) => {
    console.log(`[useUserManagement] Updating user status for ID: ${userId} to: ${status}`)
    try {
      await performActionAPI("WBH_AD_UPD_TRANG_THAI_TAI_KHOAN", {
        params: {
          p_id_tk: userId,
          p_trangthai: status,
        },
      })

      if (actionData.value) {
        let result = null

        if (Array.isArray(actionData.value) && actionData.value.length > 0) {
          result = actionData.value[0]
        } else {
          result = actionData.value
        }

        if (result && result.affected_rows !== undefined && result.affected_rows > 0) {
          actionResult.value = {
            success: true,
            message: `${status ? "Mở khóa" : "Khóa"} tài khoản thành công`,
          }
          return true
        } else {
          actionResult.value = {
            success: false,
            message: "Cập nhật trạng thái thất bại",
          }
          return false
        }
      } else {
        actionResult.value = {
          success: false,
          message: "Không có dữ liệu phản hồi từ API",
        }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi cập nhật trạng thái:", err)
      actionResult.value = {
        success: false,
        message: `Lỗi kết nối: ${err.message || "Không xác định"}`,
      }
      return false
    }
  }

  // Cập nhật vai trò người dùng
  const updateUserRole = async (userId, role) => {
    console.log(`[useUserManagement] Updating user role for ID: ${userId} to: ${role}`)
    try {
      await performActionAPI("WBH_AD_UPD_VAI_TRO_TAI_KHOAN", {
        params: {
          p_id_tk: userId,
          p_vaitro: role,
        },
      })

      if (actionData.value) {
        let result = null

        if (Array.isArray(actionData.value) && actionData.value.length > 0) {
          result = actionData.value[0]
        } else {
          result = actionData.value
        }

        if (result && result.affected_rows !== undefined && result.affected_rows > 0) {
          actionResult.value = {
            success: true,
            message: "Cập nhật vai trò thành công",
          }
          return true
        } else {
          actionResult.value = {
            success: false,
            message: "Cập nhật vai trò thất bại",
          }
          return false
        }
      } else {
        actionResult.value = {
          success: false,
          message: "Không có dữ liệu phản hồi từ API",
        }
        return false
      }
    } catch (err) {
      console.error("[useUserManagement] Lỗi khi cập nhật vai trò:", err)
      actionResult.value = {
        success: false,
        message: `Lỗi kết nối: ${err.message || "Không xác định"}`,
      }
      return false
    }
  }

  return {
    users,
    userDetail,
    actionResult,
    usersLoading,
    usersError,
    detailLoading,
    detailError,
    actionLoading,
    actionError,
    fetchUsers,
    fetchAllUsers,
    fetchUserDetail,
    createUser,
    updateUser,
    updateUserStatus,
    updateUserRole,
    validateUserData,
  }
}

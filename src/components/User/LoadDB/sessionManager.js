// Session Manager cho việc tạo và quản lý session tokens
import { usePostData } from "../../component_callApi/callAPI"

const callAPI = usePostData()

class SessionManager {
  constructor() {
    this.sessionToken = null
    this.loadSessionToken()
  }

  // Tạo session token unique
  generateSessionToken() {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    const userAgent = navigator.userAgent.substring(0, 50)
    return `${timestamp}_${random}_${btoa(userAgent).substring(0, 20)}`
  }

  // Lưu session token
  saveSessionToken(token, rememberMe = false) {
    this.sessionToken = token
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("session_token", token)
  }

  // Load session token
  loadSessionToken() {
    this.sessionToken = localStorage.getItem("session_token") || sessionStorage.getItem("session_token")
    return this.sessionToken
  }

  // Xóa session token
  clearSessionToken() {
    this.sessionToken = null
    localStorage.removeItem("session_token")
    sessionStorage.removeItem("session_token")
  }

  // Lấy session token hiện tại
  getSessionToken() {
    return this.sessionToken || this.loadSessionToken()
  }

  // Tạo phiên đăng nhập mới trên server
  async createServerSession(userId, rememberMe = false) {
    try {
      const token = this.generateSessionToken()
      const ipAddress = await this.getClientIP()
      const userAgent = navigator.userAgent

      await callAPI("WBH_US_CRT_PHIEN_DANG_NHAP", {
        params: {
          p_taikhoan: userId,
          p_session_token: token,
          p_ip_address: ipAddress,
          p_user_agent: userAgent,
          p_thoi_gian_song: rememberMe ? 10080 : 1440, // 7 ngày hoặc 1 ngày
        },
      })

      this.saveSessionToken(token, rememberMe)
      return token
    } catch (error) {
      console.error("Lỗi tạo phiên đăng nhập:", error)
      throw error
    }
  }

  // Kiểm tra phiên đăng nhập trên server
  async validateServerSession() {
    const token = this.getSessionToken()
    if (!token) {
      throw new Error("Không có session token")
    }

    try {
      const response = await callAPI("WBH_US_CHK_PHIEN_DANG_NHAP", {
        params: { p_session_token: token },
      })

      if (response && response.rtn_value === 0) {
        return response
      } else {
        this.clearSessionToken()
        throw new Error(response?.message || "Phiên đăng nhập không hợp lệ")
      }
    } catch (error) {
      this.clearSessionToken()
      throw error
    }
  }

  // Đăng xuất trên server
  async logoutServerSession() {
    const token = this.getSessionToken()
    if (!token) return

    try {
      await callAPI("WBH_US_DEL_PHIEN_DANG_NHAP", {
        params: { p_session_token: token },
      })
    } catch (error) {
      console.error("Lỗi đăng xuất:", error)
    } finally {
      this.clearSessionToken()
    }
  }

  // Lấy IP client (optional)
  async getClientIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      return "unknown"
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager()

// Export individual functions
export const {
  generateSessionToken,
  saveSessionToken,
  loadSessionToken,
  clearSessionToken,
  getSessionToken,
  createServerSession,
  validateServerSession,
  logoutServerSession,
} = sessionManager

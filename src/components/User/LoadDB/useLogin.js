import { ref } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useLogin() {
  const userData = ref(null)
  const loginError = ref(null)
  const loading = ref(false)

  const { data, callAPI } = usePostData()

  // Chuẩn hoá về mảng
  const toRows = (raw) => {
    if (Array.isArray(raw)) return raw
    if (raw && Array.isArray(raw.rows)) return raw.rows
    if (raw && typeof raw === 'object') return [raw]
    return []
  }

  // Tìm object user trong rows (ưu tiên r.fields)
  const findUser = (rows) => {
    for (const r of rows) {
      const f = r?.fields ?? r
      if (!f || typeof f !== 'object') continue
      // Tuỳ backend, mở rộng điều kiện nhận diện "user"
      if (
        f.id_tk != null || f.ID_TK != null ||
        (f.tendangnhap && (f.vaitro != null || f.email || f.sodienthoai)) ||
        f.user_id != null || f.id != null
      ) {
        return f
      }
    }
    return null
  }

  /**
   * Đăng nhập và trả về kết quả rõ ràng.
   * @returns {Promise<{ok: boolean, user?: any, error?: string}>}
   */
  const login = async (tendangnhap, matkhau) => {
    loading.value = true
    userData.value = null
    loginError.value = null

    try {
      await callAPI('WBH_US_SEL_LOGIN_USER', {
        params: { p_tendangnhap: tendangnhap, p_matkhau: matkhau },
      })

      // Debug format payload (rất hữu ích khi backend đổi)
      console.log('[login] raw:', JSON.stringify(data.value))

      const rows = toRows(data.value)
      const user = findUser(rows)

      if (user) {
        userData.value = user
        return { ok: true, user }
      }

      // Không tìm thấy user => coi là thất bại, bỏ qua mọi rtn_value random
      loginError.value = 'Sai tài khoản hoặc mật khẩu'
      return { ok: false, error: loginError.value }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err)
      loginError.value = 'Lỗi hệ thống'
      userData.value = null
      return { ok: false, error: loginError.value }
    } finally {
      loading.value = false
    }
  }

  return { userData, loginError, loading, login }
}

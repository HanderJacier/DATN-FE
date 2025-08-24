// composables/User/ThongTinTK/UPDDiachi.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * PROC: WBH_US_UPD_DIACHI
 * @p_action: 1=CREATE, 2=DELETE, 3=UPDATE
 * @p_id_dc: id địa chỉ (0 hoặc null khi tạo mới)
 * @p_taikhoan: id tài khoản
 * @p_diachi: địa chỉ chi tiết
 */
export default function useDiaChi() {
  const lastResult = ref(null)     // raw payload từ API
  const code = ref(null)           // 1|2|3|'ERROR'|null
  const success = ref(false)       // true nếu code ∈ {1,2,3}
  const message = ref('')          // mô tả ngắn dựa trên code

  const { data, loading, error, callAPI } = usePostData()

  // Map code -> thông điệp
  const codeMessage = (c) => {
    switch (c) {
      case 1: return 'Thêm địa chỉ thành công.'
      case 2: return 'Xoá địa chỉ thành công.'
      case 3: return 'Cập nhật địa chỉ thành công.'
      case 'ERROR': return 'Thao tác không hợp lệ.'
      default: return ''
    }
  }

  // Bóc tách code từ payload backend (thường là mảng 1 phần tử, cột vô danh)
  const extractCode = (payload) => {
    if (payload == null) return null

    if (Array.isArray(payload) && payload.length > 0) {
      const row = payload[0]
      if (row && typeof row === 'object') {
        const firstVal = Object.values(row)[0]
        if (typeof firstVal === 'string') {
          const up = firstVal.toUpperCase()
          if (up === 'ERROR') return 'ERROR'
          const n = Number(firstVal)
          if (!Number.isNaN(n)) return n
        }
        if (typeof firstVal === 'number') return firstVal
      }
    }

    if (typeof payload === 'string') {
      const up = payload.toUpperCase()
      if (up === 'ERROR') return 'ERROR'
      const n = Number(payload)
      if (!Number.isNaN(n)) return n
    }
    if (typeof payload === 'number') return payload

    return null
  }

  const submitDiaChi = async ({ action, id_dc = 0, taikhoan, diachi = '' }) => {
    // reset trạng thái
    success.value = false
    code.value = null
    message.value = ''
    lastResult.value = null

    // Chuẩn hoá tham số
    const p_action = Number(action)
    const p_id_dc = Number(id_dc || 0)
    const p_taikhoan = Number(taikhoan)
    const p_diachi = (diachi ?? '').trim()

    // Validate đầu vào
    if (!p_action || !p_taikhoan) {
      throw new Error('Thiếu action hoặc taikhoan')
    }
    if ((p_action === 1 || p_action === 3) && !p_diachi) {
      throw new Error('Thiếu địa chỉ')
    }
    if ((p_action === 2 || p_action === 3) && p_id_dc <= 0) {
      throw new Error('Thiếu id địa chỉ')
    }

    // Gọi PROC: tham số PHẢI TRÙNG TÊN
    await callAPI('WBH_US_UPD_DIACHI', {
      params: { p_action, p_id_dc, p_taikhoan, p_diachi }
    })

    // Lưu payload thô & rút code
    lastResult.value = data.value ?? null
    const c = extractCode(lastResult.value)
    code.value = c
    success.value = (c === 1 || c === 2 || c === 3) && !error.value
    message.value = codeMessage(c)

    return { ok: success.value, code: c, message: message.value }
  }

  // Hằng action đúng với PROC
  const ACTION = Object.freeze({
    CREATE: 1,
    DELETE: 2,
    UPDATE: 3
  })

  // Helper ngắn gọn
  const createDiaChi = (taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.CREATE, id_dc: 0, taikhoan, diachi })

  const updateDiaChi = (id_dc, taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.UPDATE, id_dc, taikhoan, diachi })

  const deleteDiaChi = (id_dc, taikhoan) =>
    submitDiaChi({ action: ACTION.DELETE, id_dc, taikhoan, diachi: '' })

  return {
    // state
    lastResult,
    code,
    success,
    message,
    loading,
    error,

    // methods
    submitDiaChi,
    createDiaChi,
    updateDiaChi,
    deleteDiaChi,

    // constants
    ACTION
  }
}

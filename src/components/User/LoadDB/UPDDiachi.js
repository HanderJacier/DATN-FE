// composables/User/ThongTinTK/useDiaChi.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Composable gọi PROC: WBH_US_UPD_DIACHI
 * inputParams:
 *  - @p_action (int)      // ví dụ: 1=CREATE, 2=UPDATE, 3=DELETE (tùy backend quy ước)
 *  - @p_id_dc (int)       // id địa chỉ (0 hoặc null khi tạo mới)
 *  - @p_taikhoan (int)    // id tài khoản
 *  - @p_diachi (nvarchar) // địa chỉ chi tiết
 */
export default function useDiaChi() {
  const lastResult = ref(null)   // dữ liệu backend trả về (nếu có)
  const success = ref(false)     // cờ thành công theo lần gọi gần nhất

  // Tái sử dụng hook callAPI chung
  const { data, loading, error, callAPI } = usePostData()

  /**
   * Gọi PROC cập nhật địa chỉ theo action
   * @param {Object} payload
   * @param {number} payload.action     - 1|2|3... (theo quy ước backend)
   * @param {number} [payload.id_dc]    - id địa chỉ (bắt buộc khi update/delete)
   * @param {number} payload.taikhoan   - id tài khoản
   * @param {string} [payload.diachi]   - nội dung địa chỉ (bắt buộc khi create/update)
   * @returns {Promise<boolean>}        - true nếu gọi thành công (không lỗi)
   */
  const submitDiaChi = async ({ action, id_dc = 0, taikhoan, diachi = '' }) => {
    success.value = false

    // Chuẩn hóa & kiểm tra nhanh
    const p_action = Number(action)
    const p_id_dc = Number(id_dc || 0)
    const p_taikhoan = Number(taikhoan)
    const p_diachi = (diachi ?? '').trim()

    // Tuỳ use-case của bạn, có thể ràng buộc thêm:
    // - create/update cần diachi khác rỗng
    // - update/delete cần id_dc > 0
    // Ở đây mình làm check cơ bản:
    if (!p_action || !p_taikhoan) {
      throw new Error('Thiếu action hoặc taikhoan')
    }

    await callAPI('WBH_US_UPD_DIACHI', {
      params: {
        p_action,
        p_id_dc,
        p_taikhoan,
        p_diachi
      }
    })

    lastResult.value = data.value ?? null
    // Backend của bạn trả 200 và không có outputFields,
    // nên coi là thành công nếu không có error:
    success.value = !error.value
    return success.value
  }

  // Helper theo quy ước action (tuỳ backend, đổi số nếu khác)
  const ACTION = Object.freeze({
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3
  })

  const createDiaChi = (taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.CREATE, id_dc: 0, taikhoan, diachi })

  const updateDiaChi = (id_dc, taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.UPDATE, id_dc, taikhoan, diachi })

  const deleteDiaChi = (id_dc, taikhoan) =>
    submitDiaChi({ action: ACTION.DELETE, id_dc, taikhoan, diachi: '' })

  return {
    // state
    lastResult,
    success,
    loading,
    error,

    // actions
    submitDiaChi,
    createDiaChi,
    updateDiaChi,
    deleteDiaChi,

    // hằng số action để tái dùng ngoài component
    ACTION
  }
}

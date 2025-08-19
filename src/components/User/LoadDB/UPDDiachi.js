// composables/User/ThongTinTK/UPDDiachi.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Gọi PROC: WBH_US_UPD_DIACHI
 * @p_action: 1=CREATE, 2=DELETE, 3=UPDATE (đúng theo PROC)
 * @p_id_dc: id địa chỉ (0 hoặc null khi tạo mới)
 * @p_taikhoan: id tài khoản
 * @p_diachi: địa chỉ chi tiết
 */
export default function useDiaChi() {
  const lastResult = ref(null)
  const success = ref(false)

  const { data, loading, error, callAPI } = usePostData()

  const submitDiaChi = async ({ action, id_dc = 0, taikhoan, diachi = '' }) => {
    success.value = false

    const p_action = Number(action)
    const p_id_dc = Number(id_dc || 0)
    const p_taikhoan = Number(taikhoan)
    const p_diachi = (diachi ?? '').trim()

    if (!p_action || !p_taikhoan) {
      throw new Error('Thiếu action hoặc taikhoan')
    }
    // Ràng buộc an toàn
    if ((p_action === 1 || p_action === 3) && !p_diachi) {
      throw new Error('Thiếu địa chỉ')
    }
    if ((p_action === 2 || p_action === 3) && p_id_dc <= 0) {
      throw new Error('Thiếu id địa chỉ')
    }

    await callAPI('WBH_US_UPD_DIACHI', {
      params: { p_action, p_id_dc, p_taikhoan, p_diachi }
    })

    lastResult.value = data.value ?? null
    success.value = !error.value
    return success.value
  }

  // Chuẩn action đúng theo PROC
  const ACTION = Object.freeze({
    CREATE: 1,
    DELETE: 2,
    UPDATE: 3
  })

  const createDiaChi = (taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.CREATE, id_dc: 0, taikhoan, diachi })

  const updateDiaChi = (id_dc, taikhoan, diachi) =>
    submitDiaChi({ action: ACTION.UPDATE, id_dc, taikhoan, diachi })

  const deleteDiaChi = (id_dc, taikhoan) =>
    submitDiaChi({ action: ACTION.DELETE, id_dc, taikhoan, diachi: '' })

  return {
    lastResult,
    success,
    loading,
    error,

    submitDiaChi,
    createDiaChi,
    updateDiaChi,
    deleteDiaChi,

    ACTION
  }
}

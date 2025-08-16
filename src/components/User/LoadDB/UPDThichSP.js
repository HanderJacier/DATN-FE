// src/components/.../useSPYeuThichUpdate.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSPYeuThichUpdate() {
  const { data, loading, error, callAPI } = usePostData()
  const success = ref(false)

  // Cập nhật / toggle SP yêu thích cho tài khoản
  // params: { sanpham: number, taikhoan: number }
  const updateSPYeuThich = async ({ sanpham, taikhoan }) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await callAPI('WBH_US_UPD_CAPNHAT_YT_SP', {
        params: {
          'p_sanpham': sanpham,   // đúng tên tham số theo spec
          'p_taikhoan': taikhoan
        }
      })

      // Proc không trả outputFields → coi như thành công nếu không throw
      success.value = true
      return true
    } catch (err) {
      console.error('[WBH_US_UPD_CAPNHAT_YT_SP] Lỗi cập nhật YT:', err)
      error.value = err?.message || 'Không cập nhật được trạng thái yêu thích'
      success.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    data,             // nếu backend có trả gì đó vẫn có thể đọc tại đây
    updateSPYeuThich,
  }
}

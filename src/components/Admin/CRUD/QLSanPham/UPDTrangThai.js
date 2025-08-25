// src/CRUD/QLSanPham/useSanPhamDelete.js (hoặc UPDTrangThai.js)
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSanPhamUpdateTrangThai() {
  const { data: response, callAPI: updateStatusAPI, loading, error } = usePostData()
  const success = ref(false)

  const updateTrangThai = async (id_sp, status = 'N') => {
    success.value = false

    const paramsWithPrefix = {
      p_id_sp: id_sp,
      p_trangthai: status
    }

    await updateStatusAPI('WBH_AD_UPD_TRANGTHAI_SP', {
      params: paramsWithPrefix
    })

    // ✅ trả về dữ liệu thật
    return response.value
  }

  return {
    updateTrangThai,
    response,
    loading,
    error,
    success
  }
}

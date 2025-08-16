// src/components/.../useSPYeuThichSelect.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSPYeuThichSelect() {
  const { data, loading, error, callAPI } = usePostData()

  const success = ref(false)
  const favorites = ref([]) // danh sách SP yêu thích sau khi gọi API

  // Lấy danh sách SP yêu thích theo tài khoản
  const fetchSPYeuThich = async (id_tk) => {
    // ✅ Nếu chưa có id_tk → đảm bảo rỗng & không gọi API
    const id = Number(id_tk)
    if (!id) {
      favorites.value = []
      success.value = false
      error.value = null
      return []
    }

    loading.value = true
    error.value = null
    success.value = false

    try {
      await callAPI('WBH_US_SEL_SP_YT', {
        params: { 'p_id_tk': id } // đúng tên tham số theo spec
      })

      const result = Array.isArray(data.value) ? data.value : []
      favorites.value = result
      success.value = true
      return result
    } catch (err) {
      console.error('[WBH_US_SEL_SP_YT] Lỗi lấy SP yêu thích:', err)
      error.value = err?.message || 'Không lấy được danh sách sản phẩm yêu thích'
      favorites.value = []     // ❗ reset rỗng khi lỗi
      success.value = false
      return []
    } finally {
      loading.value = false
    }
  }

  // Tiện ích kiểm tra 1 sản phẩm có trong danh sách yêu thích không
  const isFavorite = (id_sp) => {
    return favorites.value?.some((r) => Number(r?.id_sp) === Number(id_sp))
  }

  return {
    loading,
    error,
    success,
    favorites,
    fetchSPYeuThich,
    isFavorite
  }
}

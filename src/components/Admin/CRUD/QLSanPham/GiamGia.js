import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI' // đảm bảo đường dẫn đúng

export default function useGiamGiaList() {
  const { data: giamGiaList, callAPI: fetchGiamGia } = usePostData()
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    loading.value = true
    try {
      await fetchGiamGia('WBH_AD_SEL_getGIAMGIA', {
        params: {} // truyền param nếu có
      })
    } catch (err) {
      error.value = err.message || 'Lỗi tải danh sách giảm giá'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  })

  return { giamGiaList, loading, error }
}

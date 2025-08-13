import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useGopYPhanTrang(pageNo = 1, pageSize = 10) {
  const { data: gopies, callAPI } = usePostData()
  const loading = ref(false)
  const error = ref(null)

  const loadGopies = async (pNo = pageNo, pSize = pageSize) => {
    loading.value = true
    try {
      await callAPI('WBH_AD_SEL_GY_PHAN_TRANG', {
        params: {
          p_pageNo: pNo,
          p_pageSize: pSize
        }
      })
    } catch (err) {
      error.value = err.message || 'Lỗi tải góp ý'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadGopies()
  })

  return {
    gopies,
    loading,
    error,
    fetchGopies: loadGopies
  }
}

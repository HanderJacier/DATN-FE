import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useGopYCreate() {
  const { data, loading, error, callAPI } = usePostData()
  const success = ref(false)

  const createGopY = async ({ id_tk, noidung }) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await callAPI('WBH_US_CRT_GY', {
        params: { 'id_tk': id_tk, 'noidung': noidung }
      })

      const result = data.value || []

      if (Array.isArray(result) && result.length > 0) {
        success.value = true
        return true
      }

      success.value = true
      return true
    } catch (err) {
      console.error('[WBH_US_CRT_GY] Lỗi tạo góp ý:', err)
      error.value = err?.message || 'Không gửi được góp ý'
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
    createGopY
  }
}
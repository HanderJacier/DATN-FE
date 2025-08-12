// src/composables/useGiamGia.ts
import { onMounted } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useGiamGia() {
  const { data: giamGiaList, callAPI: fetchGiamGia } = usePostData()

  onMounted(async () => {
    try {
      await fetchGiamGia('WBH_AD_SEL_getGIAMGIA', {
        params: {}
      })
    } catch (error) {
      console.error('Lỗi khi tải danh sách giảm giá:', error)
    }
  })

  return {
    giamGiaList
  }
}

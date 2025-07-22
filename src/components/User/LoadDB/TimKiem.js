// src/composables/useSanPhamSearch.js
import { ref, onMounted } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useSanPhamSearch() {
  const allProducts = ref([])

  const { data, callAPI: fetchSanPham } = usePostData()

  onMounted(async () => {
    try {
      await fetchSanPham('WBH_US_SEL_XEMSP', { params: {} })
      allProducts.value = data.value || []
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err)
    }
  })

  return {
    allProducts
  }
}

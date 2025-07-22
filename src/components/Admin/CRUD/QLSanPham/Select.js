import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI' // đường dẫn bạn dùng trong home logic

export default function useSanPhamAdmin() {
  const { data: products, callAPI: fetchProducts } = usePostData()
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    loading.value = true
    try {
      await fetchProducts('WBH_US_SEL_XEMSP', {
        params: {} // truyền param nếu cần lọc, phân trang, v.v.
      })
    } catch (err) {
      error.value = err.message || 'Lỗi tải sản phẩm'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  })

  return { products, loading, error }
}

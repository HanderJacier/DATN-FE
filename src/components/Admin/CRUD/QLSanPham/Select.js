import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSanPhamAdmin() {
  const { data: products, callAPI } = usePostData()
  const loading = ref(false)
  const error = ref(null)

  const loadProducts = async () => {
    loading.value = true
    try {
      await callAPI('WBH_US_SEL_XEMSP', {
        params: {}
      })
    } catch (err) {
      error.value = err.message || 'Lỗi tải sản phẩm'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadProducts()
  })

  return {
    products,
    loading,
    error,
    fetchProducts: loadProducts // ✅ Trả ra đây để component khác dùng
  }
}

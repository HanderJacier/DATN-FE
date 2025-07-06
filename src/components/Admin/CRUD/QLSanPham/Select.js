// src/composables/useSanPhamAdmin.js
import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useSanPhamAdmin() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    loading.value = true
    try {
      const res = await apiClient.get('/san-pham') // API lấy toàn bộ sản phẩm
      products.value = res.data
    } catch (err) {
      error.value = err.message || 'Lỗi tải sản phẩm'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  })

  return { products, loading, error }
}

// src/composables/useSanPhamSearch.js
import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useSanPhamSearch() {
  const allProducts = ref([])
  const filteredProducts = ref([])
  const searchText = ref('')
  const showSuggestions = ref(false)

  // Gọi API khi Header mounted
  onMounted(async () => {
    try {
      const res = await apiClient.get('/san-pham')
      allProducts.value = res.data
      filteredProducts.value = res.data
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err)
    }
  })

  const handleSearchInput = () => {
    const keyword = searchText.value.trim().toLowerCase()
    filteredProducts.value = allProducts.value.filter(sp =>
      sp.tensanpham.toLowerCase().includes(keyword)
    )
  }

  const clearSearch = () => {
    searchText.value = ''
    filteredProducts.value = allProducts.value
    showSuggestions.value = false
  }

  return {
    searchText,
    showSuggestions,
    filteredProducts,
    handleSearchInput,
    clearSearch
  }
}

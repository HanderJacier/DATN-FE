import { ref } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const product = ref(null)

  const fetchChiTietSanPham = async (id) => {
    try {
      const res = await apiClient.get(`/chitietSP/${id}`)  // ✅ Đúng với controller
      product.value = res.data
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err)
    }
  }

  return {
    product,
    fetchChiTietSanPham
  }
}

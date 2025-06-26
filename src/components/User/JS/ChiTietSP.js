import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useChiTietSanPham(id) {
  const chiTietSanPham = ref(null)

  onMounted(async () => {
    try {
      const res = await apiClient.get(`/api/chitietSP/${id}`)
      chiTietSanPham.value = res.data
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    }
  })

  return {
    chiTietSanPham
  }
}

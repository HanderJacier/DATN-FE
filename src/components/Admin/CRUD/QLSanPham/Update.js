// src/CRUD/QLSanPham/Update.js
import apiClient from '@/api'

export default function useSanPhamUpdate() {
  const updateProduct = async (product) => {
    try {
      const res = await apiClient.put('/san-pham/cap-nhat', product)
      console.log('✅ Cập nhật:', res.data)
      return { success: true, message: res.data }
    } catch (err) {
      console.error('❌ Lỗi cập nhật:', err)
      return { success: false, message: err.response?.data || 'Cập nhật thất bại' }
    }
  }

  return { updateProduct }
}

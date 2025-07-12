// src/CRUD/QLSanPham/Create.js
import apiClient from '@/api'

export default function useSanPhamCreate() {
  const createProduct = async (newProduct) => {
    try {
      const res = await apiClient.post('/san-pham/tao', newProduct)
      console.log('✅ Tạo sản phẩm:', res.data)
      return { success: true, message: res.data }
    } catch (err) {
      console.error('❌ Lỗi tạo sản phẩm:', err)
      return { success: false, message: err.response?.data || 'Tạo sản phẩm thất bại' }
    }
  }

  return { createProduct }
}

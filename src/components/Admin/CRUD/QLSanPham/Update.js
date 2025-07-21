// src/CRUD/QLSanPham/Update.js
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSanPhamUpdate() {
  const { data: response, callAPI, loading, error } = usePostData()

  const updateProduct = async (updatedProduct) => {
    try {
      const paramsWithPrefix = {}
      for (const key in updatedProduct) {
        if (Object.hasOwnProperty.call(updatedProduct, key)) {
          paramsWithPrefix[`p_${key}`] = updatedProduct[key]
        }
      }

      const { data } = await callAPI('WBH_AD_UPD_SUASP', {
        params: paramsWithPrefix
      })

      console.log('✅ Cập nhật sản phẩm thành công:', data)
      return { success: true, message: data }
    } catch (err) {
      console.error('❌ Lỗi cập nhật sản phẩm:', err)
      return { success: false, message: err.response?.data || 'Cập nhật sản phẩm thất bại' }
    }
  }

  return {
    updateProduct,
    loading,
    error
  }
}

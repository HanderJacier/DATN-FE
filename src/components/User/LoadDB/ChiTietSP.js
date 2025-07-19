// src/components/User/LoadDB/ChiTietSP.js
import { ref } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const product = ref(null)
  const productImages = ref([])

  const fetchChiTietSanPham = async (id_sp) => {
    try {
      const res = await apiClient.post('WBH_US_SEL_DETAIL_SP', {
        params: { p_id_sp: id_sp }
      })

      const result = res.data || []

      if (Array.isArray(result) && result.length > 0) {
        const common = result[0].fields
        product.value = {
          ...common,
          id: common.id_sp
        }

        // Ảnh gốc
        const mainImage = {
          src: common.anhgoc,
          alt: common.tensanpham || 'Ảnh chính'
        }

        // Lọc ảnh phụ không trùng id_a
        const seenIds = new Set()
        const subImages = result
          .filter(item => {
            const id_a = item.fields.id_a
            if (!id_a || seenIds.has(id_a)) return false
            seenIds.add(id_a)
            return true
          })
          .map(item => ({
            src: item.fields.diachianh,
            alt: item.fields.tensanpham || 'Ảnh phụ',
          }))

        // Gộp ảnh gốc + ảnh phụ
        productImages.value = [mainImage, ...subImages]
      } else {
        product.value = null
        productImages.value = []
      }
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err)
      product.value = null
      productImages.value = []
    }
  }

  return {
    product,
    productImages,
    fetchChiTietSanPham,
  }
}

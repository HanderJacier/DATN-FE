import { ref } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const product = ref(null)

 const fetchChiTietSanPham = async (id_sp) => {
  try {
    const res = await apiClient.post(`/san-pham/${id_sp}`)
    console.log(res.data);
    

    if (Array.isArray(res.data) && res.data.length > 0) {
      product.value = res.data[0]
    } else {
      product.value = null
      console.warn('Không tìm thấy sản phẩm với ID:', id_sp)
    }

  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm:', err)
    product.value = null
  }
}
  return {
    product,
    fetchChiTietSanPham
  }
}

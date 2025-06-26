import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const sanPhams = ref([])             // Sản phẩm mới
  const sanPhamXepHang = ref([])       // Top sản phẩm yêu thích + đánh giá cao

  onMounted(async () => {
    try {
      // Gọi sản phẩm mới
      const resMoi = await apiClient.get('/Home/moi')
      sanPhams.value = resMoi.data

      // Gọi sản phẩm xếp hạng cao nhất
      const resTop = await apiClient.get('/Home/noibat')
      sanPhamXepHang.value = resTop.data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  })

  return {
    sanPhams,
    sanPhamXepHang
  }
}

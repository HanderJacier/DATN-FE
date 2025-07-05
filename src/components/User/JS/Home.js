import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const sanPhamMoi = ref([])             // Sản phẩm mới
  const sanPhamYeuThich = ref([])       // Top sản phẩm yêu thích + đánh giá cao
  const sanPhamXepHang = ref([])       // Top sản phẩm xếp hạng cao

  onMounted(async () => {
    try {
      // Gọi sản phẩm mới
      const resMoi = await apiClient.get('/san-pham/ngay-tao')
      sanPhamMoi.value = resMoi.data

      // Gọi sản phẩm được yêu thích
      const resTop = await apiClient.get('/san-pham/yeu-thich')
      sanPhamYeuThich.value = resTop.data

      // Gọi sản phẩm được giảm giá
      const resSale = await apiClient.get('/san-pham/giam-gia')
      sanPhamXepHang.value = resTop.data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  })

  return {
    sanPhamMoi,
    sanPhamYeuThich,
    sanPhamXepHang
  }
}

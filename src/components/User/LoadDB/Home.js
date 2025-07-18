import { ref, onMounted } from 'vue'
import apiClient from '@/api'

export default function useHomeLogic() {
  const sanPhamMoi = ref([])
  const sanPhamYeuThich = ref([])
  const sanPhamXepHang = ref([])

  onMounted(async () => {
    try {
      // Gọi sản phẩm mới
      const resMoi = await apiClient.post('/datn/WBH_US_SEL_XEMSP', {
        params: {}
      })
      sanPhamMoi.value = resMoi.data.data  // <-- lưu ý data.data

      // Gọi sản phẩm được yêu thích
      const resTop = await apiClient.post('/datn/WBH_US_SEL_RANKYTSP', {
        params: {}
      })
      sanPhamYeuThich.value = resTop.data.data

      // Gọi sản phẩm xếp hạng / giảm giá
      const resSale = await apiClient.post('/datn/WBH_US_SEL_SALESP', {
        params: {}
      })
      sanPhamXepHang.value = resSale.data.data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang chủ:', error)
    }
  })

  return {
    sanPhamMoi,
    sanPhamYeuThich,
    sanPhamXepHang
  }
}

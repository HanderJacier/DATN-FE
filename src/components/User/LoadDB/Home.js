import { onMounted } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

export default function useHomeLogic() {
  const { data: sanPhamMoi, callAPI: fetchSanPhamMoi } = usePostData()
  const { data: sanPhamMoiNhat, callAPI: fetchSanPhamMoiNhat } = usePostData()
  const { data: sanPhamYeuThich, callAPI: fetchSanPhamYeuThich } = usePostData()
  const { data: sanPhamXepHang, callAPI: fetchSanPhamXepHang } = usePostData()

  onMounted(async () => {
    try {
      await fetchSanPhamMoi('WBH_US_SEL_XEMSP', {
        params: {}
      })

      await fetchSanPhamMoiNhat('WBH_US_SEL_NGAYTAOSP', {
        params: {}
      })

      await fetchSanPhamYeuThich('WBH_US_SEL_RANKYTSP', {
        params: {}
      })

      await fetchSanPhamXepHang('WBH_US_SEL_SALESP', {
        params: {}
      })
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang chủ:', error)
    }
  })

  return {
    sanPhamMoi,
    sanPhamMoiNhat,
    sanPhamYeuThich,
    sanPhamXepHang
  }
}

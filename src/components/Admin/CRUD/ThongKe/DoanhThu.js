import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Composable: Báo cáo doanh thu theo khoảng ngày
 * - Mặc định: từ (today - 30 ngày) -> today
 * - Params backend (nvarchar): @p_tu_ngay, @p_den_ngay
 * - Định dạng ngày gửi lên: dd/MM/yyyy (chuỗi)
 */
export default function useBaoCaoDoanhThu(defaultTuNgay, defaultDenNgay) {
  const { data: baoCao, callAPI } = usePostData()
  const loading = ref(false)
  const error = ref(null)

  // ===== Helper format dd/MM/yyyy =====
  const formatDDMMYYYY = (d) => {
    if (!d) return null
    const date = d instanceof Date ? d : new Date(d)
    if (isNaN(date.getTime())) return null
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  // ===== Default range: 30 ngày gần nhất =====
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const tuNgayDefault = formatDDMMYYYY(defaultTuNgay ?? thirtyDaysAgo)
  const denNgayDefault = formatDDMMYYYY(defaultDenNgay ?? today)

  const loadBaoCao = async (tuNgay = tuNgayDefault, denNgay = denNgayDefault) => {
    loading.value = true
    try {
      await callAPI('WBH_AD_SEL_BAO_CAO_DOANH_THU', {
        params: {
          p_tu_ngay: tuNgay,   // nvarchar dd/MM/yyyy
          p_den_ngay: denNgay, // nvarchar dd/MM/yyyy
        },
      })
    } catch (err) {
      error.value = err?.message || 'Lỗi tải báo cáo doanh thu'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    // Tự load với khoảng mặc định 30 ngày gần nhất
    loadBaoCao()
  })

  return {
    baoCao,        // dữ liệu trả về từ proc
    loading,
    error,
    fetchBaoCao: loadBaoCao, // gọi lại với khoảng ngày tuỳ ý
  }
}

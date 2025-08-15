import { ref, onMounted } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Composable: Thống kê đánh giá theo sản phẩm
 * Proc: WBH_US_SEL_THONG_KE_DANH_GIA
 * Input: @p_sanpham (int) - id sản phẩm
 * Output: tong_danh_gia, diem_trung_binh, sao_5..sao_1
 */
export default function useThongKeDanhGia(defaultProductId) {
  const { data: thongKe, callAPI } = usePostData()
  const loading = ref(false)
  const error = ref(null)
  const productId = ref(
    Number.isInteger(defaultProductId) ? defaultProductId : null
  )

  const loadThongKe = async (pId = productId.value) => {
    if (!Number.isInteger(pId)) {
      error.value = 'Thiếu hoặc sai ID sản phẩm (@p_sanpham)'
      return
    }
    loading.value = true
    try {
      await callAPI('WBH_US_SEL_THONG_KE_DANH_GIA', {
        params: {
          p_sanpham: pId // int
        }
      })
      error.value = null
    } catch (err) {
      error.value = err?.message || 'Lỗi tải thống kê đánh giá'
      // eslint-disable-next-line no-console
      console.error('[useThongKeDanhGia]', error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    // Tự load nếu đã có defaultProductId hợp lệ
    if (Number.isInteger(productId.value)) {
      loadThongKe(productId.value)
    }
  })

  // Cho phép cập nhật lại productId rồi fetch
  const setProductAndFetch = async (newId) => {
    const id = Number(newId)
    productId.value = Number.isInteger(id) ? id : null
    await loadThongKe(productId.value)
  }

  return {
    // data trả về từ proc (có thể là object hoặc mảng tuỳ backend)
    thongKe,
    loading,
    error,
    productId,

    // methods
    fetchThongKe: loadThongKe,
    setProductAndFetch
  }
}

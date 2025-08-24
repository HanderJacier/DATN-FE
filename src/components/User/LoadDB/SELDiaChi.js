import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useDiaChiTheoTaiKhoan() {
  const addresses = ref([])
  const userInfo = ref(null)

  const { data, loading, error, callAPI } = usePostData()

  const reset = () => {
    addresses.value = []
    userInfo.value = null
  }

  const fetchDiaChiTheoTaiKhoan = async (id_tk) => {
    reset()
    if (id_tk == null) return

    // ✅ PROC nhận @p_taikhoan, KHÔNG phải p_id_tk
    await callAPI('WBH_US_SEL_DIACHI_THEO_TAIKHOAN', {
      params: { p_taikhoan: id_tk }
    })

    const result = Array.isArray(data.value) ? data.value : []

    if (result.length > 0) {
      const first = result[0]
      userInfo.value = {
        id_tk: first.taikhoan ?? id_tk,
        hoveten: first.hoveten ?? '',
        sodienthoai: first.sodienthoai ?? '',
        email: first.email ?? ''
      }

      const seen = new Set()
      addresses.value = result
        .filter(r => {
          const id = r.id_dc
          if (!id || seen.has(id)) return false
          seen.add(id)
          return true
        })
        .map(r => ({
          id_dc: r.id_dc,
          diachi: r.diachi ?? ''
        }))
    }
  }

  return {
    addresses,
    userInfo,
    fetchDiaChiTheoTaiKhoan,
    reset,
    loading,
    error
  }
}

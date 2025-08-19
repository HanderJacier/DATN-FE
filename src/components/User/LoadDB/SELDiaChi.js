import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useDiaChiTheoTaiKhoan() {
  const addresses = ref([])
  const userInfo = ref(null)

  const { data, loading, error, callAPI } = usePostData()

  const fetchDiaChiTheoTaiKhoan = async (id_tk) => {
    addresses.value = []
    userInfo.value = null

    await callAPI('WBH_US_SEL_DIACHI_THEO_TAIKHOAN', {
      params: { p_id_tk: id_tk }
    })

    const result = data.value || []

    if (Array.isArray(result) && result.length > 0) {
      const first = result[0]
      userInfo.value = {
        id_tk: first.taikhoan,
        hoveten: first.hoveten,
        sodienthoai: first.sodienthoai,
        email: first.email
      }

      const seen = new Set()
      addresses.value = result
        .filter(r => {
          if (!r.id_dc || seen.has(r.id_dc)) return false
          seen.add(r.id_dc)
          return true
        })
        .map(r => ({
          id_dc: r.id_dc,
          diachi: r.diachi
        }))
    }
  }

  return {
    addresses,
    userInfo,
    fetchDiaChiTheoTaiKhoan,
    loading,
    error
  }
}

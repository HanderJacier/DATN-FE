import apiClient from '@/api'

import { ref } from 'vue'

export function usePostData() {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const callAPI = async (api, body = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiClient.post(api, body)
      const raw = res.data

      if (Array.isArray(raw) && raw.length && raw[0].fields) {
        data.value = raw.map(item => item.fields)
      } else if (raw?.fields) {
        data.value = raw.fields
      } else {
        data.value = raw
      }
    } catch (err) {
      const status = err.response?.status
      const serverMessage = err.response?.data?.message
      const detail = err.response?.data || null

      const message = [
        `[API: ${api}]`,
        status ? `HTTP ${status}` : '',
        serverMessage || err.message || 'Lỗi không xác định'
      ].filter(Boolean).join(' - ')

      error.value = message

      console.error('Chi tiết lỗi API:', {
        api,
        status,
        serverMessage,
        fullError: err,
        responseData: detail
      })
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, callAPI }
}

/*
Hướng dẫn sử dụng (1 api):
--------------------------------------

<script setup>
import { onMounted } from 'vue'
import { usePostData } from '../../component_callApi/callAPI'

// Khởi tạo composable
const { data: sanPhamMoi, loading, error, callAPI } = usePostData()

// Gọi API khi component được mount
onMounted(() => {
  callAPI('WBH_US_SEL_XEMSP', {
    params: {
      p_id_sp: 1
    }
  })
})
</script>

<template>
  <div v-if="loading">Đang tải...</div>

  <div v-else-if="error">Lỗi: {{ error }}</div>

  <!-- Nếu API trả về 1 sản phẩm -->
  <div v-else-if="sanPhamMoi && !Array.isArray(sanPhamMoi)">
    <h3>{{ sanPhamMoi.tensanpham }}</h3>
    <p>{{ sanPhamMoi.mo_ta }}</p>
  </div>
*/

/*
Hướng dẫn sử dụng (nhiều api):
--------------------------------------
export default function useHomeLogic() {
  const { data: sanPhamMoi, callAPI: fetchSanPhamMoi } = usePostData()
  const { data: sanPhamYeuThich, callAPI: fetchSanPhamYeuThich } = usePostData()
  const { data: sanPhamXepHang, callAPI: fetchSanPhamXepHang } = usePostData()

  onMounted(async () => {
    try {
      await fetchSanPhamMoi('WBH_US_SEL_XEMSP', {
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
    sanPhamYeuThich,
    sanPhamXepHang
  }
}
*/
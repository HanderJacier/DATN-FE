// src/composables/useHdChiTietTheoDanhSach.js
import { ref, computed } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useHdChiTietTheoDanhSach() {
  // state
  const rawItems = ref([])            // mảng phẳng các dòng chi tiết (id_hd, id_hdct, id_sp, ...)
  const groupedItems = ref({})        // map: { [id_hd]: Array<item> }

  // api state
  const { data, loading, error, callAPI } = usePostData()

  // utilities
  const normalizeItem = (row) => ({
    id_hd: Number(row.id_hd),
    id_hdct: Number(row.id_hdct),
    id_sp: Number(row.id_sp),
    tensanpham: row.tensanpham,
    anhgoc: row.anhgoc,
    dongia: Number(row.dongia ?? 0),
    soluong: Number(row.soluong ?? 0),
    thanhtien: Number(row.thanhtien ?? 0),
  })

  const toCsv = (ids) => {
    if (!ids) return ''
    if (Array.isArray(ids)) return ids.filter(x => x != null).join(',')
    return String(ids)
  }

  const extractRows = (payload) => {
    // Backend có thể trả 1 mảng, hoặc object chứa mảng result
    if (Array.isArray(payload)) return payload
    if (payload && typeof payload === 'object') {
      const firstArray = Object.values(payload).find(v => Array.isArray(v))
      return firstArray || []
    }
    return []
  }

  // main action
  const fetchHdChiTietTheoDanhSach = async (ids) => {
    const csv = toCsv(ids)
    rawItems.value = []
    groupedItems.value = {}

    if (!csv.trim()) return

    await callAPI('WBH_US_SEL_HD_CHI_TIET_THEO_DANH_SACH', {
      params: { p_ids: csv }
    })

    const rows = extractRows(data.value).map(normalizeItem)
    rawItems.value = rows

    // group by id_hd
    const map = {}
    for (const it of rows) {
      if (!map[it.id_hd]) map[it.id_hd] = []
      map[it.id_hd].push(it)
    }
    groupedItems.value = map
  }

  // helpers
  const getItemsByHoaDon = (id_hd) => groupedItems.value[id_hd] || []

  const flattened = computed(() => rawItems.value)

  return {
    // state
    rawItems,
    groupedItems,

    // api state
    loading,
    error,

    // actions
    fetchHdChiTietTheoDanhSach,

    // helpers
    getItemsByHoaDon,
    flattened,
  }
}

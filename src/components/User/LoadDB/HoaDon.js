// src/composables/useHoaDonTheoTaiKhoan.js
import { ref, computed } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useHoaDonTheoTaiKhoan() {
  // State chính
  const orders   = ref([])   // danh sách hoá đơn (KHÔNG còn items)
  const total    = ref(0)    // tổng số bản ghi (để phân trang)
  const pageNo   = ref(1)
  const pageSize = ref(10)

  // API hook chung
  const { data, loading, error, callAPI } = usePostData()

  // Chuẩn hoá 1 hoá đơn (không có items)
  const normalizeOrder = (row) => ({
    id_hd: row.id_hd,
    ngaytao: row.ngaytao,
    giahoadon: Number(row.giahoadon ?? 0),
    trangthai: row.trangthai,
    noidung: row.noidung,
    phuongthuc: row.phuongthuc,
    magiaodich: row.magiaodich,
    ngaythanhtoan: row.ngaythanhtoan
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil((Number(total.value) || 0) / (Number(pageSize.value) || 10)))
  )
  const hasPrev = computed(() => pageNo.value > 1)
  const hasNext = computed(() => pageNo.value < totalPages.value)

  // Helpers lấy RS#1 (rows) & RS#2 (total) từ payload linh hoạt
  const extractRowsAndTotal = (payload) => {
    let rows = []
    let ttl  = 0

    if (Array.isArray(payload)) {
      // Trường hợp backend trả gộp: [...rows, { total: n }]
      const totalRow = payload.find(o => o && typeof o === 'object' && 'total' in o)
      rows = payload.filter(o => o && typeof o === 'object' && 'id_hd' in o)
      ttl  = Number(totalRow?.total ?? rows.length)
      return { rows, total: ttl }
    }

    if (payload && typeof payload === 'object') {
      // Trường hợp nhiều resultSets trong object
      const arrays = Object.values(payload).filter(Array.isArray)
      const rsRows = arrays.find(arr => arr.some(x => x && typeof x === 'object' && 'id_hd' in x)) || []
      const rsTtl  = arrays.find(arr => arr.some(x => x && typeof x === 'object' && 'total' in x)) || []
      const totalFromArr  = (rsTtl.find(x => x && typeof x === 'object' && 'total' in x) || {}).total
      const totalFromRoot = typeof payload.total === 'number' ? payload.total : undefined

      rows = rsRows
      ttl  = Number(totalFromArr ?? totalFromRoot ?? rsRows.length)
      return { rows, total: ttl }
    }

    return { rows: [], total: 0 }
  }

  // Gọi proc (RS#1: list hoá đơn, RS#2: total)
  const fetchHoaDonTheoTaiKhoan = async (id_tk, _recursed = false) => {
    await callAPI('WBH_US_SEL_HOA_DON_THEO_TAI_KHOAN', {
      params: {
        p_id_tk: id_tk,
        p_pageNo: pageNo.value,
        p_pageSize: pageSize.value
      }
    })

    const { rows, total: ttl } = extractRowsAndTotal(data.value)
    orders.value = rows.map(normalizeOrder)
    total.value  = ttl

    // Nếu page hiện tại > tổng trang thì kéo về trang cuối và fetch lại 1 lần
    const tp = totalPages.value
    if (total.value > 0 && pageNo.value > tp && !_recursed) {
      pageNo.value = tp
      return await fetchHoaDonTheoTaiKhoan(id_tk, true)
    }
  }

  // Tiện ích đổi/truy xuất trang
  const setPage = async (p) => {
    const n = Math.max(1, Number(p) || 1)
    if (total.value > 0) {
      pageNo.value = Math.min(n, totalPages.value)
    } else {
      pageNo.value = n
    }
  }
  const setPageSize = async (ps) => {
    pageSize.value = Math.max(1, Number(ps) || 10)
    pageNo.value = 1
  }
  const goPrev = async () => { if (hasPrev.value) pageNo.value -= 1 }
  const goNext = async () => { if (hasNext.value) pageNo.value += 1 }

  return {
    // state
    orders,
    total,
    pageNo,
    pageSize,

    // derived
    totalPages,
    hasPrev,
    hasNext,

    // api state
    loading,
    error,

    // actions
    fetchHoaDonTheoTaiKhoan,
    setPage,
    setPageSize,
    goPrev,
    goNext
  }
}

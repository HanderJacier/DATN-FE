// src/components/User/LoadDB/useCartProcedures.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Composable gọi các stored procedures cho giỏ hàng:
 * - WBH_US_SEL_GIO_HANG      (select theo tài khoản)
 * - WBH_US_UPD_GIO_HANG      (add / delete / update số lượng)
 * - WBH_US_DEL_GIO_HANG      (xóa toàn bộ giỏ hoặc xóa 1 sản phẩm)
 *
 * Chuẩn hoá dữ liệu trả về cho FE.
 */
export default function useCartProcedures() {
  const { data, loading, error, callAPI } = usePostData()

  /* ===================== Helpers ===================== */
  const toNum = (v) => {
    if (v === null || v === undefined) return 0
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0
    // loại bỏ ký tự không phải số, giữ dấu . - ,
    const s = String(v).replace(/[^\d,.-]/g, '').replace(/,/g, '.')
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
  }

  const unwrap = (row) => (row && typeof row === 'object' && row.fields ? row.fields : row || {})

  /** Map 1 dòng kết quả từ WBH_US_SEL_GIO_HANG -> format FE */
  const mapRowToCartItem = (_row) => {
    const row = unwrap(_row)

    const id = row.id ?? row.id_sp ?? row.sp_id ?? row.ma_sp
    const name = row.name ?? row.tensanpham ?? row.ten_san_pham ?? ''
    const image = row.image ?? row.anhgoc ?? row.anh ?? row.hinh ?? ''
    const trangthai = (row.trangthai ?? row.trang_thai ?? row.status ?? '').toString()

    const stockQuantity = toNum(row.stockQuantity ?? row.soluong_goc ?? row.ton_kho ?? row.so_luong_goc)
    const quantity = toNum(row.quantity ?? row.soluong_gh ?? row.so_luong ?? row.qty)
    const price = toNum(row.price ?? row.dongia_ap_dung ?? row.dongia ?? row.gia)
    const originalPrice = toNum(row.originalPrice ?? row.dongia ?? price)
    const lineTotal = toNum(row.lineTotal ?? row.thanhtien ?? (price * quantity))

    return {
      id_gh: row.id_gh ?? null,                         // id dòng giỏ
      accountId: row.taikhoan ?? row.accountId ?? null, // tài khoản
      id,
      name,
      image,
      trangthai,                                        // 'Y' hoặc 'N'
      stockQuantity,
      quantity,
      originalPrice,                                    // giá gốc
      price,                                            // giá áp dụng (ưu tiên giamgia)
      lineTotal,

      // FE bổ sung mặc định:
      selected: false,
      variant: row.variant ?? 'Mặc định',
      brand: row.brand ?? '',
      category: row.category ?? ''
    }
  }

  /* ===================== 1) SELECT GIỎ HÀNG ===================== */
  /**
   * @param {number} taikhoan
   * @returns {Promise<{raw:any[], items:any[]}>}
   */
  const selGioHang = async (taikhoan) => {
    await callAPI('WBH_US_SEL_GIO_HANG', { params: { p_taikhoan: taikhoan } })

    const rows = Array.isArray(data.value) ? data.value : []

    // ⛳️ Một số backend trả [{ fields: { status: 'ERROR' } }] khi giỏ trống
    const maybeStatus = rows[0]?.fields?.status ?? rows[0]?.status
    if (rows.length === 1 && String(maybeStatus).toUpperCase() === 'ERROR') {
      return { raw: [], items: [] }
    }

    // Hoặc thực sự là mảng rỗng
    if (rows.length === 0) return { raw: [], items: [] }

    // Chuẩn hoá -> map
    const items = rows.map(mapRowToCartItem)
    return { raw: rows, items }
  }

  /* ===================== 2) UPDATE GIỎ HÀNG ===================== */
  /**
   * Proc đa năng update giỏ: 1=add, 2=delete (dòng), 3=set qty
   * @returns {Promise<{rtn_value:number, message:string, id_gh:number|null}>}
   */
  const updGioHang = async ({ action, taikhoan, sanpham = null, soluong = null, id_gh = null }) => {
    await callAPI('WBH_US_UPD_GIO_HANG', {
      params: {
        p_action: action,
        p_taikhoan: taikhoan,
        p_sanpham: sanpham,
        p_soluong: soluong,
        p_id_gh: id_gh
      }
    })
    const raw = Array.isArray(data.value) ? data.value[0] : data.value
    const res = unwrap(raw)
    return {
      rtn_value: toNum(res?.rtn_value ?? res?.RTN_VALUE ?? -999),
      message: String(res?.message ?? res?.MESSAGE ?? 'Không xác định'),
      id_gh: res?.id_gh ?? res?.ID_GH ?? null
    }
  }

  // Helpers cho proc UPDATE
  const addToCartAPI = (taikhoan, sanpham, soluong = 1) =>
    updGioHang({ action: 1, taikhoan, sanpham, soluong })

  const setCartQtyAPI = (taikhoan, sanpham, soluong, id_gh = null) =>
    updGioHang({ action: 3, taikhoan, sanpham, soluong, id_gh })

  const deleteFromCartAPI = (taikhoan, id_gh = null, sanpham = null) =>
    updGioHang({ action: 2, taikhoan, id_gh, sanpham })

  /* ===================== 3) DELETE (xoá tất / xoá 1 SP) ===================== */
  /**
   * WBH_US_DEL_GIO_HANG
   * @param {1|2} action 1=xóa toàn bộ giỏ, 2=xóa 1 sản phẩm
   * @param {number} taikhoan
   * @param {number|null} sanpham  (bắt buộc khi action=2)
   * @returns {Promise<{rtn_value:number, message:string}>}
   */
  const delGioHang = async ({ action, taikhoan, sanpham = null }) => {
    await callAPI('WBH_US_DEL_GIO_HANG', {
      params: {
        p_action: action,
        p_taikhoan: taikhoan,
        p_sanpham: sanpham
      }
    })
    const raw = Array.isArray(data.value) ? data.value[0] : data.value
    const res = unwrap(raw)
    return {
      rtn_value: toNum(res?.rtn_value ?? res?.RTN_VALUE ?? -999),
      message: String(res?.message ?? res?.MESSAGE ?? 'Không xác định')
    }
  }

  // Helpers cho proc DELETE
  /** Xóa toàn bộ giỏ của tài khoản */
  const clearCartAPI = (taikhoan) => delGioHang({ action: 1, taikhoan })

  /** Xóa 1 sản phẩm ra khỏi giỏ */
  const removeOneFromCartAPI = (taikhoan, sanpham) =>
    delGioHang({ action: 2, taikhoan, sanpham })

  return {
    // state từ usePostData
    loading,
    error,

    // SELECT
    selGioHang,

    // UPDATE core + helpers
    updGioHang,
    addToCartAPI,
    setCartQtyAPI,
    deleteFromCartAPI,

    // DELETE core + helpers
    delGioHang,
    clearCartAPI,
    removeOneFromCartAPI
  }
}

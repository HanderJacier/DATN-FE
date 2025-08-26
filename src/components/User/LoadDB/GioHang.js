// src/components/User/LoadDB/useCartProcedures.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

/**
 * Composable gọi các stored procedures cho giỏ hàng:
 * - WBH_US_SEL_GIO_HANG      (select theo tài khoản)
 * - WBH_US_UPD_GIO_HANG      (add / delete / update số lượng)
 * - WBH_US_DEL_GIO_HANG      (xóa toàn bộ giỏ hoặc xóa 1 sản phẩm)
 *
 * Chuẩn hoá dữ liệu trả về cho FE (mapRowToCartItem).
 */
export default function useCartProcedures() {
  const { data, loading, error, callAPI } = usePostData()

  /** Map 1 dòng kết quả từ WBH_US_SEL_GIO_HANG -> format FE */
  const mapRowToCartItem = (row) => ({
    id_gh: row.id_gh,                                  // id dòng giỏ
    accountId: row.taikhoan,                           // tài khoản
    id: row.id_sp,                                     // id sản phẩm
    name: row.tensanpham,
    image: row.anhgoc,
    trangthai: row.trangthai,                          // 'Y' hoặc 'N'
    stockQuantity: Number(row.soluong_goc ?? 0),       // tồn kho gốc
    quantity: Number(row.soluong_gh ?? 0),             // số lượng trong giỏ
    originalPrice: Number(row.dongia ?? 0),            // giá gốc
    price: Number(row.dongia_ap_dung ?? 0),            // giá áp dụng (ưu tiên giamgia)
    lineTotal: Number(row.thanhtien ?? 0),
    // FE bổ sung mặc định:
    selected: false,
    variant: 'Mặc định',
    brand: '',
    category: ''
  })

  /* ===================== 1) SELECT GIỎ HÀNG ===================== */
  /**
   * @param {number} taikhoan
   * @returns {Promise<{raw:any[], items:any[]}>}
   */
  const selGioHang = async (taikhoan) => {
    await callAPI('WBH_US_SEL_GIO_HANG', {
      params: { p_taikhoan: taikhoan }
    })
    const rows = Array.isArray(data.value) ? data.value : []
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
    const res = Array.isArray(data.value) ? data.value[0] : data.value
    return {
      rtn_value: Number(res?.rtn_value ?? -999),
      message: String(res?.message ?? 'Không xác định'),
      id_gh: res?.id_gh ?? null
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
    const res = Array.isArray(data.value) ? data.value[0] : data.value
    return {
      rtn_value: Number(res?.rtn_value ?? -999),
      message: String(res?.message ?? 'Không xác định')
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

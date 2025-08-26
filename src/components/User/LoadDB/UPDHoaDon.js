// src/components/User/LoadDB/UPDHoaDon.js
import { usePostData } from "@/components/component_callApi/callAPI";

/**
 * Gọi proc cập nhật trạng thái hóa đơn:
 *  - WBH_US_UPD_TRANG_THAI_THANH_TOAN(@p_magiaodich, @p_trangthai)
 *  - Fallback: WBH_AD_UPD_TRANG_THAI_HOA_DON(@p_id_hd, @p_trangthai)
 */
export default function useTrangThaiThanhToan() {
  const { data, error, callAPI } = usePostData();

  // Cập nhật theo "mã giao dịch" (ở đây chính là id hóa đơn)
  const updateTrangThai = async (maGiaoDich, trangthai) => {
    await callAPI("WBH_US_UPD_TRANG_THAI_THANH_TOAN", {
      params: {
        p_magiaodich: String(maGiaoDich),
        p_trangthai: trangthai,
      },
    });

    // API trả về: { success: 1|0, id_hd: number|null }
    const rs = Array.isArray(data.value) ? data.value[0] : data.value;
    return rs || { success: 0, id_hd: null };
  };

  // Fallback theo id_hd (khi cần)
  const updateTrangThaiById = async (id_hd, trangthai) => {
    await callAPI("WBH_AD_UPD_TRANG_THAI_HOA_DON", {
      params: {
        p_id_hd: id_hd,
        p_trangthai: trangthai,
      },
    });

    // API trả về: { affected_rows: n }
    const rs = Array.isArray(data.value) ? data.value[0] : data.value;
    return rs || { affected_rows: 0 };
  };

  return { updateTrangThai, updateTrangThaiById, error };
}

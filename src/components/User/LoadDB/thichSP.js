// src/components/User/LoadDB/thichSP.js
import { ref } from "vue";
import { usePostData } from "@/components/component_callApi/callAPI";

export function useFavorites() {
  const { data, loading, error, callAPI } = usePostData();
  const list = ref([]);

  // Lấy danh sách SP yêu thích của user (POST + body { params })
  const getFavoritesByUser = async (userId) => {
    try {
      await callAPI("WBH_US_SEL_SP_YT", {
        params: { p_id_tk: userId },   // ✅ body JSON
      });

      const res = data.value;
      // Chuẩn hoá các dạng payload có thể gặp
      list.value = Array.isArray(res)
        ? res
        : Array.isArray(res?.recordset)
        ? res.recordset
        : Array.isArray(res?.data)
        ? res.data
        : [];

      return list.value;
    } catch (e) {
      console.error("[getFavoritesByUser] Lỗi:", e);
      list.value = [];
      throw e;
    }
  };

  // Toggle yêu thích (POST + body { params })
  const toggleFavorite = async (productId, userId) => {
    try {
      await callAPI("WBH_US_UPD_CAPNHAT_YT_SP", {
        params: {                      // ✅ body JSON
          p_sanpham: productId,
          p_taikhoan: userId,
        },
      });
      return data.value; // server trả 1 (update) / 2 (insert)
    } catch (e) {
      console.error("[toggleFavorite] Lỗi:", e);
      throw e;
    }
  };

  return {
    list,
    getFavoritesByUser,
    toggleFavorite,
    loading,
    error,
  };
}

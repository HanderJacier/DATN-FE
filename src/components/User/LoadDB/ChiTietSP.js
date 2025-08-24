import { ref } from "vue";
import { usePostData } from "@/components/component_callApi/callAPI";

export default function useHomeLogic() {
  const product = ref(null);
  const productImages = ref([]);

  // Sử dụng usePostData
  const { data, loading, error, callAPI } = usePostData();

  const fetchChiTietSanPham = async (id_sp) => {
    await callAPI("WBH_US_SEL_DETAIL_SP", {
      params: { p_id_sp: id_sp },
    });

    const result = data.value || [];

    if (Array.isArray(result) && result.length > 0) {
      const common = result[0];
      product.value = {
        ...common,
        id: common.id_sp,
      };

      // Ảnh gốc
      const mainImage = {
        src: common.anhgoc,
        alt: common.tensanpham || "Ảnh chính",
      };

      // Lọc ảnh phụ không trùng id_a
      const seenIds = new Set();
      const subImages = result
        .filter((item) => {
          const id_a = item.id_a;
          if (!id_a || seenIds.has(id_a)) return false;
          seenIds.add(id_a);
          return true;
        })
        .map((item) => ({
          src: item.diachianh,
          alt: item.tensanpham || "Ảnh phụ",
        }));

      // Gộp ảnh gốc + ảnh phụ
      productImages.value = [mainImage, ...subImages];
    } else {
      product.value = null;
      productImages.value = [];
    }
  };

  return {
    product,
    productImages,
    fetchChiTietSanPham,
    loading,
    error,
  };
}

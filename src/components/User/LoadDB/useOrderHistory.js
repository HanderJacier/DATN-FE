import { ref } from "vue";
import { usePostData } from "../../component_callApi/callAPI.js";

export default function useOrderHistory() {
  const orders = ref([]);
  const orderDetail = ref(null);
  const orderProducts = ref([]);
  const paymentInfo = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const detailLoading = ref(false);
  const detailError = ref(null);

  const {
    data,
    callAPI: postData,
    loading: apiLoading,
    error: apiError,
  } = usePostData();

  const fetchOrderHistory = async (userId) => {
    if (!userId) {
      error.value = "Vui lòng đăng nhập để xem lịch sử đơn hàng";
      return;
    }

    loading.value = true;
    error.value = null;
    orders.value = [];

    try {
      await postData("WBH_US_SEL_LICH_SU_MUA_HANG", {
        params: {
          p_id_tk: userId,
        },
      });

      if (data.value && Array.isArray(data.value)) {
        // Group products by order ID
        const groupedOrders = {};
        data.value.forEach((item) => {
          if (!groupedOrders[item.id_hd]) {
            groupedOrders[item.id_hd] = {
              id_hd: item.id_hd,
              ngaytao: item.ngaytao,
              trangthai: item.trangthai,
              giahoadon: item.giahoadon,
              noidung: item.noidung,
              hovaten: item.hovaten,
              sodienthoai: item.sodienthoai,
              email: item.email,
              products: [],
              payment: null,
            };
          }
          groupedOrders[item.id_hd].products.push({
            id_hdct: item.id_hdct,
            tensanpham: item.tensanpham,
            soluong: item.soluong,
            dongia: item.dongia,
            thanhtien: item.thanhtien,
            anhgoc: item.anhgoc,
          });

          if (item.phuongthuc) {
            groupedOrders[item.id_hd].payment = {
              phuongthuc: item.phuongthuc,
              ngaythanhtoan: item.ngaythanhtoan,
              magiaodich: item.magiaodich,
            };
          }
        });
        orders.value = Object.values(groupedOrders);
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
      error.value = apiError.value || "Có lỗi xảy ra khi lấy lịch sử đơn hàng";
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderDetail = async (orderId, userId) => {
    if (!userId) {
      detailError.value = "Vui lòng đăng nhập để xem chi tiết hóa đơn";
      return;
    }

    if (!orderId) {
      detailError.value = "ID hóa đơn không hợp lệ";
      return;
    }

    const userOrder = orders.value.find((order) => order.id_hd === orderId);
    if (orders.value.length > 0 && !userOrder) {
      detailError.value = "Bạn không có quyền xem hóa đơn này";
      return;
    }

    detailLoading.value = true;
    detailError.value = null;
    orderDetail.value = null;
    orderProducts.value = [];
    paymentInfo.value = null;

    try {
      await postData("WBH_US_SEL_CHI_TIET_HOA_DON", {
        params: {
          p_id_hd: orderId,
        },
      });

      if (data.value && Array.isArray(data.value) && data.value.length > 0) {
        const firstItem = data.value[0];

        orderDetail.value = {
          id_hd: firstItem.id_hd,
          ngaytao: firstItem.ngaytao,
          trangthai: firstItem.trangthai,
          giahoadon: firstItem.giahoadon,
          noidung: firstItem.noidung,
          hovaten: firstItem.hovaten,
          sodienthoai: firstItem.sodienthoai,
          email: firstItem.email,
        };

        orderProducts.value = data.value.map((item) => ({
          id_hdct: item.id_hdct,
          tensanpham: item.tensanpham,
          soluong: item.soluong,
          dongia: item.dongia,
          thanhtien: item.thanhtien,
          anhgoc: item.anhgoc,
        }));

        if (firstItem.phuongthuc) {
          paymentInfo.value = {
            phuongthuc: firstItem.phuongthuc,
            ngaythanhtoan: firstItem.ngaythanhtoan,
            magiaodich: firstItem.magiaodich,
          };
        }
      } else {
        detailError.value = "Không tìm thấy hóa đơn";
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", err);
      detailError.value =
        apiError.value || "Có lỗi xảy ra khi lấy chi tiết hóa đơn";
      throw err;
    } finally {
      detailLoading.value = false;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      // Tạm thời giữ logic cũ cho đến khi có API REST
      console.log("Hủy đơn hàng:", orderId);
      return true;
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      return false;
    }
  };

  return {
    orders,
    orderDetail,
    orderProducts,
    paymentInfo,
    loading,
    error,
    detailLoading,
    detailError,
    fetchOrderHistory,
    fetchOrderDetail,
    cancelOrder,
  };
}

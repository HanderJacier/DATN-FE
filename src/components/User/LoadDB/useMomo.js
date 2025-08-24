import { ref } from "vue";
import { usePostData } from "../../component_callApi/callAPI";

export default function useMoMo() {
  const processing = ref(false);
  const error = ref("");
  const { data: apiResponse, callAPI } = usePostData();

  const createPaymentUrl = async (orderData) => {
    processing.value = true;
    error.value = "";

    try {
      // Bước 1: Tạo đơn hàng với trạng thái "Chờ thanh toán"
      const orderRequest = {
        params: {
          p_hoveten: orderData.customerInfo.name,
          p_sodienthoai: orderData.customerInfo.phone,
          p_email: orderData.customerInfo.email || null,
          p_diachi: orderData.customerInfo.address,
          p_noidung: orderData.note || "Đơn hàng MoMo từ website (Demo)",
          p_trangthai: "Chờ thanh toán",
          p_sanphams: JSON.stringify(
            orderData.items.map((item) => ({
              sanpham: item.id,
              dongia: item.price,
              soluong: item.quantity,
            }))
          ),
        },
      };

      await callAPI("WBH_US_CRT_DAT_HANG", orderRequest);
      const orderResult = apiResponse.value[0];

      if (orderResult.rtn_value !== 0) {
        throw new Error(orderResult.message || "Lỗi tạo đơn hàng");
      }

      const hoadonId = orderResult.id_hd;

      // Bước 2: Tạo bản ghi thanh toán tạm
      const tempTransactionId = `MOMO_TEMP_${Date.now()}`;
      const paymentRequest = {
        params: {
          p_hoadon: hoadonId,
          p_phuongthuc: "MOMO",
          p_sotien: orderData.finalAmount,
          p_magiaodich: tempTransactionId,
          p_taikhoan: orderData.customerInfo.id_tk || null,
        },
      };

      await callAPI("WBH_US_CRT_THANH_TOAN", paymentRequest);
      const paymentResult = apiResponse.value[0];

      if (!paymentResult.id_tt) {
        throw new Error("Lỗi tạo bản ghi thanh toán tạm");
      }

      // Lưu thông tin pending để xử lý callback
      localStorage.setItem(
        "pendingMoMoOrder",
        JSON.stringify({ hoadonId, tempTransactionId })
      );

      // Bước 3: Giả lập MoMo (Demo mode)
      const orderId = `MOMO_${hoadonId}_${Date.now()}`;
      const demoPaymentUrl = `${window.location.origin}/payment/momo-demo?orderId=${orderId}&amount=${orderData.finalAmount}&hoadonId=${hoadonId}`;
      processing.value = false;

      return {
        success: true,
        paymentUrl: demoPaymentUrl,
        deeplink: `momo://payment?orderId=${orderId}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          demoPaymentUrl
        )}`,
        orderId,
        hoadonId,
        isDemo: true,
        message: "DEMO MODE: Thanh toán MoMo giả lập",
      };
    } catch (err) {
      processing.value = false;
      error.value = err.message;
      return {
        success: false,
        message: "Lỗi xử lý thanh toán MoMo: " + err.message,
      };
    }
  };

  const redirectToPayment = (paymentUrl, isDemo, hoadonId) => {
    if (isDemo) {
      window.location.href = paymentUrl; // Chuyển hướng đến MoMoDemo.vue
    }
  };

  const openMoMoApp = (deeplink, isDemo, hoadonId, orderId) => {
    if (isDemo) {
      alert("DEMO: Mở ứng dụng MoMo giả lập...");
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        const returnUrl = `${window.location.origin}/return?status=${
          success ? "success" : "failed"
        }&orderId=${orderId}&hoadonId=${hoadonId}&resultCode=${
          success ? 0 : 1
        }&message=${encodeURIComponent(
          success ? "Thanh toán thành công" : "Thanh toán thất bại"
        )}`;
        window.location.href = returnUrl;
      }, 1500);
    }
  };

  return {
    processing,
    error,
    createPaymentUrl,
    redirectToPayment,
    openMoMoApp,
  };
}

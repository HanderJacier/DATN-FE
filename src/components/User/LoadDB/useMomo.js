import { ref } from "vue";
import { usePostData } from "../../component_callApi/callAPI";
import CryptoJS from "crypto-js";

export default function useMoMo() {
  const processing = ref(false);
  const error = ref("");
  const { data: apiResponse, callAPI } = usePostData();

  // Hàm tạo URL thanh toán MoMo + lưu hóa đơn vào DB
  const createPaymentUrl = async (orderData) => {
    processing.value = true;
    error.value = "";

    try {
      // 🔹 transactionId duy nhất cho thanh toán
      const transactionId = `MM${Date.now()}`;

      // 1. Gọi procedure tạo hóa đơn điện tử
      const invoiceRequest = {
        params: {
          p_id_hd: orderData.id_hd, // id hóa đơn gốc đã có trong DB
          p_id_hoa_don: transactionId, // dùng transactionId làm mã hóa đơn điện tử
          p_khach_hang: orderData.customerInfo.name,
          p_so_dien_thoai: orderData.customerInfo.phone,
          p_email: orderData.customerInfo.email || null,
          p_dia_chi: orderData.customerInfo.address,
          p_phuong_thuc_thanh_toan: "MOMO",
          p_tong_tien: orderData.finalAmount,
          p_ma_giao_dich: transactionId,
          p_chi_tiet_san_pham: JSON.stringify(
            orderData.items.map((item) => ({
              ten_san_pham: item.name,
              so_luong: item.quantity,
              don_gia: item.price,
              thanh_tien: item.price * item.quantity,
            }))
          ),
        },
      };

      await callAPI("WBH_US_CRT_HOA_DON_DIEN_TU", invoiceRequest);

      const invoiceResult = apiResponse.value[0];
      if (!invoiceResult || invoiceResult.rtn_value < 0) {
        throw new Error(
          invoiceResult?.message || "Không tạo được hóa đơn điện tử"
        );
      }

      const hoadonId = invoiceResult.id_hd;

      // 2. Tạo yêu cầu MoMo
      const endpoint = import.meta.env.VITE_MOMO_ENDPOINT;
      const partnerCode = import.meta.env.VITE_MOMO_PARTNER_CODE;
      const accessKey = import.meta.env.VITE_MOMO_ACCESS_KEY;
      const secretKey = import.meta.env.VITE_MOMO_SECRET_KEY;
      const redirectUrl = import.meta.env.VITE_RETURN_URL;
      const ipnUrl = import.meta.env.VITE_NOTIFY_URL;

      const orderId = transactionId;
      const requestId = transactionId;
      const orderInfo = `Thanh toán hóa đơn ${hoadonId}`;
      const amount = orderData.finalAmount.toString();
      const requestType = "captureWallet";

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString();

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData: "",
        requestType,
        signature,
        lang: "vi",
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();

      if (result.resultCode !== 0) {
        throw new Error(result.message || "Lỗi từ MoMo API");
      }

      // 3. Lưu localStorage để xử lý callback
      localStorage.setItem(
        "pendingMoMoOrder",
        JSON.stringify({ hoadonId, transactionId })
      );

      processing.value = false;
      return {
        success: true,
        paymentUrl: result.payUrl,
        hoadonId,
        orderId,
        message: "Đã tạo yêu cầu thanh toán MoMo",
      };
    } catch (err) {
      processing.value = false;
      error.value = err.message;
      return { success: false, message: err.message };
    }
  };

  return {
    processing,
    error,
    createPaymentUrl,
  };
}

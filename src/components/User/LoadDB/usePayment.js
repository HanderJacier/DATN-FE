import { ref } from "vue";
import { usePostData } from "../../component_callApi/callAPI";

export default function usePayment() {
  const processing = ref(false);
  const paymentResult = ref(null);
  const invoiceData = ref(null);
  const { data: orderData, callAPI: createOrderAPI } = usePostData();
  const { data: invoiceResult, callAPI: createInvoiceAPI } = usePostData();

  const processPayment = async (paymentData) => {
    processing.value = true;
    paymentResult.value = null;
    invoiceData.value = null;

    try {
      if (
        !paymentData.items ||
        !Array.isArray(paymentData.items) ||
        paymentData.items.length === 0
      ) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }
      if (
        !paymentData.customerInfo ||
        !paymentData.customerInfo.name ||
        !paymentData.customerInfo.phone
      ) {
        throw new Error("Thông tin khách hàng không đầy đủ");
      }

      const orderRequest = {
        params: {
          p_hoveten: paymentData.customerInfo.name,
          p_sodienthoai: paymentData.customerInfo.phone,
          p_email: paymentData.customerInfo.email || null,
          p_diachi: paymentData.customerInfo.address,
          p_noidung:
            paymentData.note ||
            `Đơn hàng từ website - Thanh toán: ${getPaymentMethodText(
              paymentData.paymentMethod
            )}`,
          p_trangthai: getOrderStatus(paymentData.paymentMethod),
          p_sanphams: JSON.stringify(
            paymentData.items.map((item) => ({
              sanpham: item.id,
              dongia: item.price,
              soluong: item.quantity,
            }))
          ),
        },
      };

      await createOrderAPI("WBH_US_CRT_DAT_HANG", orderRequest);
      const result = orderData.value[0];

      if (result.rtn_value === 0) {
        const orderId = result.id_hd;

        if (paymentData.paymentMethod !== "MOMO") {
          const paymentRequest = {
            params: {
              p_hoadon: orderId,
              p_phuongthuc: getPaymentMethodText(paymentData.paymentMethod),
              p_sotien: paymentData.finalAmount,
              p_magiaodich: generateTransactionId(
                paymentData.paymentMethod,
                orderId
              ),
              p_taikhoan: paymentData.customerInfo.id_tk || null,
            },
          };
          await createOrderAPI("WBH_US_CRT_THANH_TOAN", paymentRequest);
        }

        const invoiceRequest = {
          params: {
            p_id_hd: orderId,
            p_id_hoa_don: orderId,
            p_khach_hang: paymentData.customerInfo.name,
            p_so_dien_thoai: paymentData.customerInfo.phone,
            p_email: paymentData.customerInfo.email || null,
            p_dia_chi: paymentData.customerInfo.address,
            p_phuong_thuc_thanh_toan: getPaymentMethodText(
              paymentData.paymentMethod
            ),
            p_tong_tien: paymentData.finalAmount,
            p_ma_giao_dich: generateTransactionId(
              paymentData.paymentMethod,
              orderId
            ),
            p_chi_tiet_san_pham: JSON.stringify(
              paymentData.items.map((item) => ({
                ten_san_pham: item.name,
                so_luong: item.quantity,
                don_gia: item.price,
                thanh_tien: item.price * item.quantity,
              }))
            ),
          },
        };

        await createInvoiceAPI("WBH_US_CRT_HOA_DON_DIEN_TU", invoiceRequest);
        const invoice = invoiceResult.value[0];

        paymentResult.value = {
          success: true,
          orderId,
          invoiceId: invoice.rtn_value === 0 ? invoice.id_hoa_don : null,
          invoiceNumber:
            invoice.rtn_value === 0 ? invoice.invoice_number : null,
          message: "Đặt hàng thành công",
        };

        return paymentResult.value;
      } else {
        throw new Error(result.message || "Lỗi tạo đơn hàng");
      }
    } catch (error) {
      paymentResult.value = {
        success: false,
        message: error.message || "Có lỗi xảy ra khi xử lý thanh toán",
      };
      return paymentResult.value;
    } finally {
      processing.value = false;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "BANK":
        return "Chuyển khoản ngân hàng";
      case "MOMO":
        return "MoMo";
      default:
        return "Không xác định";
    }
  };

  const getOrderStatus = (paymentMethod) => {
    switch (paymentMethod) {
      case "COD":
        return "Chờ xác nhận";
      case "BANK":
        return "Chờ thanh toán";
      case "MOMO":
        return "Chờ thanh toán";
      default:
        return "Chờ xác nhận";
    }
  };

  const generateTransactionId = (paymentMethod, orderId) => {
    const timestamp = Date.now().toString().slice(-6);
    return `${paymentMethod}_${orderId}_${timestamp}`;
  };

  return { processing, paymentResult, invoiceData, processPayment };
}

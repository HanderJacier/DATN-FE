import { ref } from "vue";
import { usePostData } from "../../component_callApi/callAPI";

export default function usePayment() {
  const processing = ref(false);
  const paymentResult = ref(null);
  const invoiceData = ref(null);

  const {
    data: orderData,
    callAPI: createOrderAPI,
    loading: orderLoading,
    error: orderError,
  } = usePostData();
  const {
    data: invoiceResult,
    callAPI: createInvoiceAPI,
    loading: invoiceLoading,
    error: invoiceError,
  } = usePostData();

  const processPayment = async (paymentData) => {
    processing.value = true;
    paymentResult.value = null;
    invoiceData.value = null;

    try {
      console.log("Processing payment:", paymentData);

      // Validate input data
      if (
        !paymentData ||
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

      // Prepare data for order creation
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

      console.log("Order request:", orderRequest);

      // Create order
      await createOrderAPI("WBH_US_CRT_DAT_HANG", orderRequest);
      console.log("Order creation result:", orderData.value);

      if (
        orderData.value &&
        Array.isArray(orderData.value) &&
        orderData.value.length > 0
      ) {
        const result = orderData.value[0];

        if (result.rtn_value === 0) {
          const orderId = result.id_hd;

          paymentResult.value = {
            success: true,
            orderId: orderId,
            message: "Đặt hàng thành công",
          };

          return {
            success: true,
            orderId: orderId,
            message: "Đặt hàng thành công",
          };
        } else {
          const errorMessage = result.message || "Lỗi tạo đơn hàng";
          paymentResult.value = {
            success: false,
            message: errorMessage,
          };
          return {
            success: false,
            message: errorMessage,
          };
        }
      } else {
        paymentResult.value = {
          success: false,
          message: "Lỗi kết nối server",
        };
        return {
          success: false,
          message: "Lỗi kết nối server",
        };
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      const errorMessage =
        error.message || "Có lỗi xảy ra khi xử lý thanh toán";
      paymentResult.value = {
        success: false,
        message: errorMessage,
      };
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      processing.value = false;
    }
  };

  // Tạo hóa đơn điện tử (optional)
  const createInvoice = async (orderId, paymentData) => {
    try {
      const invoiceRequest = {
        params: {
          p_id_hd: orderId,
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

      console.log("Invoice creation request:", invoiceRequest);

      await createInvoiceAPI("WBH_US_CRT_HOA_DON_DIEN_TU", invoiceRequest);
      console.log("Invoice creation result:", invoiceResult.value);

      if (
        invoiceResult.value &&
        Array.isArray(invoiceResult.value) &&
        invoiceResult.value.length > 0
      ) {
        const result = invoiceResult.value[0];

        if (result.rtn_value === 0) {
          const invoiceNumber = `HD${String(orderId).padStart(8, "0")}`;

          invoiceData.value = {
            invoiceId: orderId,
            invoiceNumber: invoiceNumber,
            customerName: paymentData.customerInfo.name,
            totalAmount: paymentData.finalAmount,
            createdDate: new Date().toISOString(),
            items: paymentData.items,
          };

          return {
            success: true,
            invoiceNumber: invoiceNumber,
            message: "Tạo hóa đơn thành công",
          };
        } else {
          return {
            success: false,
            message: result.message || "Lỗi tạo hóa đơn",
          };
        }
      } else {
        return {
          success: false,
          message: "Không nhận được phản hồi từ server khi tạo hóa đơn",
        };
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      return {
        success: false,
        message: "Lỗi tạo hóa đơn điện tử",
      };
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "BANK":
        return "Chuyển khoản ngân hàng";
      case "QR":
        return "Thanh toán QR Code";
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
      case "QR":
        return "Chờ thanh toán";
      default:
        return "Chờ xác nhận";
    }
  };

  const generateTransactionId = (paymentMethod, orderId) => {
    const timestamp = Date.now().toString().slice(-6);
    switch (paymentMethod) {
      case "COD":
        return `COD_${orderId}_${timestamp}`;
      case "BANK":
        return `BANK_${orderId}_${timestamp}`;
      case "QR":
        return `QR_${orderId}_${timestamp}`;
      default:
        return `ORDER_${orderId}_${timestamp}`;
    }
  };

  return {
    processing,
    paymentResult,
    invoiceData,
    orderLoading,
    invoiceLoading,
    processPayment,
    createInvoice,
  };
}

import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function usePayment() {
  const processing = ref(false)
  const { callAPI } = usePostData()
  const processPayment = async (paymentData) => {
    processing.value = true

    try {
      console.log("Processing payment:", paymentData)

      // Prepare data for order creation
      const orderRequest = {
        p_hoveten: paymentData.customerInfo.name,
        p_sodienthoai: paymentData.customerInfo.phone,
        p_email: paymentData.customerInfo.email || null,
        p_diachi: paymentData.customerInfo.address,
        p_noidung:
          paymentData.note || `Đơn hàng từ website - Thanh toán: ${getPaymentMethodText(paymentData.paymentMethod)}`,
        p_trangthai: getOrderStatus(paymentData.paymentMethod),
        p_sanphams: JSON.stringify(
          paymentData.items.map((item) => ({
            sanpham: item.id,
            dongia: item.price,
            soluong: item.quantity,
          })),
        ),
      }

      console.log("Order request:", orderRequest)

      // Create order
      const orderResult = await callAPI("WBH_US_CRT_DAT_HANG", orderRequest)
      console.log("Order creation result:", orderResult)

      if (orderResult.success && orderResult.data && orderResult.data.length > 0) {
        const orderData = orderResult.data[0]

        if (orderData.rtn_value === 0) {
          const orderId = orderData.id_hd

          // Update payment information
          const paymentUpdateResult = await updatePaymentInfo(orderId, paymentData)

          if (paymentUpdateResult.success) {
            return {
              success: true,
              orderId: orderId,
              message: "Đặt hàng và thanh toán thành công",
            }
          } else {
            return {
              success: false,
              message: paymentUpdateResult.message || "Lỗi cập nhật thông tin thanh toán",
            }
          }
        } else {
          return {
            success: false,
            message: orderData.message || "Lỗi tạo đơn hàng",
          }
        }
      } else {
        return {
          success: false,
          message: orderResult.message || "Lỗi kết nối server",
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      return {
        success: false,
        message: "Có lỗi xảy ra khi xử lý thanh toán",
      }
    } finally {
      processing.value = false
    }
  }

  const updatePaymentInfo = async (orderId, paymentData) => {
    try {
      const paymentRequest = {
        p_id_hd: orderId,
        p_phuongthuc: paymentData.paymentMethod,
        p_sotien: paymentData.finalAmount,
        p_magiaodich: generateTransactionId(paymentData.paymentMethod, orderId),
        p_trangthai_thanhtoan: getPaymentStatus(paymentData.paymentMethod),
        p_noidung_ck: paymentData.transferContent || null,
      }

      console.log("Payment update request:", paymentRequest)

      const result = await callAPI("WBH_US_UPD_PAYMENT_INFO", paymentRequest)
      console.log("Payment update result:", result)

      return result
    } catch (error) {
      console.error("Error updating payment info:", error)
      return {
        success: false,
        message: "Lỗi cập nhật thông tin thanh toán",
      }
    }
  }

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)"
      case "BANK":
        return "Chuyển khoản ngân hàng"
      case "QR":
        return "Thanh toán QR Code"
      default:
        return "Không xác định"
    }
  }

  const getOrderStatus = (paymentMethod) => {
    switch (paymentMethod) {
      case "COD":
        return "Chờ xác nhận"
      case "BANK":
        return "Chờ thanh toán"
      case "QR":
        return "Chờ thanh toán"
      default:
        return "Chờ xác nhận"
    }
  }

  const getPaymentStatus = (paymentMethod) => {
    switch (paymentMethod) {
      case "COD":
        return "Chưa thanh toán"
      case "BANK":
        return "Chờ xác nhận"
      case "QR":
        return "Chờ xác nhận"
      default:
        return "Chưa thanh toán"
    }
  }

  const generateTransactionId = (paymentMethod, orderId) => {
    const timestamp = Date.now().toString().slice(-6)
    switch (paymentMethod) {
      case "COD":
        return `COD_${orderId}_${timestamp}`
      case "BANK":
        return `BANK_${orderId}_${timestamp}`
      case "QR":
        return `QR_${orderId}_${timestamp}`
      default:
        return `ORDER_${orderId}_${timestamp}`
    }
  }

  return {
    processing,
    processPayment,
  }
}

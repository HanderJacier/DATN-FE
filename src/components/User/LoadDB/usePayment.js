// src/components/User/LoadDB/usePayment.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function usePayment() {
  const paymentResult = ref(null)
  const momoPayment = ref(null)
  const orderCreated = ref(null)

  const { data: orderData, callAPI: createOrderAPI, loading: orderLoading, error: orderError } = usePostData()
  const { data: detailData, callAPI: createDetailAPI, loading: detailLoading, error: detailError } = usePostData()
  const { data: paymentData, callAPI: createPaymentAPI, loading: paymentLoading, error: paymentError } = usePostData()
  const { data: momoData, callAPI: createMomoAPI, loading: momoLoading, error: momoError } = usePostData()

  // Tạo hóa đơn
  const createOrder = async (userId, totalAmount, note = null) => {
    try {
      await createOrderAPI("WBH_US_CRT_HOA_DON", {
        params: {
          p_taikhoan: userId,
          p_giahoadon: totalAmount,
          p_noidung: note,
        },
      })

      if (orderData.value && Array.isArray(orderData.value) && orderData.value.length > 0) {
        orderCreated.value = orderData.value[0]
        return orderCreated.value.id_hd
      }
    } catch (err) {
      console.error("Lỗi khi tạo hóa đơn:", err)
      throw err
    }
  }

  // Thêm chi tiết hóa đơn
  const addOrderDetail = async (orderId, productId, price, quantity) => {
    try {
      await createDetailAPI("WBH_US_CRT_HOA_DON_CHI_TIET", {
        params: {
          p_hoadon: orderId,
          p_sanpham: productId,
          p_dongia: price,
          p_soluong: quantity,
        },
      })

      return detailData.value
    } catch (err) {
      console.error("Lỗi khi thêm chi tiết hóa đơn:", err)
      throw err
    }
  }

  // Tạo thanh toán
  const createPayment = async (orderId, method, amount, transactionId = null, userId) => {
    try {
      await createPaymentAPI("WBH_US_CRT_THANH_TOAN", {
        params: {
          p_hoadon: orderId,
          p_phuongthuc: method,
          p_sotien: amount,
          p_magiaodich: transactionId,
          p_taikhoan: userId,
        },
      })

      if (paymentData.value && Array.isArray(paymentData.value) && paymentData.value.length > 0) {
        paymentResult.value = paymentData.value[0]
        return paymentResult.value
      }
    } catch (err) {
      console.error("Lỗi khi tạo thanh toán:", err)
      throw err
    }
  }

  // Tạo thanh toán MoMo
  const createMoMoPayment = async (orderId, amount, orderInfo, userId) => {
    try {
      await createMomoAPI("WBH_US_CRT_MOMO_PAYMENT", {
        params: {
          p_orderId: orderId,
          p_amount: amount,
          p_orderInfo: orderInfo,
          p_taikhoan: userId,
        },
      })

      if (momoData.value && Array.isArray(momoData.value) && momoData.value.length > 0) {
        momoPayment.value = momoData.value[0]
        return momoPayment.value
      }
    } catch (err) {
      console.error("Lỗi khi tạo thanh toán MoMo:", err)
      throw err
    }
  }

  // Xử lý đơn hàng hoàn chỉnh
  const processOrder = async (orderData) => {
    try {
      const { userId, products, totalAmount, paymentMethod, note, orderInfo } = orderData

      // 1. Tạo hóa đơn
      const orderId = await createOrder(userId, totalAmount, note)

      // 2. Thêm chi tiết sản phẩm
      for (const product of products) {
        await addOrderDetail(orderId, product.id, product.price, product.quantity)
      }

      // 3. Xử lý thanh toán
      if (paymentMethod === "MOMO") {
        const momoResult = await createMoMoPayment(orderId.toString(), totalAmount, orderInfo, userId)
        return {
          success: true,
          orderId: orderId,
          paymentMethod: "MOMO",
          payUrl: momoResult.payUrl,
          qrCodeUrl: momoResult.qrCodeUrl,
        }
      } else {
        // COD hoặc phương thức khác
        await createPayment(orderId, paymentMethod, totalAmount, null, userId)
        return {
          success: true,
          orderId: orderId,
          paymentMethod: paymentMethod,
        }
      }
    } catch (err) {
      console.error("Lỗi khi xử lý đơn hàng:", err)
      return {
        success: false,
        message: err.message || "Lỗi xử lý đơn hàng",
      }
    }
  }

  return {
    paymentResult,
    momoPayment,
    orderCreated,
    orderLoading,
    orderError,
    detailLoading,
    detailError,
    paymentLoading,
    paymentError,
    momoLoading,
    momoError,
    createOrder,
    addOrderDetail,
    createPayment,
    createMoMoPayment,
    processOrder,
  }
}

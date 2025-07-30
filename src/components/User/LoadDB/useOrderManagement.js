import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useOrderManagement() {
  const processing = ref(false)
  const orderResult = ref(null)

  const { data: orderData, callAPI: createOrderAPI, loading: orderLoading, error: orderError } = usePostData()

  // Tạo đơn hàng mới từ localStorage
  const createOrder = async (orderData) => {
    console.log("[useOrderManagement] Creating order from localStorage data:", orderData)
    processing.value = true

    try {
      // Chuẩn bị dữ liệu sản phẩm cho stored procedure
      const productsJson = JSON.stringify(
        orderData.items.map((item) => ({
          sanpham: item.id,
          dongia: item.price,
          soluong: item.quantity,
        })),
      )

      console.log("[useOrderManagement] Products JSON:", productsJson)

      // Gọi stored procedure tạo đơn hàng
      await createOrderAPI("WBH_US_CRT_DAT_HANG", {
        params: {
          p_hoveten: orderData.customerInfo.name,
          p_sodienthoai: orderData.customerInfo.phone,
          p_email: orderData.customerInfo.email || "",
          p_diachi: orderData.customerInfo.address,
          p_noidung: orderData.note,
          p_trangthai: "Chờ xác nhận",
          p_sanphams: productsJson,
        },
      })

      console.log("[useOrderManagement] Order API response:", orderData.value)

      if (orderData.value) {
        let result = null

        // Xử lý response với nhiều format khác nhau
        if (Array.isArray(orderData.value) && orderData.value.length > 0) {
          result = orderData.value[0]
        } else if (orderData.value.rtn_value !== undefined) {
          result = orderData.value
        } else {
          result = orderData.value
        }

        console.log("[useOrderManagement] Processed result:", result)

        if (result && result.rtn_value === 0) {
          orderResult.value = {
            success: true,
            message: "Đặt hàng thành công",
            orderId: result.id_hd,
          }
          return {
            success: true,
            orderId: result.id_hd,
            message: "Đặt hàng thành công",
          }
        } else {
          const errorMessage = result?.message || "Có lỗi xảy ra khi đặt hàng"
          orderResult.value = {
            success: false,
            message: errorMessage,
          }
          return {
            success: false,
            message: errorMessage,
          }
        }
      } else {
        orderResult.value = {
          success: false,
          message: "Không nhận được phản hồi từ server",
        }
        return {
          success: false,
          message: "Không nhận được phản hồi từ server",
        }
      }
    } catch (err) {
      console.error("[useOrderManagement] Error creating order:", err)
      const errorMessage = `Lỗi kết nối: ${err.message || "Không xác định"}`
      orderResult.value = {
        success: false,
        message: errorMessage,
      }
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      processing.value = false
    }
  }

  return {
    processing,
    orderResult,
    orderLoading,
    orderError,
    createOrder,
  }
}

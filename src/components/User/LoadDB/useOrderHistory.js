// src/components/User/LoadDB/useOrderHistory.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useOrderHistory() {
  const orders = ref([])
  const orderDetail = ref(null)
  const orderProducts = ref([])
  const paymentInfo = ref(null)

  const { data: ordersData, callAPI: fetchOrdersAPI, loading: ordersLoading, error: ordersError } = usePostData()
  const { data: detailData, callAPI: fetchDetailAPI, loading: detailLoading, error: detailError } = usePostData()
  const { data: cancelData, callAPI: cancelOrderAPI, loading: cancelLoading, error: cancelError } = usePostData()

  // Lấy lịch sử đơn hàng của người dùng
  const fetchOrderHistory = async (userId) => {
    orders.value = []
    try {
      await fetchOrdersAPI("WBH_US_SEL_LICH_SU_MUA_HANG", {
        params: { p_id_tk: userId },
      })

      if (ordersData.value && Array.isArray(ordersData.value)) {
        // Group products by order ID
        const groupedOrders = {}
        ordersData.value.forEach((item) => {
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
              payment: null, // Placeholder for payment info
            }
          }
          groupedOrders[item.id_hd].products.push({
            id_hdct: item.id_hdct,
            tensanpham: item.tensanpham,
            soluong: item.soluong,
            dongia: item.dongia,
            thanhtien: item.thanhtien,
            anhgoc: item.anhgoc,
          })
          // If payment info exists, assign it
          if (item.phuongthuc) {
            groupedOrders[item.id_hd].payment = {
              phuongthuc: item.phuongthuc,
              ngaythanhtoan: item.ngaythanhtoan,
              magiaodich: item.magiaodich,
            }
          }
        })
        orders.value = Object.values(groupedOrders)
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", err)
    }
  }

  // Lấy chi tiết một hóa đơn cụ thể
  const fetchOrderDetail = async (orderId) => {
    orderDetail.value = null
    orderProducts.value = []
    paymentInfo.value = null
    try {
      await fetchDetailAPI("WBH_US_SEL_CHI_TIET_HOA_DON", {
        params: { p_id_hd: orderId },
      })

      if (detailData.value && Array.isArray(detailData.value) && detailData.value.length > 0) {
        const firstItem = detailData.value[0]
        orderDetail.value = {
          id_hd: firstItem.id_hd,
          ngaytao: firstItem.ngaytao,
          trangthai: firstItem.trangthai,
          giahoadon: firstItem.giahoadon,
          noidung: firstItem.noidung,
          hovaten: firstItem.hovaten,
          sodienthoai: firstItem.sodienthoai,
          email: firstItem.email,
        }
        orderProducts.value = detailData.value.map((item) => ({
          id_hdct: item.id_hdct,
          tensanpham: item.tensanpham,
          soluong: item.soluong,
          dongia: item.dongia,
          thanhtien: item.thanhtien,
          anhgoc: item.anhgoc,
        }))
        if (firstItem.phuongthuc) {
          paymentInfo.value = {
            phuongthuc: firstItem.phuongthuc,
            ngaythanhtoan: firstItem.ngaythanhtoan,
            magiaodich: firstItem.magiaodich,
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", err)
    }
  }

  // Hủy đơn hàng
  const cancelOrder = async (orderId) => {
    try {
      await cancelOrderAPI("WBH_US_UPD_HUY_DON_HANG", {
        params: { p_id_hd: orderId },
      })

      if (cancelData.value && Array.isArray(cancelData.value) && cancelData.value.length > 0) {
        const result = cancelData.value[0]
        return result.rtn_value === 0
      }
      return false
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err)
      return false
    }
  }

  return {
    orders,
    orderDetail,
    orderProducts,
    paymentInfo,
    loading: ordersLoading, // Use ordersLoading for general order history
    error: ordersError, // Use ordersError for general order history
    detailLoading,
    detailError,
    cancelLoading,
    cancelError,
    fetchOrderHistory,
    fetchOrderDetail,
    cancelOrder,
  }
}

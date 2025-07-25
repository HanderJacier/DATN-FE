// src/components/Admin/LoadDB/useOrderManagement.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useOrderManagement() {
  const orders = ref([])
  const orderDetail = ref(null)
  const orderProducts = ref([])
  const paymentInfo = ref(null)
  const orderStats = ref(null)
  const revenueReport = ref([])

  const { data: ordersData, callAPI: fetchOrdersAPI, loading: ordersLoading, error: ordersError } = usePostData()
  const { data: detailData, callAPI: fetchDetailAPI, loading: detailLoading, error: detailError } = usePostData()
  const { data: searchData, callAPI: searchOrdersAPI, loading: searchLoading, error: searchError } = usePostData()
  const { data: statsData, callAPI: fetchStatsAPI, loading: statsLoading, error: statsError } = usePostData()
  const { data: revenueData, callAPI: fetchRevenueAPI, loading: revenueLoading, error: revenueError } = usePostData()
  const { data: updateData, callAPI: updateOrderAPI, loading: updateLoading, error: updateError } = usePostData()

  // Lấy tất cả hóa đơn
  const fetchAllOrders = async (pageNo = 1, pageSize = 10, status = null) => {
    try {
      await fetchOrdersAPI("WBH_AD_SEL_TAT_CA_HOA_DON", {
        params: {
          p_pageNo: pageNo,
          p_pageSize: pageSize,
          p_trangthai: status,
        },
      })

      if (ordersData.value) {
        orders.value = Array.isArray(ordersData.value) ? ordersData.value : []
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", err)
    }
  }

  // Lấy chi tiết hóa đơn (admin)
  const fetchOrderDetail = async (orderId) => {
    try {
      await fetchDetailAPI("WBH_AD_SEL_CHI_TIET_HOA_DON", {
        params: { p_id_hd: orderId },
      })

      if (detailData.value && Array.isArray(detailData.value)) {
        const results = detailData.value
        if (results.length > 0) {
          orderDetail.value = results[0] // Thông tin hóa đơn
        }
        if (results.length > 1) {
          orderProducts.value = results[1] // Chi tiết sản phẩm
        }
        if (results.length > 2) {
          paymentInfo.value = results[2] // Thông tin thanh toán
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", err)
    }
  }

  // Tìm kiếm hóa đơn
  const searchOrders = async (keyword = null, fromDate = null, toDate = null, pageNo = 1, pageSize = 10) => {
    try {
      await searchOrdersAPI("WBH_AD_SEL_TIM_KIEM_HOA_DON", {
        params: {
          p_keyword: keyword,
          p_tu_ngay: fromDate,
          p_den_ngay: toDate,
          p_pageNo: pageNo,
          p_pageSize: pageSize,
        },
      })

      if (searchData.value) {
        orders.value = Array.isArray(searchData.value) ? searchData.value : []
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm hóa đơn:", err)
    }
  }

  // Cập nhật trạng thái hóa đơn
  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderAPI("WBH_AD_UPD_TRANG_THAI_HOA_DON", {
        params: {
          p_id_hd: orderId,
          p_trangthai: status,
        },
      })

      if (updateData.value && Array.isArray(updateData.value) && updateData.value.length > 0) {
        return updateData.value[0].affected_rows > 0
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái hóa đơn:", err)
      return false
    }
  }

  // Thống kê hóa đơn
  const fetchOrderStats = async () => {
    try {
      await fetchStatsAPI("WBH_AD_SEL_THONG_KE_HOA_DON", {
        params: {},
      })

      if (statsData.value && Array.isArray(statsData.value)) {
        // Result set đầu tiên: thống kê tổng quan
        if (statsData.value.length > 0) {
          orderStats.value = statsData.value[0]
        }
        // Result set thứ hai: thống kê theo tháng
        if (statsData.value.length > 1) {
          revenueReport.value = statsData.value[1]
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy thống kê hóa đơn:", err)
    }
  }

  // Báo cáo doanh thu
  const fetchRevenueReport = async (fromDate, toDate) => {
    try {
      await fetchRevenueAPI("WBH_AD_SEL_BAO_CAO_DOANH_THU", {
        params: {
          p_tu_ngay: fromDate,
          p_den_ngay: toDate,
        },
      })

      if (revenueData.value) {
        revenueReport.value = Array.isArray(revenueData.value) ? revenueData.value : []
      }
    } catch (err) {
      console.error("Lỗi khi lấy báo cáo doanh thu:", err)
    }
  }

  return {
    orders,
    orderDetail,
    orderProducts,
    paymentInfo,
    orderStats,
    revenueReport,
    ordersLoading,
    ordersError,
    detailLoading,
    detailError,
    searchLoading,
    searchError,
    statsLoading,
    statsError,
    revenueLoading,
    revenueError,
    updateLoading,
    updateError,
    fetchAllOrders,
    fetchOrderDetail,
    searchOrders,
    updateOrderStatus,
    fetchOrderStats,
    fetchRevenueReport,
  }
}

<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-9">
        <!-- Thêm loading state và error handling -->
        <div v-if="detailLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải chi tiết hóa đơn...</p>
        </div>

        <!-- Cải thiện hiển thị lỗi bảo mật -->
        <div v-else-if="detailError || accessError" class="alert alert-danger">
          <i class="bi bi-shield-exclamation me-2"></i>
          <strong>Lỗi truy cập:</strong> {{ detailError || accessError }}
          <div class="mt-3">
            <router-link to="/thongtintk/hoadon" class="btn btn-primary">
              <i class="bi bi-arrow-left me-1"></i>Quay lại danh sách hóa đơn
            </router-link>
          </div>
        </div>

        <div v-else-if="orderDetail">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Chi tiết hóa đơn #HD{{ String(orderDetail.id_hd).padStart(3, '0') }}</h4>
            <button @click="goBack" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-1"></i>Quay lại
            </button>
          </div>

          <div class="bg-white border rounded p-4 shadow-sm">
            <!-- Thông tin hóa đơn -->
            <div class="row mb-4">
              <div class="col-md-6">
                <p><strong>Ngày tạo:</strong> {{ formatDateTime(orderDetail.ngaytao) }}</p>
                <p><strong>Khách hàng:</strong> {{ orderDetail.hovaten }}</p>
                <p><strong>Email:</strong> {{ orderDetail.email }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Số điện thoại:</strong> {{ orderDetail.sodienthoai }}</p>
                <p>
                  <strong>Trạng thái:</strong>
                  <span :class="getStatusClass(orderDetail.trangthai)">
                    {{ orderDetail.trangthai }}
                  </span>
                </p>
                <p v-if="orderDetail.noidung"><strong>Ghi chú:</strong> {{ orderDetail.noidung }}</p>
              </div>
            </div>

            <!-- Sản phẩm -->
            <h6 class="fw-bold mb-3">Danh sách sản phẩm</h6>
            <div class="table-responsive">
              <table class="table table-bordered text-center align-middle">
                <thead class="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in orderProducts" :key="product.id_hdct">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <img 
                        :src="product.anhgoc || '/placeholder.svg?height=50&width=50'" 
                        :alt="product.tensanpham"
                        class="img-thumbnail"
                        style="width: 50px; height: 50px; object-fit: cover;"
                      />
                    </td>
                    <td class="text-start">{{ product.tensanpham }}</td>
                    <td>{{ product.soluong }}</td>
                    <td>{{ formatCurrency(product.dongia) }}</td>
                    <td class="fw-bold text-danger">{{ formatCurrency(product.thanhtien) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Thông tin thanh toán -->
            <div v-if="paymentInfo" class="border-top pt-3 mt-3">
              <h6 class="fw-bold mb-3">Thông tin thanh toán</h6>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Phương thức:</strong> {{ paymentInfo.phuongthuc }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Ngày thanh toán:</strong> {{ formatDateTime(paymentInfo.ngaythanhtoan) }}</p>
                  <p v-if="paymentInfo.magiaodich"><strong>Mã giao dịch:</strong> {{ paymentInfo.magiaodich }}</p>
                </div>
              </div>
            </div>

            <!-- Tổng tiền -->
            <div class="text-end border-top pt-3 mt-3">
              <h5 class="fw-bold text-danger mb-0">
                Tổng thanh toán: {{ formatCurrency(orderDetail.giahoadon) }}
              </h5>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-info text-center">
          <i class="bi bi-info-circle fs-1 text-muted"></i>
          <h5 class="mt-3">Không tìm thấy thông tin hóa đơn</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import useOrderHistory from '@/components/User/LoadDB/useOrderHistory.js'

export default {
  name: 'HoaDonChiTiet',
  components: { Slidebar },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const orderHistory = useOrderHistory()
    const {
      orderDetail,
      orderProducts,
      paymentInfo,
      detailLoading,
      detailError,
      fetchOrderDetail
    } = orderHistory

    const accessError = ref('')

    const orderId = computed(() => {
      return parseInt(route.params.id) || null
    })

    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const loadOrderDetail = async () => {
      if (orderId.value) {
        try {
          const userId = getCurrentUserId()
          if (!userId) {
            accessError.value = 'Vui lòng đăng nhập để xem chi tiết hóa đơn.'
            return
          }
          
          if (orderHistory.orders.value.length === 0) {
            await orderHistory.fetchOrderHistory(userId)
          }
          
          await fetchOrderDetail(orderId.value, userId)
          accessError.value = ''
        } catch (error) {
          accessError.value = 'Bạn không có quyền xem hóa đơn này hoặc hóa đơn không tồn tại.'
        }
      }
    }

    const calculateSubtotal = () => {
      if (!orderProducts.value || !Array.isArray(orderProducts.value)) return 0
      return orderProducts.value.reduce((sum, product) => sum + (product.thanhtien || 0), 0)
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('vi-VN')
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value || 0)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'Đã thanh toán':
          return 'badge bg-success'
        case 'Chờ thanh toán':
          return 'badge bg-warning'
        case 'Đang xử lý':
          return 'badge bg-info'
        case 'Đang giao hàng':
          return 'badge bg-primary'
        case 'Đã giao hàng':
          return 'badge bg-success'
        case 'Đã hủy':
          return 'badge bg-danger'
        default:
          return 'badge bg-secondary'
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    const cancelOrder = () => {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        // TODO: Implement cancel order API
        alert('Tính năng hủy đơn hàng đang được phát triển')
      }
    }

    const printInvoice = () => {
      window.print()
    }

    onMounted(() => {
      loadOrderDetail()
    })

    return {
      orderDetail,
      orderProducts,
      paymentInfo,
      detailLoading,
      detailError,
      accessError,
      orderId,
      calculateSubtotal,
      formatDateTime,
      formatCurrency,
      getStatusClass,
      goBack,
      cancelOrder,
      printInvoice
    }
  }
}
</script>

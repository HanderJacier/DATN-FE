<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        QUẢN LÝ HÓA ĐƠN
      </h5>

      <!-- Bộ lọc và tìm kiếm -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="Tìm theo tên, SĐT, mã giao dịch..." 
            class="form-control"
          />
        </div>
        <div class="col-md-3">
          <select v-model="statusFilter" class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div class="col-md-2">
          <input v-model="fromDate" type="date" class="form-control" />
        </div>
        <div class="col-md-2">
          <input v-model="toDate" type="date" class="form-control" />
        </div>
        <div class="col-md-1">
          <button class="btn btn-primary w-100" @click="searchOrders">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- Thống kê nhanh -->
      <div v-if="orderStats" class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.tong_hoa_don }}</h5>
              <p class="mb-0">Tổng hóa đơn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.da_thanh_toan }}</h5>
              <p class="mb-0">Đã thanh toán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.cho_thanh_toan }}</h5>
              <p class="mb-0">Chờ thanh toán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <h5>{{ formatCurrency(orderStats.tong_doanh_thu) }}</h5>
              <p class="mb-0">Tổng doanh thu</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="ordersLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Đang tải danh sách hóa đơn...</p>
      </div>

      <!-- Bảng hóa đơn -->
      <div v-else class="table-responsive">
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã HĐ</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Ngày tạo</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>PT Thanh toán</th>
              <th>Mã GD</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id_hd">
              <td>HD{{ String(order.id_hd).padStart(3, '0') }}</td>
              <td>{{ order.hoveten }}</td>
              <td>{{ order.sodienthoai }}</td>
              <td>{{ formatDate(order.ngaytao) }}</td>
              <td>{{ formatCurrency(order.giahoadon) }}</td>
              <td>
                <select 
                  :value="order.trangthai" 
                  @change="updateStatus(order.id_hd, $event.target.value)"
                  class="form-select form-select-sm"
                  :disabled="updateLoading"
                >
                  <option value="Chờ thanh toán">Chờ thanh toán</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>
              <td>{{ order.phuongthuc || 'COD' }}</td>
              <td>{{ order.magiaodich || '-' }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-primary"
                  @click="viewOrderDetail(order.id_hd)"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="9" class="text-muted py-4">
                Không tìm thấy hóa đơn nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
          </li>
          <li 
            v-for="page in totalPages" 
            :key="page" 
            class="page-item" 
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Sau</button>
          </li>
        </ul>
      </nav>

      <!-- Thông báo -->
      <div v-if="actionMessage" class="alert mt-3" :class="actionSuccess ? 'alert-success' : 'alert-danger'">
        {{ actionMessage }}
      </div>
    </div>

    <!-- Modal chi tiết hóa đơn -->
    <div v-if="showDetailModal" class="modal fade show d-block" tabindex="-1">
     
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết hóa đơn HD{{ String(selectedOrderId).padStart(3, '0') }}</h5>
            <button type="button" class="btn-close" @click="closeDetailModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Đang tải chi tiết...</p>
            </div>
            <div v-else-if="orderDetail">
              <!-- Thông tin khách hàng -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6 class="fw-bold">Thông tin khách hàng</h6>
                  <p><strong>Họ tên:</strong> {{ orderDetail.hovaten }}</p>
                  <p><strong>SĐT:</strong> {{ orderDetail.sodienthoai }}</p>
                  <p><strong>Email:</strong> {{ orderDetail.email }}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="fw-bold">Thông tin đơn hàng</h6>
                  <p><strong>Ngày tạo:</strong> {{ formatDate(orderDetail.ngaytao) }}</p>
                  <p><strong>Trạng thái:</strong> {{ orderDetail.trangthai }}</p>
                  <p><strong>Ghi chú:</strong> {{ orderDetail.noidung || 'Không có' }}</p>
                </div>
              </div>

              <!-- Danh sách sản phẩm -->
              <h6 class="fw-bold">Danh sách sản phẩm</h6>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in orderProducts" :key="product.id_hdct">
                    <td>{{ product.tensanpham }}</td>
                    <td>{{ product.soluong }}</td>
                    <td>{{ formatCurrency(product.dongia) }}</td>
                    <td>{{ formatCurrency(product.thanhtien) }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Thông tin thanh toán -->
              <div v-if="paymentInfo" class="mt-4">
                <h6 class="fw-bold">Thông tin thanh toán</h6>
                <p><strong>Phương thức:</strong> {{ paymentInfo.phuongthuc }}</p>
                <p><strong>Số tiền:</strong> {{ formatCurrency(paymentInfo.sotien) }}</p>
                <p><strong>Ngày thanh toán:</strong> {{ formatDate(paymentInfo.ngaythanhtoan) }}</p>
                <p v-if="paymentInfo.magiaodich"><strong>Mã giao dịch:</strong> {{ paymentInfo.magiaodich }}</p>
              </div>

              <!-- Tổng tiền -->
              <div class="text-end mt-4">
                <h5 class="fw-bold">
                  Tổng cộng: 
                  <span class="text-danger">{{ formatCurrency(orderDetail.giahoadon) }}</span>
                </h5>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetailModal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import useOrderManagement from './QLND/useOrderManagement.js'

export default {
  name: 'OrderManagement',
  setup() {
    const {
      orders,
      orderDetail,
      orderProducts,
      paymentInfo,
      orderStats,
      ordersLoading,
      detailLoading,
      updateLoading,
      fetchAllOrders,
      fetchOrderDetail,
      searchOrders,
      updateOrderStatus,
      fetchOrderStats
    } = useOrderManagement()

    const searchKeyword = ref('')
    const statusFilter = ref('')
    const fromDate = ref('')
    const toDate = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalOrders = ref(0)
    const showDetailModal = ref(false)
    const selectedOrderId = ref(null)
    const actionMessage = ref('')
    const actionSuccess = ref(false)

    const totalPages = computed(() => {
      return Math.ceil(totalOrders.value / pageSize.value)
    })

    const loadOrders = async (page = 1) => {
      currentPage.value = page
      await fetchAllOrders(page, pageSize.value, statusFilter.value)
      totalOrders.value = orders.value.length // Giả sử có tổng số
    }

    const searchOrdersHandler = async () => {
      currentPage.value = 1
      await searchOrders(
        searchKeyword.value || null,
        fromDate.value || null,
        toDate.value || null,
        1,
        pageSize.value
      )
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        loadOrders(page)
      }
    }

    const updateStatus = async (orderId, newStatus) => {
      const success = await updateOrderStatus(orderId, newStatus)
      
      if (success) {
        // Cập nhật local
        const order = orders.value.find(o => o.id_hd === orderId)
        if (order) {
          order.trangthai = newStatus
        }
        
        actionMessage.value = 'Cập nhật trạng thái thành công'
        actionSuccess.value = true
      } else {
        actionMessage.value = 'Cập nhật trạng thái thất bại'
        actionSuccess.value = false
      }
      
      setTimeout(() => {
        actionMessage.value = ''
      }, 3000)
    }

    const viewOrderDetail = async (orderId) => {
      selectedOrderId.value = orderId
      showDetailModal.value = true
      await fetchOrderDetail(orderId)
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedOrderId.value = null
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('vi-VN')
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    }

    onMounted(async () => {
      await loadOrders()
      await fetchOrderStats()
    })

    return {
      orders,
      orderDetail,
      orderProducts,
      paymentInfo,
      orderStats,
      ordersLoading,
      detailLoading,
      updateLoading,
      searchKeyword,
      statusFilter,
      fromDate,
      toDate,
      currentPage,
      totalPages,
      showDetailModal,
      selectedOrderId,
      actionMessage,
      actionSuccess,
      loadOrders,
      searchOrders: searchOrdersHandler,
      changePage,
      updateStatus,
      viewOrderDetail,
      closeDetailModal,
      formatDate,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.form-title {
  font-size: 18px;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>

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
            @keyup.enter="searchOrdersHandler"
          />
        </div>
        <div class="col-md-3">
          <select v-model="statusFilter" class="form-select" @change="onFilterChange">
            <option value="">Tất cả trạng thái</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div class="col-md-2">
          <input v-model="fromDate" type="date" class="form-control" @change="onFilterChange" />
        </div>
        <div class="col-md-2">
          <input v-model="toDate" type="date" class="form-control" @change="onFilterChange" />
        </div>
        <div class="col-md-1">
          <button class="btn btn-primary w-100" @click="searchOrdersHandler" :disabled="ordersLoading">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- Nút refresh -->
      <div class="mb-3">
        <button class="btn btn-outline-primary" @click="refreshData" :disabled="ordersLoading">
          <i class="bi bi-arrow-clockwise"></i> Làm mới
        </button>
      </div>

      <!-- Thống kê nhanh -->
      <div v-if="orderStats" class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.tong_hoa_don || 0 }}</h5>
              <p class="mb-0">Tổng hóa đơn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.da_thanh_toan || 0 }}</h5>
              <p class="mb-0">Đã thanh toán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <h5>{{ orderStats.cho_thanh_toan || 0 }}</h5>
              <p class="mb-0">Chờ thanh toán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <h5>{{ formatCurrency(orderStats.tong_doanh_thu || 0) }}</h5>
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

      <!-- Error message -->
      <div v-else-if="ordersError" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i>
        Có lỗi xảy ra khi tải dữ liệu: {{ ordersError }}
      </div>

      <!-- Bảng hóa đơn -->
      <div v-else class="table-responsive">
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
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
            <tr v-for="(order, idx) in orders" :key="order.id_hd">
              <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td>{{ order.hoveten }}</td>
              <td>{{ order.sodienthoai }}</td>
              <td>{{ (order.ngaytao) }}</td>
              <td>{{ formatCurrency(order.giahoadon) }}</td>
              <td>
                <select
                  :value="apiToUi(order.trangthai)"
                  @change="updateStatus(order.id_hd, uiToApi($event.target.value))"
                  class="form-select form-select-sm"
                  :disabled="updateLoading"
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đã xử lý">Đã xử lý</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>
              <td>{{ order.phuongthuc || 'COD' }}</td>
              <td>{{ order.magiaodich || '-' }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="viewOrderDetail(order.id_hd)">
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
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
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
            <h5 class="modal-title">Chi tiết hóa đơn</h5>
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
                  <p><strong>Họ tên:</strong> {{ orderDetail.hoveten }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
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
      ordersError,
      detailLoading,
      updateLoading,
      fetchAllOrders,
      fetchOrderDetail,
      searchOrders,
      updateOrderStatus,
      fetchOrderStats
    } = useOrderManagement()

    // Map UI <-> API: hiển thị "Chờ xử lý" nhưng backend vẫn dùng "Đang xử lý"
    const apiToUi = (s) => (s === 'Đang xử lý' ? 'Chờ xử lý' : s || '')
    const uiToApi = (s) => (s === 'Chờ xử lý' ? 'Đang xử lý' : s || '')

    const searchKeyword = ref('')
    const statusFilter = ref('') // giữ theo UI: "", "Chờ xử lý", "Đã xử lý", "Đã hủy"
    const fromDate = ref('')
    const toDate = ref('')
    const currentPage = ref(1)
    const pageSize = ref(100)
    const totalOrders = ref(0)
    const showDetailModal = ref(false)
    const selectedOrderId = ref(null)
    const actionMessage = ref('')
    const actionSuccess = ref(false)

    const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize.value))

    // Load dữ liệu ban đầu
    const loadOrders = async (page = 1) => {
      currentPage.value = page
      await fetchAllOrders(page, pageSize.value, statusFilter.value ? uiToApi(statusFilter.value) : null)
      // Nếu API có trả tổng count thì thay bằng giá trị đó
      totalOrders.value = orders.value.length
    }

    // Tìm kiếm hóa đơn
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

    // Xử lý thay đổi filter
    const onFilterChange = async () => {
      if (searchKeyword.value || fromDate.value || toDate.value) {
        await searchOrdersHandler()
      } else {
        await loadOrders(1)
      }
    }

    // Làm mới dữ liệu
    const refreshData = async () => {
      searchKeyword.value = ''
      statusFilter.value = ''
      fromDate.value = ''
      toDate.value = ''
      currentPage.value = 1
      await loadOrders(1)
      await fetchOrderStats()
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        if (searchKeyword.value || fromDate.value || toDate.value) {
          searchOrdersHandler()
        } else {
          loadOrders(page)
        }
      }
    }

    const updateStatus = async (orderId, newStatusApi) => {
      const success = await updateOrderStatus(orderId, newStatusApi)
      if (success) {
        const order = orders.value.find(o => o.id_hd === orderId)
        if (order) order.trangthai = newStatusApi
        actionMessage.value = 'Cập nhật trạng thái thành công'
        actionSuccess.value = true
        await fetchOrderStats()
      } else {
        actionMessage.value = 'Cập nhật trạng thái thất bại'
        actionSuccess.value = false
      }
      setTimeout(() => { actionMessage.value = '' }, 3000)
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
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
    }

    // Debug nếu cần
    watch(orders, () => {}, { deep: true })

    onMounted(async () => {
      await Promise.all([ loadOrders(1), fetchOrderStats() ])
    })

    return {
      // data từ composable
      orders, orderDetail, orderProducts, paymentInfo, orderStats,
      ordersLoading, ordersError, detailLoading, updateLoading,

      // state
      searchKeyword, statusFilter, fromDate, toDate,
      currentPage, pageSize, totalPages,
      showDetailModal, selectedOrderId, actionMessage, actionSuccess,

      // maps UI<->API
      apiToUi, uiToApi,

      // methods
      loadOrders,
      searchOrders: searchOrdersHandler,
      onFilterChange,
      refreshData,
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
.form-title { font-size: 18px; }
.modal { background-color: rgba(0, 0, 0, 0.5); }
.card { transition: transform 0.2s; }
.card:hover { transform: translateY(-2px); }
.table th { background-color: #f8f9fa; font-weight: 600; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

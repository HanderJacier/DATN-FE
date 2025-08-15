<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>
        <Historybar />
        
        <!-- Bộ lọc và tìm kiếm -->
        <div class="card p-3 mb-4">
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <input 
                v-model="searchKeyword"
                type="text"
                placeholder="Tìm theo mã hóa đơn, ghi chú..."
                class="form-control"
                @keyup.enter="applyFilters"
              />
            </div>
            <div class="col-md-3">
              <select v-model="statusFilter" class="form-select" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="Chờ thanh toán">Chờ thanh toán</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao hàng">Đã giao hàng</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
            <div class="col-md-2">
              <input v-model="fromDate" type="date" class="form-control" @change="applyFilters" />
            </div>
            <div class="col-md-2">
              <input v-model="toDate" type="date" class="form-control" @change="applyFilters" />
            </div>
            <div class="col-md-1">
              <button class="btn btn-primary w-100" @click="applyFilters" :disabled="loading">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshData" :disabled="loading">
                <i class="bi bi-arrow-clockwise"></i> Làm mới
              </button>
              <span class="text-muted small">
                Tìm thấy {{ filteredOrders.length }} đơn hàng
              </span>
            </div>
            <div>
              <button class="btn btn-outline-success btn-sm" @click="exportOrders" :disabled="loading || filteredOrders.length === 0">
                <i class="bi bi-download"></i> Xuất Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Hiển thị loading và error states -->
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải danh sách hóa đơn...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          Có lỗi xảy ra: {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshData">
            Thử lại
          </button>
        </div>

        <!-- Bảng hiển thị hóa đơn -->
        <div v-else class="table-responsive">
          <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 100px;">Mã HĐ</th>
                <th style="width: 120px;">Ngày tạo</th>
                <th style="width: 130px;">Tổng tiền</th>
                <th style="width: 120px;">Trạng thái</th>
                <th style="width: 120px;">PT Thanh toán</th>
                <th>Ghi chú</th>
                <th style="width: 150px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order.id_hd">
                <td class="fw-bold">HD{{ String(order.id_hd).padStart(3, '0') }}</td>
                <td>{{ formatDate(order.ngaytao) }}</td>
                <td class="fw-bold text-danger">{{ formatCurrency(order.giahoadon) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(order.trangthai)">
                    {{ order.trangthai }}
                  </span>
                </td>
                <td>{{ getPaymentMethodText(order.phuongthuc) }}</td>
                <td class="text-start">
                  <span :title="order.noidung">
                    {{ truncateText(order.noidung, 30) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-primary"
                      @click="viewOrderDetail(order.id_hd)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      v-if="canCancelOrder(order.trangthai)"
                      class="btn btn-danger"
                      @click="confirmCancelOrder(order.id_hd)"
                      title="Hủy đơn hàng"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <button
                      class="btn btn-success"
                      @click="reorderItems(order.id_hd)"
                      title="Mua lại"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="text-muted py-4">
                  <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  {{ orders.length === 0 ? 'Bạn chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang -->
        <div v-if="filteredOrders.length > itemsPerPage" class="d-flex justify-content-center mt-4">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li 
                v-for="page in totalPages" 
                :key="page" 
                class="page-item" 
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Modal chi tiết hóa đơn -->
        <div v-if="showDetailModal" class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-receipt me-2"></i>
                  Chi tiết hóa đơn HD{{ String(selectedOrderId).padStart(3, '0') }}
                </h5>
                <button type="button" class="btn-close" @click="closeDetailModal"></button>
              </div>
              <div class="modal-body">
                <div v-if="detailLoading" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="mt-2">Đang tải chi tiết...</p>
                </div>
                <div v-else-if="orderDetail">
                  <!-- Thông tin hóa đơn -->
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0"><i class="bi bi-info-circle me-2"></i>Thông tin hóa đơn</h6>
                        </div>
                        <div class="card-body">
                          <p><strong>Mã hóa đơn:</strong> HD{{ String(orderDetail.id_hd).padStart(3, '0') }}</p>
                          <p><strong>Ngày tạo:</strong> {{ formatDateTime(orderDetail.ngaytao) }}</p>
                          <p><strong>Trạng thái:</strong> 
                            <span class="badge" :class="getStatusClass(orderDetail.trangthai)">
                              {{ orderDetail.trangthai }}
                            </span>
                          </p>
                          <p><strong>Khách hàng:</strong> {{ orderDetail.hovaten }}</p>
                          <p><strong>Số điện thoại:</strong> {{ orderDetail.sodienthoai }}</p>
                          <p v-if="orderDetail.email"><strong>Email:</strong> {{ orderDetail.email }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0"><i class="bi bi-credit-card me-2"></i>Thông tin thanh toán</h6>
                        </div>
                        <div class="card-body">
                          <p><strong>Phương thức:</strong> {{ getPaymentMethodText(orderDetail.phuongthuc) }}</p>
                          <p><strong>Ghi chú:</strong> {{ orderDetail.noidung || 'Không có' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Danh sách sản phẩm -->
                  <div class="card">
                    <div class="card-header">
                      <h6 class="mb-0"><i class="bi bi-box-seam me-2"></i>Danh sách sản phẩm</h6>
                    </div>
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-bordered">
                          <thead class="table-light">
                            <tr>
                              <th style="width: 50px;">STT</th>
                              <th style="width: 80px;">Hình ảnh</th>
                              <th>Sản phẩm</th>
                              <th style="width: 100px;">Số lượng</th>
                              <th style="width: 120px;">Đơn giá</th>
                              <th style="width: 120px;">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(product, index) in orderDetail.products" :key="index">
                              <td class="text-center">{{ index + 1 }}</td>
                              <td class="text-center">
                                <img 
                                  :src="product.anhgoc || '/placeholder.svg?height=50&width=50'" 
                                  :alt="product.tensanpham"
                                  class="img-thumbnail"
                                  style="width: 50px; height: 50px; object-fit: cover;"
                                  @error="handleImageError"
                                />
                              </td>
                              <td>{{ product.tensanpham }}</td>
                              <td class="text-center">{{ product.soluong }}</td>
                              <td class="text-end">{{ formatCurrency(product.dongia) }}</td>
                              <td class="text-end fw-bold text-danger">{{ formatCurrency(product.thanhtien) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Tổng tiền -->
                      <div class="text-end mt-4 p-3 bg-light rounded">
                        <h5 class="fw-bold mb-0">
                          Tổng cộng: 
                          <span class="text-danger">{{ formatCurrency(orderDetail.giahoadon) }}</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="detailError" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ detailError }}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeDetailModal">
                  <i class="bi bi-x-lg me-1"></i>Đóng
                </button>
                <button 
                  v-if="orderDetail && canCancelOrder(orderDetail.trangthai)" 
                  type="button" 
                  class="btn btn-danger" 
                  @click="confirmCancelOrder(orderDetail.id_hd)"
                >
                  <i class="bi bi-x-circle me-1"></i>Hủy đơn hàng
                </button>
                <button type="button" class="btn btn-success" @click="reorderItems(selectedOrderId)">
                  <i class="bi bi-arrow-repeat me-1"></i>Mua lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal backdrop -->
        <div v-if="showDetailModal" class="modal-backdrop fade show"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue'
import Historybar from '@/components/User/Title/Historybar.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AllOrders',
  components: { Slidebar, Historybar },
  setup() {
    const router = useRouter()
    
    // Reactive data
    const orders = ref([])
    const orderDetail = ref(null)
    const loading = ref(false)
    const detailLoading = ref(false)
    const error = ref(null)
    const detailError = ref(null)
    
    const searchKeyword = ref('')
    const statusFilter = ref('')
    const fromDate = ref('')
    const toDate = ref('')
    const showDetailModal = ref(false)
    const selectedOrderId = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Mock data for demonstration
    const mockOrders = [
      {
        id_hd: 1,
        ngaytao: '2024-01-15T10:30:00',
        trangthai: 'Đã thanh toán',
        giahoadon: 25290000,
        phuongthuc: 'COD',
        noidung: 'Đơn hàng iPhone 16 Pro',
        hovaten: 'Nguyễn Văn A',
        sodienthoai: '0123456789',
        email: 'nguyenvana@email.com',
        products: [
          {
            tensanpham: 'iPhone 16 Pro 128GB',
            soluong: 1,
            dongia: 25290000,
            thanhtien: 25290000,
            anhgoc: 'https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-16-pro_1.png'
          }
        ]
      },
      {
        id_hd: 2,
        ngaytao: '2024-01-10T14:20:00',
        trangthai: 'Đang giao hàng',
        giahoadon: 2390000,
        phuongthuc: 'BANK',
        noidung: 'Đơn hàng Samsung Galaxy S25',
        hovaten: 'Trần Thị B',
        sodienthoai: '0987654321',
        email: 'tranthib@email.com',
        products: [
          {
            tensanpham: 'Samsung Galaxy S25 256GB',
            soluong: 1,
            dongia: 2390000,
            thanhtien: 2390000,
            anhgoc: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_1__2.png'
          }
        ]
      },
      {
        id_hd: 3,
        ngaytao: '2024-01-05T09:15:00',
        trangthai: 'Chờ thanh toán',
        giahoadon: 300000,
        phuongthuc: 'QR',
        noidung: 'Đơn hàng chuột Logitech',
        hovaten: 'Lê Văn C',
        sodienthoai: '0369852147',
        email: 'levanc@email.com',
        products: [
          {
            tensanpham: 'Chuột không dây Logitech Signature M650 Size M',
            soluong: 2,
            dongia: 150000,
            thanhtien: 300000,
            anhgoc: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_1_3__3.png'
          }
        ]
      }
    ]

    // Computed properties
    const filteredOrders = computed(() => {
      let filtered = [...orders.value]

      // Filter by search keyword
      if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.toLowerCase().trim()
        filtered = filtered.filter(order => 
          `HD${String(order.id_hd).padStart(3, '0')}`.toLowerCase().includes(keyword) ||
          (order.noidung && order.noidung.toLowerCase().includes(keyword)) ||
          (order.hovaten && order.hovaten.toLowerCase().includes(keyword))
        )
      }

      // Filter by status
      if (statusFilter.value) {
        filtered = filtered.filter(order => order.trangthai === statusFilter.value)
      }

      // Filter by date range
      if (fromDate.value) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.ngaytao)
          const fromDateObj = new Date(fromDate.value)
          return orderDate >= fromDateObj
        })
      }

      if (toDate.value) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.ngaytao)
          const toDateObj = new Date(toDate.value)
          toDateObj.setHours(23, 59, 59, 999)
          return orderDate <= toDateObj
        })
      }

      // Sort by date (newest first)
      return filtered.sort((a, b) => new Date(b.ngaytao) - new Date(a.ngaytao))
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
    })

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredOrders.value.slice(start, end)
    })

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('vi-VN')
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('vi-VN')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount || 0)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'Chờ thanh toán': return 'bg-warning text-dark'
        case 'Đã thanh toán': return 'bg-success'
        case 'Đang xử lý': return 'bg-info'
        case 'Đang giao hàng': return 'bg-primary'
        case 'Đã giao hàng': return 'bg-success'
        case 'Đã hủy': return 'bg-danger'
        default: return 'bg-secondary'
      }
    }

    const getPaymentMethodText = (method) => {
      switch (method) {
        case 'COD': return 'Thanh toán khi nhận hàng'
        case 'BANK': return 'Chuyển khoản ngân hàng'
        case 'QR': return 'Thanh toán QR Code'
        case 'MOMO': return 'Ví MoMo'
        case 'VNPAY': return 'VNPay'
        default: return method || 'COD'
      }
    }

    const truncateText = (text, maxLength) => {
      if (!text) return '-'
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const canCancelOrder = (status) => {
      return ['Chờ thanh toán', 'Đang xử lý'].includes(status)
    }

    const handleImageError = (event) => {
      event.target.src = '/placeholder.svg?height=50&width=50'
    }

    const viewOrderDetail = (orderId) => {
      const order = orders.value.find(o => o.id_hd === orderId)
      if (order) {
        selectedOrderId.value = orderId
        orderDetail.value = order
        showDetailModal.value = true
      }
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedOrderId.value = null
      orderDetail.value = null
    }

    const applyFilters = () => {
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const refreshData = () => {
      searchKeyword.value = ''
      statusFilter.value = ''
      fromDate.value = ''
      toDate.value = ''
      currentPage.value = 1
      
      // Load mock data
      loading.value = true
      setTimeout(() => {
        orders.value = mockOrders
        loading.value = false
      }, 1000)
    }

    const confirmCancelOrder = (orderId) => {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
        // Update order status
        const order = orders.value.find(o => o.id_hd === orderId)
        if (order) {
          order.trangthai = 'Đã hủy'
          alert('Hủy đơn hàng thành công!')
          closeDetailModal()
        }
      }
    }

    const reorderItems = (orderId) => {
      const order = orders.value.find(o => o.id_hd === orderId)
      if (order && order.products) {
        alert('Tính năng mua lại đang được phát triển!')
      }
    }

    const exportOrders = () => {
      alert('Tính năng xuất Excel đang được phát triển!')
    }

    // Load data on mount
    onMounted(() => {
      refreshData()
    })

    return {
      orders,
      orderDetail,
      loading,
      detailLoading,
      error,
      detailError,
      searchKeyword,
      statusFilter,
      fromDate,
      toDate,
      showDetailModal,
      selectedOrderId,
      currentPage,
      itemsPerPage,
      filteredOrders,
      totalPages,
      paginatedOrders,
      formatDate,
      formatDateTime,
      formatCurrency,
      getStatusClass,
      getPaymentMethodText,
      truncateText,
      canCancelOrder,
      handleImageError,
      viewOrderDetail,
      closeDetailModal,
      applyFilters,
      changePage,
      refreshData,
      confirmCancelOrder,
      reorderItems,
      exportOrders
    }
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-color: #dee2e6;
}

.table td {
  vertical-align: middle;
  border-color: #dee2e6;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.card {
  border: 1px solid #e3e6f0;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
}

.card-header {
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
}

.pagination .page-link {
  color: #5a5c69;
  border-color: #dddfeb;
}

.pagination .page-item.active .page-link {
  background-color: #5a5c69;
  border-color: #5a5c69;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group-sm > .btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}
</style>

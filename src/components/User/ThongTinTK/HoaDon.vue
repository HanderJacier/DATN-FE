<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>

        <!-- Tab navigation -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'all' }" @click="changeTab('all')">Tất cả</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'pending' }" @click="changeTab('pending')">Chờ xử lý</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'processing' }" @click="changeTab('processing')">Đang xử lý</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'shipping' }" @click="changeTab('shipping')">Đang giao</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'delivered' }" @click="changeTab('delivered')">Đã giao</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'cancelled' }" @click="changeTab('cancelled')">Đã hủy</a>
          </li>
        </ul>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải đơn hàng...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Lỗi: {{ error.message || 'Không thể tải danh sách đơn hàng.' }}
        </div>

        <!-- Order list -->
        <div v-else-if="filteredOrders.length > 0">
          <div v-for="order in filteredOrders" :key="order.id_hd" class="card mb-3 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0 fw-bold text-primary">
                  Đơn hàng #HD{{ String(order.id_hd).padStart(3, '0') }}
                </h6>
                <span :class="getStatusClass(order.trangthai)">
                  {{ order.trangthai }}
                </span>
              </div>
              <p class="text-muted small mb-2">
                Ngày đặt: {{ formatDateTime(order.ngaytao) }}
              </p>
              
              <div class="border-top pt-3 mt-3">
                <div v-for="product in order.products" :key="product.id_hdct" class="d-flex align-items-center mb-2">
                  <img 
                    :src="product.anhgoc || '/placeholder.svg?height=60&width=60'" 
                    :alt="product.tensanpham"
                    class="img-thumbnail me-3"
                    style="width: 60px; height: 60px; object-fit: cover;"
                  />
                  <div class="flex-grow-1">
                    <div class="fw-semibold">{{ product.tensanpham }}</div>
                    <div class="text-muted small">Số lượng: {{ product.soluong }}</div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold text-danger">{{ formatCurrency(product.thanhtien) }}</div>
                  </div>
                </div>
              </div>

              <div class="text-end border-top pt-3 mt-3">
                <p class="mb-1">
                  Tổng tiền: 
                  <span class="fw-bold fs-5 text-danger">{{ formatCurrency(order.giahoadon) }}</span>
                </p>
                <router-link :to="`/thongtintk/hoadon/${order.id_hd}`" class="btn btn-outline-primary btn-sm">
                  Xem chi tiết
                </router-link>
                <button 
                  v-if="order.trangthai === 'Chờ xử lý'" 
                  class="btn btn-danger btn-sm ms-2"
                  @click="confirmCancelOrder(order.id_hd)"
                >
                  Hủy đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No orders found -->
        <div v-else class="alert alert-info text-center py-4">
          <i class="bi bi-info-circle fs-1 text-muted"></i>
          <h5 class="mt-3">Không có đơn hàng nào trong mục này.</h5>
          <p class="text-muted">Hãy tiếp tục mua sắm để tạo đơn hàng mới!</p>
          <router-link to="/" class="btn btn-primary">
            <i class="bi bi-shop me-1"></i>Mua sắm ngay
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import useOrderHistory from '@/components/User/LoadDB/useOrderHistory.js'

export default {
  components: { Slidebar },
  name: 'HoaDon',
  setup() {
    const {
      orders,
      loading,
      error,
      fetchOrderHistory,
      cancelOrder
    } = useOrderHistory()

    const currentTab = ref('all') // 'all', 'pending', 'processing', 'shipping', 'delivered', 'cancelled'

    const getCurrentUserId = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      return user?.id_tk
    }

    const loadOrders = async () => {
      const userId = getCurrentUserId()
      if (userId) {
        await fetchOrderHistory(userId)
      } else {
        error.value = { message: 'Vui lòng đăng nhập để xem lịch sử đơn hàng.' }
      }
    }

    const filteredOrders = computed(() => {
      if (!orders.value) return []
      
      return orders.value.filter(order => {
        if (currentTab.value === 'all') return true
        if (currentTab.value === 'pending' && order.trangthai === 'Chờ xử lý') return true
        if (currentTab.value === 'processing' && order.trangthai === 'Đang xử lý') return true
        if (currentTab.value === 'shipping' && order.trangthai === 'Đang giao hàng') return true
        if (currentTab.value === 'delivered' && order.trangthai === 'Đã giao hàng') return true
        if (currentTab.value === 'cancelled' && order.trangthai === 'Đã hủy') return true
        return false
      }).sort((a, b) => new Date(b.ngaytao) - new Date(a.ngaytao)) // Sắp xếp mới nhất lên đầu
    })

    const changeTab = (tab) => {
      currentTab.value = tab
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
          return 'badge bg-warning text-dark'
        case 'Đang xử lý':
          return 'badge bg-info text-dark'
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

    const confirmCancelOrder = async (orderId) => {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        const success = await cancelOrder(orderId)
        if (success) {
          alert('Đơn hàng đã được hủy thành công!')
          await loadOrders() // Reload orders after cancellation
        } else {
          alert('Không thể hủy đơn hàng. Vui lòng thử lại.')
        }
      }
    }

    onMounted(() => {
      loadOrders()
    })

    return {
      currentTab,
      loading,
      error,
      filteredOrders,
      changeTab,
      formatDateTime,
      formatCurrency,
      getStatusClass,
      confirmCancelOrder
    }
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  border-color: #007bff #007bff #fff;
  font-weight: bold;
}

.card {
  border-radius: 0.5rem;
}

.img-thumbnail {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.badge {
  padding: 0.5em 0.75em;
  font-size: 0.85em;
}
</style>

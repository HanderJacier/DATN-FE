<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-md-3"><Slidebar /></div>

      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>
        <Historybar />

        <!-- Thanh công cụ -->
        <div class="card p-3 mb-4">
          <div class="row g-3 align-items-center">
            <div class="col-md-6">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="Tìm theo ghi chú..."
                class="form-control"
                @keyup.enter="applyFilters"
                :disabled="!idTk"
              />
            </div>

            <div class="col-md-6 d-flex justify-content-end align-items-center gap-2">
              <span class="text-muted small me-2">
                {{ filteredOrders.length }} / {{ total }} đơn (trang {{ pageNo }} / {{ totalPages }})
              </span>

              <nav v-if="totalPages > 1" aria-label="Pagination" class="me-2">
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pageNo === 1 }">
                    <button class="page-link" @click="changePage(pageNo - 1)" :disabled="pageNo === 1 || !idTk">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === pageNo }">
                    <button class="page-link" @click="changePage(page)" :disabled="!idTk">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: pageNo === totalPages }">
                    <button class="page-link" @click="changePage(pageNo + 1)" :disabled="pageNo === totalPages || !idTk">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

              <button class="btn btn-outline-primary btn-sm" @click="refreshData" :disabled="loading || !idTk">
                <i class="bi bi-arrow-clockwise"></i> Làm mới
              </button>
            </div>
          </div>
        </div>

        <!-- Thông báo thiếu id_tk -->
        <div v-if="!idTk" class="alert alert-warning">
          Bạn chưa đăng nhập hoặc thiếu <code>id_tk</code>. Vui lòng đăng nhập để xem đơn hàng.
        </div>

        <!-- Loading / Error -->
        <div v-else-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải danh sách hóa đơn...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          Có lỗi xảy ra: {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshData">Thử lại</button>
        </div>

        <!-- Bảng hóa đơn -->
        <div v-else class="table-responsive">
          <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
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
                <td>{{ formatDate(order.ngaytao) }}</td>
                <td class="fw-bold text-danger">{{ formatCurrency(order.giahoadon) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(order.trangthai)">{{ order.trangthai }}</span>
                </td>
                <td>{{ getPaymentMethodText(order.phuongthuc) }}</td>
                <td class="text-start">
                  <span :title="order.noidung">{{ truncateText(order.noidung, 30) }}</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary" @click="viewOrderDetail(order.id_hd)" title="Xem chi tiết">
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

      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue'
import Historybar from '@/components/User/Title/Historybar.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import useHoaDonTheoTaiKhoan from '../../LoadDB/HoaDon' // chỉnh đường dẫn theo dự án của bạn

// Helper đọc id_tk an toàn
function readIdTk() {
  if (typeof window === 'undefined') return null
  const s1 = sessionStorage.getItem('id_tk')
  if (s1 && Number.isFinite(+s1) && +s1 > 0) return +s1
  const s2 = localStorage.getItem('id_tk')
  if (s2 && Number.isFinite(+s2) && +s2 > 0) return +s2
  const user =
    JSON.parse(sessionStorage.getItem('user') || 'null') ||
    JSON.parse(localStorage.getItem('user') || 'null')
  const fromUser = Number(user?.id_tk ?? user?.id ?? user?.taikhoan)
  if (Number.isFinite(fromUser) && fromUser > 0) return fromUser
  return null
}

export default {
  name: 'AllOrders',
  components: { Slidebar, Historybar },
  setup() {
    const router = useRouter()

    const {
      orders, total, pageNo, pageSize,
      loading, error,
      fetchHoaDonTheoTaiKhoan, setPage, setPageSize
    } = useHoaDonTheoTaiKhoan()

    const idTk = ref(readIdTk())

    const searchKeyword = ref('')
    const itemsPerPage = ref(10)

    const parseVNDate = (s) => {
      if (!s) return null
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/').map(Number)
        return new Date(y, m - 1, d)
      }
      return new Date(s)
    }

    const filteredOrders = computed(() => {
      let filtered = [...orders.value]
      if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.toLowerCase().trim()
        filtered = filtered.filter(order =>
          (order.noidung && order.noidung.toLowerCase().includes(keyword))
        )
      }
      return filtered.sort((a, b) => parseVNDate(b.ngaytao) - parseVNDate(a.ngaytao))
    })

    // Server-side pagination ==> render chính là `orders` từ API
    const paginatedOrders = computed(() => filteredOrders.value)
    const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / (itemsPerPage.value || 1))))

    // Helpers
    const formatDate = (dateString) => {
      const dt = parseVNDate(dateString)
      return dt && !isNaN(dt) ? dt.toLocaleDateString('vi-VN') : '-'
    }
    const formatCurrency = (amount) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
    const getStatusClass = (status) => {
      switch (status) {
        case 'Chờ thanh toán': return 'bg-warning text-dark'
        case 'Đã thanh toán': return 'bg-success'
        case 'Đang xử lý': return 'bg-warning text-dark'
        case 'Chờ xử lý': return 'bg-warning text-dark'
        case 'Đang giao hàng': return 'bg-primary'
        case 'Đã giao hàng': return 'bg-success'
        case 'Đã hủy': return 'bg-danger'
        case 'Đã xử lý': return 'bg-success'
        default: return 'bg-secondary'
      }
    }
    const getPaymentMethodText = (method) => {
      switch (method) {
        case 'COD': return 'Thanh toán khi nhận hàng'
       
        case 'QR': return 'Thanh toán QR Code'
        case 'MOMO': return 'Ví MoMo'
        case 'VNPAY': return 'VNPay'
        default: return method ?? '—'
      }
    }
    const truncateText = (text, maxLength) => !text ? '-' : (text.length > maxLength ? text.substring(0, maxLength) + '...' : text)

    // chỉ cho hủy nếu trạng thái là "Chờ xử lý"
    const canCancelOrder = (status) => status === 'Chờ xử lý'

    // Actions
    const viewOrderDetail = (orderId) => router.push({ name: 'hoadonchitiet', params: { id: orderId } })

    const applyFilters = () => { changePage(1) }

    const changePage = async (page) => {
      if (!idTk.value) return
      const p = Math.min(Math.max(1, page), totalPages.value)
      await setPage(p)
      await fetchHoaDonTheoTaiKhoan(idTk.value) // { p_id_tk, p_pageNo, p_pageSize }
    }

    const refreshData = async () => {
      if (!idTk.value) return
      searchKeyword.value = ''
      await changePage(1)
    }

    const confirmCancelOrder = (orderId) => {
      // TODO: gọi proc hủy đơn
      alert(`(Demo) Hủy đơn ${orderId} — thêm API hủy đơn tại đây!`)
    }

    // Lần đầu
    onMounted(async () => {
      await setPageSize(itemsPerPage.value)
      if (idTk.value) {
        await changePage(1)
      }
    })

    // Nếu id_tk thay đổi (đăng nhập/đăng xuất tab khác), tự refresh
    const onStorage = (e) => {
      if (e.key === 'id_tk' || e.key === 'user') {
        idTk.value = readIdTk()
        if (idTk.value) changePage(1)
      }
    }
    window.addEventListener('storage', onStorage)
    onBeforeUnmount(() => window.removeEventListener('storage', onStorage))

    return {
      // state
      idTk,
      orders, total, pageNo, pageSize,
      loading, error,
      searchKeyword,
      itemsPerPage, totalPages,
      filteredOrders, paginatedOrders,
      // helpers
      formatDate, formatCurrency, getStatusClass, getPaymentMethodText, truncateText, canCancelOrder,
      // actions
      viewOrderDetail, applyFilters, changePage, refreshData, confirmCancelOrder
    }
  }
}
</script>

<style scoped>
.table th { background-color: #f8f9fa; font-weight: 600; border-color: #dee2e6; }
.table td { vertical-align: middle; border-color: #dee2e6; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group-sm > .btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
.card { border: 1px solid #e3e6f0;}
.pagination .page-link { color: #5a5c69; border-color: #dddfeb; }
.pagination .page-item.active .page-link { background-color: #5a5c69; border-color: #5a5c69; }
@media (max-width: 768px) {
  .table-responsive { font-size: 0.875rem; }
  .btn-group-sm > .btn { padding: 0.2rem 0.4rem; font-size: 0.8rem; }
}
</style>

<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng đang xử lý</h4>
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
              />
            </div>

            <!-- Thống kê + Phân trang + Làm mới -->
            <div class="col-md-6 d-flex justify-content-end align-items-center gap-2">
              <span class="text-muted small me-2">
                {{ filteredOrders.length }} đơn (Đang xử lý) — trang {{ pageNo }} / {{ totalPages }}
              </span>

              <nav v-if="totalPages > 1" aria-label="Pagination" class="me-2">
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pageNo === 1 }">
                    <button class="page-link" @click="changePage(pageNo - 1)" :disabled="pageNo === 1">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pageNo }"
                  >
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: pageNo === totalPages }">
                    <button class="page-link" @click="changePage(pageNo + 1)" :disabled="pageNo === totalPages">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

              <button class="btn btn-outline-primary btn-sm" @click="refreshData" :disabled="loading">
                <i class="bi bi-arrow-clockwise"></i> Làm mới
              </button>
            </div>
          </div>
        </div>

        <!-- Loading / Error -->
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải danh sách hóa đơn...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          Có lỗi xảy ra: {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshData">Thử lại</button>
        </div>

        <!-- Bảng hóa đơn (chỉ "Đang xử lý") -->
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
                  <span class="badge" :class="getStatusClass(order.trangthai)">
                    {{ order.trangthai }}
                  </span>
                </td>
                <td>{{ getPaymentMethodText(order.phuongthuc) }}</td>
                <td class="text-start">
                  <span :title="order.noidung">{{ truncateText(order.noidung, 30) }}</span>
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
                    <!-- Không có nút Mua lại -->
                  </div>
                </td>
              </tr>

              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="text-muted py-4">
                  <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  {{ orders.length === 0 ? 'Bạn chưa có đơn hàng nào' : 'Không có đơn hàng đang xử lý trong trang hiện tại' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useHoaDonTheoTaiKhoan from '../../LoadDB/HoaDon' // chỉnh path theo dự án

export default {
  name: 'DangXuLy',
  components: { Slidebar, Historybar },
  setup() {
    const router = useRouter()

    // Composable gọi proc WBH_US_SEL_HOA_DON_THEO_TAI_KHOAN
    const {
      orders, total, pageNo, pageSize,
      loading, error,
      fetchHoaDonTheoTaiKhoan, setPage, setPageSize
    } = useHoaDonTheoTaiKhoan()

    const searchKeyword = ref('')
    const itemsPerPage = ref(10)

    // p_id_tk — điều chỉnh theo login thực tế
    const id_tk = Number(localStorage.getItem('id_tk')) || 2

    // Parse dd/MM/yyyy hoặc ISO
    const parseVNDate = (s) => {
      if (!s) return null
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/').map(Number)
        return new Date(y, m - 1, d)
      }
      return new Date(s)
    }

    // ✅ Chỉ lấy các order có trạng thái "Đang xử lý" rồi mới filter theo keyword
    const filteredOrders = computed(() => {
      let filtered = orders.value.filter(o => o?.trangthai === 'Đang xử lý')

      if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.toLowerCase().trim()
        filtered = filtered.filter(order =>
          (order.noidung && order.noidung.toLowerCase().includes(keyword))
        )
      }

      // sort desc by date
      return filtered.sort((a, b) => parseVNDate(b.ngaytao) - parseVNDate(a.ngaytao))
    })

    // Server-side đã trả theo trang → hiển thị trực tiếp
    const paginatedOrders = computed(() => filteredOrders.value)

    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / itemsPerPage.value)))

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
        default: return method ?? '—'
      }
    }
    const truncateText = (text, maxLength) => !text ? '-' : (text.length > maxLength ? text.substring(0, maxLength) + '...' : text)

    // Chỉ cho hủy khi trạng thái là "Đang xử lý"
    const canCancelOrder = (status) => status === 'Đang xử lý'

    // Actions
    const viewOrderDetail = (orderId) =>
      router.push({ name: 'hoadonchitiet', params: { id: orderId } })

    const applyFilters = () => { changePage(1) }

    const changePage = async (page) => {
      const p = Math.min(Math.max(1, page), totalPages.value)
      await setPage(p)
      await fetchHoaDonTheoTaiKhoan(id_tk) // { p_id_tk, p_pageNo, p_pageSize }
    }

    const refreshData = async () => {
      searchKeyword.value = ''
      await changePage(1)
    }

    const confirmCancelOrder = (orderId) => {
      // TODO: gọi proc cập nhật trạng thái => 'Đã hủy'
      alert(`(Demo) Hủy đơn ${orderId} — thêm API hủy đơn tại đây!`)
    }

    onMounted(async () => {
      await setPageSize(itemsPerPage.value)
      await changePage(1)
    })

    return {
      // state/composable
      orders, total, pageNo, pageSize,
      loading, error,

      // ui state
      searchKeyword, itemsPerPage, totalPages,

      // computed
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
.card { border: 1px solid #e3e6f0; box-shadow: 0 0.15rem 1.75rem 0 rgba(58,59,69,.15); }
.pagination .page-link { color: #5a5c69; border-color: #dddfeb; }
.pagination .page-item.active .page-link { background-color: #5a5c69; border-color: #5a5c69; }
@media (max-width: 768px) {
  .table-responsive { font-size: 0.875rem; }
  .btn-group-sm > .btn { padding: 0.2rem 0.4rem; font-size: 0.8rem; }
}
</style>

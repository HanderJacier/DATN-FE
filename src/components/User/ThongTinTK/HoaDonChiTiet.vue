<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung -->
      <div class="col-md-9">
        <!-- Nút quay lại + Hủy đơn -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <router-link to="/tatca" class="btn btn-secondary btn-sm">
            <i class="bi bi-arrow-left"></i> Quay lại danh sách
          </router-link>

          <!-- Nút Hủy đơn (tĩnh) -->
          <button
            v-if="canCancel"
            class="btn btn-danger btn-sm"
            @click="cancelOrder"
            :disabled="loading"
          >
            <i class="bi bi-x-circle"></i> Hủy đơn hàng
          </button>
        </div>

        <!-- Thông báo (tạm thời) -->
        <div v-if="cancelMsg" class="alert alert-info py-2">
          {{ cancelMsg }}
        </div>

        <h4 class="fw-bold mb-4">
          <i class="bi bi-receipt me-2"></i>
          Chi tiết hóa đơn HD{{ String(orderDetail?.id_hd || id).padStart(3, '0') }}
        </h4>

        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải chi tiết...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
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
                  <p><strong>Ngày tạo:</strong> {{ (orderDetail.ngaytao) }}</p>
                  <p><strong>Trạng thái: </strong>
                    <span class="badge" :class="getStatusClass(orderDetail.trangthai)">
                      {{ orderDetail.trangthai }}
                    </span>
                  </p>

                  <!-- Nút hủy lặp lại ngay dưới trạng thái (tuỳ thích) -->
                  <button
                    v-if="canCancel"
                    class="btn btn-outline-danger btn-sm mt-2"
                    @click="cancelOrder"
                  >
                    <i class="bi bi-x-circle"></i> Hủy đơn hàng
                  </button>

                  <p class="mt-3"><strong>Khách hàng:</strong> {{ orderDetail.hovaten }}</p>
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
                      <th>STT</th>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in orderDetail.products" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <!-- Ảnh bấm sang trang chi tiết sản phẩm -->
                        <router-link
                          :to="{ name: 'ChiTietSanPham', params: { id: product.id_sp } }"
                          class="d-inline-block"
                          :title="product.tensanpham"
                        >
                          <img
                            :src="product.anhgoc || '/placeholder.svg'"
                            class="img-thumbnail"
                            style="width:50px; height:50px; object-fit:cover; cursor:pointer;"
                            @error="onImgErr"
                          />
                        </router-link>
                      </td>
                      <td class="text-start">
                        <!-- Tên bấm sang trang chi tiết sản phẩm -->
                        <router-link
                          :to="{ name: 'ChiTietSanPham', params: { id: product.id_sp } }"
                          class="text-decoration-none"
                        >
                          {{ product.tensanpham }}
                        </router-link>
                      </td>
                      <td class="text-center">{{ product.soluong }}</td>
                      <td class="text-end">{{ formatCurrency(product.dongia) }}</td>
                      <td class="text-end text-danger fw-bold">{{ formatCurrency(product.thanhtien) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-end mt-4 p-3 bg-light rounded">
                <h5 class="fw-bold mb-0">
                  Tổng cộng: <span class="text-danger">{{ formatCurrency(orderDetail.giahoadon) }}</span>
                </h5>
              </div>
            </div>
          </div>
        </div>

        <!-- (Không còn nút quay lại dưới) -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import { usePostData } from '@/components/component_callApi/callAPI'
import useHdChiTietTheoDanhSach from '../LoadDB/HoaDonChiTiet' // chỉnh path theo dự án

export default {
  name: 'OrderDetail',
  components: { Slidebar },
  setup() {
    const route = useRoute()
    const id = Number(route.params.id)

    // --- API header (WBH_US_SEL_CHI_TIET_HOA_DON)
    const headerApi = usePostData() // { data, loading, error, callAPI }

    // --- API items theo danh sách id (WBH_US_SEL_HD_CHI_TIET_THEO_DANH_SACH)
    const {
      fetchHdChiTietTheoDanhSach,
      getItemsByHoaDon,
      loading: itemsLoading,
      error: itemsError
    } = useHdChiTietTheoDanhSach()

    const orderDetail = ref(null)
    const cancelMsg = ref('')

    const loading = computed(() => headerApi.loading.value || itemsLoading.value)
    const error = computed(() => headerApi.error.value || itemsError.value)

    const extractArrays = (payload) => {
      if (Array.isArray(payload)) return [payload]
      if (payload && typeof payload === 'object') {
        return Object.values(payload).filter(v => Array.isArray(v))
      }
      return []
    }

    const fetchDetail = async () => {
      if (!id) return
      orderDetail.value = null

      // 1) Header + payment
      await headerApi.callAPI('WBH_US_SEL_CHI_TIET_HOA_DON', { params: { p_id_hd: id } })
      const sets = extractArrays(headerApi.data.value)

      const headerSet =
        sets.find(arr => arr.some(r => r && typeof r === 'object' && 'id_hd' in r && 'trangthai' in r && 'giahoadon' in r)) || []
      const paymentSet =
        sets.find(arr => arr.some(r => r && typeof r === 'object' && ('phuongthuc' in r || 'id_tt' in r))) || []

      const h = headerSet[0] || {}

      // 2) Items theo proc danh sách
      await fetchHdChiTietTheoDanhSach([id])
      const items = getItemsByHoaDon(id)

      // 3) Gộp thành orderDetail để phù hợp UI
      orderDetail.value = {
        id_hd: h.id_hd ?? id,
        ngaytao: h.ngaytao,
        trangthai: h.trangthai,
        giahoadon: Number(h.giahoadon || 0),
        noidung: h.noidung,
        hovaten: h.hoveten,
        sodienthoai: h.sodienthoai,
        email: h.email,
        phuongthuc: (paymentSet[0]?.phuongthuc) || h.phuongthuc,
        products: items
      }
    }

    onMounted(fetchDetail)
    watch(() => route.params.id, () => fetchDetail())

    // Helpers
    const parseVNDateTime = (s) => {
      if (!s) return null
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d,m,y] = s.split('/').map(Number)
        return new Date(y, m-1, d)
      }
      return new Date(s)
    }
    const formatDateTime = (val) => {
      const dt = parseVNDateTime(val)
      return dt && !isNaN(dt) ? dt.toLocaleString('vi-VN') : '-'
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
        case 'BANK': return 'Chuyển khoản ngân hàng'
        case 'QR': return 'Thanh toán QR Code'
        case 'MOMO': return 'Ví MoMo'
        case 'VNPAY': return 'VNPay'
        default: return method || '—'
      }
    }

    const onImgErr = (e) => { e.target.src = '/placeholder.svg' }

    // ---- HỦY ĐƠN (tĩnh) ----
    const canCancel = computed(() => {
      const s = orderDetail.value?.trangthai || ''
      return s === 'Chờ xử lý' || s === 'Đang xử lý'
    })

    const cancelOrder = () => {
      if (!orderDetail.value) return
      if (!canCancel.value) return
      const ok = confirm('Bạn muốn hủy đơn hàng này? (Demo: chỉ đổi trạng thái trên giao diện)')
      if (!ok) return
      orderDetail.value.trangthai = 'Đã hủy'
      cancelMsg.value = 'Đã hủy đơn hàng (demo, chưa gọi API).'
      setTimeout(() => { cancelMsg.value = '' }, 3000)
    }

    return {
      id, loading, error, orderDetail,
      cancelMsg, canCancel, cancelOrder,
      formatDateTime, formatCurrency, getStatusClass, getPaymentMethodText, onImgErr
    }
  }
}
</script>

<style scoped>
.table th { background-color: #f8f9fa; font-weight: 600; border-color: #dee2e6; }
.table td { vertical-align: middle; border-color: #dee2e6; }
.card { border: 1px solid #e3e6f0;}
</style>

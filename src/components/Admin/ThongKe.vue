<template>
  <div class="container-fluid bg-light py-4 min-vh-100">
    <!-- Biểu đồ Doanh thu -->
    <div class="card p-4 mb-4 w-100">
      <h5 class="form-title bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block mb-3">
        SƠ ĐỒ THỐNG KÊ DOANH THU
      </h5>

      <div class="row mb-3">
        <div class="col-md">
          <select class="form-select" v-model.number="rangeDays">
            <option :value="7">7 ngày qua</option>
            <option :value="14">14 ngày qua</option>
            <option :value="30">30 ngày qua</option>
          </select>

          <!-- 🆕 Hiển thị khoảng ngày -->
          <div class="form-text mt-1">
            Khoảng thống kê: <strong>{{ revenueRangeLabel }}</strong>
          </div>
        </div>
      </div>

      <div class="chart-scroll">
        <canvas ref="revenueCanvas" class="chart-canvas"></canvas>
      </div>

      <div v-if="loadingRevenue" class="mt-2 text-muted small">Đang tải dữ liệu...</div>
      <div v-if="errorRevenue" class="mt-2 text-danger small">{{ errorRevenue }}</div>
    </div>

    <!-- THỐNG KÊ ĐÁNH GIÁ SẢN PHẨM -->
    <div class="card p-4 mb-4 w-100">
      <h5 class="form-title bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block mb-3">
        THỐNG KÊ ĐÁNH GIÁ SẢN PHẨM
      </h5>

      <!-- Hàng điều khiển: combobox | nút | điểm TB (cao bằng nhau) -->
      <div class="row g-3 mb-3 align-items-stretch">
        <!-- Combobox -->
        <div class="col-md-6 d-flex flex-column">
          <label class="form-label">Chọn sản phẩm (combobox)</label>

          <div class="position-relative flex-grow-1">
            <!-- pe-5: chừa khoảng bên phải cho nút X -->
            <input
              ref="comboInput"
              type="text"
              class="form-control eqh pe-5"
              v-model="productSearch"
              placeholder="Nhập tên sản phẩm..."
              @focus="dropdownOpen = true"
              @keydown.down.prevent="moveActive(1)"
              @keydown.up.prevent="moveActive(-1)"
              @keydown.enter.prevent="enterSelect()"
              @blur="closeDropdown"
            />

            <!-- Nút X xoá tìm kiếm -->
            <button
              v-if="productSearch || selectedProductId"
              type="button"
              class="combobox-clear"
              title="Xoá tìm kiếm"
              @mousedown.prevent.stop="clearSearch"
            >
              <i class="fa fa-times"></i>
            </button>

            <ul
              v-if="dropdownOpen"
              class="list-group position-absolute w-100 combobox-dropdown"
              style="max-height: 240px; overflow-y: auto; z-index: 1050;"
            >
              <li v-if="loadingProducts" class="list-group-item text-muted small">
                Đang tải danh sách sản phẩm...
              </li>
              <li v-else-if="errorProducts" class="list-group-item text-danger small">
                {{ errorProducts }}
              </li>
              <li v-else-if="!filteredProducts.length" class="list-group-item text-muted small">
                Không tìm thấy sản phẩm phù hợp
              </li>
              <li
                v-for="(p, idx) in filteredProducts"
                :key="p.id"
                class="list-group-item list-group-item-action"
                :class="{ active: idx === activeIndex }"
                @mousedown.prevent="selectProduct(p)"
                @mousemove="activeIndex = idx"
              >
                {{ p.name }}
              </li>
            </ul>
          </div>

          <div class="form-text mt-1">
            <span v-if="selectedProductName">
              Đã chọn: <strong>{{ selectedProductName }}</strong>
            </span>
            <span v-else>Chưa chọn sản phẩm</span>
          </div>
        </div>

        <!-- Nút tải thống kê -->
        <div class="col-md-3 d-flex flex-column">
          <label class="form-label invisible">Tải thống kê</label>
          <button
            class="btn btn-primary w-100 eqh"
            :disabled="!selectedProductId"
            @click="applySelectedProduct"
          >
            Tải thống kê
          </button>
        </div>

        <!-- Điểm trung bình -->
        <div class="col-md-3 d-flex flex-column">
          <label class="form-label invisible">Điểm trung bình</label>
          <div class="eqh d-flex align-items-center justify-content-center m-0" style="background: #f9fafb; border: none;">
            <template v-if="avgText">
              <span class="fw-bold">{{ avgText }}</span>
              <span class="text-warning ms-1">★</span>
              <span class="text-muted">&nbsp;({{ totalText }} đánh giá)</span>
            </template>
            <template v-else>
              <span class="text-muted">Chưa có dữ liệu</span>
            </template>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <canvas ref="ratingCanvas" style="height: 320px;"></canvas>
        </div>
        <div class="col-12 col-lg-6">
          <div class="table-responsive">
            <table class="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Sao</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in ratingRows" :key="row.star">
                  <td><span class="badge bg-warning text-dark">{{ row.star }} ★</span></td>
                  <td>{{ row.count.toLocaleString('vi-VN') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="loadingRating" class="mt-2 text-muted small">Đang tải thống kê...</div>
          <div v-if="errorRating" class="mt-2 text-danger small">{{ errorRating }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// Composables (điều chỉnh path theo dự án của bạn)
import useBaoCaoDoanhThu from './CRUD/ThongKe/DoanhThu'       // WBH_AD_SEL_BAO_CAO_DOANH_THU
import useThongKeDanhGia from './CRUD/ThongKe/DanhGia'         // WBH_US_SEL_THONG_KE_DANH_GIA
import useSanPhamAdmin from './CRUD/QLSanPham/Select'          // WBH_US_SEL_XEMSP

/* ====== DOANH THU (BAR) ====== */
const rangeDays = ref(7)

const formatDDMMYYYY = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
const computeRange = (days) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - (days - 1))
  return { tu: formatDDMMYYYY(start), den: formatDDMMYYYY(end) }
}

const { tu, den } = computeRange(rangeDays.value)
const { baoCao, loading: loadingRevenue, error: errorRevenue, fetchBaoCao } = useBaoCaoDoanhThu(tu, den)

// 🆕 computed cho khoảng ngày doanh thu
const revenueRange = computed(() => computeRange(rangeDays.value))
const revenueRangeLabel = computed(() => `Từ ${revenueRange.value.tu} đến ${revenueRange.value.den}`)

const revenueCanvas = ref(null)
let revenueChart = null

const getRevenueRows = () => {
  const raw = baoCao?.value
  if (Array.isArray(raw)) return raw
  if (raw?.rows && Array.isArray(raw.rows)) return raw.rows
  if (raw?.data && Array.isArray(raw.data)) return raw.data
  return []
}
const getMaxTicksLimit = (days, len) => {
  if (days <= 7) return Math.min(7, len)
  if (days <= 14) return Math.min(10, len)
  return Math.min(12, len)
}
const drawRevenueChart = () => {
  const rows = getRevenueRows()
  const labels = rows.map((r) => {
    const d = new Date(r.ngay)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}/${mm}`
  })
  const data = rows.map((r) => Number(r.tong_doanh_thu || 0))
  const maxTicksLimit = getMaxTicksLimit(rangeDays.value, labels.length)

  if (revenueChart) revenueChart.destroy()
  const ctx = revenueCanvas.value.getContext('2d')
  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Doanh thu (VNĐ)', data, backgroundColor: '#4dabf7' }],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { autoSkip: true, maxRotation: 0, maxTicksLimit } },
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => Number(value).toLocaleString('vi-VN') },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${Number(ctx.parsed.y || 0).toLocaleString('vi-VN')} VNĐ`,
          },
        },
      },
    },
  })
}

onMounted(async () => {
  await fetchBaoCao()
  drawRevenueChart()
})
watch(rangeDays, async () => {
  const { tu, den } = revenueRange.value
  await fetchBaoCao(tu, den)
  drawRevenueChart()
})

/* ====== SẢN PHẨM (COMBOBOX) ====== */
const {
  products,
  loading: loadingProducts,
  error: errorProducts,
} = useSanPhamAdmin()

// Chuẩn hoá + khử trùng lặp theo id_sp
const productOptions = computed(() => {
  const raw = products?.value
  const rows = Array.isArray(raw) ? raw
    : (raw?.rows && Array.isArray(raw.rows)) ? raw.rows
    : (raw?.data && Array.isArray(raw.data)) ? raw.data
    : []
  const map = new Map()
  rows.forEach(r => {
    const f = r.fields || r
    const id = Number(f.id_sp ?? f.id ?? f.product_id ?? 0)
    const name = String(f.tensanpham ?? f.ten_san_pham ?? f.name ?? (id ? `SP #${id}` : ''))
    if (id && !map.has(id)) map.set(id, { id, name })
  })
  return [...map.values()]
})

const productSearch = ref('')
const dropdownOpen = ref(false)
const selectedProductId = ref(null)
const selectedProductName = ref('')
const activeIndex = ref(-1)
const comboInput = ref(null)

const filteredProducts = computed(() => {
  const kw = productSearch.value.trim().toLowerCase()
  const list = productOptions.value
  const res = kw ? list.filter(p => p.name.toLowerCase().includes(kw)) : list
  activeIndex.value = res.length ? 0 : -1
  return res
})

function selectProduct(p) {
  selectedProductId.value = p.id
  selectedProductName.value = p.name
  productSearch.value = p.name
  dropdownOpen.value = false
}

function closeDropdown() {
  setTimeout(() => (dropdownOpen.value = false), 120)
}

function moveActive(step) {
  if (!dropdownOpen.value || !filteredProducts.value.length) return
  const len = filteredProducts.value.length
  activeIndex.value = (activeIndex.value + step + len) % len
  requestAnimationFrame(() => {
    const list = document.querySelector('.combobox-dropdown')
    const el = list?.children?.[activeIndex.value]
    el?.scrollIntoView?.({ block: 'nearest' })
  })
}

function enterSelect() {
  if (!dropdownOpen.value || activeIndex.value < 0) return
  const p = filteredProducts.value[activeIndex.value]
  if (p) selectProduct(p)
}

const clearSearch = async () => {
  productSearch.value = ''
  selectedProductId.value = null
  selectedProductName.value = ''
  dropdownOpen.value = true
  await nextTick()
  comboInput.value?.focus()
}

/* ====== ĐÁNH GIÁ (DOUGHNUT) ====== */
const defaultProductId = null
const { thongKe, loading: loadingRating, error: errorRating, setProductAndFetch } =
  useThongKeDanhGia(defaultProductId ?? undefined)

const ratingCanvas = ref(null)
let ratingChart = null

const ratingRows = computed(() => {
  const tk = thongKe?.value
  const obj = Array.isArray(tk) ? tk[0] : tk || {}
  return [
    { star: 5, count: Number(obj.sao_5 || 0) },
    { star: 4, count: Number(obj.sao_4 || 0) },
    { star: 3, count: Number(obj.sao_3 || 0) },
    { star: 2, count: Number(obj.sao_2 || 0) },
    { star: 1, count: Number(obj.sao_1 || 0) },
  ]
})
const totalText = computed(() => {
  const tk = thongKe?.value
  const obj = Array.isArray(tk) ? tk[0] : tk || {}
  return Number(obj.tong_danh_gia || 0).toLocaleString('vi-VN')
})
const avgText = computed(() => {
  const tk = thongKe?.value
  const obj = Array.isArray(tk) ? tk[0] : tk || {}
  const v = Number(obj.diem_trung_binh || 0)
  return v ? v.toFixed(2) : '0.00'
})

const drawRatingChart = () => {
  const labels = ratingRows.value.map((r) => `${r.star} ★`)
  const data = ratingRows.value.map((r) => r.count)

  if (ratingChart) ratingChart.destroy()
  const ctx = ratingCanvas.value.getContext('2d')
  ratingChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: 'Phân bố đánh giá',
          data,
          backgroundColor: ['#22c55e', '#60a5fa', '#f59e0b', '#fb7185', '#9ca3af'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.parsed || 0)
              return ` ${ctx.label}: ${v.toLocaleString('vi-VN')} lượt`
            },
          },
        },
      },
    },
  })
}

const applySelectedProduct = async () => {
  if (!selectedProductId.value) return
  await setProductAndFetch(selectedProductId.value)
  drawRatingChart()
}

onMounted(() => {
  setTimeout(() => drawRatingChart(), 0)
})
watch(thongKe, () => {
  drawRatingChart()
})
</script>

<style scoped>
.chart-scroll {
  overflow-x: auto;
  min-width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
}
.chart-canvas {
  min-width: 800px;
  height: 300px;
  display: block;
}

/* cùng chiều cao cho input, button, box điểm TB */
.eqh {
  height: 44px;
  border-radius: 10px;
}

/* dropdown combobox */
.combobox-dropdown {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  margin-top: 2px;
}
.combobox-dropdown .list-group-item {
  cursor: pointer;
  user-select: none;
  padding: 10px 12px;
}
.combobox-dropdown .list-group-item.active {
  background-color: #e9f5ff;
  color: #0c63e4;
  border-color: #e9f5ff;
}

/* Nút X trong combobox */
.combobox-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.combobox-clear:hover {
  background: rgba(0,0,0,0.06);
  color: #111827;
}
</style>

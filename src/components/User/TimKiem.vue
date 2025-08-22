<!-- src/components/User/TimKiem.vue -->
<template>
  <div class="container my-5">
    <!-- Tiêu đề + bộ lọc -->
    <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
      <h4 class="fw-bold mb-0 text-uppercase">
        Kết quả tìm kiếm
        <span v-if="keyword">cho: "{{ keyword }}"</span>
        <span v-else-if="loaiTen">theo loại: "{{ loaiTen }}"</span>
      </h4>
      <Loc @onFilter="onCustomFilter" />
    </div>

    <!-- Empty state (giống Home style) -->
    <div v-if="pagedProducts.length === 0" class="text-center text-muted py-5" data-testid="search-empty">
      <i class="bi bi-box-seam fs-1 d-block mb-2"></i>
      <div class="fw-medium">Không tìm thấy sản phẩm nào.</div>
    </div>

    <!-- Danh sách sản phẩm (card style giống Home) -->
    <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="sp in pagedProducts" :key="sp.id_sp">
        <router-link :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark" data-testid="search-card">
          <div class="card product-card h-100">
            <img
              :src="sp.anhgoc"
              class="card-img-top product-img"
              :alt="sp.tensanpham"
              loading="lazy"
              @error="onImgErr"
            />
            <div class="card-body">
              <h6 class="fw-bold text-truncate" :title="sp.tensanpham">{{ sp.tensanpham }}</h6>
              <p class="mb-1 text-secondary small">{{ sp.thuongHieuHienThi }}</p>

              <!-- Giá sản phẩm -->
              <div class="product-price">
                <template v-if="sp.dongiaNum && sp.dongiaNum > 0">
                  <template v-if="isGiamGiaValid(sp)">
                    <span class="price-discount">{{ formatVND(sp.giamgiaNum) }}₫</span>
                    <span class="price-original">{{ formatVND(sp.dongiaNum) }}₫</span>
                    <span class="discount-badge">-{{ pctDiscount(sp) }}%</span>
                  </template>
                  <template v-else>
                    <span class="price-normal">{{ formatVND(sp.dongiaNum) }}₫</span>
                  </template>
                </template>
                <template v-else>
                  <span class="price-normal">Liên hệ</span>
                </template>
              </div>

              <button class="btn btn-outline-dark w-100 mt-2 rounded-pill">Xem chi tiết</button>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Phân trang -->
    <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goFirstPage">|&lt;</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goPrevPage">«</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goNextPage">»</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goLastPage">&gt;|</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, unref } from 'vue'
import { decId } from '@/utils/idCodec'
import { useRoute } from 'vue-router'
import useSanPhamSearch from '@/components/User/LoadDB/TimKiem.js'
import Loc from './Loc.vue'

/* ---------- Helpers giống Home ---------- */
function toNum(v) {
  const n = Number((v ?? '').toString().replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : null
}
function formatVND(n) { return (n ?? 0).toLocaleString('vi-VN') }
function onImgErr(e) { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }
function isGiamGiaValid(sp) {
  const dongia = toNum(sp?.dongiaNum ?? sp?.dongia)
  const giamgia = toNum(sp?.giamgiaNum ?? sp?.giamgia)
  if (!dongia || !giamgia || giamgia >= dongia) return false
  const hg = sp?.hangiamgia
  if (!hg) return false
  const [day, month, year] = hg.split('/')
  if (!day || !month || !year) return false
  const han = new Date(+year, +month - 1, +day); han.setHours(0,0,0,0)
  const today = new Date(); today.setHours(0,0,0,0)
  return han > today
}
function pctDiscount(sp) {
  const d = toNum(sp?.dongiaNum ?? sp?.dongia)
  const g = toNum(sp?.giamgiaNum ?? sp?.giamgia)
  if (!d || !g) return 0
  const pct = Math.round((1 - g / d) * 100)
  return Math.min(99, Math.max(1, pct))
}

/* ---------- State & dữ liệu ---------- */
const advancedFilter = ref({ ten: '', min: null, max: null, thuonghieu: '' })
const onCustomFilter = (f) => {
  advancedFilter.value = { ten: f.ten || '', min: f.min || null, max: f.max || null, thuonghieu: f.thuonghieu || '' }
  filterProducts()
}

const route = useRoute()
const keyword = ref(route.query.q || '')
const currentLoai = ref(route.query.loai || '')
const filteredProducts = ref([])
const filterType = ref(route.query.filter || '')

const itemsPerPage = ref(16)
const currentPage = ref(1)

const loaiMap = {
  'Điện thoại di động': '1','Máy tính bảng': '2','Laptop': '3','Máy tính để bàn': '4',
  'Thiết bị đeo thông minh': '5','Phụ kiện điện thoại': '6','Phụ kiện máy tính': '7',
  'Thiết bị mạng': '8','Thiết bị lưu trữ': '9','Tivi': '10','Loa và tai nghe': '11',
  'Đồng hồ thông minh': '12','Máy ảnh và máy quay': '13','Máy in và mực in': '14','Đồ gia dụng thông minh': '15'
}
const loaiMapReverse = Object.fromEntries(Object.entries(loaiMap).map(([ten, id]) => [id, ten]))
const loaiTen = computed(() => currentLoai.value === 'phukien' ? 'Phụ kiện' : (loaiMapReverse[currentLoai.value] || ''))

// Lấy dữ liệu sản phẩm từ composable
const { allProducts: fetchedProducts } = useSanPhamSearch()

// Chuẩn hoá list giống Home
const normalizedAll = computed(() => {
  const raw = unref(fetchedProducts)
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data) ? raw.data
    : Array.isArray(raw?.rows) ? raw.rows
    : []

  return list.map(sp => ({
    ...sp,
    dongiaNum: toNum(sp.dongia),
    giamgiaNum: toNum(sp.giamgia),
    thuongHieuHienThi: sp?.thuonghieuTen || sp?.thuonghieu_ten || 'Thương hiệu khác'
  }))
})

/* ---------- Lọc ---------- */
const filterProducts = () => {
  const kwRaw = (keyword.value || '').trim()
  const kw = kwRaw.toLowerCase()
  const isShowAll = kwRaw === 'tatca'
  const loai = currentLoai.value
  const filter = filterType.value
  const { ten, min, max, thuonghieu } = advancedFilter.value

  const base = normalizedAll.value
  if (isShowAll || (!kw && !loai && !filter && !ten && !min && !max)) {
    filteredProducts.value = base
    currentPage.value = 1
    return
  }

  filteredProducts.value = base.filter(sp => {
    const matchKeyword = kw === '' || (sp.tensanpham || '').toLowerCase().includes(kw)
    const matchThuongHieu = !thuonghieu || String(sp.thuonghieu) === String(thuonghieu)
    const matchLoai =
      !loai || String(sp.loai) === String(loai) || (loai === 'phukien' && (sp.loai === 6 || sp.loai === 7))
    const matchFilter =
      filter === 'moi'
        ? new Date(sp.ngaytao) >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
        : filter === 'giamgia'
          ? Number(sp.giamgiaNum) > 0 && isGiamGiaValid(sp)
          : true
    const matchTen = !ten || (sp.tensanpham || '').toLowerCase().includes(ten.toLowerCase())
    const matchMin = !min || Number(sp.dongiaNum) >= Number(min)
    const matchMax = !max || Number(sp.dongiaNum) <= Number(max)
    return matchKeyword && matchLoai && matchFilter && matchTen && matchMin && matchMax && matchThuongHieu
  })

  currentPage.value = 1
}

/* ---------- Phân trang ---------- */
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const goFirstPage = () => { if (currentPage.value !== 1) currentPage.value = 1 }
const goLastPage  = () => { if (currentPage.value !== totalPages.value) currentPage.value = totalPages.value }
const goPrevPage  = () => { if (currentPage.value > 1) currentPage.value-- }
const goNextPage  = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

/* ---------- Watches & Mounted ---------- */
const updateItemsPerPage = () => { itemsPerPage.value = window.innerWidth < 768 ? 12 : 16 }

watch(() => route.query.q, (v) => { keyword.value = v || ''; advancedFilter.value = { ten:'', min:null, max:null, thuonghieu:'' }; filterProducts() })
watch(() => route.query.loai, (v) => { currentLoai.value = v || ''; advancedFilter.value = { ten:'', min:null, max:null, thuonghieu:'' }; filterProducts() })
watch(() => route.query.filter, (v) => { filterType.value = v || ''; advancedFilter.value = { ten:'', min:null, max:null, thuonghieu:'' }; filterProducts() })
watch(keyword, () => filterProducts())

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
  // khi dữ liệu về, chạy lọc ngay
  watch(fetchedProducts, () => { filterProducts() }, { immediate: true })
})
const realId = decId(route.params.code) // số id thật -> dùng để fetch
</script>

<style scoped>
/* --- giữ đúng look & feel của Home --- */
.product-card { border-radius: 12px; overflow: hidden; border: 1px solid #eee; transition: all .3s ease; height: 100%; background-color: #fff; }
.product-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
.card-img-top.product-img { display: block; margin: auto; width: auto; height: 200px; max-width: 100%; object-fit: contain; background-color: #fff; }
.card-img-top { border-top-left-radius: 12px; border-top-right-radius: 12px; padding-top: 10px; }
.product-price { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.price-discount { font-weight: 700; font-size: 1.05rem; }
.price-original { color: #9e9e9e; text-decoration: line-through; font-size: .85rem; }
.discount-badge { background: linear-gradient(135deg, #ff4b2b, #3e82ff); color: #fff; font-weight: 600; font-size: .75rem; padding: .25em .6em; border-radius: 6px; }
.price-normal { color: #e53935; font-weight: 700; font-size: 1rem; }
</style>

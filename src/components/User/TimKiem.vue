<template>
  <div class="container my-5">
    <!-- Tiêu đề -->
    <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
      <h4 class="fw-bold mb-0 text-uppercase">
        Kết quả tìm kiếm
        <span v-if="keyword">cho: "{{ keyword }}"</span>
        <span v-else-if="loaiTen">theo loại: "{{ loaiTen }}"</span>
      </h4>
      <ProductFilter v-model:keyword="keyword" />
    </div>

    <!-- Nếu không có sản phẩm -->
    <div v-if="pagedProducts.length === 0" class="text-muted">Không tìm thấy sản phẩm nào.</div>

    <!-- Danh sách sản phẩm -->
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="sp in pagedProducts" :key="sp.id_sp">
        <router-link :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
          <div class="card product-card h-100">
            <img :src="sp.anhgoc" class="card-img-top product-img" :alt="sp.tensanpham" />
            <div class="card-body">
              <h6 class="fw-bold text-truncate">{{ sp.tensanpham }}</h6>
              <p class="mb-1 text-secondary small">{{ sp.thuonghieu_ten || 'Thương hiệu khác' }}</p>
              <p class="fw-semibold mb-2">
                <template v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now">
                  <span class="text-dark me-2">
                    {{
                      sp.loaigiam === 1
                        ? (sp.dongia - sp.giamgia).toLocaleString()
                        : (sp.dongia * (1 - sp.giamgia / 100)).toLocaleString()
                    }}₫
                  </span>
                  <span class="text-muted text-decoration-line-through small">
                    {{ sp.dongia.toLocaleString() }}₫
                  </span>
                </template>
                <template v-else>
                  <span class="text-dark">{{ sp.dongia.toLocaleString() }}₫</span>
                </template>
              </p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api'
import ProductFilter from './Loc.vue'

const route = useRoute()
const keyword = ref(route.query.q || '')
const currentLoai = ref(route.query.loai || '')
const allProducts = ref([])
const filteredProducts = ref([])

const itemsPerPage = ref(16)
const currentPage = ref(1)
const now = new Date()

const loaiMap = {
  'Điện thoại di động': '1',
  'Máy tính bảng': '2',
  'Laptop': '3',
  'Máy tính để bàn': '4',
  'Thiết bị đeo thông minh': '5',
  'Phụ kiện điện thoại': '6',
  'Phụ kiện máy tính': '7',
  'Thiết bị mạng': '8',
  'Thiết bị lưu trữ': '9',
  'Tivi': '10',
  'Loa và tai nghe': '11',
  'Đồng hồ thông minh': '12',
  'Máy ảnh và máy quay': '13',
  'Máy in và mực in': '14',
  'Đồ gia dụng thông minh': '15'
}

// Đảo ngược lại map: { ID: TÊN }
const loaiMapReverse = Object.fromEntries(Object.entries(loaiMap).map(([ten, id]) => [id, ten]))

const loaiTen = computed(() => {
  if (currentLoai.value === 'phukien') return 'Phụ kiện'
  return loaiMapReverse[currentLoai.value] || ''
})



const updateItemsPerPage = () => {
  itemsPerPage.value = window.innerWidth < 768 ? 12 : 16
}

const fetchAllProducts = async () => {
  try {
    const res = await apiClient.get('/san-pham')
    allProducts.value = res.data
    filterProducts()
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm:', err)
  }
}

const filterProducts = () => {
  const kw = keyword.value.toLowerCase().trim()
  const loai = currentLoai.value

  filteredProducts.value = allProducts.value.filter(sp => {
    const matchKeyword = kw === '' || sp.tensanpham.toLowerCase().includes(kw)

    const matchLoai =
      !loai ||
      String(sp.loai) === String(loai) ||
      (loai === 'phukien' && (sp.loai === 6 || sp.loai === 7))
    return matchKeyword && matchLoai
  })

  currentPage.value = 1
}


const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const goFirstPage = () => { if (currentPage.value !== 1) currentPage.value = 1 }
const goLastPage = () => { if (currentPage.value !== totalPages.value) currentPage.value = totalPages.value }
const goPrevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goNextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || ''
  filterProducts()
})

watch(() => route.query.loai, (newLoai) => {
  currentLoai.value = newLoai || ''
  filterProducts()
})

watch(keyword, () => filterProducts())

onMounted(() => {
  updateItemsPerPage()
  fetchAllProducts()
  window.addEventListener('resize', updateItemsPerPage)
})
</script>

<style scoped>
.card-img-top.product-img {
  display: block;
  margin: auto;
  width: auto;
  height: 200px;
  max-width: 100%;
  object-fit: contain;
  background-color: #fff;
}

.card-img-top {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding-top: 10px;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  height: 100%;
  background-color: #fff;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
  z-index: 10;
  position: relative;
}
</style>

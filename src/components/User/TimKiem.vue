<template>
  <div class="container my-5">
    <!-- Header: kết quả và nút lọc nằm cùng hàng -->
    <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
      <h4 class="fw-bold mb-0 text-uppercase">
        Kết quả tìm kiếm cho: "{{ keyword }}"
      </h4>

      <!-- Nút lọc -->
      <ProductFilter v-model:keyword="keyword" />
    </div>

    <div v-if="pagedProducts.length === 0" class="text-muted">Không tìm thấy sản phẩm nào.</div>

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

    <!-- PHÂN TRANG -->
    <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
      <ul class="pagination">
        <!-- Nút về đầu -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goFirstPage" aria-label="Về đầu">|&lt;</button>
        </li>

        <!-- Nút trước -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goPrevPage" aria-label="Trang trước">«</button>
        </li>

        <!-- Các nút trang số -->
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>

        <!-- Nút sau -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goNextPage" aria-label="Trang sau">»</button>
        </li>

        <!-- Nút về cuối -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goLastPage" aria-label="Về cuối">&gt;|</button>
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
const allProducts = ref([])
const filteredProducts = ref([])

const itemsPerPage = ref(16)
const currentPage = ref(1)

const updateItemsPerPage = () => {
  itemsPerPage.value = window.innerWidth < 768 ? 12 : 16
}

const fetchAllProducts = async () => {
  const res = await apiClient.get('/san-pham')
  allProducts.value = res.data
  filterByKeyword()
}

const filterByKeyword = () => {
  const kw = keyword.value.toLowerCase().trim()
  filteredProducts.value = allProducts.value.filter(sp =>
    sp.tensanpham.toLowerCase().includes(kw)
  )
  currentPage.value = 1
}

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

// Hàm về đầu trang
const goFirstPage = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}

// Hàm về cuối trang
const goLastPage = () => {
  if (currentPage.value !== totalPages.value) {
    currentPage.value = totalPages.value
  }
}

// Hàm trang trước
const goPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Hàm trang sau
const goNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || ''
  filterByKeyword()
})

watch(keyword, () => {
  filterByKeyword()
})

onMounted(() => {
  updateItemsPerPage()
  fetchAllProducts()
  window.addEventListener('resize', updateItemsPerPage)
})
</script>

<style>
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

/* Hiệu ứng hover to lên */
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

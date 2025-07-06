<template>
  <div class="container my-5">
    <h4 class="fw-bold border-bottom pb-2 mb-4 text-uppercase">
      Kết quả tìm kiếm cho: "{{ keyword }}"
    </h4>

    <div v-if="pagedProducts.length === 0" class="text-muted">Không tìm thấy sản phẩm nào.</div>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="sp in pagedProducts" :key="sp.id">
        <router-link :to="`/sanpham/${sp.id}`" class="text-decoration-none text-dark">
          <div class="card product-card h-100">

            <img :src="sp.anhgoc" class="card-img-top product-img" :alt="sp.tensanpham" />
            <div class="card-body">
              <h6 class="fw-bold text-truncate">{{ sp.tensanpham }}</h6>
              <p class="mb-1 text-secondary small">{{ sp.thuonghieu_ten || 'Thương hiệu khác' }}</p>

              <!-- Giá -->
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
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--">«</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++">»</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const keyword = ref(route.query.q || '')
const allProducts = ref([])
const filteredProducts = ref([])

const itemsPerPage = ref(15)
const currentPage = ref(1)

const updateItemsPerPage = () => {
  itemsPerPage.value = window.innerWidth < 768 ? 12 : 15
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

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || ''
  filterByKeyword()
})

onMounted(() => {
  updateItemsPerPage()
  fetchAllProducts()
  window.addEventListener('resize', updateItemsPerPage)
})
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  border: 1px solid #eee;
  background-color: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.product-img {
  display: block;
  margin: auto;
  width: auto;
  height: 200px;
  max-width: 100%;
  object-fit: contain;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-body h6 {
  min-height: 42px;
}
</style>

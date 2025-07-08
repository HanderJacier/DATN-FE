<template>
  <div v-if="product">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb p-2 mt-2 bg-light">
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">{{ product.thuonghieuTen || 'Danh mục' }}</a>
        </li>
        <li class="breadcrumb-item active text-muted" aria-current="page">
          {{ product.tensanpham || 'Đang tải...' }}
        </li>
      </ol>
    </nav>

    <div class="container my-5">
      <div class="row">
        <!-- Hình ảnh & thông số -->
        <div class="col-md-6">
          <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item" :class="{ active: index === currentIndex }"
                   v-for="(image, index) in productImages" :key="index">
                <div class="fixed-image-frame d-flex justify-content-center align-items-center">
                  <img :src="image.src" :alt="image.alt" class="fixed-product-img" />
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>

          <!-- Thumbnails -->
          <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
            <img v-for="(image, index) in productImages" :key="index" :src="image.src"
                 class="img-thumbnail border border-2" :class="{ 'border-dark': index === currentIndex }"
                 style="width: 100px; height: 100px; object-fit: cover; cursor: pointer"
                 @click="changeImage(index)" />
          </div>

          <!-- Thông số kỹ thuật -->
          <div class="card p-3 mb-4 mt-5">
            <h6 class="fw-bold border-bottom pb-2">Thông số kỹ thuật</h6>

            <h6 class="mt-3 mb-2">Bộ xử lý</h6>
            <div v-for="(value, label) in specs.cpu" :key="label"
                 class="d-flex justify-content-between small py-1 border-bottom">
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <h6 class="mt-4 mb-2">Đồ họa</h6>
            <div v-for="(value, label) in specs.gpu" :key="label"
                 class="d-flex justify-content-between small py-1 border-bottom">
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <div v-if="showMore">
              <h6 class="mt-4 mb-2">Khác</h6>
              <div v-for="(value, label) in specs.other" :key="label"
                   class="d-flex justify-content-between small py-1 border-bottom">
                <span>{{ label }}</span><span>{{ value }}</span>
              </div>
            </div>

            <div class="text-center mt-3">
              <button class="btn btn-outline-success btn-sm" @click="toggleMore">
                {{ showMore ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="col-md-6">
          <h5 class="fw-bold">{{ product.tensanpham }}</h5>

          <div class="d-flex align-items-center mb-3">
            <div class="me-2 text-warning">★★★★★</div>
            <small class="me-3 text-muted">Đã bán {{ product.soluong || 0 }}</small>
            <small class="me-3 text-muted">4 Đánh giá</small>
          </div>

          <div class="mb-2">
            <label class="fw-semibold me-3">Màu sắc</label>
            <button class="btn btn-outline-primary active">{{ product.mausac }}</button>
          </div>

          <div>
            <label class="fw-semibold me-3">Dung lượng</label>
            <button class="btn btn-outline-primary active">
              {{ product.ram }} RAM {{ product.gpuMemory }}
            </button>
          </div>

          <div class="p-3 rounded-3 mt-3 bg-light" style="max-width: 550px;">
            <p class="text-danger fw-bold fs-5">
              <template v-if="isGiamGiaValid">
                <span class="text-decoration-line-through text-muted me-2">
                  {{ product.dongia.toLocaleString() }}₫
                </span>
                <span>{{ product.giamgia.toLocaleString() }}₫</span>
              </template>
              <template v-else>
                {{ product.dongia.toLocaleString() }}₫
              </template>
            </p>
          </div>

          <div class="d-flex justify-content-center mt-5">
            <ThichSanPham :productId="product.id" />
            <button class="btn btn-outline-primary ml-3 me-3" @click="addToCart">
              <i class="bi bi-cart-fill"></i>
            </button>
            <button class="btn btn-primary px-5 py-2 fw-bold" @click="buyNow">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <ProductReviews />
    </div>

    <OtherProducts />
  </div>

  <!-- Loading -->
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-3">Đang tải sản phẩm...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useHomeLogic from '@/components/User/LoadDB/ChiTietSP.js'

import ThichSanPham from '@/components/User/ChiTietSP/ThichSanPham.vue'
import ProductReviews from '@/components/User/ChiTietSP/BinhLuan.vue'
import OtherProducts from '@/components/User/ChiTietSP/SanPhamKhac.vue'

const route = useRoute()
const router = useRouter()
const { product, fetchChiTietSanPham } = useHomeLogic()

const currentIndex = ref(0)
const showMore = ref(false)

const specs = ref({ cpu: {}, gpu: {}, other: {} })

const productImages = computed(() => {
  if (!product.value) return []
  const hasImage = product.value.anhgoc && product.value.anhgoc.trim() !== ''
  return [{
    src: hasImage ? product.value.anhgoc : '/images/default.png',
    alt: product.value.tensanpham || 'Ảnh sản phẩm',
  }]
})

const isGiamGiaValid = computed(() => {
  const now = new Date()
  const hetHan = product.value?.hangiamgia ? new Date(product.value.hangiamgia) : null
  return product.value?.giamgia > 0 && hetHan && hetHan > now
})

const giaHienTai = computed(() => {
  return isGiamGiaValid.value ? product.value.giamgia : product.value.dongia
})

const changeImage = (index) => {
  currentIndex.value = index
}

const toggleMore = () => {
  showMore.value = !showMore.value
}

const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  const item = {
    id: product.value.id,
    name: product.value.tensanpham,
    price: giaHienTai.value,
    image: product.value.anhgoc,
    quantity: 1,
    variant: product.value.mausac || 'Mặc định',
    selected: true,
    originalPrice: product.value.dongia
  }

  const index = cart.findIndex(p => p.id === item.id)
  if (index !== -1) {
    cart[index].quantity += 1
  } else {
    cart.push(item)
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event("storage"))
}

const buyNow = () => {
  addToCart()
  router.push('/giohang')
}

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await fetchChiTietSanPham(id)
    if (product.value) {
      // Thêm alias id từ id_sp
      product.value.id = product.value.id_sp

      const data = product.value
      specs.value = {
        cpu: {
          'Hãng CPU': data.cpuBrand,
          'Công nghệ CPU': data.cpuModel,
          'Loại CPU': data.cpuType,
          'Tốc độ CPU tối thiểu': data.cpuMinSpeed,
          'Tốc độ tối đa': data.cpuMaxSpeed,
          'Số nhân': data.cpuCores,
          'Số luồng': data.cpuThreads,
          'Bộ nhớ đệm': data.cpuCache,
        },
        gpu: {
          'Hãng (Card rời)': data.gpuBrand,
          'Model (Card rời)': data.gpuModel,
          'Tên đầy đủ': data.gpuFullName,
          'Bộ nhớ': data.gpuMemory,
        },
        other: {
          'RAM': data.ram,
          'Ổ cứng': data.rom,
          'Màn hình': data.screen,
        }
      }
    }
  }
})
</script>

<style scoped>
.fixed-product-img {
  max-width: 100%;
  height: 400px;
  object-fit: contain;
}
.fixed-image-frame {
  width: 100%;
  height: 400px;
}
</style>

<template>
  <div>
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb p-2 mt-2 bg-light">
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">{{ product?.thuonghieuTen || 'Danh mục' }}</a>
        </li>
        <li class="breadcrumb-item active text-muted" aria-current="page">
          {{ product?.tensanpham || 'Đang tải...' }}
        </li>
      </ol>
    </nav>

    <div class="container my-5">
      <div class="row">
        <!-- Hình ảnh sản phẩm -->
        <div class="col-md-6">
          <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item" :class="{ active: index === currentIndex }"
                v-for="(image, index) in productImages" :key="index">
                <div class="fixed-image-frame mx-auto d-flex justify-content-center align-items-center">
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
              style="width: 100px; height: 100px; object-fit: cover; cursor: pointer" @click="changeImage(index)"
              :alt="`Ảnh sản phẩm ${index + 1}`" />
          </div>

          <!-- Thông số kỹ thuật -->
          <div class="card p-3 mb-4 mt-5">
            <h6 class="fw-bold border-bottom pb-2">Thông số kỹ thuật</h6>

            <h6 class="mt-3 mb-2">Bộ xử lý</h6>
            <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.cpu"
              :key="label">
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <h6 class="mt-4 mb-2">Đồ họa</h6>
            <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.gpu"
              :key="label">
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <div v-if="showMore">
              <h6 class="mt-4 mb-2">Khác</h6>
              <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.other"
                :key="label">
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
          <h5 class="fw-bold">{{ product?.tensanpham || 'Đang tải...' }}</h5>

          <div class="d-flex align-items-center mb-3">
            <div class="me-2 text-warning">★★★★★</div>
            <small class="me-3 text-muted">Đã bán {{ product?.soluong || 0 }}</small>
            <small class="me-3 text-muted">4 Đánh giá</small>
          </div>

          <div class="mb-2">
            <label class="fw-semibold me-3">Màu sắc</label>
            <button class="btn btn-outline-primary active">{{ product?.mausac }}</button>
          </div>

          <div>
            <label class="fw-semibold me-3">Dung lượng</label>
            <button class="btn btn-outline-primary active">
              {{ product?.ram }} RAM {{ product?.gpuMemory }}
            </button>
          </div>

          <div class="p-3 rounded-3 mt-3 bg-light" style="max-width: 550px;">
            <p class="text-danger fw-bold fs-5">
              Giá: {{ (product?.dongia ?? 0).toLocaleString() }}₫
            </p>
          </div>

          <div class="d-flex justify-content-center mt-5">
            <button class="btn btn-outline-primary me-3" @click="addToCart">
              <i class="bi bi-cart-fill"></i>
            </button>
            <button class="btn btn-primary px-5 py-2 fw-bold" @click="buyNow">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="mb-3 mt-5">
        <div class="d-flex mb-3" v-for="(review, index) in reviews" :key="index">
          <div class="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
            :class="review.bgClass" style="width: 40px; height: 40px;">
            {{ review.initial }}
          </div>
          <div>
            <div class="fw-bold">
              {{ review.name }} <span class="text-muted fs-6">· {{ review.time }}</span>
            </div>
            <div class="text-warning">{{ '★'.repeat(review.stars) }}</div>
            <div>{{ review.comment }}</div>
            <button class="btn btn-sm btn-outline-secondary mt-1">👍 {{ review.likes }}</button>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-outline-dark">Xem thêm đánh giá khác</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Sản phẩm khác -->
  <div class="mt-5">
    <h5 class="fw-bold mb-4">Sản phẩm khác</h5>
    <div class="row row-cols-2 row-cols-md-4 g-3">
      <div class="col" v-for="(sp, idx) in otherProducts" :key="idx">
        <div class="card h-100 shadow-sm">
          <img :src="sp.image" class="card-img-top" style="height: 180px; object-fit: contain;" />
          <div class="card-body">
            <h6 class="card-title text-truncate">{{ sp.name }}</h6>
            <p class="text-danger fw-bold">{{ sp.price.toLocaleString() }}₫</p>
            <router-link :to="'/chitiet/' + sp.id" class="btn btn-sm btn-outline-primary w-100">
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useHomeLogic from '@/components/User/JS/ChiTietSP.js'

const route = useRoute()
const router = useRouter()
const { product, fetchChiTietSanPham } = useHomeLogic()

const currentIndex = ref(0)
const showMore = ref(false)

const specs = ref({
  cpu: {},
  gpu: {},
  other: {}
})

const reviews = ref([
  {
    name: 'Thư Nguyễn',
    initial: 'T',
    bgClass: 'bg-danger',
    stars: 5,
    comment: 'Dịch vụ giao hàng nhanh, sản phẩm đúng như mô tả.',
    likes: 2,
    time: '2 ngày trước',
  },
  {
    name: 'Ngọc Huyền',
    initial: 'N',
    bgClass: 'bg-primary',
    stars: 5,
    comment: 'Sản phẩm tốt',
    likes: 0,
    time: '5 giờ trước',
  },
])

const otherProducts = ref([
  {
    id: 101,
    name: 'iPhone 16 Pro Max 512GB',
    price: 39990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-sa-mac-thumb-600x600.jpg'
  },
  {
    id: 102,
    name: 'Samsung Galaxy S25 Ultra',
    price: 28990000,
    image: 'https://happyphone.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S25-Ultra-Titan-Blue.jpg'
  },
  {
    id: 103,
    name: 'MacBook Air M4 2025',
    price: 31990000,
    image: 'https://www.apple.com/newsroom/images/2025/03/apple-introduces-the-new-macbook-air-with-the-m4-chip-and-a-sky-blue-color/article/Apple-MacBook-Air-lineup-250305_big.jpg.large.jpg'
  },
  {
    id: 104,
    name: 'Tai nghe Sony WH-1000XM6',
    price: 7990000,
    image: 'https://bizweb.dktcdn.net/thumb/grande/100/479/913/products/tai-nghe-chong-on-bluetooth-sony-wh-1000xm6-tin-do-tai-nghe-2.jpg?v=1747423362963'
  }
])

const productImages = computed(() => {
  if (!product.value) return []
  const hasImage = product.value.anhgoc && product.value.anhgoc.trim() !== ''
  return [{
    src: hasImage ? product.value.anhgoc : '/images/default.png',
    alt: product.value.tensanpham || 'Ảnh sản phẩm',
  }]
})

const changeImage = (index) => {
  currentIndex.value = index
}

const toggleMore = () => {
  showMore.value = !showMore.value
}

// ✔ Thêm vào localStorage
const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  const item = {
    id: product.value.id,
    name: product.value.tensanpham,
    price: product.value.dongia,
    image: product.value.anhgoc,
    quantity: 1,
    variant: product.value.mausac || 'Mặc định',
    selected: true,
    originalPrice: product.value.giamgia || product.value.dongia
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

// ✔ Thêm vào giỏ hàng rồi chuyển đến trang giỏ
const buyNow = () => {
  addToCart()
  router.push('/giohang')
}

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await fetchChiTietSanPham(id)
    const data = product.value
    if (data) {
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
          RAM: data.ram,
          'Ổ cứng': data.rom,
          'Màn hình': data.screen,
        },
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

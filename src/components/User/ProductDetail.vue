<template>
  <div>
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb p-2 mt-2 bg-light">
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="/" class="text-primary">{{ product?.ten_loai || 'Danh mục' }}</a>
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
              <div
                class="carousel-item"
                :class="{ active: index === currentIndex }"
                v-for="(image, index) in productImages"
                :key="index"
              >
                <div class="fixed-image-frame mx-auto d-flex justify-content-center align-items-center">
                  <img :src="image.src" :alt="image.alt" class="fixed-product-img" />
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>

          <!-- Thumbnails -->
          <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
            <img
              v-for="(image, index) in productImages"
              :key="index"
              :src="image.src"
              class="img-thumbnail border border-2"
              :class="{ 'border-dark': index === currentIndex }"
              style="width: 100px; height: 100px; object-fit: cover; cursor: pointer"
              @click="changeImage(index)"
              :alt="`Ảnh sản phẩm ${index + 1}`"
            />
          </div>

          <!-- Thông số kỹ thuật -->
          <div class="card p-3 mb-4 mt-5">
            <h6 class="fw-bold border-bottom pb-2">Thông số kỹ thuật</h6>

            <h6 class="mt-3 mb-2">Bộ xử lý</h6>
            <div
              class="d-flex justify-content-between small py-1 border-bottom"
              v-for="(value, label) in specs.cpu"
              :key="label"
            >
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <h6 class="mt-4 mb-2">Đồ họa</h6>
            <div
              class="d-flex justify-content-between small py-1 border-bottom"
              v-for="(value, label) in specs.gpu"
              :key="label"
            >
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>

            <div v-if="showMore">
              <h6 class="mt-4 mb-2">Khác</h6>
              <div
                class="d-flex justify-content-between small py-1 border-bottom"
                v-for="(value, label) in specs.other"
                :key="label"
              >
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
              {{ product?.ram }} RAM {{ product?.storage }}
            </button>
          </div>

          <div class="p-3 rounded-3 mt-3 bg-light" style="max-width: 550px;">
            <p class="text-danger fw-bold fs-5">
              Giá: {{ (product?.dongia ?? 0).toLocaleString() }}₫
            </p>
          </div>

          <div class="d-flex justify-content-center mt-5">
            <button class="btn btn-outline-primary me-3"><i class="bi bi-cart-fill"></i></button>
            <button class="btn btn-primary px-5 py-2 fw-bold">Mua ngay</button>
          </div>
        </div>
      </div>

      <!-- Review List -->
      <div class="mb-3 mt-5">
        <div class="d-flex mb-3" v-for="(review, index) in reviews" :key="index">
          <div
            class="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
            :class="review.bgClass"
            style="width: 40px; height: 40px;"
          >
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

      <!-- Similar Products -->
      <div class="container my-5">
        <h4 class="fw-bold mb-3">Sản phẩm tương tự</h4>
        <div id="similarProductsCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              class="carousel-item"
              :class="{ active: index === 0 }"
              v-for="(slide, index) in chunkedProducts"
              :key="index"
            >
              <div class="row row-cols-1 row-cols-md-5 g-4">
                <div class="col" v-for="(product, i) in slide" :key="i">
                  <div class="card h-100 text-center">
                    <img :src="product.image" class="card-img-top" :alt="product.name" />
                    <div class="card-body">
                      <h6 class="card-title">{{ product.name }}</h6>
                      <p class="text-decoration-line-through text-muted small">{{ product.oldPrice }}</p>
                      <p class="text-danger small">{{ product.discount }}</p>
                      <p class="fw-bold text-danger">{{ product.newPrice }}</p>
                      <a href="#" class="btn btn-primary btn-sm">Mua ngay</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#similarProductsCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#similarProductsCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useHomeLogic from '@/components/User/JS/ChiTietSP.js'

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      currentIndex: 0,
      showMore: false,
      specs: {
        cpu: {},
        gpu: {},
        other: {},
      },
      reviews: [
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
      ],
      similarProducts: [
        {
          name: 'Laptop Asus Vivobook 15',
          oldPrice: '34.000.000 đ',
          discount: '-12%',
          newPrice: '32.000.000 đ',
          image:
            'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_13__7_33.png',
        },
        {
          name: 'Laptop HP Envy X360 14',
          oldPrice: '25.990.000 đ',
          discount: '-25%',
          newPrice: '19.390.000 đ',
          image:
            'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_11__5_119.png',
        },
        {
          name: 'Huawei MatePad 11.5”S',
          oldPrice: '14.990.000 đ',
          discount: '-14%',
          newPrice: '12.490.000 đ',
          image:
            'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-huawei-matepad-11-5-s_42_.png',
        },
        {
          name: 'Laptop Acer Nitro V15',
          oldPrice: '21.990.000 đ',
          discount: '-6%',
          newPrice: '20.690.000 đ',
          image:
            'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_11__4_19.png',
        },
        {
          name: 'Laptop HP Envy X360',
          oldPrice: '45.390.000 đ',
          discount: '-24%',
          newPrice: '41.090.000 đ',
          image:
            'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-hp-pavilion-x360-14-dy0168tu-4y1d3pa-1_1_1_2.jpg',
        },
      ],
      homeLogic: null, // lưu biến composable để dùng
    }
  },
  computed: {
    chunkedProducts() {
      const chunkSize = 5
      const result = []
      for (let i = 0; i < this.similarProducts.length; i += chunkSize) {
        result.push(this.similarProducts.slice(i, i + chunkSize))
      }
      return result
    },
    productImages() {
      if (!this.product) return []
      const hasImage = this.product.anh_goc && this.product.anh_goc.trim() !== ''
      return [
        {
          src: hasImage ? this.product.anh_goc : '/images/default.png',
          alt: this.product.tensanpham || 'Ảnh sản phẩm',
        },
      ]
    },
  },
  methods: {
    changeImage(index) {
      this.currentIndex = index
    },
    toggleMore() {
      this.showMore = !this.showMore
    },
    async fetchProduct(id) {
      try {
        if (!this.homeLogic) {
          this.homeLogic = useHomeLogic()
        }
        await this.homeLogic.fetchChiTietSanPham(id)
        this.product = this.homeLogic.product.value
        console.log('Product chi tiết:', this.product)
        const data = this.product
        if (data) {
          this.specs = {
            cpu: {
              'Hãng CPU': data.cpu_brand,
              'Công nghệ CPU': data.cpu_model,
              'Loại CPU': data.cpu_type,
              'Tốc độ CPU tối thiểu': data.cpu_min_speed,
              'Tốc độ tối đa': data.cpu_max_speed,
              'Số nhân': data.cpu_cores,
              'Số luồng': data.cpu_threads,
              'Bộ nhớ đệm': data.cpu_cache,
            },
            gpu: {
              'Hãng (Card rời)': data.gpu_brand,
              'Model (Card rời)': data.gpu_model,
              'Tên đầy đủ': data.gpu_full_name,
              'Bộ nhớ': data.gpu_memory,
            },
            other: {
              RAM: data.ram,
              'Ổ cứng': data.storage,
              'Màn hình': data.screen,
            },
          }
        }
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err)
      }
    },
  },
  mounted() {
    const id = this.$route.params.id
    this.fetchProduct(id)
  },
}
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

<template>
  <div class="zoom-wrapper">
    <!-- Sticky Header -->
    <div v-if="showStickyHeader && product"
      class="position-fixed top-0 start-0 w-100 bg-white shadow-sm d-flex align-items-center justify-content-between px-3 py-2"
      style="height: 70px; z-index: 1050;">
      <div class="d-flex align-items-center">
        <img :src="productImages[0]?.src || product.anhgoc" alt="thumb"
          style="height: 60px; width: 60px; object-fit: cover;" class="me-2 rounded" />
        <div>
          <div class="fw-semibold small">{{ product.tensanpham }}</div>
          <div class="text-muted small">Phân loại: {{ product.ram }}, {{ product.mausac }}</div>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="text-end">
          <div class="text-danger fw-bold">
            {{ giaHienTai.toLocaleString() }}đ
          </div>
          <template v-if="isGiamGiaValid">
            <div class="small text-muted">
              <span class="text-decoration-line-through me-2">{{ product.dongia.toLocaleString() }}đ</span>
              <span class="text-danger">-{{ tinhPhanTramGiamGia(product.dongia, product.giamgia) }}%</span>
            </div>
          </template>
        </div>
        <button class="btn btn-primary px-5 py-2 fw-bold" @click="buyNow">Mua ngay</button>
      </div>
    </div>

    <!-- Nội dung chính -->
    <div v-if="product">
      <div class="container my-5">
        <div class="row">
          <!-- Hình ảnh & thông số -->
          <div class="col-md-6">
            <!-- Carousel -->
            <div class="position-relative">
              <div class="carousel-inner">
                <div class="carousel-item" :class="{ active: index === currentIndex }"
                  v-for="(image, index) in productImages" :key="index" v-show="index === currentIndex">
                  <div class="fixed-image-frame d-flex justify-content-center align-items-center">
                    <img :src="image.src" :alt="image.alt" class="fixed-product-img" />
                  </div>
                </div>
              </div>
              <!-- Carousel điều khiển -->
              <button class="carousel-control-prev custom-control" type="button" @click="prevImage">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next custom-control" type="button" @click="nextImage">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>

            <!-- Thumbnails -->
            <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center">
              <img v-for="(image, index) in productImages" :key="index" :src="image.src"
                class="img-thumbnail border border-2" :class="{ 'border-dark': index === currentIndex }"
                style="width: 80px; height: 80px; object-fit: cover; cursor: pointer" @click="changeImage(index)" />
            </div>

            <!-- Cam kết -->
            <h5 class="fw-bold mt-4 mb-3">Cam kết sản phẩm</h5>
            <div class="row row-cols-1 row-cols-md-2 gx-4 gy-3 small text-secondary">
              <div class="col">
                <div class="bg-white rounded-4 shadow-sm p-3 border h-100">
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-box fs-4 text-primary"></i>
                    <div>Máy mới 100%, chính hãng Việt Nam, đầy đủ phụ kiện từ nhà sản xuất</div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="bg-white rounded-4 shadow-sm p-3 border h-100">
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-box fs-4 text-primary"></i>
                    <div>Bảo hành 12 tháng tại trung tâm bảo hành chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng
                      từ
                      nhà sản xuất</div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="bg-white rounded-4 shadow-sm p-3 border h-100">
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-arrow-repeat fs-4 text-primary"></i>
                    <div>Sách hướng dẫn, Hộp máy, Cáp Type C - Type C</div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="bg-white rounded-4 shadow-sm p-3 border h-100">
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-shield-check fs-4 text-primary"></i>
                    <div>Giá sản phẩm <strong>Đã bao gồm thuế VAT</strong>, giúp bạn yên tâm và dễ dàng trong việc tính
                      toán
                      chi phí</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông số kỹ thuật -->
            <h5 class="fw-bold mb-4 mt-3">Thông số kỹ thuật </h5>
            <div class="bg-white rounded-4 shadow-sm p-3 border h-1">
              <div class="table-responsive">
                <table class="table table-sm align-middle text-start mb-0" style="font-size: 0.95rem;">
                  <tbody>
                    <!-- CPU -->
                    <tr v-for="(value, label) in specs.cpu" :key="'cpu-' + label" class="border-0 border-bottom">
                      <th class="fw-semibold text-secondary py-2 w-25">{{ label }}</th>
                      <td class="py-2">{{ value }}</td>
                    </tr>
                    <!-- GPU -->
                    <tr v-for="(value, label) in specs.gpu" :key="'gpu-' + label" class="border-0 border-bottom">
                      <th class="fw-semibold text-secondary py-2">{{ label }}</th>
                      <td class="py-2">{{ value }}</td>
                    </tr>
                    <!-- Other -->
                    <template v-if="showMore">
                      <tr v-for="(value, label) in specs.other" :key="'other-' + label" class="border-0 border-bottom">
                        <th class="fw-semibold text-secondary py-2">{{ label }}</th>
                        <td class="py-2">{{ value }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Nút xem thêm -->
            <div class="text-center mt-2">
              <button class="btn btn-outline-primary btn-sm rounded-pill px-4"
                style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif; font-size: 0.9rem;"
                @click="toggleMore">
                {{ showMore ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>

          </div>

          <!-- Thông tin sản phẩm -->
          <div class="col-md-6">
            <div class="p-3 mt-1">
              <h3 class="fw-bold mb-3">{{ product.tensanpham }}</h3>

              <div class="product-meta d-flex flex-wrap align-items-center gap-4 mb-4">
                <!-- Đã bán -->
                <div class="d-flex align-items-center meta-item">
                  <span class="icon-circle bg-primary-subtle text-primary me-2">
                    <i class="fas fa-shopping-cart"></i>
                  </span>
                  <span class="text-secondary small">
                    Đã bán:
                    <strong class="ms-1 text-dark">{{ product.soluong || 0 }}</strong>
                  </span>
                </div>

                <!-- Đánh giá -->
                <div class="d-flex align-items-center meta-item">
                  <span class="icon-circle bg-warning-subtle text-warning me-2">
                    <i class="fas fa-star"></i>
                  </span>
                  <span class="text-secondary small">
                    Đánh giá:
                    <template v-if="ratingStats.tong_danh_gia > 0">
                      <strong class="ms-1 text-dark">{{ ratingStats.diem_trung_binh.toFixed(1) }}</strong>
                      <span class="text-warning">★</span>
                      <small class="ms-1 text-muted">({{ ratingStats.tong_danh_gia }} lượt)</small>
                    </template>
                    <template v-else>
                      <span class="ms-1 text-muted">(Chưa có)</span>
                    </template>
                  </span>
                </div>
              </div>

              <!-- Giá sản phẩm -->
              <div class="price-box border rounded-4 px-4 py-3 d-inline-block">
                <small class="text-muted fw-semibold mb-1 d-block">Giá sản phẩm</small>

                <div class="d-flex align-items-baseline">
                  <span class="fw-bold fs-4 text-danger">
                    {{ giaHienTai.toLocaleString() }}đ
                  </span>
                  <span v-if="isGiamGiaValid" class="original-price ms-3">
                    {{ product.dongia.toLocaleString() }}đ
                  </span>
                </div>

                <span v-if="isGiamGiaValid" class="badge bg-primary-subtle text-primary mt-2">
                  Giảm {{ Math.round((1 - giaHienTai / product.dongia) * 100) }}%
                </span>
              </div>

              <div class="product-options mt-4">
                <!-- Màu sắc -->
                <div class="option-group mb-3">
                  <label class="fw-semibold text-secondary me-3">Màu sắc:</label>
                  <button class="option-btn active">
                    {{ product.mausac }}
                  </button>
                </div>

                <!-- Phiên bản -->
                <div class="option-group">
                  <label class="fw-semibold text-secondary me-3">Phiên bản:</label>
                  <button class="option-btn active">
                    {{ product.ram }} {{ product.gpuMemory }}
                  </button>
                </div>
              </div>

              <div class="d-flex justify-content-center mt-5 align-items-center flex-wrap gap-3">
                <ThichSanPham :productId="product.id" />
                <template v-if="product.soluong > 0">
                  <div class="d-flex gap-2">
                    <!-- Nút thêm vào giỏ -->
                    <button
                      class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 shadow-sm fw-semibold"
                      style="min-width: 180px; height: 44px; white-space: nowrap;" @click="addToCart">
                      <i class="bi bi-cart-fill fs-5"></i>
                      <span>Thêm vào giỏ</span>
                    </button>

                    <!-- Nút mua ngay -->
                    <button
                      class="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 shadow-sm fw-semibold"
                      style="min-width: 180px; height: 44px;" @click="buyNow">
                      <span>Mua ngay</span>
                    </button>
                  </div>
                </template>
              </div>

              <!-- Ưu đãi cho sinh viên -->
              <div class="p-2 mt-3"
                style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif; font-size: 0.95rem; background-color: #f5fafd; border: 1px solid #dceefc; border-radius: 16px;">
                <ul class="list-unstyled mb-0">
                  <li class="mb-2">
                    <i class="bi bi-check2-circle text-success me-2"></i>
                    Ưu đãi cho Học sinh - sinh viên, Giảng viên - giáo viên chỉ còn
                    <strong class="text-danger">{{ (giaHienTai - 500000).toLocaleString() }}đ</strong>. <br>
                    → Khi mua tại cửa hàng
                  </li>
                </ul>
              </div>


              <!--Hình ảnh vu vơ-->
              <div class="mt-2" style="  border-radius: 16px;">
                <img src="/src/components/User/ChiTietSP/simDinhQuaChat.png" alt="" width="610px"
                  style="border-radius: 12px;">
              </div>

              <!--Khuyế mãi-->
              <div class="p-2 mt-3"
                style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif; font-size: 0.95rem; background-color: #f5fafd; border: 1px solid #dceefc; border-radius: 16px;">
                <h6 class="fw-bold mb-3">
                  <i class="bi bi-gift-fill text-danger me-2"></i>Khuyến mãi hấp dẫn
                </h6>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Trả góp 0% đến 12 tháng.</li>
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Mua bất kỳ điện thoại nào sẽ
                    nhận
                    được một món quà bí ẩn (tai nghe, ốp lưng, sạc nhanh… trị giá đến <strong
                      class="text-danger">300.000đ</strong>).</li>
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Tặng Combo bảo vệ toàn diện Kính
                    Cường Lực + Ốp lưng</li>
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Tặng phiếu mua hàng <strong
                      class="text-danger">50.000đ</strong> khi
                    mua
                    sim TechMartVN kèm máy.</li>
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Tặng thêm 1 tháng bảo hành.</li>
                  <li class="mb-2"><i class="bi bi-check2-circle text-success me-2"></i>Liên hệ TechmartVN để được tư
                    vấn
                    giá tốt nhất cho khách hàng doanh nghiệp khi mua số lượng nhiều.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
        <SanPhamMoi />
      </div>
      <ProductReviews />
    </div>

    <!-- Loading -->
    <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Đang tải sản phẩm...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import useHomeLogic from './LoadDB/ChiTietSP.js'

import ThichSanPham from './ChiTietSP/ThichSanPham.vue'
import ProductReviews from './ChiTietSP/BinhLuan.vue'
import SanPhamMoi from './Home/SPMoi.vue'

const route = useRoute()
const router = useRouter()
const { product, productImages, fetchChiTietSanPham } = useHomeLogic()

const currentIndex = ref(0)
const showMore = ref(false)
const showStickyHeader = ref(false)

const specs = ref({ cpu: {}, gpu: {}, other: {} })
const ratingStats = ref({
  tong_danh_gia: 0,
  diem_trung_binh: 0,
})

const isGiamGiaValid = computed(() => {
  const now = new Date()
  const hetHan = product.value?.hangiamgia ? new Date(product.value.hangiamgia) : null
  return product.value?.giamgia > 0 && hetHan && hetHan > now
})

const giaHienTai = computed(() => {
  return isGiamGiaValid.value ? product.value.giamgia : product.value.dongia
})

const tinhPhanTramGiamGia = (goc, giam) => {
  if (!goc || !giam) return 0
  return Math.round(((goc - giam) / goc) * 100)
}

const changeImage = (index) => {
  currentIndex.value = index
}

const prevImage = () => {
  currentIndex.value =
    currentIndex.value === 0 ? productImages.value.length - 1 : currentIndex.value - 1
}

const nextImage = () => {
  currentIndex.value =
    currentIndex.value === productImages.value.length - 1 ? 0 : currentIndex.value + 1
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
    image: productImages.value[0]?.src || product.value.anhgoc,
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
  router.push('/giohang').then(() => window.location.reload())
}

const handleScroll = () => {
  showStickyHeader.value = window.scrollY > 400
}

const fetchRatingStats = async (productId) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/datn/WBH_US_SEL_THONG_KE_DANH_GIA',
      {
        params: { p_sanpham: productId },
      }
    );
    if (Array.isArray(response.data) && response.data.length > 0) {
      ratingStats.value = response.data[0].fields;
    }
  } catch (error) {
    console.error('Lỗi khi lấy thống kê đánh giá:', error);
  }
};

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await fetchChiTietSanPham(id)
    if (product.value) {
      await fetchRatingStats(product.value.id)
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
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>


<style scoped>
.fixed-product-img {
  max-width: 100%;
  height: 300px;
  object-fit: contain;
}

.fixed-image-frame {
  width: 100%;
  height: 300px;
}

/* điều hướng hai bên */
.carousel-control-prev.custom-control,
.carousel-control-next.custom-control {
  width: 45px;
  height: 45px;
  background-color: #999;
  /* màu xám */
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 1;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  /* bóng đổ nhẹ */
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: brightness(0) invert(1);
  /* chuyển sang màu trắng */
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
}


.table th {
  width: 40%;
  background-color: #f8f9fa;
}

.table td,
.table th {
  vertical-align: middle;
  padding: 8px;
}


/* Giá sản phẩm */
.price-box {
  background: linear-gradient(180deg, #ffffff 0%, #f2f7ff 100%);
  border: 1px solid #e0e8f0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  min-width: 320px;
  /* cái này là chiều rộng*/
  padding: 16px 24px;
  /* cài này là khoảng cách bên tróng */

}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #6c757d;
}


/*Thông tin sản phẩm*/
.product-meta .meta-item {
  min-width: 10px;
  /* khoảng cách đã bán và đnáh giá */
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.9rem;
}

/* Màu sắc phiên bản */
.option-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  border: 1px solid #dee2e6;
  background-color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s ease-in-out;
}

.option-btn:hover {
  border-color: #0d6efd;
  background-color: #f0f6ff;
  color: #0d6efd;
}

.option-btn.active {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0d6efd;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.15);
}
</style>
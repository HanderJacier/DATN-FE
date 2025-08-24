<script setup>
import { computed, unref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import useHomeLogic from '@/components/User/LoadDB/Home.js'

const { sanPhamXepHang } = useHomeLogic()

// ===== Helpers =====
function toNum(v) {
  const n = Number((v ?? '').toString().replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : null
}
function formatVND(n) {
  return (n ?? 0).toLocaleString('vi-VN')
}
function isGiamGiaValid(sp) {
  const dongia = toNum(sp?.dongia)
  const giamgia = toNum(sp?.giamgia)
  if (!dongia || !giamgia || giamgia >= dongia) return false
  if (!sp?.hangiamgia) return false

  const [day, month, year] = String(sp.hangiamgia).split('/')
  if (!day || !month || !year) return false
  const han = new Date(+year, +month - 1, +day)
  han.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return han > today
}
function pctDiscount(sp) {
  const d = toNum(sp?.dongia)
  const g = toNum(sp?.giamgia)
  if (!d || !g) return 0
  const pct = Math.round((1 - g / d) * 100)
  return Math.min(99, Math.max(1, pct))
}
function onImgErr(e) {
  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
}

// ===== Chuẩn hoá dữ liệu trước khi render =====
const sanPhamHienThi = computed(() => {
  const raw = unref(sanPhamXepHang)
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.rows)
        ? raw.rows
        : []

  return list
    .filter(sp => (sp?.soluong ?? 0) > 0 && isGiamGiaValid(sp)) // chỉ giữ sản phẩm đang giảm giá hợp lệ
    .map(sp => ({
      ...sp,
      dongiaNum: toNum(sp.dongia),
      giamgiaNum: toNum(sp.giamgia),
      thuongHieuHienThi: sp?.thuonghieuTen || sp?.thuonghieu_ten || 'Thương hiệu khác',
      pct: pctDiscount(sp)
    }))
})
</script>

<template>
  <section class="mb-5">
    <h4 class="fw-semibold border-bottom pb-2 mb-3 fw-bold">SẢN PHẨM GIẢM GIÁ</h4>

    <!-- Empty state -->
    <div v-if="sanPhamHienThi.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-tags fs-1 d-block mb-2"></i>
      <div class="fw-medium">Chưa có sản phẩm giảm giá để hiển thị</div>
    </div>

    <!-- Render Swiper chỉ khi có dữ liệu -->
    <Swiper
      v-else
      :slides-per-view="1"
      :space-between="10"
      :breakpoints="{ 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } }"
      navigation
      :modules="[Navigation]"
    >
      <SwiperSlide v-for="sp in sanPhamHienThi" :key="sp.id_sp">
        <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
          <div class="card product-card mx-2 position-relative">
            <!-- 🔻 Badge % giảm giá ở góc trên ảnh -->
            <div class="sale-badge" :title="`Giảm ${sp.pct}%`">-{{ sp.pct }}%</div>

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
                <span class="price-discount">{{ formatVND(sp.giamgiaNum) }}₫</span>
                <span class="price-original">{{ formatVND(sp.dongiaNum) }}₫</span>
                <!-- (ĐÃ bỏ badge phần trăm ở dưới để tránh trùng với badge trên ảnh) -->
              </div>

              <button class="btn btn-outline-dark w-100 mt-2 rounded-pill">Xem chi tiết</button>
            </div>
          </div>
        </RouterLink>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.product-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all .3s ease;
  height: 100%;
  background-color: #fff;
}
.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
  transform: translateY(-2px);
}

/* Ảnh */
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

/* Giá */
.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.price-discount,
.price-normal {
  color: #e53935;
  font-weight: 700;
  font-size: 1.05rem;
}
.price-original {
  color: #9e9e9e;
  text-decoration: line-through;
  font-size: .85rem;
}

/* 🔻 Badge % giảm giá ở góc */
.sale-badge {
  position: absolute;
  top: 8px;
  left: 8px; /* đổi sang right: 8px nếu thích góc phải */
  z-index: 6;
  background: #e53935;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0,0,0,.18);
  user-select: none;
}

/* (Tuỳ chọn) Kiểu ribbon nhỏ nếu muốn nổi bật hơn:
.sale-badge {
  top: 12px;
  left: -8px;
  border-radius: 0 6px 6px 0;
}
.sale-badge::after {
  content: '';
  position: absolute;
  left: 0; bottom: -6px;
  border-width: 6px 6px 0 0;
  border-style: solid;
  border-color: #a02727 transparent transparent transparent;
}
*/
</style>

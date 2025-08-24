<script setup>
import { computed, unref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import useHomeLogic from '@/components/User/LoadDB/Home.js'

const { sanPhamYeuThich } = useHomeLogic()

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

// Format hiển thị lượt yêu thích theo yêu cầu
function formatLikesDisplay(n) {
  const x = Number(n ?? 0)
  if (x <= 9) return String(x)             // 0-9: số thật
  if (x < 20) return '10+'                 // 10–19
  if (x < 100) return '20+'                // 20–99
  if (x < 10_000_000) return '100+'        // 100–9,999,999
  return '10tr+'                           // >= 10,000,000
}

// ===== Chuẩn hoá dữ liệu trước khi render =====
const sanPhamHienThi = computed(() => {
  const raw = unref(sanPhamYeuThich)
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.rows)
        ? raw.rows
        : []

  return list
    .filter(sp => (sp?.soluong ?? 0) > 0)
    .map(sp => {
      const favRaw =
        sp?.SoYeuThich ??
        sp?.favoriteCount ??
        sp?.favorites ??
        sp?.yeuthich ??
        0
      const favCountNum = Math.max(0, toNum(favRaw) ?? 0)
      return {
        ...sp,
        dongiaNum: toNum(sp.dongia),
        giamgiaNum: toNum(sp.giamgia),
        thuongHieuHienThi: sp?.thuonghieuTen || sp?.thuonghieu_ten || 'Thương hiệu khác',
        favCountNum,
        favDisplay: formatLikesDisplay(favCountNum)
      }
    })
})
</script>

<template>
  <section class="mb-5">
    <h4 class="fw-semibold border-bottom pb-2 mb-3 fw-bold">SẢN PHẨM ĐƯỢC YÊU THÍCH NHẤT</h4>

    <!-- Empty state -->
    <div v-if="sanPhamHienThi.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-heart fs-1 d-block mb-2"></i>
      <div class="fw-medium">Chưa có sản phẩm yêu thích để hiển thị</div>
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
            <!-- 💖 Badge lượt yêu thích ở góc trên phải -->
            <div class="fav-badge" :title="`${sp.favCountNum.toLocaleString('vi-VN')} lượt yêu thích`">
              <i class="bi bi-heart-fill me-1"></i>{{ sp.favDisplay }}
            </div>

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

/* Badge giảm giá */
.discount-badge {
  background: linear-gradient(135deg, #ff4b2b, #3e82ff);
  color: white;
  font-weight: 600;
  font-size: .75rem;
  padding: .25em .6em;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(255, 64, 129, .3);
}

/* 💖 Badge lượt yêu thích (góc trên phải) */
.fav-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 64, 129, .95);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,.18);
  backdrop-filter: saturate(1.2) blur(1px);
}
.fav-badge .bi-heart-fill {
  font-size: 0.75rem;
}
</style>

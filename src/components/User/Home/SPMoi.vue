<script setup>
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import useHomeLogic from '@/components/User/LoadDB/Home.js'

const { sanPhamMoiNhat } = useHomeLogic()

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

  const [day, month, year] = sp.hangiamgia.split('/')
  if (!day || !month || !year) return false
  const han = new Date(+year, +month - 1, +day)
  han.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return han > today
}

// Chuẩn hoá cho template
const sanPhamHienThi = computed(() =>
  (sanPhamMoiNhat || [])
    .filter(sp => (sp?.soluong ?? 0) > 0)
    .map(sp => ({
      ...sp,
      dongiaNum: toNum(sp.dongia),
      giamgiaNum: toNum(sp.giamgia),
      thuongHieuHienThi: sp?.thuonghieuTen || sp?.thuonghieu_ten || 'Thương hiệu khác'
    }))
)
</script>

<template>
  <section class="mb-5">
    <h4 class="fw-semibold border-bottom pb-2 mb-3 fw-bold">SẢN PHẨM MỚI NHẤT</h4>

    <Swiper
      :slides-per-view="1"
      :space-between="10"
      :breakpoints="{ 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } }"
      navigation
      :modules="[Navigation]"
    >
      <SwiperSlide v-for="sp in sanPhamHienThi" :key="sp.id_sp">
        <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
          <div class="card product-card mx-2">
            <img :src="sp.anhgoc" class="card-img-top product-img" :alt="sp.tensanpham" />
            <div class="card-body">
              <h6 class="fw-bold text-truncate">{{ sp.tensanpham }}</h6>
              <p class="mb-1 text-secondary small">{{ sp.thuongHieuHienThi }}</p>

              <!-- Giá sản phẩm -->
              <div class="product-price">
                <template v-if="sp.dongiaNum && sp.dongiaNum > 0">
                  <template v-if="isGiamGiaValid(sp)">
                    <span class="price-discount">{{ formatVND(sp.giamgiaNum) }}₫</span>
                    <span class="price-original">{{ formatVND(sp.dongiaNum) }}₫</span>
                    <span class="discount-badge">
                      -{{ Math.round((1 - sp.giamgiaNum / sp.dongiaNum) * 100) }}%
                    </span>
                  </template>
                  <template v-else>
                    <span class="price-normal">{{ formatVND(sp.dongiaNum) }}₫</span>
                  </template>
                </template>

                <!-- Không có giá hợp lệ -->
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
.product-card { border-radius: 12px; overflow: hidden; border: 1px solid #eee; transition: all .3s ease; height: 100%; background-color: #fff; }
.product-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
.card-img-top.product-img { display: block; margin: auto; width: auto; height: 200px; max-width: 100%; object-fit: contain; background-color: #fff; }
.card-img-top { border-top-left-radius: 12px; border-top-right-radius: 12px; padding-top: 10px; }
.product-price { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.price-discount { color: #e53935; font-weight: 700; font-size: 1.05rem; }
.price-original { color: #9e9e9e; text-decoration: line-through; font-size: .85rem; }
.discount-badge { background: linear-gradient(135deg, #ff4b2b, #3e82ff); color: white; font-weight: 600; font-size: .75rem; padding: .25em .6em; border-radius: 6px; box-shadow: 0 2px 4px rgba(255,64,129,.3); }
.price-normal { color: #e53935; font-weight: 700; font-size: 1rem; }
</style>

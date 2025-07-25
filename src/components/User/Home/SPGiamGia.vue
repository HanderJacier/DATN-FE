<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { ref } from 'vue'


// ✅ Import composable
import useHomeLogic from '@/components/User/LoadDB/Home.js'

// ✅ Gọi hàm composable
const { sanPhamMoi, sanPhamYeuThich, sanPhamXepHang } = useHomeLogic()
const discountMap = {
  1: 0,
  2: 5,
  3: 10,
  4: 15,
  5: 20,
  6: 25,
  7: 30,
  8: 35,
  9: 40,
  10: 45,
  11: 50,
  12: 55,
  13: 60,
  14: 65,
  15: 70
};

const now = new Date();

</script>

<template>
  <section class="mb-5">
    <h4 class="fw-semibold border-bottom pb-2 mb-3 fw-bold">SẢN PHẨM GIẢM GIÁ</h4>

    <Swiper :slides-per-view="1" :space-between="10"
      :breakpoints="{ 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } }" navigation
      :modules="[Navigation]">
      <SwiperSlide v-for="sp in sanPhamXepHang" :key="sp.id_sp">
        <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
          <div class="card product-card mx-2">
            <img :src="sp.anhgoc" class="card-img-top product-img" :alt="sp.tensanpham" />
            <div class="card-body">
              <h6 class="fw-bold text-truncate">{{ sp.tensanpham }}</h6>
              <p class="mb-1 text-secondary small">{{ sp.thuonghieu_ten || 'Thương hiệu khác' }}</p>

              <!-- Giá sản phẩm -->
              <p class="fw-semibold mb-2" v-if="typeof sp.dongia === 'number'">
                <template v-if="sp.id_gg && discountMap[sp.id_gg] && new Date(sp.hangiamgia) > now">
                  <span class="text-dark me-2">
                    {{
                      Math.round(sp.dongia * (1 - discountMap[sp.id_gg] / 100)).toLocaleString()
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
  transition: all 0.3s ease;
  height: 100%;
  background-color: #fff;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

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
</style>

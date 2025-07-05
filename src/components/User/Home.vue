<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

import useHomeLogic from '@/components/User/JS/Home.js'

// Lấy dữ liệu sản phẩm
const { sanPhamMoi, sanPhamYeuThich, sanPhamXepHang } = useHomeLogic()

// Ngày hiện tại
const now = new Date()
</script>

<template>
  <div class="container-fluid px-0">

    <!-- 🌟 SẢN PHẨM MỚI -->
    <div class="my-4 p-2">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM MỚI</h3>
      <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }" navigation :modules="[Navigation]">
        <SwiperSlide v-for="sp in sanPhamMoi" :key="sp.id_sp">
          <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
            <div class="card h-100 mx-1 position-relative">
              <!-- Badge Giảm giá -->
              <div
                class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small"
                v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
              >
                Giảm giá
              </div>

              <img :src="sp.anhgoc" class="card-img-top product-img" alt="Ảnh sản phẩm" />
              <div class="card-body text-center">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>

                <!-- Giá -->
                <p class="mb-2">
                  <span
                    v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
                  >
                    <span class="text-danger fw-bold me-2">
                      {{
                        sp.loaigiam === 1
                          ? (sp.dongia - sp.giamgia).toLocaleString()
                          : (sp.dongia * (1 - sp.giamgia / 100)).toLocaleString()
                      }}₫
                    </span>
                    <span class="text-muted text-decoration-line-through">
                      {{ sp.dongia.toLocaleString() }}₫
                    </span>
                  </span>
                  <span v-else class="text-danger fw-bold">
                    {{ sp.dongia.toLocaleString() }}₫
                  </span>
                </p>

                <div class="d-flex justify-content-center">
                  <div class="btn btn-primary mt-2">Mua ngay</div>
                </div>
              </div>
            </div>
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- ❤️ SẢN PHẨM YÊU THÍCH -->
    <div class="my-4 p-2">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM YÊU THÍCH</h3>
      <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }" navigation :modules="[Navigation]">
        <SwiperSlide v-for="sp in sanPhamYeuThich" :key="sp.id_sp">
          <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
            <div class="card h-100 mx-1 position-relative">
              <!-- Badge Giảm giá -->
              <div
                class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small"
                v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
              >
                Giảm giá
              </div>

              <img :src="sp.anhgoc" class="card-img-top product-img" alt="Ảnh sản phẩm" />
              <div class="card-body text-center">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>

                <!-- Giá -->
                <p class="mb-2">
                  <span
                    v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
                  >
                    <span class="text-danger fw-bold me-2">
                      {{
                        sp.loaigiam === 1
                          ? (sp.dongia - sp.giamgia).toLocaleString()
                          : (sp.dongia * (1 - sp.giamgia / 100)).toLocaleString()
                      }}₫
                    </span>
                    <span class="text-muted text-decoration-line-through">
                      {{ sp.dongia.toLocaleString() }}₫
                    </span>
                  </span>
                  <span v-else class="text-danger fw-bold">
                    {{ sp.dongia.toLocaleString() }}₫
                  </span>
                </p>

                <div class="d-flex justify-content-center">
                  <div class="btn btn-primary mt-2">Mua ngay</div>
                </div>
              </div>
            </div>
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 💸 SẢN PHẨM GIẢM GIÁ -->
    <div class="my-4 p-2">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM GIẢM GIÁ</h3>
      <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }" navigation :modules="[Navigation]">
        <SwiperSlide v-for="sp in sanPhamXepHang" :key="sp.id_sp">
          <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
            <div class="card h-100 mx-1 position-relative">
              <!-- Badge Giảm giá -->
              <div
                class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small"
                v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
              >
                Giảm giá
              </div>

              <img :src="sp.anhgoc" class="card-img-top product-img" alt="Ảnh sản phẩm" />
              <div class="card-body text-center">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>

                <!-- Giá -->
                <p class="mb-2">
                  <span
                    v-if="sp.giamgia && sp.loaigiam !== null && new Date(sp.hangiamgia) > now"
                  >
                    <span class="text-danger fw-bold me-2">
                      {{
                        sp.loaigiam === 1
                          ? (sp.dongia - sp.giamgia).toLocaleString()
                          : (sp.dongia * (1 - sp.giamgia / 100)).toLocaleString()
                      }}₫
                    </span>
                    <span class="text-muted text-decoration-line-through">
                      {{ sp.dongia.toLocaleString() }}₫
                    </span>
                  </span>
                  <span v-else class="text-danger fw-bold">
                    {{ sp.dongia.toLocaleString() }}₫
                  </span>
                </p>

                <div class="d-flex justify-content-center">
                  <div class="btn btn-primary mt-2">Mua ngay</div>
                </div>
              </div>
            </div>
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>

  </div>
</template>

<style scoped>
.product-img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: contain;
  padding: 10px;
}
</style>

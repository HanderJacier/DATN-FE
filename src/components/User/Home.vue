<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

import useHomeLogic from '@/components/User/JS/Home.js'

const { sanPhamMoi, sanPhamYeuThich, sanPhamXepHang } = useHomeLogic()
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
            <div class="card h-100 mx-1">
              <img :src="sp.anhgoc" class="card-img-top" alt="Ảnh sản phẩm" style="height: 180px; object-fit: cover" />
              <div class="card-body text-center">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>
                <p class="text-danger mb-2">Giá: {{ (sp.dongia ?? 0).toLocaleString() }}₫</p>
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
          <RouterLink :to="`/sanpham/${sp.id_sp}`" class="btn w-100 mt-2 text-center">
            <div class="card h-100 mx-1">
              <img :src="sp.anhgoc" class="card-img-top" alt="Ảnh sản phẩm" style="height: 180px; object-fit: cover" />
              <div class="card-body">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>
                <p class="text-danger">Giá: {{ (sp.dongia ?? 0).toLocaleString() }}₫</p>
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
          <RouterLink :to="`/sanpham/${sp.id_sp}`" class="btn w-100 mt-2 text-center">
            <div class="card h-100 mx-1">
              <img :src="sp.anhgoc" class="card-img-top" alt="Ảnh sản phẩm" style="height: 180px; object-fit: cover" />
              <div class="card-body">
                <p class="fw-bold mb-1">{{ sp.tensanpham }}</p>
                <p class="text-danger">Giá: {{ (sp.dongia ?? 0).toLocaleString() }}₫</p>
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

<!-- src/views/HomePage.vue -->
<!-- src/views/HomePage.vue -->
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'

import { Navigation } from 'swiper/modules'
import useHomeLogic from '@/components/User/JS/Home.js'

const { sanPhams, sanPhamXepHang } = useHomeLogic()
</script>

<template>
  <div class="container-fluid px-0">

    <!-- Flash Sale
    <div class="bg-danger bg-opacity-10 p-4 rounded">
      <h3 class="h5 fw-bold mb-3">FLASH SALE</h3>
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3" v-for="i in 4" :key="i">
          <div class="card h-100">
            <div class="card-body">
              <RouterLink to="/sanpham" class="dropdown-item text-decoration-none">
                <p class="fw-bold">Sản phẩm {{ i }}</p>
                <p class="text-danger">Giá: xxx.000₫</p>
                <button class="btn btn-primary mt-2">Mua ngay</button>
              </RouterLink>

            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- SẢN PHẨM MỚI -->
    <div class="my-4">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM MỚI</h3>
      <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }" navigation :modules="[Navigation]">
        <SwiperSlide v-for="sp in sanPhams" :key="sp.id">
          <div class="card h-100 mx-2">
            <img :src="`@/assets/${sp.anhGoc}`" class="card-img-top" alt="Ảnh sản phẩm"
              style="height: 180px; object-fit: cover" />
            <div class="card-body">
              <RouterLink :to="`/sanpham/${sp.id}`" class="text-decoration-none text-dark">
                <p class="fw-bold mb-1">{{ sp.tenSanPham }}</p>
                <p class="text-danger">Giá: {{ (sp.donGia ?? 0).toLocaleString() }}₫</p>
              </RouterLink>
              <button class="btn btn-outline-primary w-100 mt-2">Xem ngay</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>


    <!-- Sản phẩm nổi bật -->
    <div class="my-4">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM NỔI BẬT</h3>
      <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }" navigation :modules="[Navigation]">
        <SwiperSlide v-for="sp in sanPhamXepHang" :key="sp.id">
          <div class="card h-100 mx-2">
            <img
              :src="`/uploads/${sp.anhGoc}`"
              class="card-img-top"
              alt="Ảnh sản phẩm"
              style="height: 180px; object-fit: cover"
            />
            <div class="card-body">
              <RouterLink
                :to="`/sanpham/${sp.id}`"
                class="text-decoration-none text-dark"
              >
                <p class="fw-bold mb-1">{{ sp.tenSanPham }}</p>
                <p class="text-danger mb-0">
                  Giá: {{ (sp.donGia ?? 0).toLocaleString() }}₫
                </p>
              </RouterLink>
              <button class="btn btn-outline-primary w-100 mt-2">Xem ngay</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Combo / Ưu đãi -->
    <div class="bg-warning bg-opacity-25 text-center p-4 rounded">
      <h3 class="h6 fw-bold">Hè càng nóng - Giá càng hời</h3>
      <p>Deal sốc - Giao nhanh</p>
      <button class="btn btn-outline-primary mt-2">Khám phá ngay</button>
    </div>

    <!-- Ưu đãi thanh toán
    <div class="bg-success bg-opacity-10 p-4 my-4 rounded">
      <h3 class="h6 fw-bold">Ưu đãi thanh toán</h3>
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3" v-for="i in 4" :key="i">
          <div class="card h-100">
            <div class="card-body">
              <p>Ưu đãi {{ i }}</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>
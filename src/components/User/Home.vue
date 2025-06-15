<!-- src/views/HomePage.vue -->
<template>
  <div class="container py-4">
    <HeaderComponent />

    <!-- Danh mục sản phẩm -->
    <div class="row text-center my-4">
      <div class="col-6 col-md-3 col-lg-1 mb-3" v-for="i in 8" :key="i">
        <div class="card h-100">
          <div class="card-body">
            <p class="card-text">Danh mục {{ i }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Flash Sale -->
    <div class="bg-danger bg-opacity-10 p-4 rounded">
      <h3 class="h5 fw-bold mb-3">FLASH SALE</h3>
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3" v-for="i in 4" :key="i">
          <div class="card h-100">
            <div class="card-body">
              <p class="fw-bold">Sản phẩm {{ i }}</p>
              <p class="text-danger">Giá: xxx.000₫</p>
              <button class="btn btn-primary mt-2">Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sản phẩm nổi bật -->
    <div class="my-4">
      <h3 class="h5 fw-bold mb-3">SẢN PHẨM NỔI BẬT</h3>
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3" v-for="i in 4" :key="i">
          <div class="card h-100">
            <div class="card-body">
              <p class="fw-bold">Nổi bật {{ i }}</p>
              <button class="btn btn-primary mt-2">Xem ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Combo / Ưu đãi -->
    <div class="bg-warning bg-opacity-25 text-center p-4 rounded">
      <h3 class="h6 fw-bold">Hè càng nóng - Giá càng hời</h3>
      <p>Deal sốc - Giao nhanh</p>
      <button class="btn btn-outline-primary mt-2">Khám phá ngay</button>
    </div>

    <!-- Ưu đãi thanh toán -->
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
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../User/Title/Header.vue'
import FooterComponent from '../User/Title/Footer.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderComponent,
    FooterComponent,
  },
}
</script>

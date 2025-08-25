<script setup>
import Banner from './Banner.vue'
import SanPhamMoi from './Home/SPMoi.vue'
import SanPhamYeuThich from './Home/SPYeuThich.vue'
import SanPhamGiamGia from './Home/SPGiamGia.vue'
import Catalog from './Title/Catalog.vue'
</script>

<template>
  <div class="container my-4">
    <div class="row g-3">
      <!-- Sidebar Catalog -->
      <div class="col-md-2">
        <Catalog />
      </div>

      <!-- Banner chính -->
      <div class="col-md-10">
        <Banner />
      </div>
      <!-- Tabs nhỏ bên dưới Banner chính -->
      <div class="d-flex justify-content-around mt-2 small fw-semibold flex-wrap gap-2">
        <!-- iPhone -->
        <button class="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
          @click.prevent="$router.push({ path: '/timkiem', query: { q: 'iphone' } })">
          <span class="text-muted hover-red">
            IPHONE SERIES<br />
            <small class="fw-normal">Hiệu năng cực đỉnh</small>
          </span>
        </button>

        <!-- Samsung -->
        <button class="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
          @click.prevent="$router.push({ path: '/timkiem', query: { q: 'samsung' } })">
          <span class="text-muted hover-red">
            SAMSUNG SERIES<br />
            <small class="fw-normal">Đỉnh cao gập mở</small>
          </span>
        </button>

        <!-- Xiaomi -->
        <button class="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
          @click.prevent="$router.push({ path: '/timkiem', query: { q: 'xiaomi' } })">
          <span class="text-muted hover-red">
            XIAOMI SERIES<br />
            <small class="fw-normal">Hiệu năng trên tầm giá</small>
          </span>
        </button>

        <!-- Oppo -->
        <button class="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
          @click.prevent="$router.push({ path: '/timkiem', query: { q: 'oppo' } })">
          <span class="text-muted hover-red">
            OPPO SERIES<br />
            <small class="fw-normal">Chụp đêm cực nét</small>
          </span>
        </button>
      </div>
      <hr>
    </div>
  </div>

  <!-- Các section sản phẩm -->
  <div class="container my-5 mt-1">
    <SanPhamMoi />
    <SanPhamYeuThich />
    <SanPhamGiamGia />
  </div>
</template>

<style scoped>
.hover-red:hover {
  color: #dc3545 !important;
  /* bootstrap red */
  border-bottom: 2px solid #dc3545;
  cursor: pointer;
}
</style>
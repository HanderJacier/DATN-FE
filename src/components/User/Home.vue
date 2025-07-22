<script setup>
import Banner from './Banner.vue'
import SanPhamMoi from './Home/SPMoi.vue'
import SanPhamYeuThich from './Home/SPYeuThich.vue'
import SanPhamGiamGia from './Home/SPGiamGia.vue'
</script>

<template>
  <div>
    <Banner />
    <div class="container my-5">
      <SanPhamMoi />
      <SanPhamYeuThich />
      <SanPhamGiamGia />
    </div>
  </div>
</template>

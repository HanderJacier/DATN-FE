<template>
  <nav class="nav justify-content-center gap-3 mt-2 flex-wrap">
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 3 } })" class="nav-link text-white" style="cursor: pointer;">Laptop</a>
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 1 } })" class="nav-link text-white" style="cursor: pointer;">Điện Thoại Di Động</a>
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 'phukien' } })" class="nav-link text-white"style="cursor: pointer;">Phụ Kiện</a>
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 10 } })" class="nav-link text-white" style="cursor: pointer;">Tivi</a>
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 11 } })" class="nav-link text-white" style="cursor: pointer;">Loa & Tai Nghe</a>
    <a @click.prevent="$router.push({ path: '/timkiem', query: { loai: 12 } })" class="nav-link text-white" style="cursor: pointer;">Đồng Hồ Thông Minh</a>
  </nav>
</template>

<script>
export default {
  name: "Catalog"
}
</script>
<style scoped>
.nav a {
  cursor: pointer;
}
</style>

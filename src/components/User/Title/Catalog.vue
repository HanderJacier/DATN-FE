<template>
  <div class="catalog-overlay shadow">
    <nav class="nav flex-column p-3">
      <a @click.prevent="navigate({ loai: 3 })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-laptop me-2"></i> Laptop
      </a>

      <a @click.prevent="navigate({ loai: 1 })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-phone me-2"></i> Điện Thoại Di Động
      </a>

      <a @click.prevent="navigate({ loai: 'phukien' })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-usb me-2"></i> Phụ Kiện
      </a>

      <a @click.prevent="navigate({ loai: 10 })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-tv me-2"></i> Tivi
      </a>

      <a @click.prevent="navigate({ loai: 11 })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-speaker me-2"></i> Loa & Tai Nghe
      </a>

      <a @click.prevent="navigate({ loai: 12 })" class="nav-link text-dark fw-semibold">
        <i class="bi bi-watch me-2"></i> Đồng Hồ Thông Minh
      </a>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Catalog",
  emits: ["close"],
  methods: {
    navigate(query) {
      this.$router.push({ path: "/timkiem", query });
      this.$emit("close"); // khi click thì emit xảy ra để home ẩn fprm
    },
  },
};
</script>
<style scoped>
.catalog-overlay {
  width: 260px;
  background: #f2efef;
  border-radius: 6px;
  overflow: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  z-index: 3000;
}

.nav-link {
  padding: 10px 14px;
  font-size: 0.95rem;
  color: #333 !important;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: #dedcdc;
}
</style>

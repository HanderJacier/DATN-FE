<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 70vh;">
    <div class="text-center">
      <i class="bi bi-shield-exclamation text-danger" style="font-size: 5rem;"></i>
      <h1 class="mt-3">403 - Truy cập bị từ chối</h1>
      <p class="text-muted">{{ message || 'Bạn không có quyền truy cập trang này.' }}</p>
      <div class="mt-4">
        <router-link to="/" class="btn btn-primary me-2">
          <i class="bi bi-house"></i> Về trang chủ
        </router-link>
        <button @click="$router.go(-1)" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
  computed: {
    message() {
      return this.$route.query.message
    }
  }
}
</script>

<template>
  <div class="border rounded-4 p-1 mb-2 bg-white">
    <div
      class="bg-white rounded-pill px-2 py-1 d-flex justify-content-between overflow-auto"
      style="white-space: nowrap;"
    >
      <router-link
        to="/tatca"
        class="px-3 py-2 text-decoration-none"
        :class="linkClass('/tatca')"
      >Tất cả</router-link>

      <router-link
        to="/dangxuly"
        class="px-3 py-2 text-decoration-none"
        :class="linkClass('/dangxuly')"
      >Đang xử lý</router-link>

      <router-link
        to="/daxuly"
        class="px-3 py-2 text-decoration-none"
        :class="linkClass('/daxuly')"
      >Đã xử lý</router-link>

      <router-link
        to="/dahuy"
        class="px-3 py-2 text-decoration-none"
        :class="linkClass('/dahuy')"
      >Đã hủy</router-link>

    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: 'OrderStatusTabs',
  setup() {
    const route = useRoute()

    const linkClass = (path) => {
      return route.path === path
        ? 'text-dark fw-bold border-bottom border-2 border-dark'
        : 'text-dark fw-normal'
    }

    return { linkClass }
  },
}
</script>

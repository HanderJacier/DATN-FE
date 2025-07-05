<template>
  <div class="mb-3 mt-5">
    <div class="d-flex mb-3" v-for="(review, index) in reviews" :key="index">
      <div
        class="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
        :class="review.bgClass"
        style="width: 40px; height: 40px"
      >
        {{ review.initial }}
      </div>
      <div>
        <div class="fw-bold">
          {{ review.name }}
          <span class="text-muted fs-6">· {{ review.time }}</span>
        </div>
        <div class="text-warning">{{ '★'.repeat(review.stars) }}</div>
        <div>{{ review.comment }}</div>
        <button class="btn btn-sm btn-outline-secondary mt-1">👍 {{ review.likes }}</button>
      </div>
    </div>
    <div class="text-center">
      <button class="btn btn-outline-dark">Xem thêm đánh giá khác</button>
    </div>
  </div>
</template>

<script setup>
const reviews = [
  {
    name: 'Thư Nguyễn',
    initial: 'T',
    bgClass: 'bg-danger',
    stars: 5,
    comment: 'Dịch vụ giao hàng nhanh, sản phẩm đúng như mô tả.',
    likes: 2,
    time: '2 ngày trước',
  },
  {
    name: 'Ngọc Huyền',
    initial: 'N',
    bgClass: 'bg-primary',
    stars: 5,
    comment: 'Sản phẩm tốt',
    likes: 0,
    time: '5 giờ trước',
  },
]
</script>

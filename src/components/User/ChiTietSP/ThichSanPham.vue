<template>
  <button
    class="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-semibold"
    :class="{ 'btn-danger text-white': isLiked }" @click="$emit('toggle-like')">
    <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
    <span>Yêu thích</span>
  </button>
</template>

<script setup>
defineProps({
  isLiked: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-like'])
</script>

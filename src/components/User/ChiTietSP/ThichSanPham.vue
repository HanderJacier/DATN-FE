<template>
  <button
    class="btn btn-outline-danger me-3"
    :class="{ 'btn-danger text-white': isLiked }"
    @click="$emit('toggle-like')"
  >
    <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
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

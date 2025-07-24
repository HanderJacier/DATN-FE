<template>
  <div>
    <!-- Nút mở bộ lọc -->
    <button
      type="button"
      class="btn btn-outline-secondary"
      style="width: 40px; height: 40px; padding: 0;"
      @click="showFilter = !showFilter"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
        class="bi bi-funnel" viewBox="0 0 16 16">
        <path
          d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .39.812L10 8.5v5a.5.5 0 0 1-.79.407L7 11.07V8.5L1.11 1.812A.5.5 0 0 1 1.5 1.5z" />
      </svg>
    </button>

    <!-- Form lọc -->
    <div v-if="showFilter" class="filter-form">
      <input v-model="filter.ten" type="text" placeholder="Tên sản phẩm" />
      <input v-model.number="filter.min" type="number" placeholder="Giá từ" />
      <input v-model.number="filter.max" type="number" placeholder="Giá đến" />
      <button @click="applyFilter">Áp dụng</button>
      <button @click="resetFilter">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showFilter = ref(false)
const filter = ref({
  ten: '',
  min: null,
  max: null,
})

const emit = defineEmits(['onFilter'])

const applyFilter = () => {
  emit('onFilter', { ...filter.value })
}

const resetFilter = () => {
  filter.value = { ten: '', min: null, max: null }
  emit('onFilter', { ...filter.value })
}
</script>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}
button:hover {
  background-color: #f0f0f0;
}
.filter-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

<template>
  <form @submit.prevent="onSubmit">
    <div class="row g-3">
      <div class="col-md-4" v-for="(label, key) in formFields" :key="key">
        <label class="form-label">{{ label }}</label>
        <input
          v-if="key !== 'diachianh'"
          :type="['dongia', 'giamgia', 'soluong'].includes(key) ? 'number' : 'text'"
          class="form-control"
          v-model="productForm[key]"
        />
        <input
          v-else
          type="file"
          class="form-control"
          @change="onImageChange"
        />
      </div>

      <div v-if="productForm.diachianh" class="col-md-4">
        <label class="form-label d-block">Xem trước ảnh</label>
        <img :src="productForm.diachianh" alt="Preview" width="100" height="100" class="rounded" />
      </div>
    </div>

    <div class="mt-4 d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-warning" @click="$emit('resetForm')">
        Làm Mới
      </button>

      <button
        type="submit"
        class="btn btn-success fw-bold"
      >
        Thêm
      </button>

      <button
        type="submit"
        class="btn btn-primary fw-bold"
      >
        Sửa
      </button>

      <button
        type="button"
        class="btn btn-danger"
        @click="$emit('deleteProduct')"
      >
        Xóa
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  productForm: Object,
  formFields: Object,
  editingIndex: Number,
})

const emit = defineEmits(['submitForm', 'resetForm', 'deleteProduct', 'imageChange'])

function onImageChange(event) {
  emit('imageChange', event)
}
</script>

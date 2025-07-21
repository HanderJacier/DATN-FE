<script setup>
import { loaiMap, brandList } from './List'
import { computed } from 'vue'

const props = defineProps({
  productForm: Object,
  formFields: Object,
  visibleFields: Array,
  isEditing: Boolean,
  notification: String,
  notificationType: String
})

const emit = defineEmits(['imageChange', 'create', 'update', 'resetForm', 'deleteProduct'])

function onImageChange(event) {
  emit('imageChange', event)
}

function validateForm() {
  const requiredFields = ['tensanpham', 'thuonghieu', 'dongia', 'soluong', 'loai']
  for (const field of requiredFields) {
    const value = props.productForm[field]
    if (value === undefined || value === '' || value === null) {
      alert(`❌ Vui lòng nhập: ${props.formFields[field]}`)
      return false
    }
    if (['dongia', 'soluong'].includes(field) && Number(value) < 0) {
      alert(`❌ ${props.formFields[field]} không được âm`)
      return false
    }
  }
  return true
}

function handleCreate() {
  if (!validateForm()) return
  emit('create')
}

function handleUpdate() {
  if (!validateForm()) return
  emit('update')
}

const loaiOptions = computed(() =>
  Object.entries(loaiMap).map(([name, value]) => ({ name, value }))
)
</script>

<template>
  <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
    <!-- Notification -->
    <div v-if="notification" :class="['alert', notificationType === 'success' ? 'alert-success' : 'alert-danger']">
      {{ notification }}
    </div>

    <!-- Dropdown chọn loại sản phẩm -->
    <div class="mb-3">
      <label class="form-label">Chọn loại sản phẩm</label>
      <select class="form-select" v-model="productForm.loai">
        <option disabled value="">-- Chọn loại --</option>
        <option v-for="item in loaiOptions" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>
    </div>

    <!-- Dropdown chọn thương hiệu -->
    <div class="mb-3">
      <label class="form-label">Chọn thương hiệu</label>
      <select class="form-select" v-model="productForm.thuonghieu">
        <option disabled value="">-- Chọn thương hiệu --</option>
        <option v-for="brand in brandList" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
    </div>

    <!-- Other Inputs -->
    <div class="row g-3">
      <div class="col-md-4" v-for="key in visibleFields" :key="key">
        <label class="form-label">{{ formFields[key] }}</label>
        <input
          v-if="key !== 'diachianh'"
          :type="['dongia', 'soluong'].includes(key) ? 'number' : 'text'"
          class="form-control"
          v-model="productForm[key]"
        />
        <input v-else type="file" class="form-control" @change="onImageChange" />
      </div>

      <!-- Preview -->
      <div v-if="productForm.diachianh" class="col-md-4">
        <label class="form-label d-block">Xem trước ảnh</label>
        <img :src="productForm.diachianh" width="100" height="100" class="rounded" />
      </div>
    </div>

    <!-- Buttons -->
<div class="mt-4 d-flex justify-content-end gap-2">
  <button type="button" class="btn btn-warning" @click="$emit('resetForm')">Làm Mới</button>

  <!-- Nút Thêm -->
  <button
    type="button"
    class="btn btn-primary fw-bold me-2"
    @click="handleCreate"
  >
    Thêm
  </button>

  <!-- Nút Cập nhật -->
  <button
    type="button"
    class="btn btn-warning fw-bold"
    @click="handleUpdate"
  >
    Cập nhật
  </button>

  <button type="button" class="btn btn-danger" @click="$emit('deleteProduct')">Xóa</button>
</div>

  </form>
</template>

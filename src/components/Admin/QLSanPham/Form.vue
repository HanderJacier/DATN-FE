<template>
  <form @submit.prevent="handleCreate">
    <!-- 🔽 Thông báo -->
    <div
      v-if="notification"
      :class="['alert', notificationType === 'success' ? 'alert-success' : 'alert-danger']"
      role="alert"
    >
      {{ notification }}
    </div>

    <!-- 🔽 Dropdown chọn loại sản phẩm -->
    <div class="mb-3">
      <label class="form-label">Chọn loại sản phẩm</label>
      <select class="form-select" v-model="productForm.loai">
        <option disabled value="">-- Chọn loại --</option>
        <option value="1">Điện thoại di động</option>
        <option value="2">Máy tính bảng</option>
        <option value="3">Laptop</option>
        <option value="4">Máy tính để bàn</option>
        <option value="5">Thiết bị đeo thông minh</option>
        <option value="6">Phụ kiện điện thoại</option>
        <option value="7">Phụ kiện máy tính</option>
        <option value="8">Thiết bị mạng</option>
        <option value="9">Thiết bị lưu trữ</option>
        <option value="10">Tivi</option>
        <option value="11">Loa và tai nghe</option>
        <option value="12">Đồng hồ thông minh</option>
        <option value="13">Máy ảnh và máy quay</option>
        <option value="14">Máy in và mực in</option>
        <option value="15">Đồ gia dụng thông minh</option>
      </select>
    </div>

    <!-- 🔽 Các input -->
    <div class="row g-3">
      <div class="col-md-4" v-for="key in visibleFields" :key="key">
        <label class="form-label">{{ formFields[key] }}</label>

        <input
          v-if="key !== 'diachianh'"
          :type="['dongia', 'soluong'].includes(key) ? 'number' : 'text'"
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

      <!-- 🔽 Xem trước ảnh -->
      <div v-if="productForm.diachianh" class="col-md-4">
        <label class="form-label d-block">Xem trước ảnh</label>
        <img :src="productForm.diachianh" width="100" height="100" class="rounded" />
      </div>
    </div>

    <!-- 🔽 Nút -->
    <div class="mt-4 d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-warning" @click="$emit('resetForm')">Làm Mới</button>
      <button type="button" class="btn btn-success fw-bold" @click="handleCreate">Thêm</button>
      <button type="button" class="btn btn-primary fw-bold" @click="handleUpdate">Sửa</button>
      <button type="button" class="btn btn-danger" @click="$emit('deleteProduct')">Xóa</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  productForm: Object,
  formFields: Object,
  visibleFields: Array,
  isEditing: Boolean
})

const emit = defineEmits([
  'imageChange',
  'create',
  'update',
  'resetForm',
  'deleteProduct'
])

const notification = ref('')
const notificationType = ref('success') // or 'error'

function showNotification(message, type = 'success') {
  notification.value = message
  notificationType.value = type
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

function onImageChange(event) {
  emit('imageChange', event)
}

function validateForm() {
  const requiredFields = ['tensanpham', 'thuonghieu', 'dongia', 'soluong', 'loai']
  for (const field of requiredFields) {
    const value = props.productForm[field]
    if (value === undefined || value === '' || value === null) {
      showNotification(`❌ Vui lòng nhập: ${props.formFields[field]}`, 'error')
      return false
    }
    if (['dongia', 'soluong'].includes(field) && Number(value) < 0) {
      showNotification(`❌ ${props.formFields[field]} không được âm`, 'error')
      return false
    }
  }
  return true
}

function handleCreate() {
  if (!validateForm()) return
  emit('create')
  showNotification('✅ Thêm sản phẩm thành công', 'success')
}

function handleUpdate() {
  if (!validateForm()) return
  emit('update')
  showNotification('✅ Cập nhật sản phẩm thành công', 'success')
}
</script>

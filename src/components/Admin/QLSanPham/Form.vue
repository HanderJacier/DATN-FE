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

    <!-- 🔽 Dropdown chọn thương hiệu -->
    <div class="mb-3">
      <label class="form-label">Chọn thương hiệu</label>
      <select class="form-select" v-model="productForm.thuonghieu">
        <option disabled value="">-- Chọn thương hiệu --</option>
        <option value="1">Apple</option>
        <option value="2">Samsung</option>
        <option value="3">Xiaomi</option>
        <option value="4">Oppo</option>
        <option value="5">Vivo</option>
        <option value="6">Realme</option>
        <option value="7">Nokia</option>
        <option value="8">ASUS</option>
        <option value="9">Dell</option>
        <option value="10">HP</option>
        <option value="11">Lenovo</option>
        <option value="12">Acer</option>
        <option value="13">Sony</option>
        <option value="14">LG</option>
        <option value="15">Panasonic</option>
        <option value="16">Canon</option>
        <option value="17">Epson</option>
        <option value="18">JBL</option>
        <option value="19">Anker</option>
        <option value="20">Huawei</option>
      </select>
    </div>

    <!-- 🔽 Các input khác -->
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

    <!-- 🔽 Các nút thao tác -->
    <div class="mt-4 d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-warning" @click="$emit('resetForm')">Làm Mới</button>

      <button
        type="button"
        class="btn btn-success fw-bold"
        @click="handleCreate"
      >
        Thêm
      </button>

      <button
        type="button"
        class="btn btn-primary fw-bold"
        @click="handleUpdate"
      >
        Sửa
      </button>

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
  isEditing: Boolean,
  notification: String,
  notificationType: String
})

const emit = defineEmits([
  'imageChange',
  'create',
  'update',
  'resetForm',
  'deleteProduct'
])

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

  console.log('🔧 ID gửi cập nhật:', props.productForm.id_sp || '(chưa có)')
  emit('update')
}

</script>

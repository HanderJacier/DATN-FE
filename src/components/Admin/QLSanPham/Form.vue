<template>
  <form>
    <!-- 🔽 Dropdown chọn loại sản phẩm -->
    <div class="mb-3">
      <label class="form-label">Chọn loại sản phẩm</label>
      <select
        class="form-select"
        v-model="productForm.loai"
        :disabled="isFixedType && isEditing"
      >
        <option disabled value="">-- Chọn loại --</option>
        <option value="1">Điện thoại di động</option>
        <option value="3">Laptop</option>
        <option value="0">Phụ kiện</option> <!-- 👈 dùng value="0" thay vì "" -->
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
          :disabled="key === 'loai' && isFixedType && isEditing"
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
      <button type="button" class="btn btn-success fw-bold" @click="$emit('create')">Thêm</button>
      <button type="button" class="btn btn-primary fw-bold" @click="$emit('update')">Sửa</button>
      <button type="button" class="btn btn-danger" @click="$emit('deleteProduct')">Xóa</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  productForm: Object,
  formFields: Object,
  visibleFields: Array,
  isFixedType: Boolean,
  isEditing: Boolean
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
</script>

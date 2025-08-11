<script setup>
import { loaiMap, brandList } from './List'
import { computed, ref, watch } from 'vue'
import useGiamGiaList from '../CRUD/QLSanPham/GiamGia'
const { giamGiaList, loading: loadingDiscounts, error } = useGiamGiaList()

const props = defineProps({
  productForm: Object,
  formFields: Object,
  visibleFields: Array,
  isEditing: Boolean,
  notification: String,
  notificationType: String
})

const emit = defineEmits(['imageChange', 'multipleImagesChange', 'create', 'update', 'resetForm', 'deleteProduct'])

const previewAnhPhu = ref('') // thay vì []

// Khi chọn ảnh phụ, tạo preview
function onAnhPhuChange(event) {
  const file = (event.target.files || [])[0]
  if (file) {
    previewAnhPhu.value = URL.createObjectURL(file)
  } else {
    previewAnhPhu.value = ''
  }
  emit('multipleImagesChange', event) // vẫn giữ để parent upload & set vào form
}


// Khi reset form thì reset luôn preview ảnh phụ
watch(() => props.productForm.anhphu, (val) => {
  // nếu parent set blob/URL mới thì đồng bộ preview; nếu clear thì xóa preview
  if (!val || (typeof val === 'string' && val.length === 0)) {
    previewAnhPhu.value = ''
  } else if (typeof val === 'string' && !val.startsWith('blob:')) {
    // nếu là URL thật từ cloud, có thể hiển thị luôn (tùy bạn)
    previewAnhPhu.value = ''
  }
})

const anhPhuUrl = computed(() => {
  if (previewAnhPhu.value) return previewAnhPhu.value
  const v = props.productForm?.anhphu
  if (!v) return ''
  if (typeof v === 'string') {
    // DB có thể lưu dạng JSON array '["url"]'
    try {
      const p = JSON.parse(v)
      if (Array.isArray(p)) return p[0] || ''
    } catch { }
    return v.startsWith('blob:') ? '' : v
  }
  if (Array.isArray(v)) return v[0] || ''
  return ''
})


function onImageChange(event) {
  emit('imageChange', event)
}

function validateForm() {
  const requiredFields = ['tensanpham', 'thuonghieu', 'dongia', 'soluong', 'loai']

  for (const field of requiredFields) {
    const value = props.productForm[field]
    if (value === undefined || value === '' || value === null) {
      emit('showNotification', `❌ Vui lòng nhập: ${props.formFields[field]}`, 'error')
      return false
    }

    if (['dongia', 'soluong'].includes(field) && Number(value) < 0) {
      emit('showNotification', `❌ ${props.formFields[field]} không được âm`, 'error')
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

    <!-- 3 dropdown cùng 1 hàng -->
    <div class="row">
      <!-- Dropdown chọn loại sản phẩm -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Chọn loại sản phẩm</label>
        <select class="form-select" v-model="productForm.loai">
          <option disabled value="">-- Chọn loại --</option>
          <option v-for="item in loaiOptions" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
      </div>

      <!-- Dropdown chọn thương hiệu -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Chọn thương hiệu</label>
        <select class="form-select" v-model="productForm.thuonghieu">
          <option disabled value="">-- Chọn thương hiệu --</option>
          <option v-for="brand in brandList" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
      </div>

      <!-- Dropdown chọn giảm giá -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Chọn giảm giá</label>
        <select class="form-select" v-model="productForm.id_gg" :disabled="loadingDiscounts">
          <option v-for="item in giamGiaList" :key="item.id_gg" :value="item.id_gg">
            Giảm {{ item.loaigiamTen }}%
          </option>
        </select>
      </div>
    </div>

    <!-- Other Inputs -->
    <div class="row g-3">
      <div class="col-md-4" v-for="key in visibleFields" :key="key">
        <label class="form-label">{{ formFields[key] }}</label>

        <!-- Ảnh gốc -->
        <div v-if="key === 'anhgoc'">
          <input type="file" class="form-control" @change="onImageChange" />
          <!-- Hiện tên file hoặc link nếu đang sửa và có ảnh -->
          <div v-if="isEditing && (productForm.anhgoc || productForm.diachianh)" class="mt-1 small text-secondary">
            <span v-if="productForm.diachianh && productForm.diachianh.startsWith('blob:')">
              {{ productForm.diachianh.split('/').pop() }}
            </span>
            <span v-else-if="productForm.anhgoc">
              <a :href="productForm.anhgoc" target="_blank">{{ productForm.anhgoc.split('/').pop() }}</a>
            </span>
          </div>
        </div>

        <!-- Ảnh phụ -->
        <div v-else-if="key === 'anhphu'">
          <input type="file" class="form-control" @change="onAnhPhuChange" />

          <!-- Hiện tên file hoặc link nếu đang sửa và có ảnh -->
          <div v-if="isEditing && (anhPhuUrl || productForm.anhphu)" class="mt-1 small text-secondary">
            <!-- Nếu là URL thật từ DB/Cloud -->
            <span v-if="anhPhuUrl && !anhPhuUrl.startsWith('blob:')">
              <a :href="anhPhuUrl" target="_blank">{{ anhPhuUrl.split('/').pop() }}</a>
            </span>
            <!-- Nếu chưa có URL (chỉ có blob preview) -->
            <span v-else-if="previewAnhPhu">
              {{ (productForm.anhphu && productForm.anhphu.split('/').pop()) || 'Đang xem trước ảnh phụ' }}
            </span>
          </div>
        </div>

        <!-- Các input khác -->
        <input v-else :type="['dongia', 'soluong'].includes(key) ? 'number' : 'text'" class="form-control"
          v-model="productForm[key]" />
      </div>

      <!-- Preview ảnh chính -->
      <div class="col-md-4" v-if="productForm.diachianh || productForm.anhgoc">
        <label class="form-label d-block">Xem trước ảnh chính</label>
        <!-- Nếu vừa chọn file mới (blob), ưu tiên hiện -->
        <img v-if="productForm.diachianh && productForm.diachianh.startsWith('blob:')" :src="productForm.diachianh"
          width="100" height="100" class="rounded" style="object-fit: cover;" />
        <!-- Nếu đã upload lên cloud hoặc load lại (link cloud) -->
        <img v-else-if="productForm.anhgoc" :src="productForm.anhgoc" width="100" height="100" class="rounded"
          style="object-fit: cover;" />
      </div>

      <!-- Preview ảnh phụ (1 ảnh) -->
      <div class="col-md-4" v-if="anhPhuUrl">
        <label class="form-label d-block">Xem trước ảnh phụ</label>
        <img :src="anhPhuUrl" width="100" height="100" class="rounded" style="object-fit: cover;" />
      </div>

    </div>

    <!-- Buttons -->
    <div class="mt-4 d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-warning " @click="$emit('resetForm')">Làm Mới</button>
      <button type="button" class="btn btn-primary fw-bold me-2" @click="handleCreate">
        Thêm
      </button>
      <button type="button" class="btn btn-s btn-success fw-bold" @click="handleUpdate">
        Cập nhật
      </button>
      <button type="button" class="btn btn-danger" @click="$emit('deleteProduct')">Xóa</button>
    </div>
  </form>
</template>
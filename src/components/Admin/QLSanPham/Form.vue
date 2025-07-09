<template>
  <div class="container-fluid py-4">
    <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
      QUẢN LÝ SẢN PHẨM
    </h5>

    <form @submit.prevent="submitForm">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Tên sản phẩm</label>
          <input type="text" v-model="productForm.tensanpham" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Giá (VND)</label>
          <input type="number" v-model="productForm.dongia" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Thương hiệu</label>
          <input type="text" v-model="productForm.thuonghieuTen" class="form-control" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Loại</label>
          <input type="text" v-model="productForm.loaiTen" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Màu sắc</label>
          <input type="text" v-model="productForm.mausac" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Giảm giá (%)</label>
          <input type="number" v-model="productForm.giamgia" class="form-control" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Hạn giảm giá</label>
          <input type="date" v-model="productForm.hangiamgia" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Ngày tạo</label>
          <input type="date" v-model="productForm.ngaytao" class="form-control" />
        </div>

        <div class="col-md-4">
          <label class="form-label">RAM</label>
          <input type="text" v-model="productForm.ram" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">ROM</label>
          <input type="text" v-model="productForm.rom" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Màn hình</label>
          <input type="text" v-model="productForm.screen" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Số lượng</label>
          <input type="number" v-model="productForm.soluong" class="form-control" />
        </div>

        <!-- CPU -->
        <div class="col-md-4">
          <label class="form-label">CPU Brand</label>
          <input type="text" v-model="productForm.cpuBrand" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Model</label>
          <input type="text" v-model="productForm.cpuModel" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Type</label>
          <input type="text" v-model="productForm.cpuType" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Min Speed</label>
          <input type="text" v-model="productForm.cpuMinSpeed" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Max Speed</label>
          <input type="text" v-model="productForm.cpuMaxSpeed" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Cores</label>
          <input type="text" v-model="productForm.cpuCores" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Threads</label>
          <input type="text" v-model="productForm.cpuThreads" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">CPU Cache</label>
          <input type="text" v-model="productForm.cpuCache" class="form-control" />
        </div>

        <!-- GPU -->
        <div class="col-md-4">
          <label class="form-label">GPU Brand</label>
          <input type="text" v-model="productForm.gpuBrand" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">GPU Model</label>
          <input type="text" v-model="productForm.gpuModel" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">GPU Full Name</label>
          <input type="text" v-model="productForm.gpuFullName" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">GPU Memory</label>
          <input type="text" v-model="productForm.gpuMemory" class="form-control" />
        </div>

        <!-- Ảnh -->
        <div class="col-md-4">
          <label class="form-label">Ảnh sản phẩm</label>
          <input type="file" @change="onImageChange" class="form-control" />
        </div>

        <div v-if="productForm.diachianh" class="col-md-4">
          <label class="form-label d-block">Xem trước ảnh</label>
          <img :src="productForm.diachianh" alt="Preview" width="100" height="100" class="rounded" />
        </div>
      </div>

      <div class="mt-4 d-flex justify-content-end gap-2">
        <!-- Nút Làm Mới -->
        <button type="button" class="btn btn-warning" @click="handleReset">
          Làm Mới
        </button>

        <!-- Nút Thêm: chỉ hiển thị khi không sửa -->
        <button
          type="submit"
          class="btn btn-success fw-bold"
        >
          Thêm
        </button>

        <!-- Nút Xóa: chỉ hiển thị khi đang sửa -->
        <button
          type="button"
          class="btn btn-danger"
          @click="handleDelete"
        >
          Xóa
        </button>

        <!-- Nút Sửa: chỉ hiển thị khi đang sửa -->
        <button
          type="submit"
          class="btn btn-primary fw-bold"
        >
          Sửa
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import apiClient from '@/api' // file axios instance

const props = defineProps({
  productId: Number
})
const emit = defineEmits(['reset'])

const productForm = ref({
  tensanpham: '',
  dongia: '',
  thuonghieuTen: '',
  loaiTen: '',
  mausac: '',
  mota: '',
  diachianh: '',
  cpuBrand: '',
  cpuModel: '',
  cpuType: '',
  cpuMinSpeed: '',
  cpuMaxSpeed: '',
  cpuCores: '',
  cpuThreads: '',
  cpuCache: '',
  gpuBrand: '',
  gpuModel: '',
  gpuFullName: '',
  gpuMemory: '',
  ram: '',
  rom: '',
  screen: '',
  soluong: '',
  giamgia: '',
  loaigiamTen: '',
  hangiamgia: '',
  ngaytao: ''
})

// 🔄 Khi productId thay đổi, tự động gọi API và gán vào form
watch(
  () => props.productId,
  async (id) => {
    if (id) {
      try {
        const res = await apiClient.get(`/san-pham/${id}`)
        productForm.value = { ...res.data }
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err)
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  productForm.value = {
    tensanpham: '',
    dongia: '',
    thuonghieuTen: '',
    loaiTen: '',
    mausac: '',
    mota: '',
    diachianh: '',
    cpuBrand: '',
    cpuModel: '',
    cpuType: '',
    cpuMinSpeed: '',
    cpuMaxSpeed: '',
    cpuCores: '',
    cpuThreads: '',
    cpuCache: '',
    gpuBrand: '',
    gpuModel: '',
    gpuFullName: '',
    gpuMemory: '',
    ram: '',
    rom: '',
    screen: '',
    soluong: '',
    giamgia: '',
    loaigiamTen: '',
    hangiamgia: '',
    ngaytao: ''
  }
  emit('reset')
}

function onImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.diachianh = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

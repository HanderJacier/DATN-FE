<template>
  <div class="container-fluid py-4">
    <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
      QUẢN LÝ SẢN PHẨM
    </h5>

    <!-- Form nhập liệu -->
    <form @submit.prevent="submitForm">
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

    <!-- Tìm kiếm -->
    <div class="my-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm sản phẩm..."
        class="form-control"
        @input="currentPage = 1"
      />
    </div>

    <!-- Bảng sản phẩm -->
    <div class="table-responsive" style="max-height: 600px; overflow-x: auto;">
      <table class="table table-bordered table-hover align-middle text-center bg-white" style="width: max-content; min-width: 100%;">
        <thead class="table-warning">
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Loại</th>
            <th>Giá (VND)</th>
            <th>Màu sắc</th>
            <th>Ảnh</th>
            <th>Ngày tạo</th>
            <th>CPU Brand</th>
            <th>CPU Model</th>
            <th>CPU Type</th>
            <th>CPU Min Speed</th>
            <th>CPU Max Speed</th>
            <th>CPU Cores</th>
            <th>CPU Threads</th>
            <th>CPU Cache</th>
            <th>GPU Brand</th>
            <th>GPU Model</th>
            <th>GPU Full Name</th>
            <th>GPU Memory</th>
            <th>RAM</th>
            <th>ROM</th>
            <th>Màn hình</th>
            <th>Số lượng</th>
            <th>Địa chỉ ảnh</th>
            <th>Thương hiệu (Tên)</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in pagedProducts" :key="index">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ product.tensanpham }}</td>
            <td>{{ product.thuonghieuTen }}</td>
            <td>{{ product.loaiTen }}</td>
            <td>{{ product.dongia }}</td>
            <td>{{ product.mausac }}</td>
            <td>
              <img :src="product.anhgoc || product.diachianh" width="40" height="40" class="rounded" v-if="product.anhgoc || product.diachianh" />
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(product.ngaytao) }}</td>
            <td>{{ product.cpuBrand }}</td>
            <td>{{ product.cpuModel }}</td>
            <td>{{ product.cpuType }}</td>
            <td>{{ product.cpuMinSpeed }}</td>
            <td>{{ product.cpuMaxSpeed }}</td>
            <td>{{ product.cpuCores }}</td>
            <td>{{ product.cpuThreads }}</td>
            <td>{{ product.cpuCache }}</td>
            <td>{{ product.gpuBrand }}</td>
            <td>{{ product.gpuModel }}</td>
            <td>{{ product.gpuFullName }}</td>
            <td>{{ product.gpuMemory }}</td>
            <td>{{ product.ram }}</td>
            <td>{{ product.rom }}</td>
            <td>{{ product.screen }}</td>
            <td>{{ product.soluong }}</td>
            <td>{{ product.diachianh }}</td>
            <td>{{ product.thuonghieuTen }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="editProduct(index)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(index)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api'

// Khởi tạo dữ liệu
const products = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

// Form sản phẩm
const editingIndex = ref(null)
const productForm = ref({})

const formFields = {
  tensanpham: 'Tên sản phẩm',
  thuonghieu: 'Thương hiệu',
  loai: 'Loại',
  dongia: 'Giá (VND)',
  mausac: 'Màu sắc',
  cpuBrand: 'CPU Brand',
  cpuModel: 'CPU Model',
  cpuType: 'CPU Type',
  cpuMinSpeed: 'CPU Min Speed',
  cpuMaxSpeed: 'CPU Max Speed',
  cpuCores: 'CPU Cores',
  cpuThreads: 'CPU Threads',
  cpuCache: 'CPU Cache',
  gpuBrand: 'GPU Brand',
  gpuModel: 'GPU Model',
  gpuFullName: 'GPU Full Name',
  gpuMemory: 'GPU Memory',
  ram: 'RAM',
  rom: 'ROM',
  screen: 'Màn hình',
  soluong: 'Số lượng',
  diachianh: 'Chọn ảnh'
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/san-pham')
    products.value = res.data
  } catch (err) {
    error.value = err.message || 'Lỗi khi tải dữ liệu'
  } finally {
    loading.value = false
  }
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product =>
    Object.values(product).some(val =>
      String(val).toLowerCase().includes(query)
    )
  )
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('vi-VN') : '-'
}

function editProduct(index) {
  handleReset()
  editingIndex.value = index
  productForm.value = { ...pagedProducts.value[index] }
}

function deleteProduct(index) {
  const globalIndex = (currentPage.value - 1) * pageSize + index
  products.value.splice(globalIndex, 1)
  if (editingIndex.value === index) handleReset()
}

function handleReset() {
  productForm.value = {}
  editingIndex.value = null
}

function onImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    productForm.value.diachianh = URL.createObjectURL(file)
  }
}

function submitForm() {
  if (editingIndex.value === null) {
    products.value.push({ ...productForm.value })
  } else {
    const globalIndex = (currentPage.value - 1) * pageSize + editingIndex.value
    products.value[globalIndex] = { ...productForm.value }
  }
  handleReset()
}
</script>
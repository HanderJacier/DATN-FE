<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width: 100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        THÊM SẢN PHẨM MỚI
      </h5>

      <!-- Form -->
      <form @submit.prevent="saveProduct">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Tên sản phẩm:</label>
            <input type="text" v-model="newProduct.name" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Giá sản phẩm:</label>
            <input type="number" v-model="newProduct.price" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Thương hiệu:</label>
            <input type="text" v-model="newProduct.brand" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Mô tả:</label>
            <input type="text" v-model="newProduct.description" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Ảnh sản phẩm:</label>
            <input type="file" @change="onImageChange" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Loại:</label>
            <input type="text" v-model="newProduct.category" class="form-control" />
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="resetForm">Hủy</button>
          <button type="submit" class="btn btn-warning fw-bold">Lưu</button>
        </div>
      </form>

      <!-- Tìm kiếm -->
      <div class="my-4">
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." class="form-control" />
      </div>

      <!-- Bảng sản phẩm -->
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle text-center bg-white" style="width: 100%;">
          <thead class="table-warning">
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Loại</th>
              <th>Giá (VND)</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th style="width: 120px;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.description }}</td>
              <td>
                <img :src="product.image" alt="Ảnh" width="40" height="40" v-if="product.image" class="rounded" />
              </td>
              <td>
                <button class="btn btn-sm btn-primary me-1" @click="editProduct(index)" title="Sửa">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteProduct(index)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="text-muted">Không có sản phẩm nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'techmart_products'

const newProduct = ref({
  name: '',
  price: '',
  brand: '',
  category: '',
  description: '',
  image: ''
})

const productList = ref([])
const searchQuery = ref('')
const editingIndex = ref(null)

onMounted(() => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    productList.value = JSON.parse(storedData)
  }
})

function updateLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productList.value))
}

function saveProduct() {
  if (editingIndex.value !== null) {
    productList.value[editingIndex.value] = { ...newProduct.value }
    editingIndex.value = null
  } else {
    productList.value.push({ ...newProduct.value })
  }
  updateLocalStorage()
  resetForm()
}

function resetForm() {
  newProduct.value = {
    name: '',
    price: '',
    brand: '',
    category: '',
    description: '',
    image: ''
  }
  editingIndex.value = null
}

function deleteProduct(index) {
  productList.value.splice(index, 1)
  updateLocalStorage()
}

function editProduct(index) {
  editingIndex.value = index
  newProduct.value = { ...productList.value[index] }
}

function onImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      newProduct.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productList.value
  return productList.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

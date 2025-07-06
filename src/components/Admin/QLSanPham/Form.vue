<template>
  <div class="container-fluid py-4">
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
        <button type="button" class="btn btn-warning me-2" @click="resetForm">Làm Mới</button>
        <button type="submit" class="btn btn-success fw-bold me-2">Thêm</button>
        <button type="button" class="btn btn-danger fw-bold me-2" @click="deleteProduct">Xóa</button>
        <button type="submit" class="btn btn-primary fw-bold">Sửa</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
const editingIndex = ref(null)

const loadProducts = () => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    productList.value = JSON.parse(storedData)
  }
}
loadProducts()

const updateLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productList.value))
}

const saveProduct = () => {
  if (editingIndex.value !== null) {
    productList.value[editingIndex.value] = { ...newProduct.value }
    editingIndex.value = null
  } else {
    productList.value.push({ ...newProduct.value })
  }
  updateLocalStorage()
  resetForm()
}

const resetForm = () => {
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

const deleteProduct = () => {
  if (editingIndex.value !== null) {
    productList.value.splice(editingIndex.value, 1)
    updateLocalStorage()
    resetForm()
  } else {
    alert('Vui lòng chọn sản phẩm để xóa')
  }
}

const editProduct = (index) => {
  editingIndex.value = index
  newProduct.value = { ...productList.value[index] }
}

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      newProduct.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="card p-4 bg-white rounded">
      <Form
        :product="editingProduct"
        :editingIndex="editingIndex"
        @save="handleSave"
        @reset="handleReset"
      />
      <Table
        :products="productList"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
// Import đúng theo đường dẫn và tên file bạn đặt
import Form from './QLSanPham/Form.vue'
import Table from './QLSanPham/Table.vue'

const STORAGE_KEY = 'techmart_products'

const productList = ref([])
const editingProduct = ref(null)
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

function handleSave(product) {
  if (editingIndex.value !== null) {
    productList.value[editingIndex.value] = product
  } else {
    productList.value.push(product)
  }
  updateLocalStorage()
  handleReset()
}

function handleReset() {
  editingProduct.value = null
  editingIndex.value = null
}

function handleEdit(index) {
  editingIndex.value = index
  editingProduct.value = { ...productList.value[index] }
}

function handleDelete(index) {
  productList.value.splice(index, 1)
  updateLocalStorage()
}
</script>

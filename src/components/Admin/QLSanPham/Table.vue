<template>
  <div class="container-fluid py-4">
    <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
      QUẢN LÝ SẢN PHẨM
    </h5>

    <!-- Form nhập liệu -->
    <Form
      :productForm="productForm"
      :formFields="formFields"
      @submitForm="submitForm"
      @resetForm="handleReset"
      @deleteProduct="handleDelete"
      @imageChange="onImageChange"
    />

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
import Form from './Form.vue'
import { useProductTable } from './QLSP'

const {
  productForm,
  formFields,
  searchQuery,
  currentPage,
  pageSize,
  pagedProducts,
  totalPages,
  formatDate,
  changePage,
  editProduct,
  deleteProduct,
  handleReset,
  onImageChange,
  submitForm
} = useProductTable()
</script>

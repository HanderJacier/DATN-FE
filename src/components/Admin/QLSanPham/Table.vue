<template>
  <div class="container-fluid py-4">
    <h5
      class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block"
    >
      QUẢN LÝ SẢN PHẨM
    </h5>

    <!-- Form nhập -->
    <Form
      :productForm="productForm"
      :formFields="formFields"
      :isFixedType="isFixedType"
      :visibleFields="visibleFields"
      :editProduct="editProduct"
      :isEditing="editingIndex !== null"
      :notification="notification"
      :notificationType="notificationType"
      @create="createNewProduct"
      @update="updateExistingProduct"
      @resetForm="handleReset"
      @deleteProduct="deleteProduct"
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

    <!-- Bảng hiển thị -->
    <div
      class="table-responsive"
      style="max-height: 600px; overflow-x: auto;"
    >
      <table
        class="table table-bordered table-hover align-middle text-center bg-white"
        style="width: max-content; min-width: 100%;"
      >
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
            <th>Số lượng</th>
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
              <img
                v-if="product.anhgoc || product.diachianh"
                :src="product.anhgoc || product.diachianh"
                width="40"
                height="40"
                class="rounded"
              />
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(product.ngaytao) }}</td>
            <td>{{ product.soluong }}</td>
            <td>{{ product.thuonghieuTen }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-1"
                @click="editProduct(index)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteProduct(index)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav class="mt-3">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage - 1)"
            >Previous</a
          >
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(page)"
            >{{ page }}</a
          >
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage + 1)"
            >Next</a
          >
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
  isFixedType,
  visibleFields,
  editingIndex,
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
  createNewProduct,
  updateExistingProduct,
  notification,
  notificationType
} = useProductTable()
</script>

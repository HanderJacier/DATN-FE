<template>
  <div>
    <div class="my-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm sản phẩm..."
        class="form-control"
        @input="currentPage = 1"
      />
    </div>

    <div class="table-responsive" style="max-height: 600px; overflow-x: auto;">
      <table
        class="table table-bordered table-hover align-middle text-center bg-white"
        style="width: max-content; min-width: 100%;"
      >
        <thead class="table-warning">
          <tr>
            <th style="width: 50px;">STT</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Loại</th>
            <th>Giá (VND)</th>
            <th>Màu sắc</th>
            <th>Ảnh</th>
            <th>Loại giảm</th>
            <th>Giảm giá (%)</th>
            <th>Hạn giảm giá</th>
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
            <th>Loại giảm (Tên)</th>
            <th>Thương hiệu (Tên)</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in pagedProducts" :key="product.id_sp">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ product.tensanpham }}</td>
            <td>{{ product.thuonghieuTen || '-' }}</td>
            <td>{{ product.loaiTen || '-' }}</td>
            <td>{{ product.dongia?.toLocaleString() || 0 }}</td>
            <td>{{ product.mausac || '-' }}</td>
            <td>
              <img
                :src="product.anhgoc || product.diachianh || ''"
                alt="Ảnh"
                width="40"
                height="40"
                v-if="product.anhgoc || product.diachianh"
                class="rounded"
              />
              <span v-else>-</span>
            </td>
            <td>{{ product.loaigiamTen || '-' }}</td>
            <td>{{ product.giamgia != null ? product.giamgia + '%' : '-' }}</td>
            <td>{{ formatDate(product.hangiamgia) }}</td>
            <td>{{ formatDate(product.ngaytao) }}</td>
            <td>{{ product.cpuBrand || '-' }}</td>
            <td>{{ product.cpuModel || '-' }}</td>
            <td>{{ product.cpuType || '-' }}</td>
            <td>{{ product.cpuMinSpeed || '-' }}</td>
            <td>{{ product.cpuMaxSpeed || '-' }}</td>
            <td>{{ product.cpuCores || '-' }}</td>
            <td>{{ product.cpuThreads || '-' }}</td>
            <td>{{ product.cpuCache || '-' }}</td>
            <td>{{ product.gpuBrand || '-' }}</td>
            <td>{{ product.gpuModel || '-' }}</td>
            <td>{{ product.gpuFullName || '-' }}</td>
            <td>{{ product.gpuMemory || '-' }}</td>
            <td>{{ product.ram || '-' }}</td>
            <td>{{ product.rom || '-' }}</td>
            <td>{{ product.screen || '-' }}</td>
            <td>{{ product.soluong != null ? product.soluong : '-' }}</td>
            <td>{{ product.diachianh || '-' }}</td>
            <td>{{ product.loaigiamTen || '-' }}</td>
            <td>{{ product.thuonghieuTen || '-' }}</td>
            <td>
              <!-- Trong bảng sản phẩm -->
              <button class="btn btn-sm btn-primary me-1" @click="editProduct(product.id_sp)">
                Sửa
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id_sp)">
                Xóa
              </button>
            </td>
          </tr>

          <tr v-if="pagedProducts.length === 0">
            <td colspan="31" class="text-muted">Không có sản phẩm nào.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="changePage(currentPage - 1)"
        >
          <a class="page-link" href="#">Previous</a>
        </li>

        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          <a class="page-link" href="#">{{ page }}</a>
        </li>

        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="changePage(currentPage + 1)"
        >
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import useSanPhamAdmin from '../CRUD/QLSanPham/Select.js' // giả định bạn có composable này

const { products } = useSanPhamAdmin()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

const emit = defineEmits(['edit-product'])

function editProduct(id_sp) {
  emit('edit-product', id_sp)
}


const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const keyword = searchQuery.value.toLowerCase()
  return products.value.filter(
    p =>
      (p.tensanpham?.toLowerCase().includes(keyword) ||
       p.thuonghieuTen?.toLowerCase().includes(keyword) ||
       p.loaiTen?.toLowerCase().includes(keyword))
  )
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

function changePage(page) {
  if (page < 1) page = 1
  else if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

watch(searchQuery, () => {
  currentPage.value = 1
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d)) return '-'
  return d.toLocaleDateString()
}
</script>

<template>
  <div class="container-fluid py-4" style="min-height: 80vh;">
    <div class="card shadow p-4">
      <h5 class="form-title mb-4 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        GÓP Ý CỦA NGƯỜI DÙNG
      </h5>

      <!-- Bộ lọc -->
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <input v-model="searchTerm" type="text" placeholder="Tìm tên người dùng..." class="form-control" />
        </div>
        <div class="col-md-6">
          <input v-model="searchContent" type="text" placeholder="Tìm nội dung góp ý..." class="form-control" />
        </div>
      </div>

      <!-- Bảng góp ý -->
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Nội dung góp ý</th>
              <th>Ngày gửi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedFeedback" :key="item.id_gy">
              <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
              <td>{{ item.hoveten || 'Ẩn danh' }}</td>
              <td>{{ item.noidung }}</td>
              <td>{{ formatDate(item.ngay_gui) }}</td>
            </tr>
            <tr v-if="!loading && paginatedFeedback.length === 0">
              <td colspan="4">Không có góp ý nào phù hợp.</td>
            </tr>
            <tr v-if="error">
              <td colspan="4" class="text-danger">Lỗi khi tải góp ý.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <nav class="mt-3 d-flex justify-content-end">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Trước</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Sau</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import useGopYPhanTrang from '@/components/Admin/CRUD/GOPY/Select.js'

const searchTerm = ref('')
const searchContent = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const { gopies, loading, error } = useGopYPhanTrang()

const filteredFeedback = computed(() =>
  (gopies.value || []).filter(item => {
    const matchName =
      !searchTerm.value ||
      item.hoVaTen?.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchContent =
      !searchContent.value ||
      item.noidung?.toLowerCase().includes(searchContent.value.toLowerCase())
    return matchName && matchContent
  })
)

const paginatedFeedback = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFeedback.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredFeedback.value.length / pageSize.value))
)

watch([searchTerm, searchContent], () => {
  currentPage.value = 1
})

function formatDate(dateString) {
  if (!dateString) return 'Không rõ'
  const date = new Date(dateString)
  return isNaN(date) ? 'Không rõ' : date.toLocaleDateString('vi-VN')
}
</script>
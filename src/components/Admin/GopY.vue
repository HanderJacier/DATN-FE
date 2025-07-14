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
              <td>{{ item.hoVaTen || 'Ẩn danh' }}</td>
              <td>{{ item.noidung }}</td>
              <td>{{ formatDate(item.ngay_gui) }}</td>
            </tr>
            <tr v-if="paginatedFeedback.length === 0">
              <td colspan="4">Không có góp ý nào phù hợp.</td>
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

<script>
import apiClient from '@/api';

export default {
  data() {
    return {
      feedbackList: [],
      searchTerm: '',
      searchContent: '',
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredFeedback() {
      return this.feedbackList.filter((item) => {
        const matchName =
          !this.searchTerm ||
          item.hoVaTen?.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchContent =
          !this.searchContent ||
          item.noidung?.toLowerCase().includes(this.searchContent.toLowerCase());
        return matchName && matchContent;
      });
    },
    paginatedFeedback() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredFeedback.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredFeedback.length / this.pageSize);
    },
  },
  methods: {
    async fetchFeedback() {
      try {
        const res = await apiClient.get('/san-pham/gop-y?p_pageNo=1&p_pageSize=100');
        this.feedbackList = res.data || [];
      } catch (error) {
        console.error(' Lỗi tải góp ý:', error);
        alert('Lỗi khi tải danh sách góp ý.');
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Không rõ';
      const date = new Date(dateString);
      return isNaN(date) ? 'Không rõ' : date.toLocaleDateString('vi-VN');
    },
  },
  watch: {
    searchTerm() {
      this.currentPage = 1;
    },
    searchContent() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchFeedback();
  },
};
</script>

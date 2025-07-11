<template>
  <div class="mb-3 mt-5">
    <!-- Gửi đánh giá -->
    <div class="mb-4" v-if="isLoggedIn">
      <textarea
        v-model="newComment.noidung"
        class="form-control mb-2"
        placeholder="Viết đánh giá..."
        rows="4"
      ></textarea>
      <select v-model="newComment.diemso" class="form-select w-auto mb-2">
        <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
      </select>
      <button class="btn btn-warning" @click="submitReview">Gửi đánh giá</button>
    </div>
    <div v-else class="alert alert-warning">
      Vui lòng đăng nhập để gửi đánh giá.
    </div>

    <!-- Danh sách đánh giá -->
    <div v-if="paginatedReviews.length" class="mb-3">
      <div class="d-flex mb-3" v-for="(review, index) in paginatedReviews" :key="index">
        <div
          class="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
          :class="review.bgClass"
          style="width: 40px; height: 40px"
        >
          {{ review.initial }}
        </div>
        <div>
          <div class="fw-bold">
            {{ review.name }}
            <span class="text-muted fs-6">· {{ review.time }}</span>
          </div>
          <div class="text-warning">
            <span v-for="n in 5" :key="n">
              <span v-if="n <= review.stars">★</span>
              <span v-else class="text-secondary">☆</span>
            </span>
          </div>
          <div>{{ review.comment }}</div>
          <button class="btn btn-sm btn-outline-secondary mt-1">
            👍 {{ review.likes }}
          </button>
          <button
            v-if="review.taikhoan === currentUserId"
            class="btn btn-sm btn-outline-danger mt-1 ms-2"
            @click="deleteReview(review.idDg)"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info">Chưa có đánh giá nào.</div>

    <!-- Phân trang -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--">« Trước</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
        >
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++">Tiếp »</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import danhGiaService from './danhGiaService.js'

dayjs.extend(relativeTime)

const reviews = ref([])
const productId = 1 // hoặc prop nếu cần truyền vào
const currentUserId = ref(2) // ID người dùng (giả lập)
const isLoggedIn = ref(true)
const currentPage = ref(1)
const pageSize = 5

const newComment = ref({
  taikhoan: currentUserId.value,
  sanpham: productId,
  noidung: '',
  diemso: 5,
})

const resetForm = () => {
  Object.assign(newComment.value, {
    taikhoan: currentUserId.value, // ✅ lấy giá trị động
    sanpham: productId,
    noidung: '',
    diemso: 5,
  })
}

const loadReviews = async () => {
  try {
    const res = await danhGiaService.getBySanPham(productId)
    reviews.value = res.data.map((dg) => ({
      idDg: dg.id_dg,
      name: dg.tenNguoiDung || 'Ẩn danh',
      initial: (dg.tenNguoiDung || 'A').charAt(0).toUpperCase(),
      bgClass: getColorClass(dg.tenNguoiDung || 'A'),
      stars: dg.diemso,
      comment: dg.noidung,
      likes: 0,
      time: dayjs(dg.ngayDanhGia || new Date()).fromNow(),
      taikhoan: dg.taikhoan,
    }))
    currentPage.value = 1
  } catch (err) {
    alert('Lỗi tải đánh giá')
    console.error(err)
  }
}

const submitReview = async () => {
  if (!newComment.value.noidung.trim()) {
    alert('Vui lòng nhập nội dung đánh giá')
    return
  }

  newComment.value.taikhoan = currentUserId.value // ✅ Gán lại tại đây

  try {
    await danhGiaService.create(newComment.value)
    alert('✅ Gửi đánh giá thành công')
    await loadReviews()
    resetForm()
  } catch (err) {
    alert('❌ Lỗi khi gửi đánh giá')
    console.error(err)
  }
}


const deleteReview = async (idDg) => {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    try {
      await danhGiaService.delete(idDg)
      alert('✅ Đã xóa đánh giá')
      await loadReviews()
    } catch (err) {
      alert('❌ Lỗi khi xóa đánh giá')
    }
  }
}

const getColorClass = (name) => {
  const code = name.charCodeAt(0)
  return ['bg-primary', 'bg-danger', 'bg-warning', 'bg-success'][code % 4]
}

const totalPages = computed(() => Math.ceil(reviews.value.length / pageSize))
const paginatedReviews = computed(() =>
  reviews.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

onMounted(loadReviews)
</script>

<style scoped>
.form-control {
  resize: vertical;
}
.pagination .page-link {
  cursor: pointer;
}
.alert {
  font-size: 0.9rem;
}
</style>

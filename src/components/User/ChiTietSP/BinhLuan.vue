<template>
  <div class="container my-4">
    <h4>Đánh giá sản phẩm</h4>

    <!-- Hiển thị danh sách đánh giá -->
    <div v-if="paginatedReviews.length > 0" class="my-3">
      <div v-for="(review, index) in paginatedReviews" :key="index" class="border p-3 rounded mb-3">
        <div class="d-flex align-items-center mb-2">
          <div class="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
               :class="['text-white', review.bgClass]"
               style="width: 40px; height: 40px;">
            {{ review.initial }}
          </div>
          <div>
            <strong>{{ review.name }}</strong>
            <div class="text-muted" style="font-size: 13px;">{{ review.time }}</div>
          </div>
          <div class="ms-auto">
            <span v-for="star in 5" :key="star" class="text-warning">
              <i :class="star <= review.stars ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
          </div>
        </div>
        <p class="mb-0">{{ review.comment }}</p>
        <button v-if="review.taikhoan === currentUserId" class="btn btn-sm btn-outline-danger mt-2" @click="deleteReview(review.idDg)">
          Xóa đánh giá
        </button>
      </div>

      <!-- Phân trang -->
      <nav class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--">Trước</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++">Sau</button>
          </li>
        </ul>
      </nav>
    </div>
    <div v-else class="text-muted my-3">Chưa có đánh giá nào</div>

    <!-- Form đánh giá -->
    <div v-if="isLoggedIn" class="mt-4">
      <h5>Gửi đánh giá của bạn</h5>
      <div class="mb-3">
        <label>Điểm đánh giá:</label><br>
        <span v-for="star in 5" :key="star" class="text-warning" style="cursor: pointer;" @click="newComment.diemso = star">
          <i :class="star <= newComment.diemso ? 'fas fa-star' : 'far fa-star'"></i>
        </span>
      </div>
      <div class="mb-3">
        <textarea class="form-control" rows="3" v-model="newComment.noidung" placeholder="Nội dung đánh giá..."></textarea>
      </div>
      <button class="btn btn-primary" @click="submitReview">Gửi đánh giá</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import danhGiaService from './danhGiaService.js'

dayjs.extend(relativeTime)

const reviews = ref([])
const productId = 1 // ID sản phẩm đang xem
const currentUserId = ref(2) // giả lập ID người dùng
const isLoggedIn = ref(true) // giả lập trạng thái đăng nhập
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
    taikhoan: currentUserId.value,
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
    console.error('Lỗi tải đánh giá:', err)
  }
}

const submitReview = async () => {
  if (!newComment.value.noidung.trim()) {
    alert('Vui lòng nhập nội dung đánh giá')
    return
  }

  newComment.value.taikhoan = currentUserId.value

  try {
    await danhGiaService.create(newComment.value)
    alert('✅ Gửi đánh giá thành công')
    // Bạn có thể **bỏ dòng này nếu muốn tĩnh hoàn toàn**:
    await loadReviews()
    resetForm()
  } catch (err) {
    console.error('❌ Lỗi khi gửi đánh giá:', err)
  }
}

const deleteReview = async (idDg) => {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    try {
      await danhGiaService.delete(idDg)
      alert('✅ Đã xóa đánh giá')
      // Nếu không muốn tự cập nhật lại, bạn có thể xóa dòng dưới:
      await loadReviews()
    } catch (err) {
      console.error('❌ Lỗi khi xóa đánh giá:', err)
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
textarea {
  resize: none;
}
</style>

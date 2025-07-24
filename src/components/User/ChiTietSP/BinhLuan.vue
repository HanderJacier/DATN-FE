<template>
  <div class="container my-4">
    <h4>Đánh giá sản phẩm</h4>

    <!-- Hiển thị danh sách đánh giá -->
    <div v-if="paginatedReviews.length > 0" class="my-3">
      <div v-for="(review, index) in paginatedReviews" :key="index" class="border p-3 rounded mb-3">
        <div class="d-flex align-items-center mb-2">
          <div class="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
            :class="['text-white', review.bgClass]" style="width: 40px; height: 40px;">
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
        <button v-if="review.taikhoan === currentUserId" class="btn btn-sm btn-outline-danger mt-2"
          @click="deleteReview(review.idDg)">
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

    <!-- Form đánh giá giống CellphoneS -->
    <div v-if="isLoggedIn" class="mt-4 p-4 bg-light rounded">
      <h5 class="mb-3">Đánh giá và bình luận</h5>
      <div class="d-flex align-items-start">
        <!-- Nhân vật minh họa -->
        <img
          src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-eb4c-622f-8e54-454b98a44be2/raw?se=2025-07-24T22%3A24%3A14Z&sp=r&sv=2024-08-04&sr=b&scid=dc42d998-bc42-5d46-a534-067a78dfebf0&skoid=24a7dec3-38fc-4904-b888-8abe0855c442&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-24T19%3A07%3A33Z&ske=2025-07-25T19%3A07%3A33Z&sks=b&skv=2024-08-04&sig=g4fIrJE1fvXWQ1N%2BBFx7sVrjw/Yvu7rWfY1il7g6Yuo%3D"
          alt="Ảnh icon" style="width: 100px; height: auto;" class="me-3" />

        <!-- Nội dung form -->
        <div class="flex-grow-1">
          <!-- Chọn sao -->
          <div class="mt-3">
            <label class="fw-semibold">Điểm đánh giá:</label>
            <span v-for="star in 5" :key="star" class="text-warning" style="cursor: pointer;"
              @click="newComment.diemso = star">
              <i :class="star <= newComment.diemso ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
          </div>

          <!-- Ô nhập nội dung -->
          <div class="input-group mt-2">
            <input v-model="newComment.noidung" type="text" class="form-control"
              placeholder="Viết đánh giá của bạn tại đây" />
            <button class="btn btn-danger" @click="submitReview">
              Gửi đánh giá
              <i class="fas fa-paper-plane ms-1"></i>
            </button>
          </div>

        </div>
      </div>
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

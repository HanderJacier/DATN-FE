<template>
  <div class="container my-4">
    <h4>Đánh giá sản phẩm</h4>

    <!-- Thống kê đánh giá -->
    <div v-if="reviewStats" class="row mb-4">
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h2 class="text-warning">{{ reviewStats.diem_trung_binh?.toFixed(1) || 0 }}</h2>
            <div class="mb-2">
              <span v-for="star in 5" :key="star" class="text-warning fs-4">
                <i :class="star <= Math.round(reviewStats.diem_trung_binh || 0) ? 'fas fa-star' : 'far fa-star'"></i>
              </span>
            </div>
            <p class="text-muted">{{ reviewStats.tong_danh_gia || 0 }} đánh giá</p>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <div v-for="star in 5" :key="star" class="d-flex align-items-center mb-2">
              <span class="me-2">{{ star }} sao</span>
              <div class="progress flex-grow-1 me-2" style="height: 8px;">
                <div 
                  class="progress-bar bg-warning" 
                  :style="{ width: getStarPercentage(star) + '%' }"
                ></div>
              </div>
              <span class="text-muted">{{ getStarCount(star) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        <button 
          v-if="review.taikhoan === currentUserId" 
          class="btn btn-sm btn-outline-danger mt-2" 
          @click="deleteReview(review.idDg)"
          :disabled="deleteLoading"
        >
          {{ deleteLoading ? 'Đang xóa...' : 'Xóa đánh giá' }}
        </button>
      </div>

      <!-- Phân trang -->
      <nav class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Trước</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Sau</button>
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
          <i :class="star <= newComment.diemso ? 'fas fa-star' : 'far fa-star'" class="fs-4"></i>
        </span>
        <span class="ms-2 text-muted">({{ newComment.diemso }}/5)</span>
      </div>
      <div class="mb-3">
        <textarea 
          class="form-control" 
          rows="3" 
          v-model="newComment.noidung" 
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          maxlength="500"
        ></textarea>
        <div class="form-text">{{ newComment.noidung.length }}/500 ký tự</div>
      </div>
      <button 
        class="btn btn-primary" 
        @click="submitReview"
        :disabled="createLoading || !newComment.noidung.trim()"
      >
        {{ createLoading ? 'Đang gửi...' : 'Gửi đánh giá' }}
      </button>
    </div>
    <div v-else class="mt-4 text-center">
      <p class="text-muted">Vui lòng đăng nhập để đánh giá sản phẩm</p>
      <router-link to="/dangnhap" class="btn btn-primary">Đăng nhập</router-link>
    </div>

    <!-- Thông báo -->
    <div v-if="actionMessage" class="alert mt-3" :class="actionSuccess ? 'alert-success' : 'alert-danger'">
      {{ actionMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import useReviews from '../LoadDB/useReviews.js'

dayjs.extend(relativeTime)
dayjs.locale('vi')

export default {
  name: 'BinhLuan',
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const {
      reviews,
      reviewStats,
      reviewsLoading,
      createLoading,
      deleteLoading,
      fetchProductReviews,
      createReview,
      deleteReview: deleteReviewAPI,
      fetchReviewStats
    } = useReviews()

    const currentUserId = ref(null)
    const isLoggedIn = ref(false)
    const currentPage = ref(1)
    const pageSize = 5
    const actionMessage = ref('')
    const actionSuccess = ref(false)

    const newComment = ref({
      noidung: '',
      diemso: 5,
    })

    // Computed
    const totalPages = computed(() => Math.ceil(reviews.value.length / pageSize))
    
    const paginatedReviews = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return reviews.value.slice(start, end).map(review => ({
        idDg: review.id_dg,
        name: review.hoveten || 'Ẩn danh',
        initial: (review.hoveten || 'A').charAt(0).toUpperCase(),
        bgClass: getColorClass(review.hoveten || 'A'),
        stars: review.diemso,
        comment: review.noidung,
        time: dayjs(review.ngaytao).fromNow(),
        taikhoan: review.taikhoan,
      }))
    })

    // Methods
    const checkLoginStatus = () => {
      const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
      if (user && user.id_tk) {
        currentUserId.value = user.id_tk
        isLoggedIn.value = true
      } else {
        currentUserId.value = null
        isLoggedIn.value = false
      }
    }

    const loadReviews = async () => {
      await fetchProductReviews(props.productId, 1, 100) // Load tất cả để phân trang client-side
      await fetchReviewStats(props.productId)
      currentPage.value = 1
    }

    const submitReview = async () => {
      if (!newComment.value.noidung.trim()) {
        showMessage('Vui lòng nhập nội dung đánh giá', false)
        return
      }

      if (!currentUserId.value) {
        showMessage('Vui lòng đăng nhập để đánh giá', false)
        return
      }

      const success = await createReview(
        currentUserId.value,
        props.productId,
        newComment.value.noidung.trim(),
        newComment.value.diemso
      )
      console.log("Review submission result:", success)
      if (success) {
        showMessage('Gửi đánh giá thành công!', true)
        resetForm()
        await loadReviews() // Reload reviews
      } else {
        showMessage('Gửi đánh giá thất bại', false)
        
      }
    }

    const deleteReview = async (reviewId) => {
      if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return

      const success = await deleteReviewAPI(reviewId, currentUserId.value)

      if (success) {
        showMessage('Đã xóa đánh giá', true)
        await loadReviews() // Reload reviews
      } else {
        showMessage('Xóa đánh giá thất bại', false)
      }
    }

    const resetForm = () => {
      newComment.value = {
        noidung: '',
        diemso: 5,
      }
    }

    const showMessage = (message, success) => {
      actionMessage.value = message
      actionSuccess.value = success
      setTimeout(() => {
        actionMessage.value = ''
      }, 3000)
    }

    const getColorClass = (name) => {
      const colors = ['bg-primary', 'bg-danger', 'bg-warning', 'bg-success', 'bg-info', 'bg-secondary']
      const code = name.charCodeAt(0)
      return colors[code % colors.length]
    }

    const getStarCount = (star) => {
      if (!reviewStats.value) return 0
      const key = `sao_${star}`
      return reviewStats.value[key] || 0
    }

    const getStarPercentage = (star) => {
      if (!reviewStats.value || !reviewStats.value.tong_danh_gia) return 0
      const count = getStarCount(star)
      return (count / reviewStats.value.tong_danh_gia) * 100
    }

    // Watchers
    watch(() => props.productId, () => {
      if (props.productId) {
        loadReviews()
      }
    })

    // Lifecycle
    onMounted(() => {
      checkLoginStatus()
      if (props.productId) {
        loadReviews()
      }
    })

    return {
      reviews,
      reviewStats,
      paginatedReviews,
      reviewsLoading,
      createLoading,
      deleteLoading,
      currentUserId,
      isLoggedIn,
      currentPage,
      totalPages,
      newComment,
      actionMessage,
      actionSuccess,
      submitReview,
      deleteReview,
      getStarCount,
      getStarPercentage
    }
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}

.progress {
  background-color: #e9ecef;
}

.fa-star {
  transition: color 0.2s;
}

.fa-star:hover {
  color: #ffc107 !important;
}

.pagination .page-link {
  color: #007bff;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}
</style>

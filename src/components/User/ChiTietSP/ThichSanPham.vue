<template>
  <button
    class="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-semibold"
    :class="{ 'btn-danger text-white': isLiked }" @click="toggleLike">
    <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
    <span>{{ isLiked ? 'Đã yêu thích' : 'Yêu thích' }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// ✅ Nhận productId từ trang chi tiết sản phẩm
const props = defineProps({
  productId: {
    type: Number,
    required: true
  }
})

// ✅ Lấy userId từ localStorage (khi login đã lưu)
const userId = localStorage.getItem('userId')

// State để biết sản phẩm đã yêu thích chưa
const isLiked = ref(false)

// ✅ Hàm gọi API toggle like
const toggleLike = async () => {
  try {
    const res = await axios.post(
      'http://localhost:8080/api/datn/WBH_US_UPD_CAPNHAT_YT_SP',
      {
        inputParams: [
          { PARAMETER_NAME: '@p_sanpham', value: props.productId },
          { PARAMETER_NAME: '@p_taikhoan', value: userId }
        ]
      }
    )

    // API procedure trả về 1 (toggle) hoặc 2 (insert mới)
    const result = res.data
    if (result === 1) {
      isLiked.value = !isLiked.value
    } else if (result === 2) {
      isLiked.value = true
    }
  } catch (err) {
    console.error('Lỗi khi gọi API Yêu thích:', err)
  }
}

// ✅ Khi load trang chi tiết, kiểm tra trạng thái yêu thích
onMounted(async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/san-pham/yeu-thich?userId=${userId}&productId=${props.productId}`
    )
    isLiked.value = res.data?.trangthai === 'Y'
  } catch (err) {
    console.warn('Không thể kiểm tra trạng thái yêu thích:', err)
  }
})
</script>

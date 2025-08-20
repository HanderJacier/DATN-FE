<template>
  <div class="position-relative">
    <button
      class="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-semibold"
      :class="{ 'btn-danger text-white': isLiked }" @click="handleToggleLike">
      <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
    </button>

    <!-- Thông báo -->
    <div v-if="thongBao.show"
      :class="['alert', thongBao.type === 'success' ? 'alert-success' : 'alert-danger', 'alert-dismissible', 'fade', 'show']"
      role="alert"
      style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; min-width: 300px;">
      {{ thongBao.message }}
      <button type="button" class="btn-close" aria-label="Close" @click="thongBao.show = false"></button>
    </div>

    <!-- Yêu cầu đăng nhập -->
    <div v-if="yeuCauDangNhap"
      class="alert alert-warning alert-dismissible fade show d-flex align-items-center justify-content-between"
      role="alert"
      style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; min-width: 320px;">
      <span><i class="fas fa-exclamation-circle me-2"></i>Bạn cần đăng nhập để sử dụng Yêu thích!</span>
      <div class="ms-3">
        <button class="btn btn-success btn-sm me-1" @click="chuyenDangNhap"><i class="fas fa-check"></i></button>
        <button class="btn btn-danger btn-sm" @click="yeuCauDangNhap = false"><i class="fas fa-times"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  productId: {
    type: [Number, String],
    default: null
  },
  isLikedInit: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const sanPhamId = computed(() => Number(props.productId ?? route.params.id))

let taiKhoanId = null
const userData =
  JSON.parse(localStorage.getItem('user')) ||
  JSON.parse(sessionStorage.getItem('user'))
if (userData && userData.id_tk) {
  taiKhoanId = userData.id_tk
}

// --- UI ---
const isLiked = ref(props.isLikedInit)
const thongBao = ref({ show: false, message: '', type: 'success' })

function hienThiThongBao(message, type = 'success') {
  thongBao.value = { show: true, message, type }
  setTimeout(() => (thongBao.value.show = false), 2000)
}

const yeuCauDangNhap = ref(false)
let timeoutYeuCau = null
function chuyenDangNhap() {
  clearTimeout(timeoutYeuCau)
  yeuCauDangNhap.value = false
  router.push('/dangnhap')
}
function hienThongBaoDangNhap() {
  yeuCauDangNhap.value = true
  clearTimeout(timeoutYeuCau)
  timeoutYeuCau = setTimeout(() => (yeuCauDangNhap.value = false), 1500)
}

// ------------------- LOCALSTORAGE -------------------
function getFavoriteKey() {
  return `favorites_user_${taiKhoanId}`
}

// ------------------- LOAD DATA -------------------
onMounted(async () => {
  if (!taiKhoanId) return

  try {
    const res = await axios.get(`http://localhost:8080/api/datn/WBH_US_GET_TRANGTHAI_YT_SP`, {
      params: {
        p_sanpham: sanPhamId.value,
        p_taikhoan: taiKhoanId
      }
    })

    // ví dụ API trả về { trangThai: "Y" | "N" }
    const trangThai = res.data?.trangThai
    isLiked.value = trangThai === "Y"  // chỉ set true khi DB trả Y
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái:", err)
    isLiked.value = false
  }
})

// ------------------- TOGGLE -------------------
const handleToggleLike = async () => {
  if (!taiKhoanId) {
    hienThongBaoDangNhap()
    return
  }

  try {
    await axios.post('http://localhost:8080/api/datn/WBH_US_UPD_CAPNHAT_YT_SP', {
      params: {
        p_sanpham: sanPhamId.value,
        p_taikhoan: taiKhoanId
      }
    })

    isLiked.value = !isLiked.value

    hienThiThongBao(isLiked.value ? 'Đã thêm vào Yêu thích' : 'Đã bỏ khỏi Yêu thích', 'success')
  } catch (err) {
    console.error('Lỗi Yêu thích:', err)
    hienThiThongBao('Cập nhật Yêu thích thất bại!', 'danger')
  }
}
</script>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

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

// ---------------- UI ----------------
const isLiked = ref(props.isLikedInit)
const thongBao = ref({ show: false, message: '', type: 'success' })
function hienThiThongBao(message, type = 'success') {
  thongBao.value = { show: true, message, type }
  setTimeout(() => (thongBao.value.show = false), 2000)
}

// ---------------- LocalStorage ----------------
function getFavoriteKey() {
  return `favorites_user_${taiKhoanId}`
}

// ---------------- Load trạng thái ----------------
onMounted(async () => {
  if (!taiKhoanId) return

  const localFavorites = JSON.parse(localStorage.getItem(getFavoriteKey()) || '[]')
  if (localFavorites.includes(sanPhamId.value)) {
    isLiked.value = true
  }

  try {
    const res = await axios.get('http://localhost:8080/api/datn/WBH_US_SEL_SP_YT', {
      params: { p_id_tk: taiKhoanId }
    })

    const danhSachYT = res.data?.fields ? [res.data.fields] : res.data?.map(item => item.fields) || []
    const spYT = danhSachYT.find(item => Number(item.sanpham) === sanPhamId.value)

    if (spYT && spYT.trangthai === 'Y') {
      isLiked.value = true
      if (!localFavorites.includes(sanPhamId.value)) {
        localFavorites.push(sanPhamId.value)
        localStorage.setItem(getFavoriteKey(), JSON.stringify(localFavorites))
      }
    } else {
      isLiked.value = false
      const index = localFavorites.indexOf(sanPhamId.value)
      if (index !== -1) {
        localFavorites.splice(index, 1)
        localStorage.setItem(getFavoriteKey(), JSON.stringify(localFavorites))
      }
    }
  } catch (err) {
    console.error('Lỗi load trạng thái Yêu thích:', err)
  }
})

// ---------------- Toggle yêu thích ----------------
async function handleToggleLike() {
  if (!taiKhoanId) {
    // ❌ Chưa đăng nhập → bật SweetAlert giống "xóa địa chỉ"
    const res = await Swal.fire({
      icon: 'warning',
      title: 'Yêu cầu đăng nhập',
      text: 'Bạn cần đăng nhập để sử dụng tính năng Yêu thích.',
      showCancelButton: true,
      confirmButtonText: 'Đăng nhập ngay',
      cancelButtonText: 'Để sau',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33'
    })
    if (res.isConfirmed) {
      router.push('/dangnhap')
    }
    return
  }

  const newStatus = !isLiked.value

  try {
    await axios.post('http://localhost:8080/api/datn/WBH_US_UPD_CAPNHAT_YT_SP', {
      params: {
        p_sanpham: sanPhamId.value,
        p_taikhoan: taiKhoanId
      }
    })

    let favs = JSON.parse(localStorage.getItem(getFavoriteKey()) || '[]')
    if (newStatus) {
      if (!favs.includes(sanPhamId.value)) favs.push(sanPhamId.value)
      hienThiThongBao('Đã thêm vào Yêu thích', 'success')
    } else {
      favs = favs.filter(id => id !== sanPhamId.value)
      hienThiThongBao('Đã bỏ khỏi Yêu thích', 'success')
    }
    localStorage.setItem(getFavoriteKey(), JSON.stringify(favs))
    isLiked.value = newStatus

  } catch (err) {
    console.error('Lỗi khi cập nhật Yêu thích:', err)
    hienThiThongBao('Cập nhật Yêu thích thất bại!', 'danger')
  }
}
</script>

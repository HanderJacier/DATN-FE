<template>
  <div class="position-relative">
    <button
      class="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 shadow-sm fw-semibold"
      :class="{ 'btn-danger text-white': isLiked }" @click="handleToggleLike">
      <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { getFavoritesByUser, toggleFavorite } from '../LoadDB/thichSP'

const props = defineProps({
  productId: { type: [Number, String], default: null },
  isLikedInit: { type: Boolean, default: false }
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

// UI state
const isLiked = ref(props.isLikedInit)

// Toast thông báo
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
})

// LocalStorage key
function getFavoriteKey() {
  return `favorites_user_${taiKhoanId}`
}

// Load trạng thái yêu thích
onMounted(async () => {
  if (!taiKhoanId) return

  let localFavorites = JSON.parse(localStorage.getItem(getFavoriteKey()) || '[]')
  if (localFavorites.includes(sanPhamId.value)) {
    isLiked.value = true
  }

  try {
    const res = await getFavoritesByUser(taiKhoanId)
    const danhSachYT = res?.fields ? [res.fields] : res?.map(item => item.fields) || []
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

// Toggle Yêu thích
async function handleToggleLike() {
  if (!taiKhoanId) {
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
    await toggleFavorite(sanPhamId.value, taiKhoanId)

    let favs = JSON.parse(localStorage.getItem(getFavoriteKey()) || '[]')
    if (newStatus) {
      if (!favs.includes(sanPhamId.value)) favs.push(sanPhamId.value)
      Toast.fire({ icon: 'success', title: 'Đã thêm vào yêu thích' })
    } else {
      favs = favs.filter(id => id !== sanPhamId.value)
      Toast.fire({ icon: 'success', title: 'Đã bỏ khỏi danh sách yêu thích' })
    }
    localStorage.setItem(getFavoriteKey(), JSON.stringify(favs))
    isLiked.value = newStatus

  } catch (err) {
    Toast.fire({ icon: 'error', title: 'Cập nhật Yêu thích thất bại!' })
  }
}
</script>

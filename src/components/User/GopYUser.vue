<template>
  <div class="container py-5" style="max-width: 720px;">
    <div class="p-5 border rounded shadow-sm" style="background-color: #fefcf9; font-family: 'Georgia', serif;">
      <h2 class="text-center mb-3 fw-bold" style="font-family: 'Be Vietnam Pro', sans-serif;">
        TechMartVN,
      </h2>

      <p class="text-muted text-center mb-4" style="font-family: 'Be Vietnam Pro', sans-serif;">
        Mọi chia sẻ, góp ý của bạn là món quà quý giá với chúng tôi!
      </p>

      <form @submit.prevent="submitFeedback">
        <div class="mb-4">
          <textarea
            class="form-control"
            rows="8"
            v-model="feedback"
            placeholder="Viết thư góp ý của bạn tại đây..."
            style="resize: none; background: #fffefb; border: 1px solid #e0ddd3; font-size: 1.05rem; font-family: 'Quicksand', 'Arial', sans-serif;"
            required
          ></textarea>
        </div>

        <div class="text-end me-2 mb-4">
          <p class="fw-bold" style="font-family: 'Be Vietnam Pro', sans-serif; font-size: 1.2rem;">
            {{ username || 'Bạn' }}
          </p>
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-outline-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Gửi thư góp ý
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import useGopYCreate from '@/components/User/LoadDB/GopY.js'

const feedback = ref('')
const id_tk = ref(null)
const username = ref('Bạn')

const { loading, error, success, createGopY } = useGopYCreate()

// Lấy user từ localStorage/sessionStorage
try {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
  const storageUser = raw ? JSON.parse(raw) : null
  if (storageUser) {
    id_tk.value = storageUser.id_tk || storageUser.idtk
    username.value = storageUser.hoVaTen || storageUser.hoveten || 'Bạn'
  }
} catch (e) {
  console.error('Lỗi đọc storage:', e)
}

const submitFeedback = async () => {
  if (!feedback.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa nhập nội dung',
      text: 'Vui lòng viết nội dung góp ý trước khi gửi!',
    })
    return
  }

  if (!id_tk.value) {
    Swal.fire({
      icon: 'error',
      title: 'Không tìm thấy tài khoản',
      text: 'Vui lòng đăng nhập lại!',
    }).then(() => window.location.href = '/dangnhap')
    return
  }

  const ok = await createGopY({ id_tk: id_tk.value, noidung: feedback.value })
  if (ok) {
    Swal.fire({
      icon: 'success',
      title: 'Góp ý đã được gửi!',
      text: 'Cảm ơn bạn đã chia sẻ ý kiến quý giá.',
      timer: 3000,
      showConfirmButton: false,
    })
    feedback.value = ''
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Gửi góp ý thất bại!',
      text: error.value || 'Vui lòng thử lại sau.',
    })
  }
}
</script>

<style scoped>
@media (max-width: 576px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
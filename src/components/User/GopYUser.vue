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
          <button type="submit" class="btn btn-outline-primary">Gửi thư góp ý</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { postFeedback } from '@/api.js';

export default {
  data() {
    return {
      feedback: '',
      id_tk: null,
      username: 'Bạn',
    };
  },
  created() {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      if (storageUser) {
        this.id_tk = storageUser.id_tk || storageUser.idtk;
        this.username = storageUser.hoVaTen || 'Bạn';
      }
    } catch (e) {
      console.error('Lỗi đọc storage:', e);
    }
  },
  methods: {
    async submitFeedback() {
      if (!this.feedback.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Bạn chưa nhập nội dung',
          text: 'Vui lòng viết nội dung góp ý trước khi gửi!',
        });
        return;
      }

      if (!this.id_tk) {
        Swal.fire({
          icon: 'error',
          title: 'Không tìm thấy tài khoản',
          text: 'Vui lòng đăng nhập lại!',
        }).then(() => {
          this.$router.push('/dangnhap');
        });
        return;
      }

      try {
        await postFeedback({
          noidung: this.feedback,
          id_tk: this.id_tk
        });

        Swal.fire({
          icon: 'success',
          title: 'Góp ý đã được gửi!',
          text: 'Cảm ơn bạn đã chia sẻ ý kiến quý giá.',
          timer: 3000,
          showConfirmButton: false
        });

        this.feedback = '';
      } catch (error) {
        console.error('Lỗi gửi góp ý:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gửi góp ý thất bại!',
          text: 'Vui lòng thử lại sau.',
        });
      }
    }
  }
};
</script>

<style scoped>
@media (max-width: 576px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

<template>

    <!--Nav-->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Góp ý</li>
        </ol>
    </nav>

    <div class="container py-5" style="max-width: 1000px;">
        <h2 class="text-center text-dark mb-1">Hãy Góp Ý Về Chúng Tôi</h2>
        <p class="text-center text-muted mb-4">Chúng Tôi Luôn Tôn Trọng Ý Kiến Của Bạn!</p>

        <div class="row align-items-center">
            <!-- Hình ảnh bên trái -->
            <div class="col-md-6 mb-4 mb-md-0">
                <img src="/src/assets/image/gopy/gopy.png" alt="Contact Us" class="img-fluid rounded" />
            </div>

            <!-- Form bên phải -->
            <div class="col-md-6">
                <form @submit.prevent="submitFeedback">
                    <div class="mb-3">
                        <textarea class="form-control" rows="4" placeholder="Nội dung góp ý của bạn" v-model="feedback"
                            required></textarea>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Gửi góp ý</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'FeedbackForm',
    data() {
        return {
            feedback: ''
        };
    },
    methods: {
        submitFeedback() {
            console.log('Nội dung góp ý:', this.feedback);

            // Reset ô nhập sau khi gửi
            this.feedback = '';

            alert('Cảm ơn bạn đã gửi góp ý!');
        }
    }
};

</script>

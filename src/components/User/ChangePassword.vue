<template>

    <!--Nav-->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Tài khoản</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Thông tin cá nhân</li>
        </ol>
    </nav>

    <!--Menu tài khoản-->
    <div class="container my-5">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3">
                <div class="bg-light rounded p-3">
                    <div class="text-center mb-3">
                        <div class="d-flex align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar"
                                class="me-2" />
                            <h5 class="fw-bold mb-0">{{ username }}</h5>
                        </div>
                    </div>
                    <hr />
                    <div class="ps-4">
                        <h6 class="fw-bold"><i class="bi bi-person-fill"></i> Tài khoản của tôi</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li><router-link to="/thongtintk" class="text-dark text-decoration-none">Thông tin cá
                                    nhân</router-link></li>
                            <li><router-link to="/diachinguoidung" class="text-dark text-decoration-none">Địa
                                    chỉ</router-link>
                            </li>
                            <li><router-link to="/doimatkhaunguoidung" class="text-primary text-decoration-none">> Đổi
                                    mật
                                    khẩu</router-link></li>
                        </ul>

                        <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li>Lịch sử mua hàng</li>
                            <li>Hóa đơn mua hàng</li>
                        </ul>

                        <h6 class="fw-bold text-danger"><i class="bi bi-heart-fill"></i> Sản phẩm yêu thích</h6>
                        <h6 class="fw-bold text-warning mt-3"><i class="bi bi-box-arrow-right"></i> Đăng xuất</h6>
                    </div>
                </div>
            </div>

            <!-- VerifyAccountPage.vue -->
            <div class="col-md-8">
                <h4 class="fw-bold mb-4">Xác minh tài khoản</h4>

                <div class="bg-white border rounded p-4 shadow-sm">
                    <form @submit.prevent="submitPassword">
                        <!-- Icon khoá + tiêu đề -->
                        <div class="text-center mb-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/2874/2874106.png" width="70" alt="shield"
                                class="mb-2" />
                            <h5 class="fw-bold">Đổi mật khẩu</h5>
                        </div>

                        <!-- Mật khẩu hiện tại -->
                        <div class="mb-3 w-50 mx-auto">
                            <label class="form-label fw-semibold">Mật khẩu hiện tại</label>
                            <input v-model="currentPassword" type="password" class="form-control"
                                placeholder="Nhập mật khẩu hiện tại..." required />
                        </div>

                        <!-- Mật khẩu mới -->
                        <div class="mb-3 w-50 mx-auto">
                            <label class="form-label fw-semibold">Mật khẩu mới</label>
                            <input v-model="newPassword" type="password" class="form-control"
                                placeholder="Nhập mật khẩu mới..." required />
                        </div>

                        <!-- Xác nhận mật khẩu -->
                        <div class="mb-3 w-50 mx-auto">
                            <label class="form-label fw-semibold">Xác nhận mật khẩu mới</label>
                            <input v-model="confirmPassword" type="password" class="form-control"
                                placeholder="Nhập lại mật khẩu mới..." required />
                        </div>


                        <!-- Nút cập nhật -->
                        <div class="text-center">
                            <button class="btn btn-primary w-25">Cập nhật mật khẩu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'PersonalInfoPage',
    data() {
        return {
            // Thông tin cá nhân
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',

            // Mật khẩu
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
    },
    methods: {
        // Gửi form thông tin cá nhân
        submitForm() {
            alert(`Thông tin đã cập nhật:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}`);
        },

        // Gửi form đổi mật khẩu
        submitPassword() {
            if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
                alert('Vui lòng nhập đầy đủ các trường mật khẩu.');
                return;
            }

            if (this.newPassword !== this.confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            // Giả sử đây là mật khẩu cũ đúng (demo)
            const correctCurrentPassword = '123456';

            if (this.currentPassword !== correctCurrentPassword) {
                alert('Mật khẩu hiện tại không đúng!');
                return;
            }

            alert('✅ Mật khẩu đã được cập nhật!');
            this.currentPassword = this.newPassword = this.confirmPassword = '';
        },
    },
};
</script>

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
                            <h5 class="fw-bold mb-0">{{ hoVaTen }}</h5>
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
                            <li><router-link to="/doimatkhau" class="text-dark text-decoration-none">Đổi mật
                                    khẩu</router-link></li>
                        </ul>

                        <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li><router-link to="/lichsumuahang" class="text-dark text-decoration-none">Lịch sử mua
                                    hàng</router-link></li>
                            <li><router-link to="/hoadon" class="text-primary text-decoration-none">> Hóa đơn mua
                                    hàng</router-link></li>
                        </ul>

                        <router-link to="/sanphamyeuthich" class="text-dark text-decoration-none">
                            <h6 class="fw-bold text-danger mb-0">
                                <i class="bi bi-heart-fill"></i> Sản phẩm yêu thích
                            </h6>
                        </router-link>
                        <h6 class="fw-bold text-warning mt-3"><i class="bi bi-box-arrow-right"></i> Đăng xuất</h6>
                    </div>
                </div>
            </div>

            <!-- Thông tin cá nhân -->
            <div class="col-md-8">
                <h4 class="fw-bold mb-4">Thông tin cá nhân</h4>
                <div class="bg-white border rounded p-4 shadow-sm">
                    <form @submit.prevent="submitForm">
                        <div class="text-center mb-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar"
                                class="mb-2" />
                        </div>

                        <!-- Tên đăng nhập -->
                        <div class="mb-3 row w-75 mx-auto">
                            <label class="col-sm-3 col-form-label">Tên đăng nhập</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" v-model="username" />
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="mb-3 row w-75 mx-auto">
                            <label class="col-sm-3 col-form-label">Email</label>
                            <div class="col-sm-9">
                                <input type="email" class="form-control" v-model="email" />
                            </div>
                        </div>

                        <!-- Số điện thoại -->
                        <div class="mb-3 row w-75 mx-auto">
                            <label class="col-sm-3 col-form-label">Số điện thoại</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" v-model="phone" />
                            </div>
                        </div>

                        <!-- Giới tính -->
                        <div class="mb-3 row w-75 mx-auto">
                            <label class="col-sm-3 col-form-label">Giới tính</label>
                            <div class="col-sm-9 d-flex align-items-center gap-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="nam" value="Nam"
                                        v-model="gender" />
                                    <label class="form-check-label" for="nam">Nam</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="nu" value="Nữ" v-model="gender" />
                                    <label class="form-check-label" for="nu">Nữ</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="khac" value="Khác"
                                        v-model="gender" />
                                    <label class="form-check-label" for="khac">Khác</label>
                                </div>
                            </div>
                        </div>

                        <!-- Nút submit -->
                        <div class="text-end w-75 mx-auto">
                            <button type="submit" class="btn btn-primary">Chỉnh sửa thông tin</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import apiClient from '/src/api.js';

export default {
    name: 'PersonalInfoPage',
    data() {
        return {
            username: '',
            email: '',
            phone: '',
            gender: '',
            hoVaTen: '',
        };
    },
    mounted() {
        this.layThongTinTaiKhoan();
    },
    methods: {
        async layThongTinTaiKhoan() {
            try {
                const res = await apiClient.get('/taikhoan/thongtin', {
                    withCredentials: true
                });
                const data = res.data;
                this.username = data.tenDangNhap;
                this.email = data.email;
                this.phone = data.soDienThoai;
                this.hoVaTen = data.hoVaTen;

                // 👇 nếu bạn lưu giới tính trong trường khác thì xử lý thêm
                // this.gender = data.gioiTinh;
            } catch (err) {
                console.error(err);
                alert("Không thể tải thông tin tài khoản.");
            }
        },

        async submitForm() {
            try {
                const res = await apiClient.put('/taikhoan/capnhat',
                    {
                        hoVaTen: this.hoVaTen,
                        email: this.email,
                        soDienThoai: this.phone
                    },
                    { withCredentials: true }
                );

                alert("Thông tin đã được cập nhật!");
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || "Lỗi cập nhật thông tin");
            }
        }
    }
};
</script>


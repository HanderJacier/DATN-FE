<template>
    <!--Nav-->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Đơn mua</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Hóa đơn mua hàng</li>
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
                            <li><router-link to="/doimatkhau" class="text-dark text-decoration-none">Đổi mật
                                    khẩu</router-link></li>
                        </ul>

                        <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li><router-link to="/lichsumuahang" class="text-primary text-decoration-none">> Lịch sử mua
                                    hàng</router-link></li>
                            <li><router-link to="/hoadon" class="text-dark text-decoration-none">Hóa đơn mua
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

            <!-- Lịch sử đơn hàng -->
            <div id="app" class="col-md-9">
                <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>
                <form @submit.prevent="submitForm"></form>
                <!-- Bọc ngoài bằng thẻ có nền trắng, bo góc -->
                <div class="border rounded-4 p-1 mb-2 bg-white">
                    <div class="bg-white rounded-pill px-2 py-1 d-flex justify-content-between overflow-auto"
                        style="white-space: nowrap;">
                        <a href="#" class="px-3 py-2 text-decoration-none text-dark fw-normal">Tất cả</a>
                        <a href="#"
                            class="px-3 py-2 text-decoration-none text-dark fw-bold border-bottom border-2 border-dark">Đang
                            xử lý</a>
                        <a href="#" class="px-3 py-2 text-decoration-none text-dark fw-normal">Đang giao</a>
                        <a href="#" class="px-3 py-2 text-decoration-none text-dark fw-normal">Đã giao</a>
                        <a href="#" class="px-3 py-2 text-decoration-none text-dark fw-normal">Đã hủy</a>
                        <a href="#" class="px-3 py-2 text-decoration-none text-dark fw-normal">Trả hàng</a>
                    </div>
                </div>


                <!-- Đơn hàng 1 -->
                <div class="border rounded-4 p-3 mb-4 bg-white">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">12/10/2024</small>
                        <small class="text-muted">• 2 sản phẩm</small>
                    </div>

                    <!-- Sản phẩm 1 -->
                    <div class="d-flex mb-3 ">
                        <img src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-16-pro_1.png"
                            class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" alt="iPhone">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">iPhone 16 Pro 128GB</h6>
                            <small class="text-muted">Số lượng: 1</small>
                        </div>
                        <div class="text-end">
                            <div>25.290.000 đ</div>
                            <small class="text-muted text-decoration-line-through">28.990.000 đ</small>
                        </div>
                    </div>

                    <!-- Sản phẩm 2 -->
                    <div class="d-flex mb-3">
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_1__2.png"
                            class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;"
                            alt="Apple Watch Band">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Samsung Galaxy S25 256GB</h6>
                            <small class="text-muted">Số lượng: 1</small>
                        </div>
                        <div class="text-end">
                            <div>2.390.000 đ</div>
                            <small class="text-muted text-decoration-line-through">2.790.000 đ</small>
                        </div>
                    </div>

                    <!-- Tổng tiền + Mua lại -->
                    <div class="d-flex justify-content-between align-items-center border-top pt-2">
                        <strong>Thành tiền: 27.680.000 đ</strong>
                        <button class="btn btn-primary btn-sm">Mua lại</button>
                    </div>
                </div>

                <!-- Đơn hàng 2 -->
                <div class="border rounded-4 p-3 mb-4 bg-white">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">02/04/2025</small>
                        <small class="text-muted">• 1 sản phẩm</small>
                    </div>

                    <!-- Sản phẩm -->
                    <div class="d-flex mb-3">
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_1_3__3.png   "
                            class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;"
                            alt="Chuột không dây">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">Chuột không dây Logitech Signature M650 Size M</h6>
                            <small class="text-muted">Số lượng: 2</small>
                        </div>
                        <div class="text-end">
                            <div>150.000 đ</div>
                            <small class="text-muted text-decoration-line-through">200.000 đ</small>
                        </div>
                    </div>

                    <!-- Tổng tiền + Mua lại -->
                    <div class="d-flex justify-content-between align-items-center border-top pt-2">
                        <strong>Thành tiền: 300.000 đ</strong>
                        <button class="btn btn-primary btn-sm">Mua lại</button>
                    </div>
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
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',
        };
    },
    methods: {
        submitForm() {
            alert(`Thông tin đã cập nhật:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}`);
        },
    },
};
</script>

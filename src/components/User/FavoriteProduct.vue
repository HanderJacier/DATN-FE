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
            <li class="breadcrumb-item active text-muted" aria-current="page">Sản phẩm yêu thích</li>
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

            <!--sản phẩm yêu thích -->
            <div class="col-md-9">
                <h4 class="fw-bold mb-4">Danh sách sản phẩm yêu thích</h4>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    <div class="col" v-for="(product, index) in favoriteProducts" :key="index">
                        <div class="card shadow-sm" style="max-height: 480px;">
                            <img :src="product.image" class="card-img-top" :alt="product.name" />

                            <div class="card-body py-2 px-3">
                                <h6 class="card-title fw-bold mb-2" style="font-size: 14px;">{{ product.name }}</h6>

                                <div class="d-flex align-items-center mb-1" style="font-size: 14px;">
                                    <span class="text-muted text-decoration-line-through me-2">{{ product.originalPrice
                                        }}</span>
                                    <span class="text-danger fw-bold">{{ product.discount }}</span>
                                </div>

                                <p class="fw-bold text-danger mb-2" style="font-size: 18px;">{{ product.salePrice }}</p>
                            </div>

                            <div
                                class="card-footer d-flex justify-content-between align-items-center border-0 py-2 px-3">
                                <button class="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                    style="width: 40px; height: 35px;" @click="addToCart(product)">
                                    <i class="bi bi-cart fs-5"></i>
                                </button>

                                <button class="btn btn-primary w-75" style="font-size: 14px;"
                                    @click="removeProduct(index)">
                                    Xoá sản phẩm
                                </button>
                            </div>
                        </div>
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
            /* Thông tin cá nhân */
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',

            /* Danh sách sản phẩm yêu thích */
            favoriteProducts: [
                {
                    name: 'Tivi Xiaomi A Pro 4K 55 inch QLED 2025',
                    originalPrice: '5.390.000 đ',
                    salePrice: '4.090.000 đ',
                    discount: '-24%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/5/5/55_1_1.png',
                },
                {
                    name: 'Google Tivi Sony 4K 43 inch (K-43S30)',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/o/google-tivi-sony-k-43s30-4k-43-inch_5_.png',
                },
                {
                    name: 'Smart Tivi NanoCell LG 4K 55 inch 55NANO76SQA    ',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/6/5/65578dfv.png',
                },
                {
                    name: 'Tivi Xiaomi A 4K 2025 55 inch',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/_/1_691.png',
                },
                {
                    name: 'Smart Tivi Samsung UHD 4K 43 inch 2024 (43DU7000)',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/smart_tivi_oled_lg_4k_48_inch_oled48a3psa_4.png',
                },
                {
                    name: 'Tivi Xiaomi A Pro 4K 43 inch QLED 2026',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/i/tivi-xiaomi-qled-4k-a-pro-43-inch-2026_1_.png',
                },
                {
                    name: 'Smart Tivi Samsung QLED 4K 55 inch 2024 (55Q60D)',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/smart_tivi_qned_lg_4k_65_inch_65qned86sra_36_.png',
                },
                {
                    name: 'Google tivi TCL 4K 55 inch 2024 (55P638)',
                    originalPrice: '10.990.000 đ',
                    salePrice: '9.290.000 đ',
                    discount: '-15%',
                    image:
                        'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/o/google-tivi-tcl-55p638-4k-55-inch-2024_2__1.png',
                },
            ],
        };
    },

    methods: {
        /* Lưu thông tin cá nhân */
        submitForm() {
            alert(`Thông tin đã cập nhật:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}`);
        },

        /* Thêm sản phẩm vào giỏ */
        addToCart(product) {
            alert(`Đã thêm "${product.name}" vào giỏ hàng`);
            // TODO: Gọi API hoặc mutation Vuex để thêm vào giỏ thực tế (nếu có)
        },

        /* Xoá sản phẩm khỏi danh sách yêu thích */
        removeProduct(index) {
            this.favoriteProducts.splice(index, 1);
        },
    },
};
</script>

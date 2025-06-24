<template>

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Giỏ hàng</li>
        </ol>
    </nav>

    <div class="container my-4 mt-5">
        <div class="row">
            <!-- Danh sách sản phẩm -->
            <div class="col-lg-8">
                <div class="d-flex align-items-center mb-3">
                    <input type="checkbox" class="form-check-input me-2" v-model="selectAll" @change="toggleAll" />
                    <label class="form-check-label fw-semibold">
                        Chọn tất cả ({{ selectedQuantity }})
                    </label>
                </div>

                <!-- Danh sách sản phẩm -->
                <div v-for="(item, index) in cart" :key="index" class="card mb-3">
                    <div class="bg-white rounded p-3 mb-3">
                        <div class="d-flex align-items-center">
                            <input class="form-check-input me-3" type="checkbox" v-model="item.selected">
                            <img :src="item.image" class="product-img me-3" style="width: 100px; height: 100px;"
                                :alt="item.name">
                            <div class="flex-grow-1">
                                <div class="fw-semibold text-wrap text-break w-75">
                                    {{ item.name }}
                                </div>
                                <select class="form-select form-select-sm mt-3 bg-light" style="width: 150px;">
                                    <option selected>Phân loại: {{ item.variant }}</option>
                                </select>
                            </div>
                            <div class="text-end px-2">
                                <div class="text-danger fw-bold">{{ formatPrice(item.price) }} đ</div>
                                <div class="text-secondary text-decoration-line-through" style="font-size: 0.9em;">
                                    {{ formatPrice(item.originalPrice) }} đ
                                </div>
                            </div>
                            <div class="ms-3 d-flex align-items-center px-2">
                                <button class="btn btn-outline-secondary btn-sm" @click="decreaseQty(index)">−</button>
                                <span class="mx-2">{{ item.quantity }}</span>
                                <button class="btn btn-outline-secondary btn-sm" @click="increaseQty(index)">+</button>
                            </div>
                            <button class="btn btn-sm btn-outline-danger ms-3" @click="removeItem(index)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Thông tin đơn hàng -->
            <div class="col-lg-4">
                <div class="card p-3">
                    <button class="btn btn-light d-flex justify-content-between align-items-center mb-3">
                        <span><i class="bi bi-percent text-danger me-2"></i>Chọn hoặc nhập ưu đãi</span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <h6 class="fw-bold">Thông tin đơn hàng</h6>
                    <div class="d-flex justify-content-between py-2">
                        <span>Tổng tiền</span>
                        <span class="text-danger fw-bold">{{ formatPrice(totalPrice) }} đ</span>
                    </div>
                    <div class="d-flex justify-content-between py-2 border-top">
                        <span>Tổng khuyến mãi</span>
                        <span>0 đ</span>
                    </div>
                    <div class="d-flex justify-content-between py-2 border-top fw-bold">
                        <span>Cần thanh toán</span>
                        <span class="text-danger fs-5">{{ formatPrice(totalPrice) }} đ</span>
                    </div>
                    <button class="btn btn-primary w-50 mt-3 mx-auto">Thanh toán</button>
                </div>
            </div>
        </div>

        <!-- Thông tin cam kết -->
        <div class="row text-center mt-5">
            <div v-for="(info, index) in guarantees" :key="index" class="col-6 col-md-3 mb-3">
                <div class="text-danger fs-3">
                    <i :class="info.icon"></i>
                </div>
                <div class="fw-bold">{{ info.title }}</div>
                <div>{{ info.subtitle }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ProductCarousel',
    data() {
        return {
            selectAll: true,
            cart: [
                {
                    name: 'Chuột Gaming không dây Logitech G304 Lightspeed',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_36__2.png',
                    variant: 'Đen',
                    price: 439000,
                    originalPrice: 499000,
                    quantity: 1,
                    selected: true
                },
                {
                    name: 'Chuột gaming Logitech Pro X Superlight 2 Lightspeed',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-gaming-logitech-pro-x-superlight-2-lightspeed-2.png',
                    variant: 'Đen',
                    price: 439000,
                    originalPrice: 499000,
                    quantity: 1,
                    selected: true
                },
                {
                    name: 'Chuột không dây Dareu LM115G',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-khong-day-dareu-lm115g_1_.png',
                    variant: 'Đen',
                    price: 439000,
                    originalPrice: 499000,
                    quantity: 1,
                    selected: true
                }
            ],
            guarantees: [
                {
                    icon: 'bi bi-bookmark-fill',
                    title: 'Thương hiệu đảm bảo',
                    subtitle: 'Nhập khẩu, bảo hành chính hãng'
                },
                {
                    icon: 'bi bi-house-door-fill',
                    title: 'Giao hàng tận nhà',
                    subtitle: 'Tại 63 tỉnh thành'
                },
                {
                    icon: 'bi bi-check-square-fill',
                    title: 'Sản phẩm chất lượng',
                    subtitle: 'Đảm bảo tương thích và độ bền cao'
                },
                {
                    icon: 'bi bi-arrow-repeat',
                    title: 'Đổi trả dễ dàng',
                    subtitle: 'Theo chính sách đổi trả tại FPT Shop'
                }
            ]
        };
    },
    computed: {
        totalPrice() {
            return this.cart.reduce((total, item) => {
                return item.selected ? total + item.price * item.quantity : total;
            }, 0);
        },
        totalQuantity() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        selectedQuantity() {
            return this.cart.reduce((sum, item) => item.selected ? sum + item.quantity : sum, 0);
        }
    },
    methods: {
        formatPrice(val) {
            return val.toLocaleString('vi-VN');
        },
        increaseQty(index) {
            this.cart[index].quantity++;
        },
        decreaseQty(index) {
            if (this.cart[index].quantity > 1) this.cart[index].quantity--;
        },
        removeItem(index) {
            this.cart.splice(index, 1);
        },
        toggleAll() {
            this.cart.forEach(item => (item.selected = this.selectAll));
        }
    }
};
</script>

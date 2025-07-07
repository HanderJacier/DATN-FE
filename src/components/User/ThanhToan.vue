<template>

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Giỏ hàng</li>
        </ol>
    </nav>

    <div class="text-start ms-5 mt-4">
        <RouterLink to="/giohang" class="text-primary text-decoration-none d-inline-flex align-items-center">
            <i class="bi bi-chevron-left"></i>
            <span class="ms-1">Quay lại giỏ hàng</span>
        </RouterLink>
    </div>

    <div class="container my-4">
        <div class="row">
            <!-- DANH SÁCH SẢN PHẨM -->
            <div class="col-12 mb-4">
                <div class="card shadow-sm border-0 p-3 bg-light rounded-4">
                    <div class="d-flex align-items-center mb-3">
                        <label class="form-check-label fw-semibold">
                            Tổng sản phẩm ({{ selectedQuantity }})
                        </label>
                    </div>

                    <div v-for="(item, index) in cart" :key="index" class="d-flex align-items-center mb-3">
                        <img :src="item.image" class="rounded border"
                            style="width: 100px; height: 100px; object-fit: contain" :alt="item.name" />
                        <div class="ms-3 flex-grow-1">
                            <div class="fw-semibold">{{ item.name }}</div>
                            <div>
                                <span class="badge bg-light text-dark border mt-1 px-2 py-1" style="font-size: 13px">
                                    Phân loại: {{ item.variant }}
                                </span>
                            </div>
                        </div>
                        <div class="text-muted me-5">x{{ item.quantity }}</div>
                        <div class="text-end">
                            <div class="fw-bold text-danger">{{ formatPrice(item.price) }} đ</div>
                            <div class="text-decoration-line-through text-muted small">
                                {{ formatPrice(item.originalPrice) }} đ
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THÔNG TIN ĐƠN HÀNG VÀ FORM -->
            <div class="col-lg-8">
                <div class="card border-0 rounded-4 p-4 bg-light">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Tên người nhận hàng</label>
                        <input type="text" class="form-control" v-model="receiverName" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Số điện thoại</label>
                        <input type="tel" class="form-control" v-model="phone" />
                    </div>

                    <p class="fw-semibold mb-2">Địa chỉ nhận hàng</p>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <select class="form-select" v-model="city">
                                <option disabled selected>Chọn tỉnh/ Thành phố</option>
                                <option value="TP.HCM">TP.HCM</option>
                                <option value="Hà Nội">Hà Nội</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <select class="form-select" v-model="district">
                                <option disabled selected>Chọn quận/huyện</option>
                                <option value="Quận 1">Quận 1</option>
                                <option value="Quận 3">Quận 3</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <select class="form-select" v-model="ward">
                                <option disabled selected>Chọn phường xã</option>
                                <option value="Phường A">Phường A</option>
                                <option value="Phường B">Phường B</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" v-model="address"
                                placeholder="Nhập tên đường/ toà nhà/ số nhà" />
                        </div>
                    </div>

                    <div class="form-check form-switch mt-4">
                        <label class="form-check-label fw-semibold">Xuất hóa đơn điện tử</label>
                        <input class="form-check-input" type="checkbox" v-model="useEInvoice" />
                    </div>

                    <div class="mt-4 w-50">
                        <label class="form-label fw-semibold">Phương thức thanh toán</label>
                        <select class="form-select" v-model="paymentMethod">
                            <option>Thanh toán khi nhận hàng</option>
                            <option>Chuyển khoản ngân hàng</option>
                            <option>Thẻ tín dụng/ Ghi nợ</option>
                            <option>Ví điện tử</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Tổng kết -->
            <div class="col-lg-4 mt-4 mt-lg-0">
                <div class="card p-3 rounded-4 shadow-sm">
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

                    <button class="btn btn-primary w-100 mt-3" @click="submitOrder">
                        Thanh toán
                    </button>
                </div>
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

</template>

<script>
export default {
    name: 'ProductCartPage',
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
            // Thông tin giao hàng
            receiverName: '',
            phone: '',
            city: '',
            district: '',
            ward: '',
            address: '',
            useEInvoice: false,
            paymentMethod: 'Thanh toán khi nhận hàng',

            // Bảo đảm sản phẩm
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
        },
        submitOrder() {
            if (!this.receiverName || !this.phone || !this.city || !this.district || !this.ward || !this.address) {
                alert('Vui lòng điền đầy đủ thông tin nhận hàng.');
                return;
            }

            alert(`Đơn hàng đã được đặt!
- Tên: ${this.receiverName}
- SĐT: ${this.phone}
- Địa chỉ: ${this.address}, ${this.ward}, ${this.district}, ${this.city}
- Hóa đơn điện tử: ${this.useEInvoice ? 'Có' : 'Không'}
- Thanh toán: ${this.paymentMethod}
- Tổng tiền: ${this.formatPrice(this.totalPrice)} đ`);
        }
    }
};
</script>

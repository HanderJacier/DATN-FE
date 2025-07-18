<template>
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
                <div v-if="cart.length === 0" class="alert alert-warning">Giỏ hàng của bạn đang trống.</div>
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
            <div class="col-lg-4" v-if="cart.length > 0">
                <div class="card p-3">
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
                    <button class="btn btn-primary w-50 mt-3 mx-auto text-center" @click="goToCheckout">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { kiemTraPhien } from '../../api';

export default {
    name: 'ProductCart',
    data() {
        return {
            selectAll: false,
            cart: []
        };
    },
    computed: {
        totalPrice() {
            return this.cart.reduce((total, item) =>
                item.selected ? total + item.price * item.quantity : total, 0);
        },
        selectedQuantity() {
            return this.cart.reduce((sum, item) =>
                item.selected ? sum + item.quantity : sum, 0);
        }
    },
    methods: {
        formatPrice(val) {
            return val.toLocaleString('vi-VN');
        },
        increaseQty(index) {
            this.cart[index].quantity++;
            this.saveCart();
        },
        decreaseQty(index) {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
                this.saveCart();
            }
        },
        removeItem(index) {
            this.cart.splice(index, 1);
            this.saveCart();
        },
        toggleAll() {
            this.cart.forEach(item => item.selected = this.selectAll);
            this.saveCart();
        },
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            window.dispatchEvent(new Event('storage')); // Cập nhật Header
        },
        
        async checkUserSession() {
            try {
                await kiemTraPhien();
                return true;
            } catch (error) {
                console.error('❌ Phiên đăng nhập không hợp lệ:', error);
                
                // Xóa thông tin user cũ
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
                
                return false;
            }
        },
        
        async goToCheckout() {
            // Kiểm tra xem có sản phẩm nào được chọn không
            const selectedItems = this.cart.filter(item => item.selected);
            if (selectedItems.length === 0) {
                alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
                return;
            }

            // Kiểm tra đăng nhập
            const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
            if (!user) {
                alert('Vui lòng đăng nhập để tiếp tục thanh toán.');
                this.$router.push("/dangnhap");
                return;
            }

            // Kiểm tra phiên đăng nhập có còn hợp lệ không
            const isSessionValid = await this.checkUserSession();
            if (!isSessionValid) {
                alert('⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                this.$router.push('/dangnhap');
                return;
            }

            // Lưu các sản phẩm được chọn vào localStorage
            localStorage.setItem('selectedCart', JSON.stringify(selectedItems));
            
            // Chuyển đến trang thanh toán
            this.$router.push("/thanhtoan");
        }
    },
    watch: {
        cart: {
            handler() {
                this.saveCart();
            },
            deep: true
        }
    },
    mounted() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
            } catch (e) {
                console.error('Không thể parse giỏ hàng:', e);
            }
        }
    }
};
</script>

<template>
    <div class="container py-4">
        <!-- Loading -->
        <div v-if="orderLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Đang xử lý đơn hàng...</p>
        </div>

        <!-- Nội dung chính -->
        <div v-else>
            <!-- Địa chỉ nhận hàng -->
            <div class="card shadow-sm mb-4">
                <div class="card-body d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="text-danger fw-bold mb-2">
                            <i class="bi bi-geo-alt-fill me-2"></i>Địa Chỉ Nhận Hàng
                        </h6>
                        <p class="mb-1">
                            <strong>{{ userInfo?.hovaten || 'Chưa cập nhật' }}</strong> 
                            <span class="text-muted">{{ userInfo?.sodienthoai || '' }}</span>
                        </p>
                        <p class="mb-0 text-muted">
                            {{ shippingAddress || 'Vui lòng cập nhật địa chỉ giao hàng' }}
                        </p>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-light text-danger border border-danger me-2">Mặc Định</span>
                        <button class="btn btn-link text-primary p-0" @click="showAddressModal = true">
                            Thay Đổi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sản phẩm -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h6 class="fw-bold mb-4">
                        <i class="bi bi-box-seam-fill text-primary me-2"></i>Sản phẩm đã chọn
                    </h6>

                    <div v-for="(item, index) in selectedItems" :key="index" class="d-flex align-items-center justify-content-between flex-wrap mb-3 pb-3" :class="{ 'border-bottom': index < selectedItems.length - 1 }">
                        <div class="d-flex align-items-center flex-grow-1">
                            <img 
                                :src="item.image || '/placeholder.svg?height=80&width=80'" 
                                :alt="item.name"
                                class="me-3 rounded" 
                                style="width: 80px; height: 80px; object-fit: cover;"
                            >
                            <div>
                                <div class="fw-semibold mb-1">{{ item.name }}</div>
                                <div class="text-muted small mb-1" v-if="item.variant">
                                    Phân loại: <span class="fw-medium">{{ item.variant }}</span>
                                </div>
                                <div class="text-muted small">
                                    Số lượng: <span class="fw-medium">{{ item.quantity }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="text-danger fw-bold fs-6">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </div>
                            <div v-if="item.originalPrice && item.originalPrice > item.price" class="text-decoration-line-through text-muted small">
                                {{ formatCurrency(item.originalPrice * item.quantity) }}
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <label class="form-label fw-semibold">Lời nhắn cho người bán</label>
                        <input 
                            type="text" 
                            class="form-control shadow-sm" 
                            v-model="orderNote"
                            placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
                            maxlength="200"
                        >
                        <div class="form-text">{{ orderNote.length }}/200 ký tự</div>
                    </div>
                </div>
            </div>

            <!-- Vận chuyển -->
            <div class="card shadow-sm mb-4">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-semibold">
                            <i class="bi bi-truck text-primary me-2"></i>
                            Phương thức vận chuyển:
                            <span class="text-primary">{{ shippingMethod.name }}</span>
                        </div>
                        <small class="text-muted">{{ shippingMethod.description }}</small>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-link text-primary p-0 me-2" @click="showShippingModal = true">
                            Thay Đổi
                        </button>
                        <div class="text-danger fw-semibold">{{ formatCurrency(shippingMethod.fee) }}</div>
                    </div>
                </div>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-bold mb-0">
                            <i class="bi bi-wallet2 me-2 text-primary"></i>Phương thức thanh toán
                        </h6>
                        <div class="text-end">
                            <span class="text-muted me-2">{{ paymentMethod.name }}</span>
                            <button class="btn btn-link text-primary p-0" @click="showPaymentModal = true">
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    <div class="border-top pt-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-secondary">Tổng tiền hàng</span>
                            <span>{{ formatCurrency(subtotal) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-secondary">Giảm giá</span>
                            <span class="text-success">-{{ formatCurrency(totalDiscount) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-secondary">Phí vận chuyển</span>
                            <span>{{ formatCurrency(shippingMethod.fee) }}</span>
                        </div>
                        <div class="d-flex justify-content-between fw-bold fs-5 border-top pt-3 mt-2">
                            <span>Tổng thanh toán</span>
                            <span class="text-danger">{{ formatCurrency(finalTotal) }}</span>
                        </div>
                    </div>

                    <p class="text-muted small mt-3">
                        Bằng việc nhấn <strong>"Đặt hàng"</strong>, bạn đã đồng ý với
                        <a href="#" class="text-decoration-none text-primary">Điều khoản sử dụng</a>.
                    </p>

                    <div class="text-end">
                        <button 
                            class="btn btn-danger px-4 py-2 shadow-sm fw-semibold"
                            @click="confirmOrder"
                            :disabled="!canPlaceOrder || orderProcessing"
                        >
                            <i class="bi bi-cart-check-fill me-1"></i>
                            {{ orderProcessing ? 'Đang xử lý...' : 'Đặt hàng' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal địa chỉ -->
        <div v-if="showAddressModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-backdrop fade show"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cập nhật địa chỉ giao hàng</h5>
                        <button type="button" class="btn-close" @click="showAddressModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Địa chỉ chi tiết</label>
                            <textarea 
                                class="form-control" 
                                rows="3" 
                                v-model="tempAddress"
                                placeholder="Nhập địa chỉ giao hàng chi tiết"
                            ></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showAddressModal = false">Hủy</button>
                        <button type="button" class="btn btn-primary" @click="updateAddress">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal vận chuyển -->
        <div v-if="showShippingModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-backdrop fade show"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chọn phương thức vận chuyển</h5>
                        <button type="button" class="btn-close" @click="showShippingModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div v-for="method in shippingMethods" :key="method.id" class="form-check mb-3">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                :id="'shipping-' + method.id"
                                :value="method"
                                v-model="tempShippingMethod"
                            >
                            <label class="form-check-label d-flex justify-content-between w-100" :for="'shipping-' + method.id">
                                <div>
                                    <div class="fw-semibold">{{ method.name }}</div>
                                    <small class="text-muted">{{ method.description }}</small>
                                </div>
                                <div class="text-danger fw-semibold">{{ formatCurrency(method.fee) }}</div>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showShippingModal = false">Hủy</button>
                        <button type="button" class="btn btn-primary" @click="updateShipping">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal thanh toán -->
        <div v-if="showPaymentModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-backdrop fade show"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chọn phương thức thanh toán</h5>
                        <button type="button" class="btn-close" @click="showPaymentModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div v-for="method in paymentMethods" :key="method.id" class="form-check mb-3">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                :id="'payment-' + method.id"
                                :value="method"
                                v-model="tempPaymentMethod"
                            >
                            <label class="form-check-label d-flex align-items-center" :for="'payment-' + method.id">
                                <i :class="method.icon" class="me-2 fs-4"></i>
                                <div>
                                    <div class="fw-semibold">{{ method.name }}</div>
                                    <small class="text-muted">{{ method.description }}</small>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showPaymentModal = false">Hủy</button>
                        <button type="button" class="btn btn-primary" @click="updatePayment">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal thành công -->
        <div v-if="showSuccessModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-backdrop fade show"></div>
            <div class="modal-dialog modal-lg">
                <div class="modal-content text-center">
                    <div class="modal-body p-5">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                        <h3 class="mt-3 text-success">Đặt hàng thành công!</h3>
                        <p class="text-muted">Mã đơn hàng: <strong>HD{{ String(orderId).padStart(3, '0') }}</strong></p>
                        <p class="text-muted">Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!</p>
                        
                        <!-- Hiển thị thông tin thanh toán MoMo nếu có -->
                        <div v-if="paymentResult && paymentResult.payUrl" class="mt-4">
                            <h5>Thanh toán MoMo</h5>
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <img :src="paymentResult.qrCodeUrl" alt="QR Code" class="img-fluid mb-3">
                                    <p class="small text-muted">Quét mã QR để thanh toán</p>
                                    <a :href="paymentResult.payUrl" target="_blank" class="btn btn-primary">
                                        Thanh toán ngay
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button class="btn btn-primary" @click="goToOrderHistory">Xem đơn hàng</button>
                        <button class="btn btn-secondary" @click="continueShopping">Tiếp tục mua sắm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePayment from '../LoadDB/usePayment.js'
import useUserProfile from '../LoadDB/useUserProfile.js'

export default {
    name: 'XacNhanDonHang',
    setup() {
        const router = useRouter()
        
        const {
            orderLoading,
            paymentLoading,
            processOrder
        } = usePayment()

        const {
            userInfo,
            fetchUserProfile
        } = useUserProfile()

        // Reactive data
        const selectedItems = ref([])
        const orderNote = ref('')
        const shippingAddress = ref('')
        const tempAddress = ref('')
        const orderProcessing = ref(false)
        const showAddressModal = ref(false)
        const showShippingModal = ref(false)
        const showPaymentModal = ref(false)
        const showSuccessModal = ref(false)
        const orderId = ref(null)
        const paymentResult = ref(null)

        // Shipping methods
        const shippingMethods = ref([
            {
                id: 1,
                name: 'Giao hàng tiêu chuẩn',
                description: 'Giao hàng trong 3-5 ngày làm việc',
                fee: 30000
            },
            {
                id: 2,
                name: 'Giao hàng nhanh',
                description: 'Giao hàng trong 1-2 ngày làm việc',
                fee: 50000
            },
            {
                id: 3,
                name: 'Giao hàng hỏa tốc',
                description: 'Giao hàng trong ngày (khu vực nội thành)',
                fee: 80000
            }
        ])

        const shippingMethod = ref(shippingMethods.value[0])
        const tempShippingMethod = ref(shippingMethods.value[0])

        // Payment methods
        const paymentMethods = ref([
            {
                id: 1,
                name: 'Thanh toán khi nhận hàng (COD)',
                description: 'Thanh toán bằng tiền mặt khi nhận hàng',
                icon: 'bi bi-cash-coin text-success'
            },
            {
                id: 2,
                name: 'Thanh toán MoMo',
                description: 'Thanh toán qua ví điện tử MoMo',
                icon: 'bi bi-phone text-danger'
            },
            {
                id: 3,
                name: 'Chuyển khoản ngân hàng',
                description: 'Chuyển khoản qua ngân hàng',
                icon: 'bi bi-bank text-primary'
            }
        ])

        const paymentMethod = ref(paymentMethods.value[0])
        const tempPaymentMethod = ref(paymentMethods.value[0])

        // Computed properties
        const subtotal = computed(() => 
            selectedItems.value.reduce((total, item) => 
                total + (item.originalPrice || item.price) * item.quantity, 0
            )
        )

        const totalDiscount = computed(() => 
            selectedItems.value.reduce((total, item) => 
                total + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
            )
        )

        const finalTotal = computed(() => 
            selectedItems.value.reduce((total, item) => 
                total + item.price * item.quantity, 0
            ) + shippingMethod.value.fee
        )

        const canPlaceOrder = computed(() => 
            selectedItems.value.length > 0 && 
            shippingAddress.value.trim() !== '' &&
            userInfo.value
        )

        // Methods
        const loadSelectedItems = () => {
            try {
                const saved = localStorage.getItem('selectedCart')
                if (saved) {
                    selectedItems.value = JSON.parse(saved)
                } else {
                    // Nếu không có sản phẩm được chọn, chuyển về giỏ hàng
                    router.push('/giohang')
                }
            } catch (e) {
                console.error('Lỗi khi tải sản phẩm đã chọn:', e)
                router.push('/giohang')
            }
        }

        const loadUserInfo = async () => {
            const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
            if (user && user.id_tk) {
                await fetchUserProfile(user.id_tk)
                // Set default address if available
                if (userInfo.value && !shippingAddress.value) {
                    shippingAddress.value = 'Địa chỉ mặc định - Vui lòng cập nhật địa chỉ giao hàng chi tiết'
                }
            }
        }

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(value || 0)
        }

        const updateAddress = () => {
            if (tempAddress.value.trim()) {
                shippingAddress.value = tempAddress.value.trim()
                showAddressModal.value = false
            }
        }

        const updateShipping = () => {
            shippingMethod.value = tempShippingMethod.value
            showShippingModal.value = false
        }

        const updatePayment = () => {
            paymentMethod.value = tempPaymentMethod.value
            showPaymentModal.value = false
        }

        const confirmOrder = async () => {
            if (!canPlaceOrder.value) {
                alert('Vui lòng kiểm tra lại thông tin đơn hàng')
                return
            }

            orderProcessing.value = true

            try {
                const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
                
                const orderData = {
                    userId: user.id_tk,
                    products: selectedItems.value.map(item => ({
                        id: item.id,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    totalAmount: finalTotal.value,
                    paymentMethod: paymentMethod.value.id === 2 ? 'MOMO' : 'COD',
                    note: orderNote.value.trim(),
                    orderInfo: `Thanh toán đơn hàng - ${selectedItems.value.length} sản phẩm`
                }

                const result = await processOrder(orderData)

                if (result.success) {
                    orderId.value = result.orderId
                    paymentResult.value = result.payUrl ? result : null
                    
                    // Xóa sản phẩm đã đặt khỏi giỏ hàng
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                    const remainingCart = cart.filter(cartItem => 
                        !selectedItems.value.some(selectedItem => selectedItem.id === cartItem.id)
                    )
                    localStorage.setItem('cart', JSON.stringify(remainingCart))
                    localStorage.removeItem('selectedCart')
                    
                    // Dispatch event để cập nhật header
                    window.dispatchEvent(new Event('storage'))
                    
                    showSuccessModal.value = true
                } else {
                    alert(result.message || 'Đặt hàng thất bại, vui lòng thử lại')
                }
            } catch (error) {
                console.error('Lỗi khi đặt hàng:', error)
                alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại')
            } finally {
                orderProcessing.value = false
            }
        }

        const goToOrderHistory = () => {
            showSuccessModal.value = false
            router.push('/thongtintk/hoadon')
        }

        const continueShopping = () => {
            showSuccessModal.value = false
            router.push('/')
        }

        // Lifecycle
        onMounted(() => {
            loadSelectedItems()
            loadUserInfo()
        })

        return {
            selectedItems,
            orderNote,
            shippingAddress,
            tempAddress,
            orderLoading,
            orderProcessing,
            showAddressModal,
            showShippingModal,
            showPaymentModal,
            showSuccessModal,
            orderId,
            paymentResult,
            userInfo,
            shippingMethods,
            shippingMethod,
            tempShippingMethod,
            paymentMethods,
            paymentMethod,
            tempPaymentMethod,
            subtotal,
            totalDiscount,
            finalTotal,
            canPlaceOrder,
            formatCurrency,
            updateAddress,
            updateShipping,
            updatePayment,
            confirmOrder,
            goToOrderHistory,
            continueShopping
        }
    }
}
</script>

<style scoped>
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.card {
    transition: box-shadow 0.2s;
}

.card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-check-input:checked {
    background-color: #007bff;
    border-color: #007bff;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .d-flex.justify-content-between {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .text-end {
        text-align: left !important;
        margin-top: 0.5rem;
    }
}
</style>

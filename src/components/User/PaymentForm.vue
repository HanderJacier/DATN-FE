<template>
    <div class="container my-4 mt-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Progress Steps -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="step-item completed">
                            <div class="step-circle">
                                <i class="bi bi-check"></i>
                            </div>
                            <span class="step-label">Xác nhận đơn hàng</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step-item completed">
                            <div class="step-circle">
                                <i class="bi bi-check"></i>
                            </div>
                            <span class="step-label">Thanh toán</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step-item completed">
                            <div class="step-circle">
                                <i class="bi bi-check"></i>
                            </div>
                            <span class="step-label">Hoàn thành</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header bg-success text-white text-center">
                        <h4 class="mb-0">
                            <i class="bi bi-check-circle-fill"></i>
                            Đặt hàng thành công!
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="text-center">
                            <!-- Success Icon -->
                            <div class="mb-4">
                                <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                            </div>

                            <!-- Success Message -->
                            <h3 class="text-success mb-3">Cảm ơn bạn đã đặt hàng!</h3>
                            <p class="text-muted mb-4">
                                Đơn hàng của bạn đã được xử lý thành công và hóa đơn đã được tự động tạo.
                            </p>
                            
                            <!-- Order Info -->
                            <div v-if="orderInfo" class="alert alert-info">
                                <h6 class="fw-bold mb-2">Thông tin đơn hàng</h6>
                                <p class="mb-1"><strong>Mã đơn hàng:</strong> HD{{ String(orderInfo.orderId).padStart(6, '0') }}</p>
                                <p class="mb-1"><strong>Tổng tiền:</strong> {{ formatPrice(orderInfo.totalAmount) }} đ</p>
                                <p class="mb-0"><strong>Phương thức:</strong> {{ orderInfo.paymentMethod }}</p>
                            </div>

                            <!-- Order Items -->
                            <div v-if="orderItems && orderItems.length > 0" class="mb-4">
                                <h6 class="fw-bold">Sản phẩm đã đặt:</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Đơn giá</th>
                                                <th>SL</th>
                                                <th>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="product in orderItems" :key="product.id">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <img :src="product.image" style="width: 40px; height: 40px; object-fit: cover;" 
                                                             class="me-2 rounded" :alt="product.name" @error="handleImageError">
                                                        <div>
                                                            <div class="fw-semibold small">{{ product.name }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{{ formatPrice(product.price) }} đ</td>
                                                <td class="text-center">{{ product.quantity }}</td>
                                                <td class="fw-bold">{{ formatPrice(product.price * product.quantity) }} đ</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Auto redirect notice -->
                            <div class="alert alert-warning">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Bạn sẽ được chuyển về trang chủ sau {{ countdown }} giây...</strong>
                            </div>

                            <!-- Next Steps -->
                            <div class="mt-4 p-3 bg-light rounded">
                                <h6 class="fw-bold">
                                    <i class="bi bi-clock"></i>
                                    Các bước tiếp theo
                                </h6>
                                <div class="text-start">
                                    <!-- <div class="mb-2">
                                        <i class="bi bi-1-circle text-primary me-2"></i>
                                        Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút để xác nhận đơn hàng
                                    </div> -->
                                    <div class="mb-2">
                                        <i class="bi bi-2-circle text-primary me-2"></i>
                                        Đơn hàng sẽ được chuẩn bị và đóng gói cẩn thận
                                    </div>
                                    <div class="mb-2">
                                        <i class="bi bi-3-circle text-primary me-2"></i>
                                        Thời gian giao hàng dự kiến: 1-3 ngày làm việc
                                    </div>
                                    <div>
                                        <i class="bi bi-4-circle text-primary me-2"></i>
                                        Bạn có thể tra cứu trạng thái đơn hàng bằng số điện thoại
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="mt-4 d-flex flex-wrap justify-content-center gap-3">
                                <button type="button" class="btn btn-primary btn-lg" @click="goHome">
                                    <i class="bi bi-house me-2"></i>Về trang chủ ngay
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-lg" @click="continueShopping">
                                    <i class="bi bi-shop me-2"></i>Tiếp tục mua sắm
                                </button>
                                <button type="button" class="btn btn-info btn-lg" @click="trackOrder">
                                    <i class="bi bi-search me-2"></i>Tra cứu đơn hàng
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
    name: 'PaymentSuccess',
    setup() {
        const router = useRouter()
        const countdown = ref(5)
        const orderInfo = ref(null)
        const orderItems = ref([])
        let countdownInterval = null
        
        const formatPrice = (val) => {
            return val.toLocaleString('vi-VN')
        }

        const handleImageError = (event) => {
            event.target.src = '/placeholder.svg?height=40&width=40'
        }

        const goHome = () => {
            clearInterval(countdownInterval)
            router.push('/')
        }

        const continueShopping = () => {
            clearInterval(countdownInterval)
            router.push('/timkiem')
        }

        const trackOrder = () => {
            clearInterval(countdownInterval)
            router.push('/hoadonchitiet')
        }

        const loadOrderInfo = () => {
            try {
                // Load order info from localStorage if available
                const savedOrderData = localStorage.getItem('orderData')
                const savedOrderResult = localStorage.getItem('orderResult')
                
                if (savedOrderData) {
                    const orderData = JSON.parse(savedOrderData)
                    orderItems.value = orderData.items || []
                    orderInfo.value = {
                        totalAmount: orderData.totalAmount || 0,
                        paymentMethod: getPaymentMethodText(orderData.paymentMethod)
                    }
                }

                if (savedOrderResult) {
                    const result = JSON.parse(savedOrderResult)
                    if (orderInfo.value) {
                        orderInfo.value.orderId = result.orderId
                    } else {
                        orderInfo.value = {
                            orderId: result.orderId,
                            totalAmount: 0,
                            paymentMethod: 'Không xác định'
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading order info:', error)
            }
        }

        const getPaymentMethodText = (method) => {
            switch (method) {
                case 'COD':
                    return 'Thanh toán khi nhận hàng'
                case 'BANK':
                    return 'Chuyển khoản ngân hàng'
                case 'QR':
                    return 'Thanh toán QR Code'
                default:
                    return 'Không xác định'
            }
        }

        const startCountdown = () => {
            countdownInterval = setInterval(() => {
                countdown.value--
                if (countdown.value <= 0) {
                    clearInterval(countdownInterval)
                    router.push('/')
                }
            }, 1000)
        }

        onMounted(() => {
            loadOrderInfo()
            startCountdown()
        })

        onUnmounted(() => {
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }
        })

        return {
            countdown,
            orderInfo,
            orderItems,
            formatPrice,
            handleImageError,
            goHome,
            continueShopping,
            trackOrder
        }
    }
}
</script>

<style scoped>
.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #28a745;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
}

.step-line {
    height: 2px;
    background-color: #28a745;
    flex: 1;
    margin: 0 10px;
    margin-top: 20px;
}

.step-label {
    font-size: 0.875rem;
    text-align: center;
    color: #495057;
    font-weight: 500;
}

.card {
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .container {
        padding: 0 10px;
    }
    
    .step-item {
        font-size: 0.8rem;
    }
    
    .step-circle {
        width: 35px;
        height: 35px;
        font-size: 0.9rem;
    }
    
    .table-responsive {
        font-size: 0.9em;
    }
    
    .d-flex.gap-3 {
        gap: 0.5rem !important;
    }
    
    .btn {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }
}
</style>
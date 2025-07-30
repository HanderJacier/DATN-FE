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
                            {{ getSuccessTitle() }}
                        </h4>
                    </div>
                    <div class="card-body">
                        <!-- Loading -->
                        <div v-if="loading" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2">Đang tải thông tin đơn hàng...</p>
                        </div>

                        <!-- Success Content -->
                        <div v-else-if="orderInfo" class="text-center">
                            <!-- Success Icon -->
                            <div class="mb-4">
                                <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                            </div>

                            <!-- Success Message -->
                            <h3 class="text-success mb-3">{{ getSuccessMessage() }}</h3>
                            <p class="text-muted mb-4">
                                Mã đơn hàng: <strong class="text-primary">HD{{ String(orderInfo.id_hd).padStart(6, '0') }}</strong>
                            </p>

                            <!-- Payment Status Alert -->
                            <div v-if="paymentInfo.phuongthuc === 'COD'" class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>Lưu ý:</strong> Vui lòng chuẩn bị đủ tiền mặt {{ formatPrice(paymentInfo.sotien) }} đ khi nhận hàng
                            </div>
                            
                            <div v-else-if="paymentInfo.phuongthuc === 'BANK'" class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Thông tin chuyển khoản đã được ghi nhận</strong><br>
                                Vui lòng chuyển khoản trong vòng 24h để được giao hàng nhanh nhất
                            </div>

                            <div v-else-if="paymentInfo.phuongthuc === 'QR'" class="alert alert-success">
                                <i class="bi bi-check-circle"></i>
                                <strong>Thanh toán QR Code đã được xử lý</strong><br>
                                Đơn hàng sẽ được chuẩn bị và giao trong thời gian sớm nhất
                            </div>

                            <!-- Order Details -->
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <h6 class="card-title fw-bold">
                                                <i class="bi bi-person"></i>
                                                Thông tin khách hàng
                                            </h6>
                                            <p class="card-text mb-1"><strong>Họ tên:</strong> {{ orderInfo.hoveten }}</p>
                                            <p class="card-text mb-1"><strong>SĐT:</strong> {{ orderInfo.sodienthoai }}</p>
                                            <p class="card-text mb-1"><strong>Email:</strong> {{ orderInfo.email || 'Không có' }}</p>
                                            <p class="card-text mb-0"><strong>Địa chỉ:</strong> {{ orderInfo.diachi || 'Không có' }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <h6 class="card-title fw-bold">
                                                <i class="bi bi-receipt"></i>
                                                Chi tiết đơn hàng
                                            </h6>
                                            <p class="card-text mb-1"><strong>Ngày đặt:</strong> {{ formatDate(orderInfo.ngaytao) }}</p>
                                            <p class="card-text mb-1"><strong>Tổng tiền:</strong> {{ formatPrice(orderInfo.giahoadon) }} đ</p>
                                            <p class="card-text mb-1"><strong>Thanh toán:</strong> {{ getPaymentMethodText(paymentInfo.phuongthuc) }}</p>
                                            <p class="card-text mb-0"><strong>Trạng thái:</strong> 
                                                <span class="badge bg-warning">{{ orderInfo.trangthai }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Products List -->
                            <div v-if="orderProducts && orderProducts.length > 0" class="mt-4">
                                <h6 class="fw-bold text-start">
                                    <i class="bi bi-bag-check"></i>
                                    Sản phẩm đã đặt ({{ orderProducts.length }} sản phẩm)
                                </h6>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Đơn giá</th>
                                                <th>Số lượng</th>
                                                <th>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="product in orderProducts" :key="product.id_hdct">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <img :src="product.anhgoc" style="width: 40px; height: 40px; object-fit: cover;" 
                                                             class="me-2 rounded" :alt="product.tensanpham" @error="handleImageError">
                                                        <div>
                                                            <div class="fw-semibold">{{ product.tensanpham }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{{ formatPrice(product.dongia) }} đ</td>
                                                <td class="text-center">{{ product.soluong }}</td>
                                                <td class="fw-bold">{{ formatPrice(product.thanhtien) }} đ</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Next Steps -->
                            <div class="mt-4 p-3 bg-light rounded">
                                <h6 class="fw-bold">
                                    <i class="bi bi-clock"></i>
                                    Các bước tiếp theo
                                </h6>
                                <div class="text-start">
                                    <div class="mb-2">
                                        <i class="bi bi-1-circle text-primary me-2"></i>
                                        Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút để xác nhận đơn hàng
                                    </div>
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
                            <div class="mt-4 d-flex flex-wrap justify-content-center gap-2">
                                <button type="button" class="btn btn-primary" @click="goHome">
                                    <i class="bi bi-house"></i> Về trang chủ
                                </button>
                                <button type="button" class="btn btn-outline-primary" @click="continueShopping">
                                    <i class="bi bi-shop"></i> Tiếp tục mua sắm
                                </button>
                                <button type="button" class="btn btn-info" @click="trackOrder">
                                    <i class="bi bi-search"></i> Tra cứu đơn hàng
                                </button>
                                <button type="button" class="btn btn-success" @click="downloadInvoice">
                                    <i class="bi bi-download"></i> Tải hóa đơn
                                </button>
                            </div>
                        </div>

                        <!-- Error State -->
                        <div v-else class="text-center py-4">
                            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                            <h5 class="mt-3">Không tìm thấy thông tin đơn hàng</h5>
                            <p class="text-muted">Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hỗ trợ</p>
                            <router-link to="/" class="btn btn-primary">
                                <i class="bi bi-house"></i> Về trang chủ
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostData } from '../component_callApi/callAPI'


export default {
    name: 'PaymentSuccess',
    setup() {
        const router = useRouter()
        const route = useRoute()
        
        const loading = ref(true)
        const orderInfo = ref(null)
        const paymentInfo = ref({})
        const orderProducts = ref([])

        // Methods
        const formatPrice = (val) => {
            return val.toLocaleString('vi-VN')
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const handleImageError = (event) => {
            event.target.src = '/placeholder.svg?height=40&width=40'
        }

        const getSuccessTitle = () => {
            if (!paymentInfo.value.phuongthuc) return 'Đặt hàng thành công'
            
            switch (paymentInfo.value.phuongthuc) {
                case 'COD':
                    return 'Đặt hàng thành công'
                case 'BANK':
                    return 'Xác nhận chuyển khoản thành công'
                case 'QR':
                    return 'Thanh toán thành công'
                default:
                    return 'Đặt hàng thành công'
            }
        }

        const getSuccessMessage = () => {
            if (!paymentInfo.value.phuongthuc) return 'Cảm ơn bạn đã đặt hàng!'
            
            switch (paymentInfo.value.phuongthuc) {
                case 'COD':
                    return 'Cảm ơn bạn đã đặt hàng!'
                case 'BANK':
                    return 'Thông tin chuyển khoản đã được ghi nhận!'
                case 'QR':
                    return 'Cảm ơn bạn đã thanh toán!'
                default:
                    return 'Cảm ơn bạn đã đặt hàng!'
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
        const callAPI = usePostData()
        const loadOrderDetails = async () => {
            try {
                const orderId = route.params.orderId
                if (!orderId) {
                    console.error('No order ID provided')
                    return
                }

                console.log('Loading order details for ID:', orderId)

                const result = await callAPI('WBH_US_SEL_CHI_TIET_DON_HANG', {
                    p_id_hd: parseInt(orderId)
                })

                console.log('Order details result:', result)

                if (result.success && result.data && result.data.length > 0) {
                    // First result set: Order info
                    if (result.data[0] && result.data[0].length > 0) {
                        orderInfo.value = result.data[0][0]
                    }

                    // Second result set: Order products
                    if (result.data[1] && result.data[1].length > 0) {
                        orderProducts.value = result.data[1]
                    }

                    // Third result set: Payment info
                    if (result.data[2] && result.data[2].length > 0) {
                        paymentInfo.value = result.data[2][0]
                    }

                    console.log('Loaded order info:', orderInfo.value)
                    console.log('Loaded payment info:', paymentInfo.value)
                    console.log('Loaded products:', orderProducts.value)
                } else {
                    console.error('No order data found')
                }
            } catch (error) {
                console.error('Error loading order details:', error)
            } finally {
                loading.value = false
            }
        }

        const goHome = () => {
            router.push('/')
        }

        const continueShopping = () => {
            router.push('/sanpham')
        }

        const trackOrder = () => {
            router.push('/tra-cuu-don-hang')
        }

        const downloadInvoice = () => {
            // TODO: Implement invoice download
            alert('Tính năng tải hóa đơn sẽ được cập nhật sớm!')
        }

        onMounted(() => {
            loadOrderDetails()
        })

        return {
            loading,
            orderInfo,
            paymentInfo,
            orderProducts,
            formatPrice,
            formatDate,
            handleImageError,
            getSuccessTitle,
            getSuccessMessage,
            getPaymentMethodText,
            goHome,
            continueShopping,
            trackOrder,
            downloadInvoice
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
    
    .d-flex.gap-2 {
        gap: 0.5rem !important;
    }
    
    .btn {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }
}
</style>

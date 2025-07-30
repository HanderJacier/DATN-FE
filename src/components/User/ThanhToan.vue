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
                        <div class="step-item active">
                            <div class="step-circle">2</div>
                            <span class="step-label">Thanh toán</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-item">
                            <div class="step-circle">3</div>
                            <span class="step-label">Hoàn thành</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">
                            <i class="bi bi-credit-card"></i>
                            Thanh toán đơn hàng
                        </h4>
                    </div>
                    <div class="card-body">
                        <!-- Loading -->
                        <div v-if="processing" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2">Đang xử lý thanh toán...</p>
                        </div>

                        <!-- Main content -->
                        <div v-else>
                            <!-- Order Summary -->
                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">
                                    <i class="bi bi-receipt"></i>
                                    Thông tin đơn hàng
                                </h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="border p-3 rounded bg-light">
                                            <h6 class="fw-bold">Thông tin khách hàng:</h6>
                                            <p class="mb-1"><strong>Họ tên:</strong> {{ orderData.customerInfo.name }}</p>
                                            <p class="mb-1"><strong>SĐT:</strong> {{ orderData.customerInfo.phone }}</p>
                                            <p class="mb-1"><strong>Email:</strong> {{ orderData.customerInfo.email || 'Không có' }}</p>
                                            <p class="mb-0"><strong>Địa chỉ:</strong> {{ orderData.customerInfo.address }}</p>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="border p-3 rounded bg-light">
                                            <h6 class="fw-bold">Chi tiết đơn hàng:</h6>
                                            <p class="mb-1"><strong>Số lượng:</strong> {{ orderData.items.length }} sản phẩm</p>
                                            <p class="mb-1"><strong>Tạm tính:</strong> {{ formatPrice(subtotal) }} đ</p>
                                            <p class="mb-1"><strong>Giảm giá:</strong> -{{ formatPrice(discount) }} đ</p>
                                            <p class="mb-0 fs-5 text-danger"><strong>Tổng cộng:</strong> {{ formatPrice(finalAmount) }} đ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Methods -->
                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">
                                    <i class="bi bi-wallet2"></i>
                                    Chọn phương thức thanh toán
                                </h5>
                                
                                <!-- COD -->
                                <div class="form-check payment-method mb-3" :class="{ 'selected': paymentMethod === 'COD' }">
                                    <input class="form-check-input" type="radio" name="paymentMethod" 
                                           id="cod" value="COD" v-model="paymentMethod">
                                    <label class="form-check-label w-100" for="cod">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-cash text-success me-3" style="font-size: 1.5rem;"></i>
                                            <div class="flex-grow-1">
                                                <strong>Thanh toán khi nhận hàng (COD)</strong>
                                                <div class="text-muted small mt-1">
                                                    • Thanh toán bằng tiền mặt khi nhận hàng<br>
                                                    • Kiểm tra hàng trước khi thanh toán<br>
                                                    • Phí COD: Miễn phí
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-success">Phổ biến</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <!-- Bank Transfer -->
                                <div class="form-check payment-method mb-3" :class="{ 'selected': paymentMethod === 'BANK' }">
                                    <input class="form-check-input" type="radio" name="paymentMethod" 
                                           id="bank" value="BANK" v-model="paymentMethod">
                                    <label class="form-check-label w-100" for="bank">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-bank text-primary me-3" style="font-size: 1.5rem;"></i>
                                            <div class="flex-grow-1">
                                                <strong>Chuyển khoản ngân hàng</strong>
                                                <div class="text-muted small mt-1">
                                                    • Chuyển khoản trước khi giao hàng<br>
                                                    • Thông tin TK sẽ được gửi qua SMS/Email<br>
                                                    • Giảm 2% phí thanh toán
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-info">Giảm 2%</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <!-- QR Code -->
                                <div class="form-check payment-method mb-3" :class="{ 'selected': paymentMethod === 'QR' }">
                                    <input class="form-check-input" type="radio" name="paymentMethod" 
                                           id="qr" value="QR" v-model="paymentMethod">
                                    <label class="form-check-label w-100" for="qr">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-qr-code text-warning me-3" style="font-size: 1.5rem;"></i>
                                            <div class="flex-grow-1">
                                                <strong>Thanh toán QR Code</strong>
                                                <div class="text-muted small mt-1">
                                                    • Quét mã QR để thanh toán<br>
                                                    • Hỗ trợ các ví điện tử phổ biến<br>
                                                    • Thanh toán nhanh chóng, an toàn
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-warning">Nhanh</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Payment Details -->
                            <div v-if="paymentMethod" class="mb-4">
                                <!-- Bank Transfer Details -->
                                <div v-if="paymentMethod === 'BANK'" class="alert alert-info">
                                    <h6 class="fw-bold">
                                        <i class="bi bi-info-circle"></i>
                                        Thông tin chuyển khoản
                                    </h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-2">
                                                <strong>Ngân hàng:</strong> Vietcombank
                                                <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard('Vietcombank')">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Số TK:</strong> 1234567890
                                                <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard('1234567890')">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Chủ TK:</strong> CÔNG TY ABC
                                                <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard('CÔNG TY ABC')">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-2">
                                                <strong>Số tiền:</strong> {{ formatPrice(finalAmount) }} đ
                                                <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard(finalAmount.toString())">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Nội dung CK:</strong> {{ transferContent }}
                                                <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard(transferContent)">
                                                    <i class="bi bi-clipboard"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <small class="text-muted">
                                        * Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý nhanh chóng
                                    </small>
                                </div>

                                <!-- QR Code Details -->
                                <div v-if="paymentMethod === 'QR'" class="alert alert-warning text-center">
                                    <h6 class="fw-bold">
                                        <i class="bi bi-qr-code"></i>
                                        Quét mã QR để thanh toán
                                    </h6>
                                    <div class="qr-code-container my-3">
                                        <img src="/src/assets/cart.png" 
                                             alt="QR Code" class="img-fluid" style="max-width: 200px;">
                                    </div>
                                    <p class="mb-0">
                                        <strong>Số tiền:</strong> {{ formatPrice(finalAmount) }} đ<br>
                                        <small class="text-muted">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</small>
                                    </p>
                                </div>

                                <!-- COD Details -->
                                <div v-if="paymentMethod === 'COD'" class="alert alert-success">
                                    <h6 class="fw-bold">
                                        <i class="bi bi-cash"></i>
                                        Thanh toán khi nhận hàng
                                    </h6>
                                    <p class="mb-0">
                                        Bạn sẽ thanh toán <strong>{{ formatPrice(finalAmount) }} đ</strong> bằng tiền mặt khi nhận hàng.<br>
                                        <small class="text-muted">Vui lòng chuẩn bị đủ tiền mặt khi shipper giao hàng.</small>
                                    </p>
                                </div>
                            </div>

                            <!-- Terms Agreement -->
                            <div class="mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="agreeTerms">
                                    <label class="form-check-label" for="agreeTerms">
                                        Tôi đồng ý với 
                                        <a href="#" class="text-primary">điều khoản và điều kiện</a> 
                                        của cửa hàng và xác nhận thông tin thanh toán là chính xác
                                    </label>
                                </div>
                            </div>

                            <!-- Action buttons -->
                            <div class="d-flex justify-content-between">
                                <router-link to="/xacnhandonhang" class="btn btn-outline-secondary">
                                    <i class="bi bi-arrow-left"></i>
                                    Quay lại
                                </router-link>
                                <button type="button" class="btn btn-success btn-lg" 
                                        @click="processPayment" 
                                        :disabled="processing || !paymentMethod || !agreeTerms">
                                    <i class="bi bi-credit-card"></i>
                                    {{ processing ? 'Đang xử lý...' : getPaymentButtonText() }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Messages -->
        <div v-if="errorMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
            </div>
        </div>

        <!-- Success Messages -->
        <div v-if="successMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePayment from '../User/LoadDB/usePayment.js'

export default {
    name: 'Payment',
    setup() {
        const router = useRouter()
        const { processPayment: executePayment, processing } = usePayment()

        const orderData = ref({
            customerInfo: {},
            items: [],
            totalAmount: 0
        })
        const paymentMethod = ref('')
        const agreeTerms = ref(false)
        const errorMessage = ref('')
        const successMessage = ref('')

        // Computed properties
        const subtotal = computed(() => {
            return orderData.value.items.reduce((total, item) => total + item.originalPrice * item.quantity, 0)
        })

        const discount = computed(() => {
            let baseDiscount = subtotal.value - orderData.value.items.reduce((total, item) => total + item.price * item.quantity, 0)
            
            // Add 2% discount for bank transfer
            if (paymentMethod.value === 'BANK') {
                const bankDiscount = orderData.value.items.reduce((total, item) => total + item.price * item.quantity, 0) * 0.02
                baseDiscount += bankDiscount
            }
            
            return Math.round(baseDiscount)
        })

        const finalAmount = computed(() => {
            let total = orderData.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            
            // Apply 2% discount for bank transfer
            if (paymentMethod.value === 'BANK') {
                total = total * 0.98
            }
            
            return Math.round(total)
        })

        const transferContent = computed(() => {
            return `HD${String(Date.now()).slice(-6)} ${orderData.value.customerInfo.phone}`
        })

        // Methods
        const formatPrice = (val) => {
            return val.toLocaleString('vi-VN')
        }

        const getPaymentButtonText = () => {
            switch (paymentMethod.value) {
                case 'COD':
                    return 'Xác nhận đặt hàng'
                case 'BANK':
                    return 'Xác nhận chuyển khoản'
                case 'QR':
                    return 'Thanh toán QR Code'
                default:
                    return 'Thanh toán ngay'
            }
        }

        const copyToClipboard = async (text) => {
            try {
                await navigator.clipboard.writeText(text)
                successMessage.value = `Đã sao chép: ${text}`
                setTimeout(() => {
                    successMessage.value = ''
                }, 2000)
            } catch (err) {
                console.error('Failed to copy: ', err)
                errorMessage.value = 'Không thể sao chép. Vui lòng copy thủ công.'
            }
        }

        const processPayment = async () => {
            if (!paymentMethod.value) {
                errorMessage.value = 'Vui lòng chọn phương thức thanh toán'
                return
            }

            if (!agreeTerms.value) {
                errorMessage.value = 'Vui lòng đồng ý với điều khoản và điều kiện'
                return
            }

            try {
                const paymentData = {
                    ...orderData.value,
                    paymentMethod: paymentMethod.value,
                    finalAmount: finalAmount.value,
                    transferContent: paymentMethod.value === 'BANK' ? transferContent.value : null
                }

                console.log('Processing payment with data:', paymentData)

                const result = await executePayment(paymentData)
                
                if (result.success) {
                    // Clear order data from localStorage
                    localStorage.removeItem('orderData')
                    
                    // Navigate to success page
                    router.push(`/thanh-toan-thanh-cong/${result.orderId}`)
                } else {
                    errorMessage.value = result.message || 'Có lỗi xảy ra khi xử lý thanh toán'
                }
            } catch (error) {
                console.error('Error processing payment:', error)
                errorMessage.value = 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.'
            }
        }

        const loadOrderData = () => {
            try {
                const saved = localStorage.getItem('orderData')
                if (saved) {
                    orderData.value = JSON.parse(saved)
                    console.log('Loaded order data:', orderData.value)
                } else {
                    console.warn('No order data found, redirecting to cart')
                    router.push('/gio-hang')
                }
            } catch (error) {
                console.error('Error loading order data:', error)
                router.push('/gio-hang')
            }
        }

        onMounted(() => {
            loadOrderData()
        })

        return {
            orderData,
            paymentMethod,
            agreeTerms,
            errorMessage,
            successMessage,
            processing,
            subtotal,
            discount,
            finalAmount,
            transferContent,
            formatPrice,
            getPaymentButtonText,
            copyToClipboard,
            processPayment
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
    background-color: #e9ecef;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
}

.step-item.completed .step-circle {
    background-color: #28a745;
    color: white;
}

.step-item.active .step-circle {
    background-color: #007bff;
    color: white;
}

.step-line {
    height: 2px;
    background-color: #e9ecef;
    flex: 1;
    margin: 0 10px;
    margin-top: 20px;
}

.step-line.completed {
    background-color: #28a745;
}

.step-label {
    font-size: 0.875rem;
    text-align: center;
    color: #6c757d;
}

.step-item.completed .step-label,
.step-item.active .step-label {
    color: #495057;
    font-weight: 500;
}

.payment-method {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.payment-method:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
}

.payment-method.selected {
    border-color: #007bff;
    background-color: #e7f3ff;
}

.payment-method .form-check-input {
    margin-top: 0;
}

.qr-code-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.card {
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    
    .payment-method {
        padding: 10px;
    }
    
    .btn-lg {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }
}
</style>

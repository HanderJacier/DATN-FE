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
                            
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Bạn sẽ được chuyển về trang chủ sau 3 giây...</strong>
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

                            <!-- Action Buttons -->
                            <div class="mt-4 d-flex justify-content-center gap-3">
                                <button type="button" class="btn btn-primary btn-lg" @click="goHome">
                                    <i class="bi bi-house me-2"></i>Về trang chủ ngay
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-lg" @click="continueShopping">
                                    <i class="bi bi-shop me-2"></i>Tiếp tục mua sắm
                                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'PaymentSuccess',
    setup() {
        const router = useRouter()
        const route = useRoute()
        
        const goHome = () => {
            router.push('/')
        }

        const continueShopping = () => {
            router.push('/timkiem')
        }

        onMounted(() => {
            // Tự động chuyển về trang chủ sau 3 giây
            setTimeout(() => {
                router.push('/')
            }, 3000)
        })

        return {
            goHome,
            continueShopping
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

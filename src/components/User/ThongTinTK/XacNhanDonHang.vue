<template>
    <div class="container my-4 mt-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Progress Steps -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="step-item active">
                            <div class="step-circle">1</div>
                            <span class="step-label">Xác nhận đơn hàng</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-item">
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
                    <div class="card-header bg-warning text-dark">
                        <h4 class="mb-0">
                            <i class="bi bi-clipboard-check"></i>
                            Xác nhận đơn hàng
                        </h4>
                    </div>
                    <div class="card-body">
                        <!-- Loading -->
                        <div v-if="processing || loadingAddresses" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2">Đang xử lý...</p>
                        </div>

                        <!-- Main content -->
                        <div v-else>
                            <!-- Thông tin khách hàng -->
                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">
                                    <i class="bi bi-person"></i>
                                    Thông tin khách hàng
                                </h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="form-label">Họ và tên *</label>
                                        <input type="text" class="form-control" v-model="customerInfo.name" 
                                               :class="{ 'is-invalid': errors.name }" required>
                                        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Số điện thoại *</label>
                                        <input type="tel" class="form-control" v-model="customerInfo.phone" 
                                               :class="{ 'is-invalid': errors.phone }" required>
                                        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" v-model="customerInfo.email"
                                               :class="{ 'is-invalid': errors.email }">
                                        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Địa chỉ giao hàng *</label>
                                        <div v-if="addresses.length > 0" class="form-control" disabled>
                                            {{ customerInfo.address || 'Không có địa chỉ mặc định' }}
                                        </div>
                                        <div v-else class="form-control text-muted">
                                            Không có địa chỉ nào được lưu
                                        </div>
                                        <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="form-label">Ghi chú đơn hàng</label>
                                    <textarea class="form-control" rows="2" v-model="customerInfo.note" 
                                             placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"></textarea>
                                </div>
                            </div>

                            <!-- Danh sách sản phẩm đã chọn -->
                            <div class="mb-4">
                                <h5 class="fw-bold mb-3">
                                    <i class="bi bi-bag-check"></i>
                                    Sản phẩm đã chọn ({{ selectedItems.length }} sản phẩm)
                                </h5>
                                <div v-if="selectedItems.length === 0" class="alert alert-warning">
                                    <i class="bi bi-exclamation-triangle"></i>
                                    Không có sản phẩm nào được chọn. 
                                    <router-link to="/giohang" class="btn btn-sm btn-primary ms-2">
                                        Quay lại giỏ hàng
                                    </router-link>
                                </div>
                                <div v-else class="table-responsive">
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
                                            <tr v-for="item in selectedItems" :key="`${item.id}-${item.variant}`">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <img :src="item.image" style="width: 50px; height: 50px; object-fit: cover;" 
                                                             class="me-2 rounded" :alt="item.name" @error="handleImageError">
                                                        <div>
                                                            <div class="fw-semibold">{{ item.name }}</div>
                                                            <small class="text-muted">{{ item.variant }}</small>
                                                            <div class="text-muted small">{{ item.brand }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="text-danger fw-bold">{{ formatPrice(item.price) }} đ</div>
                                                    <div v-if="item.originalPrice && item.originalPrice > item.price" 
                                                         class="text-muted text-decoration-line-through small">
                                                        {{ formatPrice(item.originalPrice) }} đ
                                                    </div>
                                                </td>
                                                <td class="text-center">{{ item.quantity }}</td>
                                                <td class="fw-bold text-danger">{{ formatPrice(item.price * item.quantity) }} đ</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Tổng tiền -->
                            <div class="border-top pt-3 mb-4">
                                <div class="row">
                                    <div class="col-md-6 offset-md-6">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Tạm tính:</span>
                                            <span>{{ formatPrice(subtotal) }} đ</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Phí vận chuyển:</span>
                                            <span class="text-success">Miễn phí</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Khuyến mãi:</span>
                                            <span class="text-success">-{{ formatPrice(totalDiscount) }} đ</span>
                                        </div>
                                        <hr>
                                        <div class="d-flex justify-content-between fw-bold fs-5">
                                            <span>Tổng cộng:</span>
                                            <span class="text-danger">{{ formatPrice(totalPrice) }} đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action buttons -->
                            <div class="d-flex justify-content-between">
                                <router-link to="/giohang" class="btn btn-outline-secondary">
                                    <i class="bi bi-arrow-left"></i>
                                    Quay lại giỏ hàng
                                </router-link>
                                <button type="button" class="btn btn-success btn-lg" 
                                        @click="proceedToPayment" 
                                        :disabled="processing || selectedItems.length === 0">
                                    <i class="bi bi-credit-card"></i>
                                    {{ processing ? 'Đang xử lý...' : 'Xác nhận đơn hàng' }}
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
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useCartManagement from '../LoadDB/useCartManagement'
import useDiaChiTheoTaiKhoan from '../LoadDB/SELDiaChi'

export default {
    name: 'OrderConfirmation',
    setup() {
        const router = useRouter()
        const { loadCart } = useCartManagement()
        const { addresses, fetchDiaChiTheoTaiKhoan, loading: loadingAddresses, error: errorAddresses } = useDiaChiTheoTaiKhoan()

        const selectedItems = ref([])
        const processing = ref(false)
        const errorMessage = ref('')

        const customerInfo = ref({
            name: '',
            phone: '',
            email: '',
            address: '',
            note: ''
        })

        const errors = ref({})

        // Computed properties
        const subtotal = computed(() => {
            if (!selectedItems.value || !Array.isArray(selectedItems.value)) return 0
            return selectedItems.value.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0)
        })

        const totalPrice = computed(() => {
            if (!selectedItems.value || !Array.isArray(selectedItems.value)) return 0
            return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
        })

        const totalDiscount = computed(() => {
            return subtotal.value - totalPrice.value
        })

        // Methods
        const formatPrice = (val) => {
            if (typeof val !== 'number') return '0'
            return val.toLocaleString('vi-VN')
        }

        const handleImageError = (event) => {
            event.target.src = '/placeholder.svg?height=50&width=50'
        }

        const validateForm = () => {
            errors.value = {}
            let isValid = true

            if (!customerInfo.value.name || !customerInfo.value.name.trim()) {
                errors.value.name = 'Vui lòng nhập họ và tên'
                isValid = false
            }

            if (!customerInfo.value.phone || !customerInfo.value.phone.trim()) {
                errors.value.phone = 'Vui lòng nhập số điện thoại'
                isValid = false
            } else if (!/^[0-9]{10,11}$/.test(customerInfo.value.phone.trim())) {
                errors.value.phone = 'Số điện thoại không hợp lệ (10-11 số)'
                isValid = false
            }

            if (customerInfo.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.value.email)) {
                errors.value.email = 'Email không hợp lệ'
                isValid = false
            }

            if (!customerInfo.value.address || !customerInfo.value.address.trim()) {
                errors.value.address = 'Không có địa chỉ giao hàng'
                isValid = false
            }

            return isValid
        }

        const proceedToPayment = () => {
            if (!validateForm()) {
                errorMessage.value = 'Vui lòng kiểm tra lại thông tin'
                return
            }

            if (!selectedItems.value || selectedItems.value.length === 0) {
                errorMessage.value = 'Không có sản phẩm nào để đặt hàng'
                return
            }

            // Save order data to localStorage for payment page
            const orderData = {
                customerInfo: {
                    name: customerInfo.value.name.trim(),
                    phone: customerInfo.value.phone.trim(),
                    email: customerInfo.value.email ? customerInfo.value.email.trim() : '',
                    address: customerInfo.value.address.trim()
                },
                items: selectedItems.value,
                totalAmount: totalPrice.value,
                note: customerInfo.value.note || 'Đơn hàng từ website'
            }

            console.log('Saving order data:', orderData)
            localStorage.setItem('orderData', JSON.stringify(orderData))

            // Navigate to payment page
            router.push('/thanhtoan')
        }

        const loadSelectedItems = () => {
            try {
                const saved = localStorage.getItem('selectedCartItems')
                if (saved) {
                    const items = JSON.parse(saved)
                    selectedItems.value = Array.isArray(items) ? items : []
                    console.log('Loaded selected items:', selectedItems.value)
                } else {
                    console.warn('No selected items found, redirecting to cart')
                    router.push('/giohang')
                }
            } catch (error) {
                console.error('Error loading selected items:', error)
                router.push('/giohang')
            }
        }

        const loadUserInfo = async () => {
            try {
                const userData = localStorage.getItem('user') || sessionStorage.getItem('user')
                if (userData) {
                    const user = JSON.parse(userData)
                    customerInfo.value.name = user.hoveten || ''
                    customerInfo.value.phone = user.sodienthoai || ''
                    customerInfo.value.email = user.email || ''
                    const id_tk = user.id_tk || user.id || user.taikhoan
                    if (id_tk) {
                        await fetchDiaChiTheoTaiKhoan(id_tk)
                        if (addresses.value.length > 0) {
                            customerInfo.value.address = addresses.value[0].diachi // Chọn địa chỉ đầu tiên làm mặc định
                        }
                    }
                    console.log('Loaded user info:', customerInfo.value)
                }
            } catch (error) {
                console.error('Error loading user info:', error)
            }
        }

        onMounted(async () => {
            loadCart()
            loadSelectedItems()
            await loadUserInfo()
        })

        return {
            selectedItems,
            customerInfo,
            errors,
            errorMessage,
            processing,
            addresses,
            loadingAddresses,
            errorAddresses,
            subtotal,
            totalPrice,
            totalDiscount,
            formatPrice,
            handleImageError,
            proceedToPayment
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

.card {
    border: 1px solid #e0e0e0;
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 0.875em;
    margin-top: 0.25rem;
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
    
    .table-responsive {
        font-size: 0.9em;
    }
    
    .btn-lg {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }
}
</style>
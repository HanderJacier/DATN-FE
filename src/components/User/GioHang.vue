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
                
                <!-- Empty cart -->
                <div v-if="cart.length === 0" class="alert alert-warning text-center">
                    <i class="bi bi-cart-x fs-1 text-muted"></i>
                    <h5 class="mt-3">Giỏ hàng của bạn đang trống</h5>
                    <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                    <router-link to="/" class="btn btn-primary">
                        <i class="bi bi-shop"></i> Tiếp tục mua sắm
                    </router-link>
                </div>
                
                <!-- Cart items -->
                <div v-else>
                    <div v-for="(item, index) in cart" :key="`${item.id}-${item.variant}`" class="card mb-3">
                        <div class="bg-white rounded p-3">
                            <div class="d-flex align-items-center">
                                <input class="form-check-input me-3" type="checkbox" 
                                       v-model="item.selected" @change="saveCart">
                                <img :src="item.image" class="product-img me-3" 
                                     style="width: 100px; height: 100px; object-fit: cover;"
                                     :alt="item.name" @error="handleImageError">
                                <div class="flex-grow-1">
                                    <div class="fw-semibold text-wrap text-break w-75">
                                        {{ item.name }}
                                    </div>
                                    <div class="text-muted small mt-1">
                                        {{ item.brand }} - {{ item.category }}
                                    </div>
                                    <select class="form-select form-select-sm mt-2 bg-light" style="width: 200px;" disabled>
                                        <option selected>Phân loại: {{ item.variant }}</option>
                                    </select>
                                    <div v-if="item.stockQuantity" class="text-muted small mt-1">
                                        Còn lại: {{ item.stockQuantity }} sản phẩm
                                    </div>
                                </div>
                                <div class="text-end px-2">
                                    <div class="text-danger fw-bold">{{ formatPrice(item.price) }} đ</div>
                                    <div v-if="item.originalPrice > item.price" 
                                         class="text-secondary text-decoration-line-through" 
                                         style="font-size: 0.9em;">
                                        {{ formatPrice(item.originalPrice) }} đ
                                    </div>
                                </div>
                                <div class="ms-3 d-flex align-items-center px-2">
                                    <button class="btn btn-outline-secondary btn-sm" 
                                            @click="decreaseQty(index)"
                                            :disabled="item.quantity <= 1">−</button>
                                    <span class="mx-2 fw-semibold">{{ item.quantity }}</span>
                                    <button class="btn btn-outline-secondary btn-sm" 
                                            @click="increaseQty(index)">+</button>
                                </div>
                                <button class="btn btn-sm btn-outline-danger ms-3" 
                                        @click="removeItem(index)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Thông tin đơn hàng -->
            <div class="col-lg-4" v-if="cart.length > 0">
                <div class="card p-3 sticky-top" style="top: 100px;">
                    <h6 class="fw-bold">
                        <i class="bi bi-receipt"></i>
                        Thông tin đơn hàng
                    </h6>
                    
                    <div class="d-flex justify-content-between py-2">
                        <span>Tổng tiền ({{ selectedQuantity }} sản phẩm)</span>
                        <span class="text-danger fw-bold">{{ formatPrice(totalPrice) }} đ</span>
                    </div>
                    
                    <div class="d-flex justify-content-between py-2 border-top">
                        <span>Tổng khuyến mãi</span>
                        <span class="text-success">{{ formatPrice(totalDiscount) }} đ</span>
                    </div>
                    
                    <div class="d-flex justify-content-between py-2 border-top fw-bold">
                        <span>Cần thanh toán</span>
                        <span class="text-danger fs-5">{{ formatPrice(totalPrice) }} đ</span>
                    </div>
                    
                    <button class="btn btn-warning w-100 mt-3" @click="goToOrderConfirmation"
                            :disabled="selectedQuantity === 0">
                        <i class="bi bi-check-circle"></i>
                        Xác nhận đơn hàng
                    </button>
                    
                    <div class="text-center mt-2">
                        <small class="text-muted">
                            Bạn đã chọn {{ selectedQuantity }} sản phẩm
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Messages -->
        <div v-if="actionResult" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
            <div class="alert alert-dismissible fade show" 
                 :class="actionResult.success ? 'alert-success' : 'alert-danger'"
                 role="alert">
                <i :class="actionResult.success ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
                {{ actionResult.message }}
                <button type="button" class="btn-close" @click="actionResult = null"></button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useCartManagement from './LoadDB/useCartManagement.js'

export default {
    name: 'ProductCart',
    setup() {
        const router = useRouter()
        const {
            cart,
            actionResult,
            loadCart,
            saveCart,
            updateQuantity,
            removeFromCart,
            updateSelectAll,
            getSelectedItems
        } = useCartManagement()

        const selectAll = ref(false)

        // Computed properties
        const totalPrice = computed(() => {
            return cart.value.reduce((total, item) =>
                item.selected ? total + item.price * item.quantity : total, 0
            )
        })

        const totalDiscount = computed(() => {
            return cart.value.reduce((total, item) =>
                item.selected ? total + (item.originalPrice - item.price) * item.quantity : total, 0
            )
        })

        const selectedQuantity = computed(() => {
            return cart.value.reduce((sum, item) =>
                item.selected ? sum + item.quantity : sum, 0
            )
        })

        // Watch for selectAll changes
        watch(selectAll, (newVal) => {
            updateSelectAll(newVal)
        })

        // Watch cart changes to update selectAll
        watch(cart, (newCart) => {
            if (newCart.length > 0) {
                const allSelected = newCart.every(item => item.selected)
                const noneSelected = newCart.every(item => !item.selected)
                
                if (allSelected) {
                    selectAll.value = true
                } else if (noneSelected) {
                    selectAll.value = false
                } else {
                    selectAll.value = false // Indeterminate state
                }
            } else {
                selectAll.value = false
            }
        }, { deep: true })

        // Methods
        const formatPrice = (val) => {
            return val.toLocaleString('vi-VN')
        }

        const handleImageError = (event) => {
            event.target.src = '/placeholder.svg?height=100&width=100'
        }

        const increaseQty = (index) => {
            cart.value[index].quantity++
            saveCart()
        }

        const decreaseQty = (index) => {
            if (cart.value[index].quantity > 1) {
                cart.value[index].quantity--
                saveCart()
            }
        }

        const removeItem = (index) => {
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                cart.value.splice(index, 1)
                saveCart()
                
                // Dispatch event to update header cart count
                window.dispatchEvent(new CustomEvent('cartUpdated'))
            }
        }

        const toggleAll = () => {
            // selectAll watcher will handle the logic
        }

        const goToOrderConfirmation = () => {
            if (selectedQuantity.value === 0) {
                actionResult.value = {
                    success: false,
                    message: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng.'
                }
                return
            }
            

            // Lưu các sản phẩm đã chọn vào localStorage để sử dụng ở trang xác nhận
            const selectedItems = getSelectedItems()
            localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems))
            
            // Chuyển đến trang xác nhận đơn hàng
            router.push('/xacnhandonhang')
        }

        // Auto-hide action result after 5 seconds
        watch(actionResult, (newVal) => {
            if (newVal) {
                setTimeout(() => {
                    actionResult.value = null
                }, 5000)
            }
        })

        onMounted(() => {
            loadCart()

            // Listen for cart updates from other components
            window.addEventListener('cartUpdated', () => {
                loadCart()
            })
        })

        return {
            cart,
            selectAll,
            totalPrice,
            totalDiscount,
            selectedQuantity,
            actionResult,
            formatPrice,
            handleImageError,
            increaseQty,
            decreaseQty,
            removeItem,
            toggleAll,
            goToOrderConfirmation,
            saveCart
        }
    }
}
</script>

<style scoped>
.product-img {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.card {
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s ease;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.sticky-top {
    position: sticky;
}

.alert {
    border-radius: 8px;
}

.text-break {
    word-break: break-word;
}

@media (max-width: 768px) {
    .container {
        padding: 0 10px;
    }
    
    .product-img {
        width: 80px !important;
        height: 80px !important;
    }
    
    .sticky-top {
        position: relative !important;
        top: auto !important;
    }
}
</style>

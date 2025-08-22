<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h4><i class="fas fa-mobile-alt me-2"></i>MoMo Demo Payment</h4>
          </div>
          
          <div class="card-body">
            <!-- Order Info -->
            <div class="mb-4">
              <h5 class="text-center mb-3">Thông tin đơn hàng</h5>
              <div class="row">
                <div class="col-6"><strong>Mã đơn hàng:</strong></div>
                <div class="col-6">{{ orderId }}</div>
              </div>
              <div class="row">
                <div class="col-6"><strong>Số tiền:</strong></div>
                <div class="col-6 text-danger">{{ formatCurrency(amount) }}</div>
              </div>
            </div>

            <!-- Payment Status -->
            <div class="text-center mb-4">
              <div v-if="isProcessing" class="mb-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang xử lý...</span>
                </div>
                <p class="mt-2">Đang xử lý thanh toán...</p>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" 
                       :style="`width: ${progress}%`"></div>
                </div>
              </div>

              <div v-if="paymentResult" class="alert" 
                   :class="paymentResult.success ? 'alert-success' : 'alert-danger'">
                <i :class="paymentResult.success ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ paymentResult.message }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center">
              <button v-if="!isProcessing && !paymentResult" 
                      @click="startPayment" 
                      class="btn btn-primary btn-lg">
                <i class="fas fa-credit-card me-2"></i>Thanh toán MoMo
              </button>

              <div v-if="paymentResult">
                <button @click="goToSuccess" 
                        v-if="paymentResult.success"
                        class="btn btn-success me-2">
                  <i class="fas fa-check me-2"></i>Hoàn thành
                </button>
                <button @click="retryPayment" 
                        v-else
                        class="btn btn-warning me-2">
                  <i class="fas fa-redo me-2"></i>Thử lại
                </button>
                <button @click="goBack" class="btn btn-secondary">
                  <i class="fas fa-arrow-left me-2"></i>Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = ref('')
const amount = ref(0)
const isProcessing = ref(false)
const progress = ref(0)
const paymentResult = ref(null)

onMounted(() => {
  orderId.value = route.query.orderId || 'DEMO_ORDER'
  amount.value = parseInt(route.query.amount) || 0
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const startPayment = () => {
  isProcessing.value = true
  progress.value = 0
  paymentResult.value = null

  // Simulate payment progress
  const interval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(interval)
      completePayment()
    }
  }, 300)
}

const completePayment = () => {
  isProcessing.value = false
  
  // 70% success rate for demo
  const isSuccess = Math.random() > 0.3
  
  paymentResult.value = {
    success: isSuccess,
    message: isSuccess 
      ? 'Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.'
      : 'Thanh toán thất bại. Vui lòng thử lại sau.'
  }
}

const retryPayment = () => {
  paymentResult.value = null
  progress.value = 0
}

const goToSuccess = () => {
  router.push('/')
}

const goBack = () => {
  router.push('/giohang')
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.progress {
  height: 8px;
}

.btn-lg {
  padding: 12px 30px;
  font-size: 1.1rem;
}

.alert {
  border: none;
  font-weight: 500;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>

<template>
  <div class="payment-status-page">
    <div v-if="loading" class="loading-indicator">Đang xử lý thanh toán...</div>
    <div v-else class="status-content">
      <div v-if="paymentSuccess" class="success-message">
        <div class="icon-circle success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>
        <h2>Thanh toán thành công!</h2>
        <p>Đơn hàng của bạn đã được đặt và thanh toán thành công.</p>
        <p>Mã giao dịch: <strong>{{ transactionId }}</strong></p>
        <p>Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.</p>
        <router-link to="/thong-tin-tai-khoan/hoa-don" class="view-orders-button">Xem đơn hàng của tôi</router-link>
        <router-link to="/" class="continue-shopping-button">Tiếp tục mua sắm</router-link>
      </div>
      <div v-else class="error-message">
        <div class="icon-circle error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        </div>
        <h2>Thanh toán thất bại!</h2>
        <p>Đã có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch bị hủy.</p>
        <p v-if="paymentError">Chi tiết lỗi: {{ paymentError }}</p>
        <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
        <router-link to="/gio-hang" class="view-orders-button">Quay lại giỏ hàng</router-link>
        <router-link to="/" class="continue-shopping-button">Tiếp tục mua sắm</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import usePayment from '../User/LoadDB/usePayment.js'

const route = useRoute()
const { confirmPayment, loading, success, error } = usePayment()

const paymentSuccess = ref(false)
const paymentError = ref(null)
const transactionId = ref(null)

onMounted(async () => {
  const query = route.query
  const resultCode = query.resultCode // For MoMo
  const orderId = query.orderId // For MoMo
  const transId = query.transId // For MoMo

  if (resultCode === '0' && orderId && transId) {
    // MoMo successful payment
    transactionId.value = transId
    const confirmed = await confirmPayment(transId, 'SUCCESS')
    if (confirmed) {
      paymentSuccess.value = true
    } else {
      paymentSuccess.value = false
      paymentError.value = 'Xác nhận thanh toán MoMo thất bại tại hệ thống.'
    }
  } else if (resultCode && resultCode !== '0') {
    // MoMo failed or cancelled payment
    paymentSuccess.value = false
    paymentError.value = `Giao dịch MoMo thất bại. Mã lỗi: ${resultCode}`
  } else {
    // Handle other payment methods or direct order confirmation
    // For COD, it might just be a direct redirect after order creation
    // For now, assume if no MoMo params, it's a successful COD or direct order
    const isCodSuccess = sessionStorage.getItem('codOrderSuccess')
    if (isCodSuccess === 'true') {
      paymentSuccess.value = true
      transactionId.value = 'COD-' + Date.now() // Mock transaction ID for COD
      sessionStorage.removeItem('codOrderSuccess') // Clear flag
    } else {
      paymentSuccess.value = false
      paymentError.value = 'Không tìm thấy thông tin thanh toán hợp lệ.'
    }
  }
})
</script>

<style scoped>
.payment-status-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px); /* Adjust based on header/footer height */
  background-color: #f0f2f5;
  padding: 20px;
}

.loading-indicator {
  font-size: 1.5em;
  color: #007bff;
  text-align: center;
}

.status-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
}

.success-icon {
  background-color: #d4edda;
  color: #28a745;
}

.error-icon {
  background-color: #f8d7da;
  color: #dc3545;
}

.icon-circle svg {
  width: 48px;
  height: 48px;
}

h2 {
  font-size: 2.2em;
  margin-bottom: 15px;
}

.success-message h2 {
  color: #28a745;
}

.error-message h2 {
  color: #dc3545;
}

p {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 10px;
}

p strong {
  color: #333;
}

.view-orders-button,
.continue-shopping-button {
  display: inline-block;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  text-decoration: none;
  margin: 15px 10px 0;
  transition: background-color 0.3s ease;
}

.view-orders-button {
  background-color: #007bff;
  color: white;
}

.view-orders-button:hover {
  background-color: #0056b3;
}

.continue-shopping-button {
  background-color: #6c757d;
  color: white;
}

.continue-shopping-button:hover {
  background-color: #5a6268;
}
</style>

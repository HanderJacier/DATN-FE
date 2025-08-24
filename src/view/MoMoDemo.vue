<template>
  <div class="momo-container">
    <div class="momo-header">
      <img src="https://developers.momo.vn/static/images/logo-momo.png" alt="MoMo Logo" class="momo-logo" />
      <h4 class="momo-title">Thanh toán MoMo</h4>
    </div>
    <div class="momo-content">
      <div class="order-info">
        <h5 class="section-title">Thông tin thanh toán</h5>
        <div class="info-row">
          <span class="label">Mã đơn hàng:</span>
          <span class="value">{{ orderId }}</span>
        </div>
        <div class="info-row">
          <span class="label">Số tiền:</span>
          <span class="value text-danger">{{ formatCurrency(amount) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Nội dung:</span>
          <span class="value">Thanh toán đơn hàng</span>
        </div>
      </div>
      <div class="qr-section text-center">
        <img :src="qrCodeUrl" alt="MoMo QR Code" class="qr-code" />
        <p class="qr-instruction">Quét mã QR bằng ứng dụng MoMo để thanh toán (Demo)</p>
      </div>
      <div class="text-center" v-if="isProcessing">
        <div class="spinner-border text-momo" role="status"></div>
        <p class="mt-2">Đang xử lý thanh toán...</p>
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated bg-momo" :style="`width: ${progress}%`"></div>
        </div>
      </div>
      <div v-if="paymentResult" class="alert mt-3" :class="paymentResult.success ? 'alert-success' : 'alert-danger'">
        <i :class="paymentResult.success ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ paymentResult.message }}
      </div>
      <div class="action-buttons text-center">
        <button v-if="!isProcessing && !paymentResult" @click="startPayment" class="btn btn-momo btn-lg">
          <i class="fas fa-credit-card me-2"></i>Thanh toán ngay
        </button>
        <div v-if="paymentResult" class="mt-3">
          <button @click="goToSuccess" v-if="paymentResult.success" class="btn btn-success me-2">
            <i class="fas fa-check me-2"></i>Hoàn thành
          </button>
          <button @click="retryPayment" v-else class="btn btn-warning me-2">
            <i class="fas fa-redo me-2"></i>Thử lại
          </button>
          <button @click="goBack" class="btn btn-secondary">
            <i class="fas fa-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>
    </div>
    <div class="momo-footer">
      <p>Powered by <strong>MoMo</strong> - Dịch vụ thanh toán an toàn và nhanh chóng</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const orderId = ref('');
const hoadonId = ref('');
const amount = ref(0);
const qrCodeUrl = ref('');
const isProcessing = ref(false);
const progress = ref(0);
const paymentResult = ref(null);

onMounted(() => {
  orderId.value = route.query.orderId || 'DEMO_ORDER';
  hoadonId.value = route.query.hoadonId || '';
  amount.value = parseInt(route.query.amount) || 0;
  qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const startPayment = () => {
  isProcessing.value = true;
  progress.value = 0;
  paymentResult.value = null;

  const interval = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(interval);
      completePayment();
    }
  }, 300);
};

const completePayment = () => {
  isProcessing.value = false;
  const isSuccess = Math.random() > 0.3;
  paymentResult.value = {
    success: isSuccess,
    message: isSuccess ? 'Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.' : 'Thanh toán thất bại. Vui lòng thử lại sau.',
  };
};

const goToSuccess = () => {
  const returnUrl = `/return?status=success&orderId=${orderId.value}&hoadonId=${hoadonId.value}&resultCode=0&message=Thanh%20toán%20thành%20công`;
  router.push(returnUrl);
};

const retryPayment = () => {
  paymentResult.value = null;
  progress.value = 0;
};

const goBack = () => {
  router.push('/giohang');
};
</script>

<style scoped>
.momo-container {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.momo-header {
  background: linear-gradient(90deg, #a50064, #d81b60);
  color: white;
  padding: 20px;
  text-align: center;
}

.momo-logo {
  max-width: 120px;
  margin-bottom: 10px;
}

.momo-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.momo-content {
  padding: 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.info-row .label {
  color: #666;
}

.info-row .value {
  font-weight: 500;
  color: #333;
}

.qr-section {
  margin: 20px 0;
}

.qr-code {
  max-width: 200px;
  border: 2px solid #a50064;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}

.qr-instruction {
  color: #666;
  font-size: 0.9rem;
  margin-top: 10px;
}

.action-buttons .btn-momo {
  background: #a50064;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.3s;
}

.action-buttons .btn-momo:hover {
  background: #d81b60;
}

.action-buttons .btn-success {
  background: #28a745;
  border: none;
  border-radius: 8px;
}

.action-buttons .btn-warning {
  background: #ffc107;
  border: none;
  border-radius: 8px;
}

.action-buttons .btn-secondary {
  background: #6c757d;
  border: none;
  border-radius: 8px;
}

.progress {
  height: 8px;
  margin-top: 15px;
  background: #f0f0f0;
  border-radius: 4px;
}

.progress-bar.bg-momo {
  background: #a50064;
}

.spinner-border.text-momo {
  color: #a50064;
}

.momo-footer {
  background: #f8f8f8;
  padding: 15px;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
}

.momo-footer strong {
  color: #a50064;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

@media (max-width: 576px) {
  .momo-container {
    margin: 20px;
  }

  .momo-logo {
    max-width: 100px;
  }

  .momo-title {
    font-size: 1.3rem;
  }

  .qr-code {
    max-width: 150px;
  }
}
</style>
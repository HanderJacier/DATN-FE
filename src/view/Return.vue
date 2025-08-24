<template>
  <div class="return-container">
    <div class="card">
      <div class="card-body text-center">
        <div v-if="loading">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-gray">Đang xử lý kết quả thanh toán...</p>
        </div>
        <div v-else-if="success">
          <i class="bi bi-check-circle-fill text-primary" style="font-size: 4rem;"></i>
          <h3 class="mt-3 text-primary">Thanh toán thành công!</h3>
          <p class="text-gray">Mã đơn hàng: <strong>{{ orderId }}</strong></p>
          <p class="text-gray">Mã giao dịch: <strong>{{ transactionId }}</strong></p>
          <p v-if="invoiceNumber" class="text-gray">Số hóa đơn: <strong>{{ invoiceNumber }}</strong></p>
          <router-link to="/" class="btn btn-primary mt-3">
            <i class="bi bi-house-fill me-2"></i>Về trang chủ
          </router-link>
        </div>
        <div v-else>
          <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
          <h3 class="mt-3 text-primary">Thanh toán thất bại!</h3>
          <p class="text-gray">{{ errorMessage }}</p>
          <router-link to="/giohang" class="btn btn-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Quay lại giỏ hàng
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostData } from "../components/component_callApi/callAPI";

const route = useRoute();
const router = useRouter();
const { data: updateResponse, callAPI } = usePostData();

const loading = ref(true);
const success = ref(false);
const orderId = ref('');
const transactionId = ref('');
const invoiceNumber = ref('');
const errorMessage = ref('');

onMounted(async () => {
  try {
    const resultCode = parseInt(route.query.resultCode) || 1;
    const orderIdFromQuery = route.query.orderId;
    const hoadonId = route.query.hoadonId;
    const message = route.query.message || 'Lỗi không xác định';

    const pending = JSON.parse(localStorage.getItem('pendingMoMoOrder')) || {};
    orderId.value = hoadonId || pending.hoadonId;

    if (!orderId.value) {
      errorMessage.value = 'Không tìm thấy đơn hàng';
      loading.value = false;
      return;
    }

    const callbackRequest = {
      params: {
        p_orderId: orderIdFromQuery,
        p_resultCode: resultCode,
        p_message: message,
      },
    };

    await callAPI("WBH_US_UPD_MOMO_CALLBACK", callbackRequest);
    const updateResult = updateResponse.value[0];

    if (updateResult.resultCode === 0) {
      success.value = true;
      transactionId.value = orderIdFromQuery;

      const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder')) || {};
      const invoiceRequest = {
        params: {
          p_id_hd: orderId.value,
          p_id_hoa_don: orderId.value,
          p_khach_hang: pendingOrder.customerInfo?.name || 'Khách hàng',
          p_so_dien_thoai: pendingOrder.customerInfo?.phone || '',
          p_email: pendingOrder.customerInfo?.email || null,
          p_dia_chi: pendingOrder.customerInfo?.address || '',
          p_phuong_thuc_thanh_toan: "MOMO",
          p_tong_tien: pendingOrder.finalAmount || 0,
          p_ma_giao_dich: orderIdFromQuery,
          p_chi_tiet_san_pham: JSON.stringify(
            pendingOrder.items?.map(item => ({
              ten_san_pham: item.name,
              so_luong: item.quantity,
              don_gia: item.price,
              thanh_tien: item.price * item.quantity,
            })) || []
          ),
        },
      };

      await callAPI("WBH_US_CRT_HOA_DON_DIEN_TU", invoiceRequest);
      const invoiceResult = updateResponse.value[0];

      if (invoiceResult.rtn_value === 0) {
        invoiceNumber.value = invoiceResult.invoice_number;
      }

      localStorage.removeItem('pendingMoMoOrder');
      localStorage.removeItem('pendingOrder');
    } else {
      success.value = false;
      errorMessage.value = updateResult.message || 'Cập nhật trạng thái thất bại';
    }
  } catch (err) {
    success.value = false;
    errorMessage.value = err.message || 'Lỗi xử lý callback';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.return-container {
  max-width: 600px;
  margin: 40px auto;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.card-body {
  padding: 30px;
}

.text-primary {
  color: #007bff !important;
}

.text-gray {
  color: #6c757d !important;
}

.btn-primary {
  background: #007bff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #007bff;
}

.bi-check-circle-fill, .bi-x-circle-fill {
  margin-bottom: 15px;
}

h3 {
  font-size: 1.8rem;
  font-weight: 600;
}

p {
  font-size: 1rem;
  margin-bottom: 10px;
}

@media (max-width: 576px) {
  .card-body {
    padding: 20px;
  }

  h3 {
    font-size: 1.5rem;
  }

  .bi-check-circle-fill, .bi-x-circle-fill {
    font-size: 3rem;
  }
}
</style>
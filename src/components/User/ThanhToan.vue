<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Thông tin khách hàng -->
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header">Thông tin khách hàng</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ và tên *</label>
                <input v-model="orderData.customerInfo.name" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại *</label>
                <input v-model="orderData.customerInfo.phone" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input v-model="orderData.customerInfo.email" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input v-model="orderData.customerInfo.address" class="form-control" required />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea v-model="orderData.note" class="form-control"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Phương thức thanh toán -->
        <div class="card mb-4">
          <div class="card-header">Phương thức thanh toán</div>
          <div class="card-body">
            <div class="form-check mb-2">
              <input v-model="paymentMethod" value="COD" type="radio" class="form-check-input" id="cod" />
              <label class="form-check-label" for="cod">Thanh toán khi nhận hàng (COD)</label>
            </div>
            <div class="form-check mb-2">
              <input v-model="paymentMethod" value="MOMO" type="radio" class="form-check-input" id="momo" />
              <label class="form-check-label" for="momo">Thanh toán MoMo</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header">Tóm tắt đơn hàng</div>
          <div class="card-body">
            <div v-for="item in orderData.items" :key="item.id" class="mb-2">
              <p><strong>{{ item.name }}</strong> x {{ item.quantity }}</p>
              <p>{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
            <hr />
            <p><strong>Tổng tiền:</strong> {{ formatPrice(finalAmount) }}</p>
            <div class="form-check mb-3">
              <input v-model="agreeTerms" type="checkbox" class="form-check-input" id="terms" />
              <label class="form-check-label" for="terms">Tôi đồng ý với điều khoản và điều kiện</label>
            </div>
            <button @click="processPayment" :disabled="processing || !agreeTerms" class="btn btn-primary w-100">
              <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
              {{ getPaymentButtonText() }}
            </button>
            <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success mt-2">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import Swal from "sweetalert2";
import { taoHoaDon, taoThanhToanMoMo } from "../../api.js";
import usePayment from "./LoadDB/usePayment.js"; // COD file cũ giữ nguyên

export default {
  name: "Payment",
  setup() {
    const router = useRouter();
    const { processPayment: processCOD, processing } = usePayment();

    const orderData = ref({
      customerInfo: { name: "", phone: "", email: "", address: "", id_tk: null },
      items: [],
      note: "",
    });
    const paymentMethod = ref("");
    const agreeTerms = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    const finalAmount = computed(() =>
      Math.round(orderData.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
    );

    const formatPrice = (val) =>
      val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const getPaymentButtonText = () =>
      paymentMethod.value === "MOMO" ? "Thanh toán MoMo" : "Xác nhận đặt hàng";

    // Xử lý payment
    const processPayment = async () => {
      if (!paymentMethod.value) {
        errorMessage.value = "Vui lòng chọn phương thức thanh toán";
        return;
      }
      if (!agreeTerms.value) {
        errorMessage.value = "Vui lòng đồng ý với điều khoản và điều kiện";
        return;
      }
      if (!orderData.value.items.length) {
        errorMessage.value = "Không có sản phẩm để thanh toán";
        return;
      }

      errorMessage.value = "";
      try {
        if (paymentMethod.value === "COD") {
          await processCOD({ ...orderData.value, finalAmount: finalAmount.value });
          successMessage.value = "Đặt hàng COD thành công!";
        } else if (paymentMethod.value === "MOMO") {
          processing.value = true;
          const res = await taoThanhToanMoMo({ ...orderData.value, finalAmount: finalAmount.value });
          if (res.data && res.data.payUrl) {
            localStorage.setItem("pendingMoMoOrder", JSON.stringify({ ...orderData.value, hoadonId: res.data.hoadonId }));
            await Swal.fire({
              title: "Thanh toán MoMo (Demo)",
              html: `
                <div class="text-center">
                  <p>Chọn cách thanh toán MoMo:</p>
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary" id="momo-app">Mở app</button>
                    <button class="btn btn-outline-primary" id="momo-web">Thanh toán web</button>
                  </div>
                  <img src="${res.data.qrCodeUrl}" style="max-width:200px;" />
                </div>
              `,
              icon: "info",
              showCancelButton: true,
              cancelButtonText: "Hủy",
              showConfirmButton: false,
              didOpen: () => {
                document.getElementById("momo-app").onclick = () => {
                  window.location.href = res.data.deeplink;
                  Swal.close();
                };
                document.getElementById("momo-web").onclick = () => {
                  window.location.href = res.data.payUrl;
                  Swal.close();
                };
              },
             didClose: () => {
  window.location.href = "http://localhost:5173/"; // Quay về frontend
}

            });
          } else {
            errorMessage.value = "Không tạo được thanh toán MoMo";
          }
          processing.value = false;
        }
      } catch (err) {
        errorMessage.value = "Lỗi xử lý thanh toán: " + err.message;
        processing.value = false;
      }
    };

    // Load dữ liệu order
    onMounted(() => {
      const saved = localStorage.getItem("orderData");
      if (saved) orderData.value = JSON.parse(saved);
      else router.replace("/"); // không có order → về trang chủ
    });

    // Bắt back button / rời trang
    onBeforeRouteLeave((to, from, next) => {
      if (paymentMethod.value === "MOMO") {
        next("/");
      } else {
        next();
      }
    });

    return {
      orderData,
      paymentMethod,
      agreeTerms,
      errorMessage,
      successMessage,
      processing,
      finalAmount,
      formatPrice,
      getPaymentButtonText,
      processPayment,
    };
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}
.btn {
  padding: 10px 20px;
}
.text-danger,
.text-success {
  font-size: 0.9rem;
}
</style>

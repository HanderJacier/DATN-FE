<template>
  <div class="container text-center mt-5">
    <div v-if="loading" class="spinner-border text-primary" role="status"></div>

    <div v-else>
      <div v-if="status === 'SUCCESS'" class="alert alert-success">
        ✅ Thanh toán thành công!
      </div>
      <div v-else class="alert alert-danger">
        ❌ Thanh toán thất bại!
      </div>
      <router-link to="/" class="btn btn-primary mt-3">Về trang chủ</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostData } from "../component_callApi/callAPI";

export default {
  name: "ReturnPayment",
  setup() {
    const route = useRoute();
    const { data: apiResponse, callAPI } = usePostData();

    const loading = ref(true);
    const status = ref("");

    const updatePaymentStatus = async () => {
      try {
        const resultCode = route.query.resultCode;
        const orderId = route.query.orderId;

        // Lấy pending order
        const pending = JSON.parse(localStorage.getItem("pendingMoMoOrder") || "{}");
        const hoadonId = pending.hoadonId || null;

        if (!orderId || !hoadonId) {
          status.value = "FAIL";
          return;
        }

        if (resultCode == 0) {
          // Thanh toán thành công
          await callAPI("WBH_US_UPD_THANH_TOAN", {
            params: {
              p_hoadon: hoadonId,
              p_trangthai: "SUCCESS",
              p_magiaodich: orderId,
            },
          });

          await callAPI("WBH_US_UPD_DAT_HANG", {
            params: {
              p_hoadon: hoadonId,
              p_trangthai: "DA_THANH_TOAN",
            },
          });

          status.value = "SUCCESS";
          localStorage.removeItem("pendingMoMoOrder");
        } else {
          // Thanh toán thất bại
          await callAPI("WBH_US_UPD_THANH_TOAN", {
            params: {
              p_hoadon: hoadonId,
              p_trangthai: "FAILED",
              p_magiaodich: orderId,
            },
          });
          status.value = "FAIL";
        }
      } catch (err) {
        status.value = "FAIL";
      } finally {
        loading.value = false;
      }
    };

    onMounted(updatePaymentStatus);

    return {
      loading,
      status,
    };
  },
};
</script>

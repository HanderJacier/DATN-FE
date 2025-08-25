<template>
  <div class="container py-5">
    <h2 class="mb-3">Kết quả thanh toán</h2>

    <div v-if="loading">Đang xác nhận giao dịch, vui lòng chờ...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else class="text-success">
      ✅ Thanh toán thành công cho hóa đơn #{{ hoadonId }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostData } from "../component_callApi/callAPI";

const loading = ref(true);
const error = ref("");
const hoadonId = ref(null);

const { data: apiResponse, callAPI } = usePostData();

onMounted(async () => {
  try {
    // 1. Lấy dữ liệu pending trong localStorage
    const pending = localStorage.getItem("pendingMoMoOrder");
    if (!pending) {
      error.value = "Không tìm thấy thông tin giao dịch!";
      loading.value = false;
      return;
    }

    const { hoadonId: idHd, transactionId } = JSON.parse(pending);
    hoadonId.value = idHd;

    // 2. Đọc query params từ URL callback MoMo
    const urlParams = new URLSearchParams(window.location.search);
    const resultCode = urlParams.get("resultCode");
    const transId = urlParams.get("transId");

    if (resultCode !== "0") {
      error.value = "Thanh toán thất bại!";
      loading.value = false;
      return;
    }

    // 3. Cập nhật trạng thái THANH_TOAN trong DB
    const updatePayment = {
      params: {
        p_hoadon: idHd,
        p_magiaodich: transId || transactionId,
        p_trangthai: "SUCCESS",
      },
    };

    await callAPI("WBH_US_UPD_THANH_TOAN", updatePayment);

    // 4. Cập nhật trạng thái ĐẶT HÀNG (nếu có procedure riêng)
    const updateOrder = {
      params: {
        p_id_hd: idHd,
        p_trangthai: "ĐÃ THANH TOÁN",
      },
    };
    await callAPI("WBH_US_UPD_DAT_HANG", updateOrder);

    // 5. Clear localStorage
    localStorage.removeItem("pendingMoMoOrder");

    loading.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
});
</script>

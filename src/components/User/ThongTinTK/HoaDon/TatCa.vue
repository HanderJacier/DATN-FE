<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>
        <Historybar />
        <!-- Không có sản phẩm, chỉ hiển thị thông báo -->
        <div class="alert alert-info mt-3">Hiển thị tất cả đơn hàng</div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue'
import Historybar from '@/components/User/Title/Historybar.vue'

export default {
  name: 'AllOrders',
  components: { Slidebar, Historybar },
}
</script>

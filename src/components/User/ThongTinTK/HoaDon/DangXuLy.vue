<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Lịch sử đơn hàng -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Đơn hàng của tôi</h4>
        <form @submit.prevent="submitForm"></form>

        <!-- Tabs lọc -->
        <OrderStatusTabs />

        <!-- Đơn hàng 1 -->
        <div class="border rounded-4 p-3 mb-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small class="text-muted">12/10/2024</small>
            <small class="text-muted">• 2 sản phẩm</small>
          </div>

          <!-- Sản phẩm 1 -->
          <div class="d-flex mb-3">
            <img
              src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/i/p/iphone-16-pro_1.png"
              class="rounded me-3"
              style="width: 80px; height: 80px; object-fit: cover;"
              alt="iPhone"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1">iPhone 16 Pro 128GB</h6>
              <small class="text-muted">Số lượng: 1</small>
            </div>
            <div class="text-end">
              <div>25.290.000 đ</div>
              <small class="text-muted text-decoration-line-through">28.990.000 đ</small>
            </div>
          </div>

          <!-- Sản phẩm 2 -->
          <div class="d-flex mb-3">
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_1__2.png"
              class="rounded me-3"
              style="width: 80px; height: 80px; object-fit: cover;"
              alt="Samsung"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1">Samsung Galaxy S25 256GB</h6>
              <small class="text-muted">Số lượng: 1</small>
            </div>
            <div class="text-end">
              <div>2.390.000 đ</div>
              <small class="text-muted text-decoration-line-through">2.790.000 đ</small>
            </div>
          </div>

          <!-- Tổng tiền -->
          <div class="d-flex justify-content-between align-items-center border-top pt-2">
            <strong>Thành tiền: 27.680.000 đ</strong>
            <button class="btn btn-primary btn-sm">Mua lại</button>
          </div>
        </div>

        <!-- Đơn hàng 2 -->
        <div class="border rounded-4 p-3 mb-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small class="text-muted">02/04/2025</small>
            <small class="text-muted">• 1 sản phẩm</small>
          </div>

          <!-- Sản phẩm -->
          <div class="d-flex mb-3">
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_1_3__3.png"
              class="rounded me-3"
              style="width: 80px; height: 80px; object-fit: cover;"
              alt="Chuột Logitech"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1">Chuột không dây Logitech Signature M650 Size M</h6>
              <small class="text-muted">Số lượng: 2</small>
            </div>
            <div class="text-end">
              <div>150.000 đ</div>
              <small class="text-muted text-decoration-line-through">200.000 đ</small>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center border-top pt-2">
            <strong>Thành tiền: 300.000 đ</strong>
            <button class="btn btn-primary btn-sm">Mua lại</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue';
import OrderStatusTabs from '@/components/User/Title/Historybar.vue';

export default {
  name: 'OrderHistoryPage',
  components: { Slidebar, OrderStatusTabs },
  methods: {
    submitForm() {
      alert('Cập nhật đơn hàng');
    },
  },
};
</script>
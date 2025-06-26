<template>
  <div class="container-fluid py-4">
    <!-- Trạng thái đơn hàng -->
    <div class="card p-4 mb-4 " >
      <div class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block" >ĐƠN HÀNG CHỜ XỬ LÝ</div>
      <div class="row text-center">
        <div class="col-md-2 mb-2">
          <i class="fa fa-calendar-alt text-danger fs-4"></i>
          <div>Chờ duyệt</div>
          <div class="text-danger fw-bold">10</div>
        </div>
        <div class="col-md-2 mb-2">
          <i class="fa fa-clipboard text-success fs-4"></i>
          <div>Chờ thanh toán</div>
          <div class="text-success fw-bold">5</div>
        </div>
        <div class="col-md-2 mb-2">
          <i class="fa fa-box-open text-primary fs-4"></i>
          <div>Chờ đóng gói</div>
          <div class="text-primary fw-bold">20</div>
        </div>
        <div class="col-md-2 mb-2">
          <i class="fa fa-truck text-warning fs-4"></i>
          <div>Chờ lấy hàng</div>
          <div class="text-warning fw-bold">13</div>
        </div>
        <div class="col-md-2 mb-2">
          <i class="fa fa-shipping-fast text-pink fs-4"></i>
          <div>Đang giao hàng</div>
          <div class="text-pink fw-bold">20</div>
        </div>
        <div class="col-md-2 mb-2">
          <i class="fa fa-ban text-dark fs-4"></i>
          <div>Hủy giao - Chờ nhận</div>
          <div class="text-dark fw-bold">5</div>
        </div>
      </div>
    </div>

    <!-- Tìm kiếm -->
    <div class="mb-3">
      <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, ....">
    </div>

    <!-- Bảng đơn hàng -->
    <div class="table-responsive">
      <table class="table table-bordered text-center bg-white">
        <thead class="table-light">
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày tạo đơn</th>
            <th>Trạng thái thanh toán</th>
            <th>Tên khách hàng</th>
            <th>Trạng thái đơn hàng</th>
            <th>Nhân viên tạo đơn</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in filteredOrders" :key="index">
            <td>{{ order.id }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.payment }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.staff }}</td>
            <td>{{ order.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const orders = ref([
  { id: 'DH001', date: '2024-06-20', payment: 'Chưa thanh toán', customer: 'Nguyễn Văn A', status: 'Chờ duyệt', staff: 'Admin', note: '' },
  { id: 'DH002', date: '2024-06-21', payment: 'Đã thanh toán', customer: 'Lê Thị B', status: 'Đang giao hàng', staff: 'Admin', note: 'Giao gấp' }
])

const searchQuery = ref('')

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  return orders.value.filter(order =>
    order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
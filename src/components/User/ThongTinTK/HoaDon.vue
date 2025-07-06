<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Danh sách hóa đơn mua hàng</h4>

        <div class="bg-white border rounded p-4 shadow-sm">
          <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
                <th>Số hóa đơn</th>
                <th>Ngày</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hoaDon, index) in hoaDons" :key="index">
                <td>{{ hoaDon.so }}</td>
                <td>{{ hoaDon.ngay }}</td>
                <td>{{ hoaDon.khachHang }}</td>
                <td>{{ formatCurrency(hoaDon.tongTien) }}</td>
                <td>
                  <span :class="hoaDon.trangThai === 'Đã thanh toán' ? 'text-success' : 'text-danger'">
                    {{ hoaDon.trangThai }}
                  </span>
                </td>
                <td>
                  <router-link :to="`/hoadonchitiet`" class="btn btn-sm btn-primary">
                    Xem chi tiết
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue';

export default {
  name: 'HoaDonList',
  components: { Slidebar },
  data() {
    return {
      hoaDons: [
        {
          so: 'HD001',
          ngay: '2025-07-01',
          khachHang: 'Nguyễn Văn A',
          tongTien: 5300000,
          trangThai: 'Đã thanh toán',
        },
        {
          so: 'HD002',
          ngay: '2025-07-02',
          khachHang: 'Trần Thị B',
          tongTien: 2390000,
          trangThai: 'Chưa thanh toán',
        },
      ],
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
};
</script>

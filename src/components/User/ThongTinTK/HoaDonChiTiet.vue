<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-9">
        <h4 class="fw-bold mb-4">Chi tiết hóa đơn: {{ hoaDon.so }}</h4>

        <div class="bg-white border rounded p-4 shadow-sm">
          <!-- Thông tin hóa đơn -->
          <p><strong>Ngày lập:</strong> {{ hoaDon.ngay }}</p>
          <p><strong>Khách hàng:</strong> {{ hoaDon.khachHang }}</p>
          <p><strong>Địa chỉ:</strong> {{ hoaDon.diaChi }}</p>
          <p>
            <strong>Trạng thái:</strong>
            <span :class="hoaDon.trangThai === 'Đã thanh toán' ? 'text-success' : 'text-danger'">
              {{ hoaDon.trangThai }}
            </span>
          </p>

          <!-- Sản phẩm -->
          <table class="table table-bordered text-center align-middle mt-4">
            <thead class="table-light">
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sp, index) in hoaDon.sanPham" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ sp.ten }}</td>
                <td>{{ sp.soLuong }}</td>
                <td>{{ formatCurrency(sp.donGia) }}</td>
                <td>{{ formatCurrency(sp.soLuong * sp.donGia) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Tổng -->
          <div class="text-end mt-3">
            <strong>Tổng thanh toán: {{ formatCurrency(tinhTongTien()) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from '@/components/User/Title/Slidebar.vue';

export default {
  name: 'HoaDonDetail',
  components: { Slidebar },
  data() {
    return {
      hoaDon: {
        so: this.$route.params.so || 'HD001',
        ngay: '2025-07-01',
        khachHang: 'Nguyễn Văn A',
        diaChi: '12 Nguyễn Trãi, Q1, TP.HCM',
        trangThai: 'Đã thanh toán',
        sanPham: [
          { ten: 'iPhone 15', soLuong: 1, donGia: 22990000 },
          { ten: 'Tai nghe Bluetooth', soLuong: 2, donGia: 350000 },
        ],
      },
    };
  },
  methods: {
    tinhTongTien() {
      return this.hoaDon.sanPham.reduce(
        (tong, sp) => tong + sp.soLuong * sp.donGia,
        0
      );
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
};
</script>

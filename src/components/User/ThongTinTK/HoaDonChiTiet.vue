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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import useOrderHistory from '@/components/User/LoadDB/useOrderHistory.js'

export default {
  name: 'HoaDonChiTiet',
  components: { Slidebar },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const {
      orderDetail,
      orderProducts,
      paymentInfo,
      detailLoading,
      detailError,
      fetchOrderDetail
    } = useOrderHistory()

    const orderId = computed(() => {
      return parseInt(route.params.id) || null
    })

    const loadOrderDetail = async () => {
      if (orderId.value) {
        await fetchOrderDetail(orderId.value)
      }
    }

    const calculateSubtotal = () => {
      if (!orderProducts.value || !Array.isArray(orderProducts.value)) return 0
      return orderProducts.value.reduce((sum, product) => sum + (product.thanhtien || 0), 0)
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('vi-VN')
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value || 0)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'Đã thanh toán':
          return 'badge bg-success'
        case 'Chờ thanh toán':
          return 'badge bg-warning'
        case 'Đang xử lý':
          return 'badge bg-info'
        case 'Đang giao hàng':
          return 'badge bg-primary'
        case 'Đã giao hàng':
          return 'badge bg-success'
        case 'Đã hủy':
          return 'badge bg-danger'
        default:
          return 'badge bg-secondary'
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    const cancelOrder = () => {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        // TODO: Implement cancel order API
        alert('Tính năng hủy đơn hàng đang được phát triển')
      }
    }

    const printInvoice = () => {
      window.print()
    }

    onMounted(() => {
      loadOrderDetail()
    })

    return {
      orderDetail,
      orderProducts,
      paymentInfo,
      detailLoading,
      detailError,
      orderId,
      calculateSubtotal,
      formatDateTime,
      formatCurrency,
      getStatusClass,
      goBack,
      cancelOrder,
      printInvoice
    }
  }
}
</script>

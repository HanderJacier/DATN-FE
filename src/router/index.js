import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'

import ThongTinTK from '../components/User/ThongTinTK/ThongTinTK.vue'
import DiaChi from '../components/User/ThongTinTK/DiaChi.vue'
import SPYeuThich from '../components/User/ThongTinTK/SPYeuThich.vue'
import HoaDonChiTiet from '../components/User/ThongTinTK/HoaDonChiTiet.vue'
import DoiMatKhau from '../components/User/ThongTinTK/DoiMatKhau.vue'
import PaymentResult from '../components/User/PaymentForm.vue'

import DangNhap from '../components/User/DangNhapUser.vue'
import DangKyUser from '../components/User/DangKyUser.vue'
import GioHang from '../components/User/GioHang.vue'

import GopY from '../components/Admin/GopY.vue'
import Order from '../components/Admin/Order.vue'
import QLSanPham from '../components/Admin/QLSanPham/Table.vue'
import ThongKe from '../components/Admin/ThongKe.vue'
import User from '../components/Admin/User.vue'
import ThanhToan from '../components/User/ThanhToan.vue'
import ChiTietSP from '../components/User/ChiTietSP.vue'
import TimKiem from '../components/User/TimKiem.vue'
import GopYUser from '../components/User/GopYUser.vue'

// 🎯 Các trạng thái đơn hàng
import TatCa from '../components/User/ThongTinTK/HoaDon/TatCa.vue'
import DangXuLy from '../components/User/ThongTinTK/HoaDon/DangXuLy.vue'
import DaXuLy from '../components/User/ThongTinTK/HoaDon/DaXuLy.vue'
import DaHuy from '../components/User/ThongTinTK/HoaDon/DaHuy.vue'
import XacNhanDonHang from '../components/User/ThongTinTK/XacNhanDonHang.vue'
import OrderManagement from '../components/Admin/OrderManagement.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/dangnhap', component: DangNhap },
  { path: '/dangky', component: DangKyUser },

  { path: '/thongtintk', component: ThongTinTK },
  { path: '/sanphamyeuthich', component: SPYeuThich },
  { path: '/diachinguoidung', component: DiaChi },
  { path: '/hoadonchitiet', component: HoaDonChiTiet },
  { path: '/hoadonchitiet/:id', name: 'hoadonchitiet', component: HoaDonChiTiet },
  { path: '/doimatkhau', component: DoiMatKhau },

  { path: '/giohang', component: GioHang },
  { path: '/thanhtoan', component: ThanhToan },
  { path: '/sanpham/:id', name: 'ChiTietSanPham', component: ChiTietSP },
  { path: '/sanpham', component: ChiTietSP },
  { path: '/timkiem', component: TimKiem },
  { path: '/gopynguoidung', component: GopYUser },
  { path: '/return', component: PaymentResult },
  { path: '/xacnhandonhang', component: XacNhanDonHang },

  // 🎯 Các route lịch sử đơn hàng theo tab
  { path: '/tatca', component: TatCa },
  { path: '/dangxuly', component: DangXuLy },
  { path: '/daxuly', component: DaXuLy },
  { path: '/dahuy', component: DaHuy },

  // Admin layout và nested routes
  {
    path: '/admin',
    component: Dashboard,
    children: [
      { path: 'qlsanpham', component: QLSanPham },
      { path: 'donhang', component: Order },
      { path: 'nguoidung', component: User },
      { path: 'qlhoadon', component: OrderManagement },
      { path: 'thongke', component: ThongKe },
      { path: 'gopy', component: GopY },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));

  // Nếu đã đăng nhập và vào trang đăng nhập thì redirect về trang chủ
  if (to.path === '/dangnhap' && user) {
    return next('/');
  }

  // Nếu vào trang admin mà chưa đăng nhập thì redirect về trang đăng nhập
  if (to.path.startsWith('/admin') && !user) {
    return next('/dangnhap');
  }

  // Các trường hợp còn lại đều cho phép truy cập
  next();
});


export default router

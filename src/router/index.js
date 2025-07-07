import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'

import ThongTinTK from '../components/User/ThongTinTK/ThongTinTK.vue'
import DiaChi from '../components/User/ThongTinTK/DiaChi.vue'
import SPYeuThich from '../components/User/ThongTinTK/SPYeuThich.vue'
import HoaDonChiTiet from '../components/User/ThongTinTK/HoaDonChiTiet.vue'
import HoaDon from '../components/User/ThongTinTK/HoaDon.vue'
import DoiMatKhau from '../components/User/ThongTinTK/DoiMatKhau.vue'

import DangNhap from '../components/User/DangNhapUser.vue'
import DangKyUser from '../components/User/DangKyUser.vue'
import GioHang from '../components/User/GioHang.vue'

import GopY from '../components/Admin/GopY.vue'
import Order from '../components/Admin/Order.vue'
import QLSanPham from '../components/Admin/QLSanPham.vue'
import ThongKe from '../components/Admin/ThongKe.vue'
import User from '../components/Admin/User.vue'
import ThanhToan from '../components/User/ThanhToan.vue'
import ChiTietSP from '../components/User/ChiTietSP.vue'
import TimKiem from '../components/User/TimKiem.vue'

// 🎯 Các trạng thái đơn hàng
import TatCa from '../components/User/ThongTinTK/LichSuMuaHang/TatCa.vue'
import DangXuLy from '../components/User/ThongTinTK/LichSuMuaHang/DangXuLy.vue'
import DangGiao from '../components/User/ThongTinTK/LichSuMuaHang/DangGiao.vue'
import DaGiao from '../components/User/ThongTinTK/LichSuMuaHang/DaGiao.vue'
import DaHuy from '../components/User/ThongTinTK/LichSuMuaHang/DaHuy.vue'
import TraHang from '../components/User/ThongTinTK/LichSuMuaHang/TraHang.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/dangnhap', component: DangNhap },
  { path: '/dangky', component: DangKyUser },

  { path: '/thongtintk', component: ThongTinTK },
  { path: '/sanphamyeuthich', component: SPYeuThich },
  { path: '/diachinguoidung', component: DiaChi },
  { path: '/hoadonchitiet', component: HoaDonChiTiet },
  { path: '/hoadon', component: HoaDon },
  { path: '/doimatkhau', component: DoiMatKhau },

  { path: '/giohang', component: GioHang },
  { path: '/thanhtoan', component: ThanhToan },
  { path: '/sanpham/:id', name: 'ChiTietSanPham', component: ChiTietSP },
  { path: '/sanpham', component: ChiTietSP },
  { path: '/timkiem', component: TimKiem },

  // 🎯 Các route lịch sử đơn hàng theo tab
  { path: '/tatca', component: TatCa },
  { path: '/dangxuly', component: DangXuLy },
  { path: '/danggiao', component: DangGiao },
  { path: '/dagiao', component: DaGiao },
  { path: '/dahuy', component: DaHuy },
  { path: '/trahang', component: TraHang },

  // Admin layout và nested routes
  {
    path: '/admin',
    component: Dashboard,
    children: [
      { path: 'qlsanpham', component: QLSanPham },
      { path: 'donhang', component: Order },
      { path: 'nguoidung', component: User },
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
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
  if (to.path === '/dangnhap' && user) {
    next('/')
  } else {
    next()
  }
})

export default router

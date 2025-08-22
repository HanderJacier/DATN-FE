import { createRouter, createWebHistory } from 'vue-router'
import { encodeWholeRoute, decodeWholeRoute } from '@/utils/routeMask'


// User
import Home from '../components/User/Home.vue'
import ThongTinTK from '../components/User/ThongTinTK/ThongTinTK.vue'
import DiaChi from '../components/User/ThongTinTK/DiaChi.vue'
import SPYeuThich from '../components/User/ThongTinTK/SPYeuThich.vue'
import HoaDonChiTiet from '../components/User/ThongTinTK/HoaDonChiTiet.vue'
import DoiMatKhau from '../components/User/ThongTinTK/DoiMatKhau.vue'
import PaymentResult from '../components/User/PaymentForm.vue'
import DangNhap from '../components/User/DangNhapUser.vue'
import DangKyUser from '../components/User/DangKyUser.vue'
import GioHang from '../components/User/GioHang.vue'
import ThanhToan from '../components/User/ThanhToan.vue'
import ChiTietSP from '../components/User/ChiTietSP.vue'
import TimKiem from '../components/User/TimKiem.vue'
import GopYUser from '../components/User/GopYUser.vue'

// Admin
import Dashboard from '../components/Admin/Dashboard.vue'
import GopY from '../components/Admin/GopY.vue'
import Order from '../components/Admin/Order.vue'
import QLSanPham from '../components/Admin/QLSanPham/Table.vue'
import ThongKe from '../components/Admin/ThongKe.vue'
import User from '../components/Admin/User.vue'
import OrderManagement from '../components/Admin/OrderManagement.vue'

// 🎯 Các trạng thái đơn hàng
import TatCa from '../components/User/ThongTinTK/HoaDon/TatCa.vue'
import DangXuLy from '../components/User/ThongTinTK/HoaDon/DangXuLy.vue'
import DaXuLy from '../components/User/ThongTinTK/HoaDon/DaXuLy.vue'
import DaHuy from '../components/User/ThongTinTK/HoaDon/DaHuy.vue'
import XacNhanDonHang from '../components/User/ThongTinTK/XacNhanDonHang.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dangnhap', name: 'DangNhap', component: DangNhap },
  { path: '/dangky', name: 'DangKyUser', component: DangKyUser },
  { path: '/thongtintk', name: 'ThongTinTK', component: ThongTinTK },
  { path: '/sanphamyeuthich', name: 'SPYeuThich', component: SPYeuThich },
  { path: '/diachinguoidung', name: 'DiaChi', component: DiaChi },

  // canonical nội bộ (giữ id số)
  { path: '/hoadonchitiet/:id(\\d+)', name: 'hoadonchitiet', component: HoaDonChiTiet },
  { path: '/sanpham/:id(\\d+)', name: 'ChiTietSanPham', component: ChiTietSP },

  { path: '/tatca', name: 'TatCa', component: TatCa },
  { path: '/dangxuly', name: 'DangXuLy', component: DangXuLy },
  { path: '/daxuly', name: 'DaXuLy', component: DaXuLy },
  { path: '/dahuy', name: 'DaHuy', component: DaHuy },

  { path: '/doimatkhau', name: 'DoiMatKhau', component: DoiMatKhau },
  { path: '/giohang', name: 'GioHang', component: GioHang },
  { path: '/thanhtoan', name: 'ThanhToan', component: ThanhToan },
  { path: '/timkiem', name: 'TimKiem', component: TimKiem },
  { path: '/gopynguoidung', name: 'GopYUser', component: GopYUser },
  { path: '/return', name: 'PaymentResult', component: PaymentResult },
  { path: '/xacnhandonhang', name: 'XacNhanDonHang', component: XacNhanDonHang },

  // Admin
  {
    path: '/admin',
    name: 'Admin',
    component: Dashboard,
    children: [
      { path: 'qlsanpham', name: 'QLSanPham', component: QLSanPham },
      { path: 'donhang', name: 'Order', component: Order },
      { path: 'nguoidung', name: 'User', component: User },
      { path: 'qlhoadon', name: 'OrderManagement', component: OrderManagement },
      { path: 'thongke', name: 'ThongKe', component: ThongKe },
      { path: 'gopy', name: 'GopY', component: GopY },
    ]
  },

  // ====== PUBLIC MASKED ENTRY (đặt CUỐI, cho phép dấu chấm) ======
  {
    path: '/:token(.*)',
    name: 'MaskedEntry',
    beforeEnter: (to) => {
      // Nếu đã match route thật ở trên thì bỏ qua
      if (to.matched.length && to.matched[0].name !== 'MaskedEntry') return true
      const decoded = decodeWholeRoute(String(to.params.token))
      if (!decoded || !decoded.name) return false // 404
      return {
        name: decoded.name,
        params: decoded.params,
        query: decoded.query,
        hash: decoded.hash,
        replace: true
      }
    }
  },
]

const router = createRouter({
  history: createWebHistory(), // nếu dùng base: createWebHistory('/base/')
  routes
})

// Guard đăng nhập
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
  if (to.path === '/dangnhap' && user) return next('/')
  if (to.path.startsWith('/admin') && !user) return next('/dangnhap')
  next()
})

// Luôn thay URL hiển thị thành "/<token>" (mask 100%)
router.afterEach((to) => {
  if (to.name === 'MaskedEntry') return // tránh vòng lặp

  const token = encodeWholeRoute({
    name: to.name,
    params: to.params,
    query: to.query,
    hash: to.hash || ''
  })
  if (!token) return

  const masked = `/${token}`
  const current = window.location.pathname + window.location.search + window.location.hash
  if (current !== masked) {
    window.history.replaceState({}, '', masked)
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { encId, decId } from '@/utils/idCodec'

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
  { path: '/', component: Home },
  { path: '/dangnhap', component: DangNhap },
  { path: '/dangky', component: DangKyUser },

  { path: '/thongtintk', component: ThongTinTK },
  { path: '/sanphamyeuthich', component: SPYeuThich },
  { path: '/diachinguoidung', component: DiaChi },

  // ====== HÓA ĐƠN ======
  // Route cũ (component đang dùng) – nhận id số
  { path: '/hoadonchitiet/:id(\\d+)', name: 'hoadonchitiet', component: HoaDonChiTiet },

  // Route “đẹp” – người dùng gõ URL mã hoá thì decode -> redirect về id số (component không đổi)
  {
    path: '/hoadonchitiet/:code',
    beforeEnter: (to) => {
      const id = decId(to.params.code)
      if (id == null) return false // hoặc redirect 404
      return { name: 'hoadonchitiet', params: { id }, replace: true }
    }
  },

  { path: '/doimatkhau', component: DoiMatKhau },
  { path: '/giohang', component: GioHang },
  { path: '/thanhtoan', component: ThanhToan },

  // ====== SẢN PHẨM ======
  // Route cũ (component đang dùng) – nhận id số
  { path: '/sanpham/:id(\\d+)', name: 'ChiTietSanPham', component: ChiTietSP },

  // Route “đẹp” – decode -> redirect về id số
  {
    path: '/sanpham/:code',
    beforeEnter: (to) => {
      const id = decId(to.params.code)
      if (id == null) return false // hoặc redirect 404
      return { name: 'ChiTietSanPham', params: { id }, replace: true }
    }
  },

  // (không nên giữ /sanpham rỗng cho trang chi tiết)
  // { path: '/sanpham', component: ChiTietSP },

  { path: '/timkiem', component: TimKiem },
  { path: '/gopynguoidung', component: GopYUser },
  { path: '/return', component: PaymentResult },
  { path: '/xacnhandonhang', component: XacNhanDonHang },

  // lịch sử đơn hàng
  { path: '/tatca', component: TatCa },
  { path: '/dangxuly', component: DangXuLy },
  { path: '/daxuly', component: DaXuLy },
  { path: '/dahuy', component: DaHuy },

  // Admin
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

// Guard cũ của bạn giữ nguyên
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
  if (to.path === '/dangnhap' && user) return next('/')
  if (to.path.startsWith('/admin') && !user) return next('/dangnhap')
  next()
})

/**
 * Sau khi điều hướng tới route dùng id số,
 * thay URL hiển thị thành bản mã hoá (KHÔNG đổi route đang active, KHÔNG gây re-render)
 */
router.afterEach((to) => {
  // giữ lại query & hash nếu có
  const q = to.fullPath.split('?')[1] ? `?${to.fullPath.split('?')[1].split('#')[0]}` : ''
  const h = to.fullPath.includes('#') ? `#${to.fullPath.split('#')[1]}` : ''

  if (to.name === 'ChiTietSanPham' && to.params?.id) {
    const id = String(to.params.id)
    if (/^\d+$/.test(id)) {
      const code = encId(id)
      const pretty = `/sanpham/${code}${q}${h}`
      if (location.pathname !== `/sanpham/${code}`) {
        window.history.replaceState({}, '', pretty)
      }
    }
  }

  if (to.name === 'hoadonchitiet' && to.params?.id) {
    const id = String(to.params.id)
    if (/^\d+$/.test(id)) {
      const code = encId(id)
      const pretty = `/hoadonchitiet/${code}${q}${h}`
      if (location.pathname !== `/hoadonchitiet/${code}`) {
        window.history.replaceState({}, '', pretty)
      }
    }
  }
})

export default router

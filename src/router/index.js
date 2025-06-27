import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import ProductDetail from '../components/User/ProductDetail.vue'
import UserDetail from '../components/User/UserDetail.vue'
import DangNhap from '../components/User/DangNhapUser.vue'
import DoiMatKhau from '../components/User/DoiMatKhau.vue'
import DangKyUser from '../components/User/DangKyUser.vue'
import Cart from '../components/User/Cart.vue'
import UserAddress from '../components/User/UserAddress.vue'
import GopY from '../components/Admin/GopY.vue'
import Order from '../components/Admin/Order.vue'
import Product from '../components/Admin/Product.vue'
import ThongKe from '../components/Admin/ThongKe.vue'
import User from '../components/Admin/User.vue'
import FavoriteProduct from '../components/User/FavoriteProduct.vue'
import Pay from '../components/User/Pay.vue'
import LichSuMuaHang from '../components/User/LichSuMuaHang.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/dangnhap', component: DangNhap },
  { path: '/dangky', component: DangKyUser },
  { path: '/doimatkhau', component: DoiMatKhau },
  { path: '/sanpham', component: ProductDetail },
  { path: '/thongtintk', component: UserDetail },
  { path: '/giohang', component: Cart },
  { path: '/diachinguoidung', component: UserAddress },
  { path: '/sanphamyeuthich', component: FavoriteProduct },
  { path: '/thanhtoan', component: Pay },
  {path: '/sanpham/:id',name: 'ChiTietSanPham',component: ProductDetail},
  { path: '/hoadon', component: Bill },
  { path: '/lichsumuahang', component: LichSuMuaHang },


  // Admin layout và nested routes
  {
    path: '/admin',
    component: Dashboard,
    children: [
      { path: 'sanpham', component: Product },
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

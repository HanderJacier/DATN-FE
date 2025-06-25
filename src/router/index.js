import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import ProductDetail from '../components/User/ProductDetail.vue'
import UserDetail from '../components/User/UserDetail.vue'
import DangNhap from '../components/User/DangNhapUser.vue'
import DoiMatKhau from '../components/User/DoiMatKhau.vue'
import DangKyUser from '../components/User/DangKyUser.vue'
import Cart from '../components/User/Cart.vue'


const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/admin',
    component: Dashboard
  },
  {
    path: '/dangnhap',
    component: DangNhap
  },
    {
    path: '/dangky',
    component: DangKyUser
  },
  { path: '/doimatkhau', component: DoiMatKhau },
  { path: '/sanpham', component: ProductDetail },
  { path: '/thongtintk', component: UserDetail },
  { path: '/giohang', component: Cart }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))

  // Ngăn người dùng đã đăng nhập quay lại trang /dangnhap
  if (to.path === '/dangnhap' && user) {
    next('/') // hoặc next('/userDetail')
  } else {
    next()
  }
})

export default router

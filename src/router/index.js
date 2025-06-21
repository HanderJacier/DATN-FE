import { createRouter, createWebHistory } from 'vue-router'

// COMPONENTS
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import DangNhapUser from '../components/User/DangNhapUser.vue'
import DangNhapAdmin from '../components/Admin/Dangnhap.vue'
import DangKyUser from '../components/User/DangKyUser.vue'

const routes = [
  { path: '/', component: Home },

  // Trang đăng nhập người dùng
  { path: '/DangNhapUser', component: DangNhapUser },

  // Trang đăng nhập admin
  { path: '/DangNhapAdmin', component: DangNhapAdmin },

  // Trang đăng ký người dùng
  { path: '/DangKyUser', component: DangKyUser },

  // Trang dashboard admin
  { path: '/admin', component: Dashboard },

  // Trang mặc định nếu không tìm thấy
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import Dangnhap from '../components/Admin/Dangnhap.vue'
import DangnhapUser from '../components/User/DangnhapUser.vue'
import DangkyUser from '../components/User/DangkyUser.vue'


const routes = [
<<<<<<< HEAD
  { path: '/', component: Home },
   { path: '/Dashboard', component: Dashboard },
  { path: '/Danghap', component: Dangnhap },
  { path: '/DangnhapUser', component: DangnhapUser },
   { path: '/DangkyUser', component: DangkyUser },
=======
  {
    path: '/',
    component: Home
  },
  {
    path: '/admin',
    component: Dashboard
  }
>>>>>>> f9eeaec (giao diện trang chủ)
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

  
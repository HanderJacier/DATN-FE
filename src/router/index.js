import { createRouter, createWebHistory } from 'vue-router'

// Import các component User
import Home from '../components/User/Home.vue'
import DangnhapUser from '../components/User/DangnhapUser.vue'
import DangkyUser from '../components/User/DangkyUser.vue'


// Import các component Admin
import Dashboard from '../components/Admin/Dashboard.vue'
import Dangnhap from '../components/Admin/Dangnhap.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dangnhap-user',
    name: 'DangnhapUser',
    component: DangnhapUser
  },
  {
    path: '/dangky-user',
    name: 'DangkyUser',
    component: DangkyUser
  },
  
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/dangnhap-admin',
    name: 'DangnhapAdmin',
    component: Dangnhap
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

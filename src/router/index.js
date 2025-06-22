import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import ProductDetail from '../components/User/ProductDetail.vue'
import UserDetail from '../components/User/UserDetail.vue'
import DangNhap from '../components/User/DangNhap.vue'
import DoiMatKhau from '../components/User/DoiMatKhau.vue'
import DangKyUser from '../components/User/DangKyUser.vue'


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
    path: '/DangNhap',
    component: DangNhap
  },
    {
    path: '/dangky',
    component: DangKyUser
  },
    { path: '/productDetail', component: ProductDetail },
    { path: '/doimatkhau', component: DoiMatKhau },
  { path: '/userDetail', component: UserDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.meta.requiresAuth && !user) {
    next('/dangnhap');
  } else {
    next();
  }
});

export default router

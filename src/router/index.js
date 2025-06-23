import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import ProductDetail from '../components/User/ProductDetail.vue'
import UserDetail from '../components/User/UserDetail.vue'
import Cart from '../components/User/Cart.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admin', component: Dashboard },
  { path: '/productDetail', component: ProductDetail },
  { path: '/userDetail', component: UserDetail },
  { path: '/cart', component: Cart }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

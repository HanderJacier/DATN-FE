import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/User/Home.vue'
import Dashboard from '../components/Admin/Dashboard.vue'
import ProductDetail from '../components/User/ProductDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admin', component: Dashboard },
  { path: '/product', component: ProductDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

<template>
  <div>
    <HeaderComponent v-if="showLayout" />
    <router-view />
    <FooterComponent v-if="showLayout" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import HeaderComponent from './components/User/Title/Header.vue'
import FooterComponent from './components/User/Title/Footer.vue'
// Optional: Nếu bạn cần giữ lại component Home.vue
// import Home from './components/User/Home.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderComponent,
    FooterComponent,
    // Home
  },
  setup() {
    const route = useRoute()
    const hiddenLayoutRoutes = ['/dangnhap', '/dangky', '/admin']

    const showLayout = computed(() => {
      return !hiddenLayoutRoutes.some(path => route.path.startsWith(path))
    })

    return { showLayout }
  }
}
</script>

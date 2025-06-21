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

export default {
  name: 'HomePage',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  setup() {
    const route = useRoute()

    // Danh sách các route KHÔNG cần header/footer
    const hiddenLayoutRoutes = ['/dang-nhap', '/dang-ky']

    const showLayout = computed(() => !hiddenLayoutRoutes.includes(route.path))

    return { showLayout }
  },
}
</script>

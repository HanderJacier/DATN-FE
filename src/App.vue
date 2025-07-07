<template>
  <div>
    <HeaderComponent v-if="showUserLayout" />
    <router-view />
    <FooterComponent v-if="showUserLayout" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import HeaderComponent from './components/User/Title/Header.vue'
import FooterComponent from './components/User/Title/Footer.vue'

export default {
  name: 'AppLayout',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  setup() {
    const route = useRoute()

    const showUserLayout = computed(() => {
      const path = route.path
      return (
        !path.startsWith('/admin')
      )
    })

    return { showUserLayout }
  }
}
</script>

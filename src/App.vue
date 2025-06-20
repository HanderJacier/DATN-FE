<template>
  <div>
    <HeaderComponent />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './components/User/Title/Header.vue'
import FooterComponent from './components/User/Title/Footer.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderComponent,
    FooterComponent,
  },
}
</script>

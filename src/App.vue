<template>
<<<<<<< HEAD
  <router-view />
  <Home />
    <Header />
</template>

<script setup>
import Home from './components/User/Home.vue'
import Header from './components/User/Title/Header.vue'
</script>
  <Header />
  





=======
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
>>>>>>> f9eeaec (giao diện trang chủ)

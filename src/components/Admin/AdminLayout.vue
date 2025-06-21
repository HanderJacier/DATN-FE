<!-- src/layouts/AdminLayout.vue -->
<template>
  <AdminHeader />
  <router-view /> <!-- nội dung bên trong sẽ thay đổi theo route con -->
</template>

<script setup>
import AdminHeader from './AdminHeader.vue';
</script>

<template>
  <div class="home">
    <div class="banner">
      <img src="/src/assets/z6718998489705_e8df8b9ee36aab7076f0bf51d2c9c5ae.jpg" alt="Banner" />
    </div>

    <div class="categories">
      <div class="category" v-for="item in categories" :key="item.name">
        <img :src="item.image" :alt="item.name" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: "Điện thoại", image: "@/assets/phone.png" },
  { name: "Máy tính", image: "@/assets/laptop.png" },
  { name: "Loa", image: "@/assets/speaker.png" },
  { name: "Ipad", image: "@/assets/ipad.png" },
  { name: "Đồng hồ", image: "@/assets/watch.png" },
  { name: "Phụ kiện máy tính", image: "@/assets/pc.png" },
  { name: "Tai nghe", image: "@/assets/headphone.png" },
  { name: "TV", image: "@/assets/tv.png" },
  { name: "Màn hình máy tính", image: "@/assets/monitor.png" },
]
</script>

<style scoped>
.home {
  padding: 20px;
  background: #f5f5f5;
}

.banner img {
  width: 100%;
  border-radius: 8px;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.category {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
}

.category img {
  width: 70px;
  height: auto;
  margin-bottom: 8px;
}
</style>
<template>
  <h5 class="fw-bold mb-4 mt-5">Có thể bạn cũng thích </h5>
  <div class="container mt-1 p-1">
    <div class="row row-cols-2 row-cols-md-4 g-3">
      <div class="col" v-for="(sp, idx) in otherProducts" :key="idx">
        <div class="card h-100 shadow-sm">
          <img :src="sp.image" class="card-img-top" style="height: 180px; object-fit: contain" />
          <div class="card-body">
            <h6 class="card-title text-truncate">{{ sp.name }}</h6>
            <p class="text-danger fw-bold">{{ sp.price.toLocaleString() }}₫</p>
            <router-link :to="'/chitiet/' + sp.id" class="btn btn-sm btn-outline-primary w-100">
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const otherProducts = [
  {
    id: 101,
    name: 'iPhone 16 Pro Max 512GB',
    price: 39990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-sa-mac-thumb-600x600.jpg',
  },
  {
    id: 102,
    name: 'Samsung Galaxy S25 Ultra',
    price: 28990000,
    image: 'https://happyphone.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S25-Ultra-Titan-Blue.jpg',
  },
  {
    id: 103,
    name: 'MacBook Air M4 2025',
    price: 31990000,
    image: 'https://www.apple.com/newsroom/images/2025/03/apple-introduces-the-new-macbook-air-with-the-m4-chip-and-a-sky-blue-color/article/Apple-MacBook-Air-lineup-250305_big.jpg.large.jpg',
  },
  {
    id: 104,
    name: 'Tai nghe Sony WH-1000XM6',
    price: 7990000,
    image: 'https://bizweb.dktcdn.net/thumb/grande/100/479/913/products/tai-nghe-chong-on-bluetooth-sony-wh-1000xm6-tin-do-tai-nghe-2.jpg?v=1747423362963',
  },
]
</script>

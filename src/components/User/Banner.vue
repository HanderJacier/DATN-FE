<template>
  <div class="row">
    <!-- Banner chính -->
    <div class="col-md-9">
      <div id="mainBannerCarousel" class="carousel slide shadow-sm rounded h-100" data-bs-ride="carousel"
        data-bs-interval="4000">
        <!-- Indicators -->
        <div class="carousel-indicators">
          <button v-for="(banner, index) in mainBanners" :key="index" type="button"
            :data-bs-target="'#mainBannerCarousel'" :data-bs-slide-to="index" :class="{ active: index === 0 }"
            :aria-label="`Slide ${index + 1}`"></button>
        </div>

        <!-- Items -->
        <div class="carousel-inner rounded h-10">
          <div v-for="(banner, index) in mainBanners" :key="index" class="carousel-item h-100"
            :class="{ active: index === 0 }">
            <img :src="banner.image" class="d-block w-100 h-100" :alt="banner.alt" style="object-fit: cover" />
          </div>
        </div>

        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#mainBannerCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainBannerCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>

    <!-- Banner phụ bên phải -->
    <div class="col-md-3 d-flex flex-column gap-2">
      <div v-for="(small, index) in smallBanners" :key="index" class="card border-0 shadow-sm flex-fill">
        <img :src="small.image" class="card-img-top rounded" :alt="small.alt"
          style="height: 100px; object-fit: cover;" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const mainBanners = ref([
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/oppo-reno14-f-Sliding-0825.png",
    alt: "banner1",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/samsung-galaxy-a17-5g-home-v4-0825.png",
    alt: "banner2",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-redmi-note-14-home-0825.png",
    alt: "banner2",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/vivo-y19s-home-0825-v1.png",
    alt: "banner2",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-redmi-note-14-home-0825.png",
    alt: "banner2",
  },
]);

const smallBanners = ref([
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/samsung-galaxy-m55-5g-8gb-256gb.png",
    alt: "small1",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-b2s-dday3.jpg",
    alt: "small2",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-b2s-dday3-1.jpg",
    alt: "small3",
  },
]);
</script>

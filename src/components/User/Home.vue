<template>
  <!-- Carousel banner -->
  <div id="mainCarousel" class="carousel slide relative" data-bs-ride="carousel" data-bs-interval="3000">

    <div class="carousel-inner relative w-full overflow-hidden rounded-lg">
      <div class="carousel-item active">
        <img src="/src/assets/banner1.jpg" class="block w-full h-48 object-cover" alt="Banner 1">
      </div>
      <div class="carousel-item">
        <img src="/src/assets/banner3.png" class="block w-full h-48 object-cover" alt="Banner 2">
      </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev absolute top-1/2 -translate-y-1/2 left-2" type="button"
      data-bs-target="#mainCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon bg-dark p-2 rounded-full" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </button>
    <button class="carousel-control-next absolute top-1/2 -translate-y-1/2 right-2" type="button"
      data-bs-target="#mainCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon bg-dark p-2 rounded-full" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </button>
  </div>




  <!-- Danh Mục Sản Phẩm -->
  <section class="w-full max-w-7xl mx-auto mt-6 px-4">
    <div class="category-grid">
      <div v-for="(item, i) in categories" :key="i" class="category-card">
        <img :src="item.img" alt="" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </section>





  <!-- Flash Sale -->
  <section class="flash-sale-section">
    <div class="flash-sale-header">
      FLASH SALE
      <div class="flash-sale-timer">
        <span>01</span><span>03</span><span>24</span>
      </div>
    </div>
    <div class="flash-sale-grid">
      <div v-for="(product, i) in flashSale" :key="i" class="flash-sale-card">
        <span class="discount-badge">-{{ product.discount }}%</span>
        <img :src="product.img" alt="" />
        <p class="product-name">{{ product.name }}</p>
        <p class="new-price">{{ product.newPrice }} đ</p>
        <button class="sold-btn">Đã bán {{ product.sold }}</button>
      </div>
    </div>
  </section>


  <!-- Sản phẩm nổi bật -->
  <section class="featured-products-container">
    <h2 class="featured-title">Sản Phẩm Nổi Bật</h2>
    <div class="featured-wrapper">
      <!-- Nút trái -->
      <button class="nav-btn left-btn" @click="scrollLeft">
        ‹
      </button>
      <!-- Danh sách sản phẩm trượt ngang -->
      <div ref="carousel" class="featured-scroll">
        <div v-for="(item, i) in hotProducts" :key="i" class="featured-card">
          <img :src="item.img" alt="" class="featured-img" />
          <p class="product-name">{{ item.name }}</p>
          <p class="old-price">{{ item.oldPrice }} đ</p>
          <p class="new-price">{{ item.newPrice }} đ</p>
          <p class="discount">-{{ item.discount }}%</p>
          <button class="buy-button">Mua ngay</button>
        </div>
      </div>
      <!-- Nút phải -->
      <button class="nav-btn right-btn" @click="scrollRight">
        ›
      </button>
    </div>
  </section>


  <!-- Ưu đãi mùa hè -->
  <section class="summer-sale-container">
    <h2 class="summer-title">HÈ CÀNG NÓNG GIÁ CÀNG HẠ !</h2>
    <div class="summer-sale-wrapper">
      <!-- Banner bên trái -->
      <div class="summer-banner">
        <img src="/src/image/Banner sale hè .png" alt="Summer Sale Banner" />
      </div>
      <!-- Slider sản phẩm -->
      <div class="summer-slider-section">
        <button class="nav-btn left-btn" @click="scrollSummerLeft">‹</button>
        <div ref="summerCarousel" class="summer-product-scroll">
          <div v-for="(item, i) in summerDeals" :key="i" class="summer-product-card">
            <img :src="item.img" alt="" />
            <p class="product-name">{{ item.name }}</p>
            <p class="old-price">{{ item.oldPrice }} đ</p>
            <p class="new-price">{{ item.newPrice }} đ</p>
            <p class="discount">-{{ item.discount }}%</p>
            <button class="buy-button">Mua ngay</button>
          </div>
        </div>
        <button class="nav-btn right-btn" @click="scrollSummerRight">›</button>
      </div>
    </div>
  </section>


  <!-- Sắm nhanh cho hè -->
  <section class="promo-slider-section">
    <h2 class="promo-slider-title">SẮM NHANH CHO HÈ GIÁ NGHE LÀ THÍCH !</h2>
    <div class="promo-slider-wrapper">
      <button class="promo-nav-btn left-btn" @click="scrollPromoLeft">‹</button>
      <div ref="promoCarousel" class="promo-slider-scroll">
        <div v-for="(banner, i) in summerPromos" :key="i" class="promo-banner-card">
          <img :src="banner.img" :alt="'Banner ' + (i + 1)" />
        </div>
      </div>
      <button class="promo-nav-btn right-btn" @click="scrollPromoRight">›</button>
    </div>
  </section>


  <!-- Ưu đãi thanh toán -->
  <section class="payment-offer-section">
    <h2 class="payment-title">ƯU ĐÃI THANH TOÁN</h2>
    <div class="payment-scroll-wrapper">
      <div ref="paymentCarousel" class="payment-banner-scroll">
        <div v-for="(offer, i) in paymentOffers" :key="i" class="payment-banner-card">
          <img :src="offer.img" :alt="'Offer ' + (i + 1)" />
        </div>
      </div>
      <button class="nav-btn left-btn" @click="scrollPaymentLeft">‹</button>
      <button class="nav-btn right-btn" @click="scrollPaymentRight">›</button>
    </div>
  </section>



  <!-- Cam kết dịch vụ -->
  <section class="commitment-section">
    <div class="commitment-wrapper">
      <div class="commitment-card" v-for="(item, i) in commitments" :key="i">
        <img :src="item.icon" :alt="item.title" class="commitment-icon" />
        <p class="commitment-title">{{ item.title }}</p>
        <p class="commitment-desc">{{ item.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  { name: 'Smartphone', img: '/src/image/điện thoại.jpeg' },
  { name: 'Laptop', img: '/src/image/laptop.png' },
  { name: 'Loa', img: '/src/image/loa.webp' },
  { name: 'Tai nghe', img: '/src/image/tai nghe.webp' },
  { name: 'Ipad', img: '/src/image/ipad.jfif' },
  { name: 'Màn hình máy tính', img: '/src/image/màn hình.webp' },
  { name: 'Phụ kiện laptop', img: '/src/image/phụ kiện.webp' },
  { name: 'Đồng hồ', img: '/src/image/đồng hồ.webp' },
  { name: 'Tivi', img: '/src/image/tivi.jpeg' },
]

const flashSale = [
  { name: 'Hộp Đựng Du Lịch ASUS ROG Ally', oldPrice: '990.000', newPrice: '790.000', discount: 20, img: '/src/image/sale túi.png', sold: 130 },
  { name: 'Loa Bluetooth Divoom Lovelock', oldPrice: '1.050.000', newPrice: '819.000', discount: 22, img: '/src/image/sale loa.png', sold: 99 },
  { name: 'Samsung Smart TV QLED 55 inch 4K QA55Q60D', oldPrice: '15.900.000', newPrice: '13.900.000', discount: 12, img: '/src/image/sale tivi.png', sold: 1 },
  { name: 'Galaxy Watch 6', oldPrice: '5.000.000', newPrice: '3.990.000', discount: 20, img: '/src/image/sale đồng hồ.png', sold: 30 },
]

const hotProducts = [
  {
    name: 'Chuột không dây Logitech M275',
    img: '/src/image/spchuot.png',
    oldPrice: '499.000',
    newPrice: '439.000',
    discount: 12,
  },
  {
    name: 'iPhone 15 Plus 128GB/256GB/512GB',
    img: '/src/image/spdt.png',
    oldPrice: '25.990.000',
    newPrice: '19.390.000',
    discount: 25,
  },
  {
    name: 'Laptop MSI Gaming Vector 16',
    img: '/src/image/splaptop.png',
    oldPrice: '54.900.000',
    newPrice: '50.990.000',
    discount: 7,
  },
  {
    name: 'iPad (A16) 11 inch WIFI 5G 512GB',
    img: '/src/image/spipad.png',
    oldPrice: '21.990.000',
    newPrice: '20.690.000',
    discount: 6,
  },
  {
    name: 'Sharp Google TV 32 inch HD 2T-C32EG3X',
    img: '/src/image/sptivi.png',
    oldPrice: '5.390.000',
    newPrice: '4.990.000',
    discount: 24,
  },
  {
    name: 'Bàn phím Microfoft',
    img: '/src/image/spbanphim.jpg',
    oldPrice: '5.390.000',
    newPrice: '4.990.000',
    discount: 24,
  },
  {
    name: 'Tai nghe',
    img: '/src/image/sptainghe.jpg',
    oldPrice: '390.000',
    newPrice: '290.000',
    discount: 24,
  },
  {
    name: 'Sharp Google TV 32 inch HD 2T-C32EG3X',
    img: '/src/image/sptv.jpeg',
    oldPrice: '5.390.000',
    newPrice: '4.990.000',
    discount: 24,
  },
  {
    name: 'Sharp Google TV 32 inch HD 2T-C32EG3X',
    img: '/src/image/sptivi.png',
    oldPrice: '5.390.000',
    newPrice: '4.990.000',
    discount: 24,
  }
]

import { ref } from 'vue'

const carousel = ref(null)

function scrollLeft() {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

function scrollRight() {
  if (carousel.value) {
    carousel.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const summerCarousel = ref(null);

const scrollSummerLeft = () => {
  if (summerCarousel.value) {
    summerCarousel.value.scrollBy({ left: -220, behavior: 'smooth' });
  }
};

const scrollSummerRight = () => {
  if (summerCarousel.value) {
    summerCarousel.value.scrollBy({ left: 220, behavior: 'smooth' });
  }
};

const summerDeals = [
  {
    name: 'Loa mini digital speaker LEERFEIE - 1046',
    oldPrice: '1.200.000',
    newPrice: '599.000',
    discount: 50,
    img: '/src/image/loa hè.png'
  },
  {
    name: 'Dây đeo Apple Watch 44mm - Hồng',
    oldPrice: '2.090.000',
    newPrice: '1.090.000',
    discount: 50,
    img: '/src/image/đồng hồ hè.png'
  },
  {
    name: 'Tai nghe Bluetooth nhét tai Remax PD-BT630',
    oldPrice: '1.090.000',
    newPrice: '590.000',
    discount: 50,
    img: '/src/image/airpod.png'
  },
  {
    name: 'Tai nghe Bluetooth nhét tai Remax PD-BT630',
    oldPrice: '1.090.000',
    newPrice: '590.000',
    discount: 50,
    img: '/src/image/chuột hè.webp'
  },
  {
    name: 'Tai nghe Bluetooth nhét tai Remax PD-BT630',
    oldPrice: '1.090.000',
    newPrice: '590.000',
    discount: 50,
    img: '/src/image/túi hè.jpg'
  },
  {
    name: 'Tai nghe Bluetooth nhét tai Remax PD-BT630',
    oldPrice: '1.090.000',
    newPrice: '590.000',
    discount: 50,
    img: '/src/image/túi hè.jpg'
  },
  {
    name: 'Tai nghe Bluetooth nhét tai Remax PD-BT630',
    oldPrice: '1.090.000',
    newPrice: '590.000',
    discount: 50,
    img: '/src/image/túi hè.jpg'
  }
]


const promoCarousel = ref(null)

const summerPromos = [
  { img: '/src/image/sam nhanh1.png' },
  { img: '/src/image/sam nhanh2.png' },
  { img: '/src/image/sam nhanh3.png' }
]

function scrollPromoLeft() {
  if (promoCarousel.value) {
    promoCarousel.value.scrollBy({ left: -320, behavior: 'smooth' })
  }
}

function scrollPromoRight() {
  if (promoCarousel.value) {
    promoCarousel.value.scrollBy({ left: 320, behavior: 'smooth' })
  }
}


const paymentOffers = [
  { img: '/src/image/pay1.png' },
  { img: '/src/image/pay2.png' },
  { img: '/src/image/pay3.png' },
  { img: '/src/image/pay4.png' },
  { img: '/src/image/pay5.png' }
]

const paymentCarousel = ref(null)

function scrollPaymentLeft() {
  if (paymentCarousel.value) {
    paymentCarousel.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

function scrollPaymentRight() {
  if (paymentCarousel.value) {
    paymentCarousel.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}


const commitments = [
  {
    icon: '/src/image/camket1.png',
    title: 'Thương hiệu đảm bảo',
    desc: 'Nhập khẩu, bảo hành chính hãng'
  },
  {
    icon: '/src/image/camket2.png',
    title: 'Giao hàng tận nhà',
    desc: 'Tại 63 tỉnh thành'
  },
  {
    icon: '/src/image/camket3.png',
    title: 'Sản phẩm chất lượng',
    desc: 'Đảm bảo tương thích và độ bền cao'
  },
  {
    icon: '/src/image/camket4.png',
    title: 'Đổi trả dễ dàng',
    desc: 'Theo chính sách đổi trả tại FPT Shop'
  }
]



</script>

<style>
/* Reset đơn giản */
* {
  margin: 0;
  padding: 0;
}

/* Font và màu nền */
body {
  font-family: Arial, sans-serif;
  background-color: #EFEFEF;
  color: #333;
  line-height: 1.5;
}



/* Header Banner */
.banner {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.banner img {
  max-width: 20%;
  height: auto;
  display: block;
}

/* Danh mục */
.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 32px 0;
}

.category-card {
  background-color: #EFEFEF;
  padding: 16px 12px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.category-card img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin: 0 auto 8px;
}

.category-card p {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 120px;
  gap: 16px;
  background-color: #EFEFEF;
  margin-top: 20px;
  border-radius: 10px;

}

.category-card {
  background-color: #fff;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 8px;
  transition: 0.2s ease;
}

.category-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.category-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Các danh mục cụ thể: điều chỉnh kích thước theo layout mong muốn */
.category-grid .category-card:nth-child(1) {
  grid-column: span 1;
  grid-row: span 1;
}

.category-grid .category-card:nth-child(2) {
  grid-column: span 1;
  grid-row: span 2;
}

.category-grid .category-card:nth-child(9) {
  grid-column: span 1;
  grid-row: span 1;
}

.category-grid .category-card:nth-child(3) {
  grid-column: span 1;
  grid-row: span 2;
}

.category-grid .category-card:nth-child(4) {
  grid-column: span 1;
  grid-row: span 1;
}

.category-grid .category-card:nth-child(5) {
  grid-column: span 1;
  grid-row: span 2;
}

.category-grid .category-card:nth-child(6),
.category-grid .category-card:nth-child(7) {
  grid-column: span 1;
  grid-row: span 1;
}

.category-grid .category-card:nth-child(8) {
  grid-column: span 1;
  grid-row: span 1;
}



/* Flash Sale & Sản phẩm nổi bật */


/* Sản phẩm nổi bật */
.featured-products-container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 16px;
}

.featured-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;

}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.featured-card {
  background-color: #fff;
  padding: 16px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative;
}

.featured-img {
  width: auto;
  height: 140px;
  object-fit: contain;
  margin-bottom: 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  min-height: 40px;
}

.old-price {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 14px;
}

.new-price {
  color: #dc2626;
  font-size: 18px;
  font-weight: bold;
}

.discount {
  color: #dc2626;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.buy-button {
  background-color: #1d4ed8;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  border: none;
}

.featured-card:hover {
  transform: translateY(-4px);
  transition: 0.2s ease;
}

.featured-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.featured-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  scroll-behavior: smooth;
  padding: 10px 0;
  scrollbar-width: none;
  /* Firefox */
}

.featured-scroll::-webkit-scrollbar {
  display: none;
  /* Chrome */
}

.featured-card {
  min-width: 220px;
  flex: 0 0 auto;
  background-color: #fff;
  padding: 16px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  font-size: 20px;
}

.left-btn {
  left: -20px;
  border-radius: 20px;
}

.right-btn {
  right: -20px;
  border-radius: 20px;
}

.flash-sale-section {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 8px;


}

.flash-sale-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #FF5722;
  font-size: 20px;
  margin-bottom: 16px;
}

.flash-sale-timer {
  display: flex;
  gap: 4px;
}

.flash-sale-timer span {
  background-color: black;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.flash-sale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.flash-sale-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: 0.2s;
}

.flash-sale-card:hover {
  transform: translateY(-3px);
}

.flash-sale-card img {
  width: auto;
  height: 120px;
  object-fit: contain;
  margin: 0 auto;
}

.flash-sale-card .discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  color: red;
  font-weight: bold;
  font-size: 14px;
}

.flash-sale-card .product-name {
  margin-top: 8px;
  font-weight: bold;
  font-size: 14px;
}

.flash-sale-card .new-price {
  color: red;
  font-weight: bold;
  font-size: 18px;
  margin: 4px 0;
}

.flash-sale-card .sold-btn {
  background-color: #FF5722;
  color: white;
  border: none;
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 16px;
  margin-top: 6px;
  cursor: default;
}

/*hè*/
.summer-sale-container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 16px;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
}

.summer-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #e11d48;
}

.summer-sale-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  position: relative;
}

.summer-banner img {
  width: 480px;
  border-radius: 10px;
}

.summer-slider-section {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.summer-product-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.summer-product-scroll::-webkit-scrollbar {
  display: none;
}

.summer-product-card {
  min-width: 200px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.summer-product-card img {
  width: auto;
  height: 120px;
  margin: 0 auto 10px;
  object-fit: contain;
}

.summer-product-card .product-name {
  font-size: 14px;
  font-weight: 500;
  min-height: 40px;
}

.summer-product-card .old-price {
  text-decoration: line-through;
  font-size: 14px;
  color: #9ca3af;
}

.summer-product-card .new-price {
  color: #dc2626;
  font-size: 18px;
  font-weight: bold;
}

.summer-product-card .discount {
  color: #dc2626;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.summer-product-card .buy-button {
  background-color: #1d4ed8;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  border: none;
}

.summer-slider-section .nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  font-size: 20px;
}

.summer-slider-section .left-btn {
  left: 1px;
  border-radius: 20px;
}

.summer-slider-section .right-btn {
  right: 1px;
  border-radius: 20px;
}

.summer-slider-section {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  /* 👈 Ngăn phần scroll vượt ra */
}

.summer-product-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  max-width: 100%;
  /* 👈 Giới hạn khung scroll đúng theo container */
}

.summer-product-scroll::-webkit-scrollbar {
  display: none;
}


/*sam nhanh cho he*/
.promo-slider-section {
  background-color: white;
  padding: 24px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.promo-slider-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  padding: 0 16px;
}

.promo-slider-wrapper {
  position: relative;
  overflow: hidden;
  padding: 0 16px;
}

.promo-slider-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding-bottom: 8px;
}

.promo-slider-scroll::-webkit-scrollbar {
  display: none;
}

.promo-banner-card {
  flex: 0 0 auto;
  min-width: 300px;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.promo-banner-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.promo-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 5;
  cursor: pointer;
  font-size: 20px;
}

.left-btn {
  left: 4px;
}

.right-btn {
  right: 4px;
}

/*thanh toán*/
.payment-offer-section {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 16px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  position: relative;
}

.payment-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.payment-scroll-wrapper {
  position: relative;
  overflow: hidden;
}

.payment-banner-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
  scrollbar-width: none;
}

.payment-banner-scroll::-webkit-scrollbar {
  display: none;
}

.payment-banner-card {
  flex: 0 0 auto;
  min-width: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.payment-banner-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Nút điều hướng */
.payment-scroll-wrapper .nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  font-size: 20px;
}

.payment-scroll-wrapper .left-btn {
  left: 4px;
}

.payment-scroll-wrapper .right-btn {
  right: 4px;
}

/*cam kết*/
.commitment-section {
  background-color: #f5f5f5;
  padding: 20px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.commitment-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  text-align: center;
}

.commitment-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.commitment-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.commitment-title {
  font-weight: bold;
  font-size: 14px;
  color: #222;
  margin-bottom: 4px;
}

.commitment-desc {
  font-size: 13px;
  color: #555;
}
</style>
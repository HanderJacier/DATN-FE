<template>
  <div class="banner-section">
    <!-- Main Banner Carousel -->
    <div id="mainBannerCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
      <div class="carousel-indicators">
        <button 
          v-for="(banner, index) in mainBanners" 
          :key="index"
          type="button" 
          :data-bs-target="`#mainBannerCarousel`" 
          :data-bs-slide-to="index" 
          :class="{ active: index === 0 }"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>
      
      <div class="carousel-inner">
        <div 
          v-for="(banner, index) in mainBanners" 
          :key="index"
          class="carousel-item" 
          :class="{ active: index === 0 }"
        >
          <div class="banner-slide" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-overlay"></div>
            <div class="container">
              <div class="row align-items-center min-vh-50">
                <div class="col-lg-6">
                  <div class="banner-content text-white">
                    <h1 class="banner-title mb-3">{{ banner.title }}</h1>
                    <p class="banner-subtitle mb-4">{{ banner.subtitle }}</p>
                    <div class="banner-actions">
                      <router-link :to="banner.primaryLink" class="btn btn-primary btn-lg me-3">
                        {{ banner.primaryText }}
                      </router-link>
                      <router-link :to="banner.secondaryLink" class="btn btn-outline-light btn-lg">
                        {{ banner.secondaryText }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button class="carousel-control-prev" type="button" data-bs-target="#mainBannerCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#mainBannerCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Promotional Banners -->
    <div class="container my-5">
      <div class="row g-4">
        <div class="col-md-6" v-for="(promo, index) in promoBanners" :key="index">
          <div class="promo-card">
            <router-link :to="promo.link" class="text-decoration-none">
              <div class="promo-image-container">
                <img :src="promo.image" :alt="promo.title" class="promo-image">
                <div class="promo-overlay">
                  <div class="promo-content">
                    <h3 class="promo-title">{{ promo.title }}</h3>
                    <p class="promo-description">{{ promo.description }}</p>
                    <span class="promo-cta">{{ promo.cta }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Categories -->
    <div class="container mb-5">
      <div class="row">
        <div class="col-12">
          <h3 class="text-center mb-4 fw-bold">Danh mục nổi bật</h3>
          <div class="row g-3">
            <div class="col-6 col-md-3" v-for="(category, index) in quickCategories" :key="index">
              <router-link :to="category.link" class="category-card text-decoration-none">
                <div class="category-icon">
                  <i :class="category.icon"></i>
                </div>
                <h6 class="category-name">{{ category.name }}</h6>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mainBanners = ref([
 
  {
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?...',
    title: 'Công nghệ mới nhất 2025',
    subtitle: 'Khám phá những sản phẩm công nghệ tiên tiến với giá ưu đãi đặc biệt',
    primaryText: 'Mua ngay',
    primaryLink: '/timkiem?filter=moi',
    secondaryText: 'Xem thêm',
    secondaryLink: '/timkiem'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?...',
    title: 'Giảm giá lên đến 50%',
    subtitle: 'Cơ hội vàng sở hữu những sản phẩm yêu thích với mức giá không thể tốt hơn',
    primaryText: 'Khám phá ngay',
    primaryLink: '/timkiem?filter=giamgia',
    secondaryText: 'Xem tất cả',
    secondaryLink: '/timkiem'
  },


  {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    title: 'Laptop Gaming Cao Cấp',
    subtitle: 'Trải nghiệm gaming đỉnh cao với dòng laptop gaming mới nhất',
    primaryText: 'Tìm hiểu thêm',
    primaryLink: '/timkiem?q=laptop',
    secondaryText: 'So sánh',
    secondaryLink: '/timkiem?q=gaming'
  }
])

const promoBanners = ref([
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    title: 'Điện thoại thông minh',
    description: 'Bộ sưu tập smartphone mới nhất',
    cta: 'Xem ngay →',
    link: { path: '/timkiem', query: { loai: 1 } } // ✅ Sửa từ ?q= sang ?loai=1
  },
  {
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2112&q=80',
    title: 'Phụ kiện công nghệ',
    description: 'Hoàn thiện trải nghiệm số của bạn',
    cta: 'Khám phá →',
    link: { path: '/timkiem', query: { loai: 'phukien' } } // ✅ Thống nhất dạng router-link object
  }
])


const quickCategories = ref([
  {
    name: 'Laptop',
    icon: 'fas fa-laptop',
    link: '/timkiem?q=laptop'
  },
  {
    name: 'Điện thoại',
    icon: 'fas fa-mobile-alt',
    link: '/timkiem?q=điện thoại'
  },
  {
    name: 'Tablet',
    icon: 'fas fa-tablet-alt',
    link: '/timkiem?q=tablet'
  },
  {
    name: 'Phụ kiện',
    icon: 'fas fa-headphones',
    link: '/timkiem?q=phụ kiện'
  },
  {
    name: 'TV',
    icon: 'fas fa-tv',
    link: '/timkiem?q=tivi'
  },
  {
    name: 'Đồng hồ',
    icon: 'fas fa-clock',
    link: '/timkiem?q=đồng hồ'
  },
  {
    name: 'Camera',
    icon: 'fas fa-camera',
    link: '/timkiem?q=camera'
  },
  {
    name: 'Gaming',
    icon: 'fas fa-gamepad',
    link: '/timkiem?q=gaming'
  }
])
</script>

<style scoped>
.banner-section {
  margin-bottom: 2rem;
}

.banner-slide {
  height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  animation: slideInLeft 1s ease-out;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.banner-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.6;
}

.banner-actions .btn {
  padding: 12px 30px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.banner-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.promo-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 250px;
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.promo-image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.promo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.promo-card:hover .promo-image {
  transform: scale(1.05);
}

.promo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
}

.promo-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.promo-description {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.promo-cta {
  font-weight: 600;
  font-size: 1.1rem;
}

.category-card {
  display: block;
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  color: #333;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  color: #667eea;
}

.category-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.category-name {
  font-weight: 600;
  margin: 0;
}

.min-vh-50 {
  min-height: 50vh;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  opacity: 0.5;
}

.carousel-indicators button.active {
  opacity: 1;
  background-color: white;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .banner-slide {
    height: 400px;
  }
  
  .banner-title {
    font-size: 2.5rem;
  }
  
  .banner-subtitle {
    font-size: 1rem;
  }
  
  .banner-actions .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .promo-card {
    height: 200px;
  }
  
  .category-card {
    padding: 1rem;
  }
  
  .category-icon {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .banner-slide {
    height: 350px;
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .banner-actions .btn {
    width: 100%;
  }
}
</style>
<template>
    <div class="container my-5" v-if="sameCategoryProducts.length > 0">
        <!-- Tiêu đề -->
        <h4 class="fw-semibold border-bottom pb-2 mb-3 fw-bold">Sản phẩm cùng loại</h4>

        <!-- Swiper Carousel -->
        <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
        }" navigation :modules="[Navigation]">

            <SwiperSlide v-for="sp in sameCategoryProducts" :key="sp.id_sp">
                <RouterLink :to="`/sanpham/${sp.id_sp}`" class="text-decoration-none text-dark">
                    <div class="card product-card mx-2">
                        <img :src="sp.anhgoc" class="card-img-top product-img" :alt="sp.tensanpham" />
                        <div class="card-body">
                            <h6 class="fw-bold text-truncate">{{ sp.tensanpham }}</h6>
                            <p class="mb-1 text-secondary small">
                                {{ sp.thuonghieu_ten || 'Thương hiệu khác' }}
                            </p>

                            <!-- Giá sản phẩm -->
                            <div class="product-price" v-if="typeof sp.dongia === 'number'">
                                <template v-if="isGiamGiaValid(sp)">
                                    <span class="price-discount">
                                        {{ sp.giamgia.toLocaleString() }}₫
                                    </span>
                                    <span class="price-original">
                                        {{ sp.dongia.toLocaleString() }}₫
                                    </span>
                                    <span class="discount-badge">
                                        -{{ Math.round((1 - sp.giamgia / sp.dongia) * 100) }}%
                                    </span>
                                </template>

                                <template v-else>
                                    <span class="price-normal">{{ sp.dongia.toLocaleString() }}₫</span>
                                </template>
                            </div>

                            <button class="btn btn-outline-dark w-100 mt-2 rounded-pill">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </RouterLink>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// ✅ Import Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

const route = useRoute()
const sameCategoryProducts = ref([])

const fetchSameCategory = async (id_sp) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/datn/WBH_US_SEL_SANPHAM_BY_SANPHAM_DETAIL',
            {
                params: { p_id_sp: id_sp }
            }
        )

        if (Array.isArray(response.data)) {
            sameCategoryProducts.value = response.data.map(item => item.fields)
        }
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm cùng loại:', error)
    }
}

onMounted(() => {
    if (route.params.id) {
        fetchSameCategory(route.params.id)
    }
})

watch(
    () => route.params.id,
    async (newId, oldId) => {
        if (newId && newId !== oldId) {
            currentIndex.value = 0 // reset ảnh
            await fetchChiTietSanPham(newId)
            await fetchSameCategory(newId)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
)

function isGiamGiaValid(sp) {
    if (!sp?.giamgia || sp.giamgia >= sp.dongia) return false
    if (!sp.hangiamgia) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [day, month, year] = sp.hangiamgia.split('/')
    if (!day || !month || !year) return false

    const hanGiamGia = new Date(year, month - 1, day)
    hanGiamGia.setHours(0, 0, 0, 0)

    return hanGiamGia > today
}
</script>

<style scoped>
.product-card {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    transition: all 0.3s ease;
    height: 100%;
    background-color: #fff;
}

.product-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.card-img-top.product-img {
    display: block;
    margin: auto;
    width: auto;
    height: 200px;
    max-width: 100%;
    object-fit: contain;
    background-color: #fff;
}

.card-img-top {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding-top: 10px;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.price-discount {
    color: #e53935;
    font-weight: 700;
    font-size: 1.05rem;
}

.price-original {
    color: #9e9e9e;
    text-decoration: line-through;
    font-size: 0.85rem;
}

.discount-badge {
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 0.25em 0.6em;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(255, 64, 129, 0.3);
}

.price-normal {
    color: #e53935;
    font-weight: 700;
    font-size: 1rem;
}
</style>

<template>
    <div class="container my-5" v-if="sameCategoryProducts.length > 0">
        <!-- Tiêu đề -->
        <h4 class="fw-bold mb-4">Sản phẩm cùng loại</h4>

        <!-- Swiper Carousel -->
        <Swiper :slides-per-view="1" :space-between="10" :breakpoints="{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
        }" navigation :modules="[Navigation]">
            <SwiperSlide v-for="(sp, idx) in sameCategoryProducts" :key="idx">
                <div class="card h-100 shadow-sm border-0 mx-1">
                    <!-- Ảnh sản phẩm -->
                    <img :src="sp.anhgoc" class="card-img-top" style="height: 180px; object-fit: contain"
                        :alt="sp.tensanpham" />

                    <!-- Nội dung -->
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-truncate mb-1">{{ sp.tensanpham }}</h6>
                        <p class="text-danger fw-bold mb-3">
                            {{ sp.dongia.toLocaleString() }}₫
                        </p>

                        <!-- Nút xem chi tiết -->
                        <router-link :to="`/sanpham/${sp.id_sp}`" class="btn btn-sm btn-outline-primary mt-auto w-100">
                            Xem chi tiết
                        </router-link>
                    </div>
                </div>
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
            // API trả về danh sách fields => lấy ra
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
</script>

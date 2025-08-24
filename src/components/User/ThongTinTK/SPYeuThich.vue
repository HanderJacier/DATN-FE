<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Sản phẩm yêu thích -->
      <div class="col-md-9">
        <!-- Header + Search -->
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <h4 class="fw-bold mb-0">Danh sách sản phẩm yêu thích</h4>
          <div class="d-flex gap-2">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm theo tên / thương hiệu..."
              style="min-width: 260px" />
          </div>
        </div>

        <div v-if="loading" class="small text-muted mb-2">Đang tải...</div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <!-- Empty state -->
        <div v-if="filteredFavorites.length === 0 && !loading && !error" class="text-center text-muted py-5">
          <i class="bi bi-heart fs-1 d-block mb-2"></i>
          <div class="fw-medium">Không có sản phẩm phù hợp</div>
        </div>

        <!-- Grid sản phẩm (4 cột khi >=992px) -->
        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          <div class="col" v-for="(product, index) in filteredFavorites" :key="product.id_sp || index">
            <div class="card product-card h-100">
              <img :src="product.anhgoc" class="card-img-top product-img" :alt="product.tensanpham" />

              <div class="card-body">
                <h6 class="fw-bold text-truncate mb-1">
                  {{ product.tensanpham }}
                </h6>
                <p class="mb-2 text-secondary small">
                  {{ product.thuonghieu_ten || 'Thương hiệu khác' }}
                </p>

                <!-- Giá (đồng bộ logic với Swiper) -->
                <div class="product-price" v-if="typeof toNumber(product.dongia) === 'number'">
                  <template v-if="isGiamGiaValid(product)">
                    <span class="price-discount">
                      {{ formatCurrency(toNumber(product.giamgia)) }}
                    </span>
                    <span class="discount-badge">
                      -{{ discountPercent(product) }}%
                    </span>
                    <span class="price-original">
                      {{ formatCurrency(toNumber(product.dongia)) }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="price-normal">
                      {{ formatCurrency(toNumber(product.dongia)) }}
                    </span>
                  </template>
                </div>
              </div>

              <div class="card-footer border-0 py-2 px-3">
                <div class="d-flex gap-2 w-100">
                  <!-- Nút bỏ yêu thích nhỏ gọn -->
                  <button class="btn btn-danger btn-icon" @click="handleUnfavorite(product)" :disabled="updating"
                    aria-label="Bỏ yêu thích">
                    <i class="bi bi-heart-fill"></i>
                  </button>

                  <!-- Nút xem chi tiết chiếm phần còn lại -->
                  <button class="btn btn-primary flex-fill" @click="goToDetail(product)">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div><!-- /grid -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Slidebar from '@/components/User/Title/Slidebar.vue'
import useSPYeuThichSelect from '../LoadDB/SELThichSP'
import useSPYeuThichUpdate from '../LoadDB/UPDThichSP'

export default {
  name: 'FavoriteProductsPage',
  components: { Slidebar },
  setup() {
    const { favorites, loading, error, fetchSPYeuThich } = useSPYeuThichSelect()
    const { updateSPYeuThich, loading: updating } = useSPYeuThichUpdate()

    // Tìm kiếm
    const searchQuery = ref('')

    // Lấy id_tk
    const getStoredUser = () => {
      try { const s = sessionStorage.getItem('user'); if (s) return JSON.parse(s) } catch (_) { }
      try { const l = localStorage.getItem('user'); if (l) return JSON.parse(l) } catch (_) { }
      return null
    }
    const extractIdTk = (u) => Number(u?.id_tk ?? u?.id ?? u?.userId ?? 0)
    const storedUser = getStoredUser()
    const idTk =
      extractIdTk(storedUser) ||
      Number(sessionStorage.getItem('id_tk')) ||
      Number(localStorage.getItem('id_tk')) ||
      0

    if (idTk) fetchSPYeuThich(idTk)
    else favorites.value = []

    // Item hợp lệ
    const displayFavorites = computed(() =>
      (favorites.value || []).filter(p => Number(p?.id_sp))
    )

    // Lọc theo tìm kiếm (tên / thương hiệu)
    const filteredFavorites = computed(() => {
      const q = searchQuery.value.trim().toLowerCase()
      if (!q) return displayFavorites.value
      return displayFavorites.value.filter(p => {
        const name = String(p?.tensanpham || '').toLowerCase()
        const brand = String(p?.thuonghieu_ten || '').toLowerCase()
        return name.includes(q) || brand.includes(q)
      })
    })

    // Helpers số
    const toNumber = (v) => (v == null ? 0 : Number(v))

    // Kiểm hạn giảm giá dd/MM/yyyy (đồng bộ với Home/Swiper)
    const isGiamGiaValid = (sp) => {
      const base = toNumber(sp?.dongia)
      const sale = toNumber(sp?.giamgia)
      if (!sale || sale >= base) return false
      if (!sp?.hangiamgia) return false
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const [day, month, year] = String(sp.hangiamgia).split('/')
      if (!day || !month || !year) return false
      const han = new Date(year, month - 1, day); han.setHours(0, 0, 0, 0)
      return han > today
    }

    // % giảm = 1 - (giamgia / dongia)
    const discountPercent = (p) => {
      if (!isGiamGiaValid(p)) return 0
      const base = toNumber(p.dongia), sale = toNumber(p.giamgia)
      if (!base || sale >= base) return 0
      return Math.round((1 - sale / base) * 100)
    }

    // Unfavorite
    const handleUnfavorite = async (product) => {
      if (!product?.id_sp || !idTk) return

      const ok = await updateSPYeuThich({ sanpham: Number(product.id_sp), taikhoan: idTk })
      if (ok) {
        // Xóa khỏi localStorage
        const key = `favorites_user_${idTk}`
        let favs = JSON.parse(localStorage.getItem(key) || '[]')
        favs = favs.filter(id => id !== Number(product.id_sp))
        localStorage.setItem(key, JSON.stringify(favs))

        // Refresh danh sách favorite trên page
        await fetchSPYeuThich(idTk)

        // Dispatch event để các nút chi tiết lắng nghe và cập nhật trạng thái
        window.dispatchEvent(new CustomEvent('favorite-updated', { detail: { id_sp: Number(product.id_sp), liked: false } }))
      }
    }


    // Điều hướng
    const goToDetail = (product) => {
      if (!product?.id_sp) return
      window.location.href = `/sanpham/${product.id_sp}`
    }

    // Định dạng VND
    const formatCurrency = (n) =>
      n?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }) ?? '0 ₫'

    return {
      // state
      favorites, loading, error, updating,
      searchQuery,
      // lists
      filteredFavorites,
      // helpers
      toNumber, isGiamGiaValid, discountPercent, formatCurrency,
      // actions
      handleUnfavorite, goToDetail
    }
  }
}
</script>

<style scoped>
/* Card đồng bộ với Home/Swiper */
.product-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  height: 100%;
  background-color: #fff;
}

.product-card:hover {
  transform: translateY(-2px);
}

/* Ảnh đồng bộ */
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

/* Giá đồng bộ */
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
  background: linear-gradient(135deg, #ff4b2b, #3e82ff);
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25em 0.6em;
  border-radius: 6px;
}

.price-normal {
  color: #e53935;
  font-weight: 700;
  font-size: 1rem;
}

/* Icon button nhỏ gọn */
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  /* đổi 50% nếu muốn tròn hẳn */
}

.btn-icon i {
  font-size: 1rem;
}
</style>

<template>
  <header>
    <div class="container-fluid text-white py-2 shadow-sm"
      style="background: linear-gradient(90deg, #667eea, #764ba2);">
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!-- Logo -->
        <router-link to="/" class="d-flex align-items-center text-white text-decoration-none">
          <img :src="logoImg" alt="logo" class="me-2" style="height:30px;" />
          <span class="fw-bold fs-5">TechMartVN<span class="fs-6">.com</span></span>
        </router-link>

        <!-- Tìm kiếm -->
        <div class="flex-grow-1 mx-4 position-relative" style="max-width:500px;"
          v-click-outside="() => showSuggestions = false">
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchKey" @input="filterProducts"
              @focus="showSuggestions = true" @keyup.enter="goToSearchPage" placeholder="Tìm kiếm sản phẩm..." />
            <button class="btn btn-light text-primary" type="button" @click="goToSearchPage">
              <i class="bi bi-search"></i>
            </button>
          </div>

          <!-- Gợi ý kết quả -->
          <div v-if="showSuggestions && filteredProducts.length > 0"
            class="position-absolute bg-white text-dark rounded shadow p-3 w-100 mt-1" style="z-index:1000;">
            <div v-for="(item, index) in filteredProducts.slice(0, 5)" :key="index" class="py-1 border-bottom"
              @click="selectHint(item.tensanpham)" style="cursor:pointer;">
              <i class="bi bi-search me-2"></i>{{ item.tensanpham }}
            </div>
          </div>
        </div>

        <!-- Tài khoản & Giỏ hàng -->
        <div class="d-flex align-items-center gap-3">
          <div class="dropdown" v-click-outside="() => isDropdownOpen = false">
            <button class="btn btn-light text-dark d-flex align-items-center" @click="toggleDropdown">
              <span>{{ displayName }}</span>
              <i class="fas fa-caret-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2" :class="{ show: isDropdownOpen }">
              <template v-if="user">
                <li><router-link class="dropdown-item" to="/thongtintk"><i class="fas fa-user me-2"></i> Tài khoản của
                    tôi</router-link></li>
                <li><router-link class="dropdown-item" to="/tatca"><i class="fas fa-box me-2 text-primary"></i> Đơn
                    mua</router-link></li>
                <li><router-link class="dropdown-item" to="/sanphamyeuthich"><i
                      class="fas fa-heart me-2 text-danger"></i> Yêu thích</router-link></li>
                <li><router-link class="dropdown-item" to="/gopynguoidung"><i
                      class="fas fa-envelope me-2 text-warning"></i> Góp ý</router-link></li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout"><i
                      class="fas fa-sign-out-alt text-success me-2"></i> Đăng xuất</a></li>
              </template>
              <template v-else>
                <li><router-link class="dropdown-item" to="/dangnhap"><i class="fas fa-sign-in-alt me-2"></i> Đăng
                    nhập</router-link></li>
                <li><router-link class="dropdown-item" to="/dangky"><i class="fas fa-user-plus text-primary me-2"></i>
                    Đăng ký</router-link></li>
              </template>
            </ul>
          </div>

          <router-link class="btn btn-dark d-flex align-items-center position-relative" to="/giohang">
            <img :src="cartImg" alt="cart" class="me-2" style="width:18px;height:18px;" />
            <span>Giỏ hàng</span>
            <span v-if="cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.75rem;">
              {{ cartCount }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- ✅ Đã tách Nav thành component -->
      <Catalog />
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Catalog from '@/components/User/Title/Catalog.vue'
import useSanPhamSearch from '@/components/User/LoadDB/Header.js'

// ✅ import ảnh đúng chuẩn Vite
import logoImg from '@/assets/logotechmart.png'
import cartImg from '@/assets/cart.png'

export default {
  name: "HeaderComponent",
  components: {
    Catalog
  },
  setup() {
    const router = useRouter()
    const searchKey = ref("")
    const selectedHint = ref(null)
    const showSuggestions = ref(false)
    const filteredProducts = ref([])

    const isDropdownOpen = ref(false)
    const user = ref(null)
    const cartCount = ref(0)

    const { allProducts } = useSanPhamSearch()  // ✅ dùng từ composable

    const displayName = computed(() =>
      user.value?.hoveten ||
      user.value?.fullname ||
      user.value?.tendangnhap ||
      user.value?.username ||
      user.value?.email ||
      "Tài khoản"
    )

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const logout = () => {
      localStorage.removeItem("user")
      sessionStorage.removeItem("user")
      user.value = null
      router.push("/")
    }

    const getStoredUser = () => {
      let u = null
      // Ưu tiên sessionStorage (admin)
      const sessionUser = sessionStorage.getItem("user")
      if (sessionUser) {
        u = JSON.parse(sessionUser)
      } else {
        const localUser = localStorage.getItem("user")
        if (localUser) u = JSON.parse(localUser)
      }
      user.value = u
    }

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    const filterProducts = () => {
      const keyword = searchKey.value.toLowerCase().trim()
      filteredProducts.value = allProducts.value.filter(sp =>
        sp.tensanpham.toLowerCase().includes(keyword)
      )
    }

    const selectHint = (hint) => {
      selectedHint.value = hint
      searchKey.value = hint
      goToSearchPage()
    }

    const goToSearchPage = () => {
      const keyword = (selectedHint.value || searchKey.value).trim()
      if (!keyword) return
      router.push({ path: "/timkiem", query: { q: keyword } })
      showSuggestions.value = false
      selectedHint.value = null
    }

    onMounted(() => {
      getStoredUser()
      updateCartCount()
      window.addEventListener("storage", updateCartCount)
    })

    return {
      logoImg,
      cartImg,
      isDropdownOpen,
      toggleDropdown,
      displayName,
      logout,
      user,
      cartCount,
      searchKey,
      selectedHint,
      showSuggestions,
      allProducts,
      filteredProducts,
      filterProducts,
      selectHint,
      goToSearchPage
    }
  }
}
</script>

<style scoped>
.close-icon {
  color: #9ca3af;
}
</style>

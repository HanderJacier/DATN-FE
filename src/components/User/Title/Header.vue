<template>
  <header>
    <div class="container-fluid text-white py-2 shadow-sm" style="background: linear-gradient(90deg, #667eea, #764ba2);">
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!-- Logo -->
        <router-link to="/" class="d-flex align-items-center text-white text-decoration-none">
          <img src="/src/assets/logotechmart.png" alt="logo" class="me-2" style="height:30px;" />
          <span class="fw-bold fs-5">TechMartVN<span class="fs-6">.com</span></span>
        </router-link>

        <!-- Tìm kiếm -->
        <div class="flex-grow-1 mx-4 position-relative" style="max-width:500px;" v-click-outside="() => showSuggestions = false">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="searchText"
              @input="filterProducts"
              @focus="showSuggestions = true"
              placeholder="Tìm kiếm sản phẩm..."
            />
            <button class="btn btn-light text-primary" type="button" @click="goToSearchPage">
              <i class="bi bi-search"></i>
            </button>
          </div>

          <!-- Gợi ý kết quả -->
          <div
            v-if="showSuggestions && filteredProducts.length > 0"
            class="position-absolute bg-white text-dark rounded shadow p-3 w-100 mt-1"
            style="z-index:1000;"
          >
            <div
              v-for="(item, index) in filteredProducts.slice(0, 5)"
              :key="index"
              class="py-1 border-bottom"
              @click="goToProduct(item)"
              style="cursor:pointer;"
            >
              <i class="bi bi-search me-2"></i>{{ item.tensanpham }}
            </div>
          </div>
        </div>

        <!-- Tài khoản & Giỏ hàng -->
        <div class="d-flex align-items-center gap-3">
          <!-- Dropdown -->
          <div class="dropdown" v-click-outside="() => isDropdownOpen = false">
            <button class="btn btn-light text-dark d-flex align-items-center" @click="toggleDropdown">
              <span class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
                <i class="fas fa-user"></i>
              </span>
              <span>{{ displayName }}</span>
              <i class="fas fa-caret-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2" :class="{ show: isDropdownOpen }">
              <template v-if="user">
                <li><router-link class="dropdown-item" to="/thongtintk"><i class="fas fa-user me-2"></i> Tài khoản của tôi</router-link></li>
                <li><router-link class="dropdown-item" to="/hoadon"><i class="fas fa-box me-2 text-primary"></i> Đơn mua</router-link></li>
                <li><router-link class="dropdown-item" to="/sanphamyeuthich"><i class="fas fa-heart me-2 text-danger"></i> Yêu thích</router-link></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt text-success me-2"></i> Đăng xuất</a></li>
              </template>
              <template v-else>
                <li><router-link class="dropdown-item" to="/dangnhap"><i class="fas fa-sign-in-alt me-2"></i> Đăng nhập</router-link></li>
                <li><router-link class="dropdown-item" to="/dangky"><i class="fas fa-user-plus text-primary me-2"></i> Đăng ký</router-link></li>
              </template>
            </ul>
          </div>

          <!-- Giỏ hàng -->
          <router-link class="btn btn-dark d-flex align-items-center position-relative" to="/giohang">
            <img src="/src/assets/cart.png" alt="cart" class="me-2" style="width:18px;height:18px;" />
            <span>Giỏ hàng</span>
            <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.75rem;">
              {{ cartCount }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="nav justify-content-center gap-3 mt-2">
        <a class="nav-link text-white" href="#">Iphone 16</a>
        <a class="nav-link text-white" href="#">Ipad</a>
        <a class="nav-link text-white" href="#">TV Samsung</a>
        <a class="nav-link text-white" href="#">Chuột logitech</a>
        <a class="nav-link text-white" href="#">Loa mini</a>
        <a class="nav-link text-white" href="#">Apple watch</a>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'

export default {
  name: "HeaderComponent",
  setup() {
    const router = useRouter()
    const searchText = ref("")
    const showSuggestions = ref(false)
    const allProducts = ref([])
    const filteredProducts = ref([])

    const isDropdownOpen = ref(false)
    const user = ref(null)
    const cartCount = ref(0)

    const displayName = computed(() => user.value?.hoVaTen || "Tài khoản")

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
      const u = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"))
      user.value = u
    }

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    const fetchProducts = async () => {
      try {
        const res = await apiClient.get('/san-pham')
        allProducts.value = res.data
      } catch (err) {
        console.error("Không tải được sản phẩm:", err)
      }
    }

    const filterProducts = () => {
      const keyword = searchText.value.toLowerCase().trim()
      filteredProducts.value = allProducts.value.filter(sp =>
        sp.tensanpham.toLowerCase().includes(keyword)
      )
    }

    const goToProduct = (product) => {
      router.push(`/sanpham/${product.id}`)
      searchText.value = ''
      showSuggestions.value = false
    }

    const goToSearchPage = () => {
      if (!searchText.value.trim()) return
      router.push({ path: "/timkiem", query: { q: searchText.value.trim() } })
      searchText.value = ''
      showSuggestions.value = false
    }

    onMounted(() => {
      getStoredUser()
      updateCartCount()
      fetchProducts()
      window.addEventListener("storage", updateCartCount)
    })

    return {
      isDropdownOpen,
      toggleDropdown,
      displayName,
      logout,
      user,
      cartCount,
      searchText,
      showSuggestions,
      allProducts,
      filteredProducts,
      filterProducts,
      goToProduct,
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

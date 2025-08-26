<template>
  <header>
    <div
      class="container-fluid text-white py-3 shadow-sm"
      style="background: linear-gradient(90deg, #667eea, #764ba2);"
    >
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!-- Logo -->
        <router-link to="/" class="d-flex align-items-center text-white text-decoration-none">
          <img :src="logoImg" alt="logo" class="me-2" style="height:30px;" />
          <span class="fw-bold fs-5">TechMartVN<span class="fs-6">.com</span></span>
        </router-link>

        <!-- Tìm kiếm -->
        <div
          class="flex-grow-1 mx-4 position-relative"
          style="max-width:500px;"
          v-click-outside="() => (showSuggestions = false)"
        >
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="searchKey"
              @input="filterProducts"
              @focus="showSuggestions = true"
              @keyup.enter="goToSearchPage"
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
              @click="selectHint(item.tensanpham)"
              style="cursor:pointer;"
            >
              <i class="bi bi-search me-2"></i>{{ item.tensanpham }}
            </div>
          </div>
        </div>

        <!-- Tài khoản & Giỏ hàng -->
        <div class="d-flex align-items-center gap-3">
          <div class="dropdown" v-click-outside="() => (isDropdownOpen = false)">
            <button class="btn btn-light text-dark d-flex align-items-center" @click="toggleDropdown">
              <span>{{ displayName }}</span>
              <i class="fas fa-caret-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2" :class="{ show: isDropdownOpen }">
              <template v-if="user">
                <li>
                  <router-link class="dropdown-item" to="/thongtintk">
                    <i class="fas fa-user me-2"></i> Tài khoản của tôi
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/tatca">
                    <i class="fas fa-box me-2 text-primary"></i> Đơn mua
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/sanphamyeuthich">
                    <i class="fas fa-heart me-2 text-danger"></i> Yêu thích
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/gopynguoidung">
                    <i class="fas fa-envelope me-2 text-warning"></i> Góp ý
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="fas fa-sign-out-alt text-success me-2"></i> Đăng xuất
                  </a>
                </li>
              </template>
              <template v-else>
                <li>
                  <router-link class="dropdown-item" to="/dangnhap">
                    <i class="fas fa-sign-in-alt me-2"></i> Đăng nhập
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/dangky">
                    <i class="fas fa-user-plus text-primary me-2"></i> Đăng ký
                  </router-link>
                </li>
              </template>
            </ul>
          </div>

          <router-link 
            class="btn btn-dark d-flex align-items-center position-relative" 
            to="/giohang"
          >
            <img :src="cartImg" alt="cart" class="me-2" style="width:18px;height:18px;" />
            <span>Giỏ hàng</span>
            <!-- 🔴 Chấm đỏ: có sp thì hiện -->
            <span
              v-if="cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style="width: 10px; height: 10px;"
            ></span>
          </router-link>

        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Catalog from '@/components/User/Title/Catalog.vue'
import useSanPhamSearch from '@/components/User/LoadDB/Header.js'
import useCartManagement from '../LoadDB/useCartManagement.js'
import useCartProcedures from '../LoadDB/GioHang.js'   // <-- dùng proc để đọc giỏ DB
import logoImg from '@/assets/logotechmart.png'
import cartImg from '@/assets/cart.png'

export default {
  name: 'HeaderComponent',
  components: { Catalog },
  setup() {
    const router = useRouter()
    const searchKey = ref('')
    const selectedHint = ref(null)
    const showSuggestions = ref(false)
    const filteredProducts = ref([])

    // chỉ dùng để xoá giỏ khi logout (local)
    const { clearCartOnLogout } = useCartManagement()

    // gọi proc DB
    const { selGioHang } = useCartProcedures()

    const isDropdownOpen = ref(false)
    const user = ref(null)
    const cartCount = ref(0)

    const { allProducts } = useSanPhamSearch()

    const displayName = computed(
      () =>
        user.value?.hoveten ||
        user.value?.fullname ||
        user.value?.tendangnhap ||
        user.value?.username ||
        user.value?.email ||
        'Tài khoản'
    )

    const isLoggedIn = computed(() => !!(user.value && user.value.id_tk))
    const userId = computed(() => (isLoggedIn.value ? Number(user.value.id_tk) : null))

    const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value }

    const logout = () => {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      clearCartOnLogout()        // dọn local cart
      user.value = null
      cartCount.value = 0
      router.push('/')
      // phát sự kiện để các nơi khác cập nhật
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }

    const getStoredUser = () => {
      let u = null
      const sessionUser = sessionStorage.getItem('user')
      if (sessionUser) {
        u = JSON.parse(sessionUser)
      } else {
        const localUser = localStorage.getItem('user')
        if (localUser) u = JSON.parse(localUser)
      }
      user.value = u
    }

    // ----- Badge giỏ hàng -----
    const updateCartCountGuest = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cartCount.value = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    }

    const updateCartCountDB = async () => {
      try {
        if (!userId.value) { cartCount.value = 0; return }
        const { items } = await selGioHang(userId.value)
        cartCount.value = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
      } catch (e) {
        console.error('Badge count DB error:', e)
        // fallback không làm gì; badge giữ giá trị cũ
      }
    }

    const updateCartCount = async () => {
      if (isLoggedIn.value) await updateCartCountDB()
      else updateCartCountGuest()
    }

    // ----- Search -----
    const filterProducts = () => {
      const keyword = searchKey.value.toLowerCase().trim()
      filteredProducts.value = allProducts.value.filter((sp) =>
        (sp.tensanpham || '').toLowerCase().includes(keyword)
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
      router.push({ path: '/timkiem', query: { q: keyword } })
      showSuggestions.value = false
      selectedHint.value = null
    }

    // ----- Lifecycle -----
    onMounted(async () => {
      getStoredUser()
      await updateCartCount()

      // lắng nghe cập nhật giỏ trong cùng tab
      window.addEventListener('cartUpdated', updateCartCount)
      // và đồng bộ đa tab (login/logout hoặc giỏ local thay đổi)
      window.addEventListener('storage', async (e) => {
        if (e.key === 'user' || e.key === 'cart') {
          getStoredUser()
          await updateCartCount()
        }
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
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

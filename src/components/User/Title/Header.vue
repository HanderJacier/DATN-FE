<template>
  <header>
    <div class="container-fluid bg-primary text-white py-2 shadow-sm">
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!-- Logo -->
        <router-link to="/" class="d-flex align-items-center text-white text-decoration-none">
          <img src="/src/assets/logotechmart.png" alt="logo" class="me-2" style="height:30px;" />
          <span class="fw-bold fs-5">TechMartVN<span class="fs-6">.com</span></span>
        </router-link>

        <!-- Search -->
        <div class="flex-grow-1 mx-4 position-relative" ref="searchRef" v-click-outside-search style="max-width:500px;">
          <div class="input-group">
            <input type="text" class="form-control" @focus="showSuggestions = true"
              placeholder="Tìm kiếm sản phẩm..." />
            <button class="btn btn-light text-primary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>

          <!-- Gợi ý tìm kiếm -->
          <div v-if="showSuggestions" class="position-absolute bg-white text-dark rounded shadow p-3 w-100 mt-1"
            style="z-index:1000;">
            <div class="mb-2">
              <div class="d-flex align-items-center justify-content-between border-bottom py-1"
                v-for="(item, index) in searchHistory" :key="index">
                <span><i class="bi bi-clock me-2"></i>{{ item }}</span>
                <i class="bi bi-x close-icon" @click="removeHistory(index)" style="cursor:pointer;"></i>
              </div>
              <div class="text-primary text-center mt-2" style="cursor:pointer;">Xem thêm</div>
            </div>
            <div>
              <strong>Xu hướng tìm kiếm</strong>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="badge bg-light text-dark border" v-for="(trend, index) in trending" :key="index"
                  style="cursor:pointer;">
                  <i class="bi bi-search me-1"></i>{{ trend }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tài khoản & Giỏ hàng -->
        <div class="d-flex align-items-center gap-3">
          <!-- Dropdown -->
          <div class="dropdown" ref="dropdownRef" v-click-outside-dropdown>
            <button class="btn btn-primary d-flex align-items-center" type="button" @click="toggleDropdown"
              data-bs-toggle="dropdown" aria-expanded="false">
              <span class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                style="width:32px;height:32px;">
                <i class="fas fa-user"></i>
              </span>
              <span>{{ displayName }}</span>
              <i class="fas fa-caret-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2" :class="{ show: isDropdownOpen }">
              <template v-if="user">
                <li>
                  <router-link class="dropdown-item" to="/thongtintk">
                    <i class="fas fa-user text-dark me-2"></i> Tài khoản của tôi
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item" href="#"><i class="fas fa-box text-primary me-2"></i> Đơn mua</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#"><i class="fas fa-heart text-danger me-2"></i> Sản phẩm yêu thích</a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="fas fa-sign-out-alt text-success me-2"></i> Đăng xuất
                  </a>
                </li>
              </template>
              <template v-else>
                <li>
                  <router-link class="dropdown-item" to="/dangnhap">
                    <i class="fas fa-sign-in-alt text-dark me-2"></i> Đăng nhập
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

          <!-- Giỏ hàng -->
          <router-link class="btn btn-dark d-flex align-items-center position-relative" to="/giohang">
            <img src="/src/assets/cart.png" alt="cart" class="me-2" style="width:18px;height:18px;" />
            <span>Giỏ hàng</span>
            <span v-if="cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.75rem;">
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
export default {
  name: "HeaderComponent",
  data() {
    return {
      isDropdownOpen: false,
      showSuggestions: false,
      searchHistory: ["Tivi", "tai nghe", "Laptop"],
      trending: ["iphone 16", "Tivi sony", "Loa bluetooth", "Laptop Asus", "Chuột laptop"],
      user: null,
      cartCount: 0 // ✅ Đếm số lượng sản phẩm trong giỏ hàng
    };
  },
  computed: {
    displayName() {
      return this.user?.hoVaTen || "Tài khoản";
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    removeHistory(index) {
      this.searchHistory.splice(index, 1);
    },
    logout() {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      this.user = null;
      this.$router.push("/");
    },
    getStoredUser() {
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));
      this.user = user;
    },
    updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  mounted() {
    this.getStoredUser();
    this.updateCartCount();
    window.addEventListener("storage", this.updateCartCount);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.updateCartCount);
  }
};
</script>

<style scoped>
.close-icon {
  color: #9ca3af;
}
</style>

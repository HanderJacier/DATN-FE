<template>
  <header class="bg-primary text-white shadow-sm">
    <div class="container py-2">
      <div class="row align-items-center justify-content-between">
        <!-- Logo -->
        <div class="col-auto d-flex align-items-center">
          <router-link to="/" class="d-flex align-items-center text-white text-decoration-none">
            <img src="../../../assets/logotechmart.png" alt="logo" height="32" class="me-2" />
            <span class="fw-bold fs-5">TechMartVN<span class="fs-6">.com</span></span>
          </router-link>
        </div>

        <!-- Search -->
        <div class="col col-md-6 col-lg-5 my-2 my-md-0 position-relative" ref="searchRef" v-click-outside-search>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm sản phẩm..."
              @focus="showSuggestions = true"
            />
            <button class="btn btn-light">
              <i class="bi bi-search text-primary"></i>
            </button>
          </div>

          <!-- Gợi ý tìm kiếm -->
          <div v-if="showSuggestions" class="search-suggestions">
            <div v-for="(item, index) in searchHistory" :key="index" class="d-flex justify-content-between py-1 border-bottom">
              <div><i class="bi bi-clock me-2"></i>{{ item }}</div>
              <i class="bi bi-x text-muted" @click="removeHistory(index)" style="cursor: pointer;"></i>
            </div>
            <div class="text-primary text-center mt-2" style="cursor: pointer">Xem thêm</div>
            <div class="mt-3">
              <strong>Xu hướng tìm kiếm</strong>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="badge bg-light text-dark border" v-for="(trend, index) in trending" :key="index">
                  <i class="bi bi-search me-1"></i>{{ trend }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tài khoản + Giỏ hàng -->
        <div class="col-auto d-flex align-items-center gap-3">
          <!-- Dropdown -->
          <div class="dropdown">
            <button
              class="btn btn-light text-primary d-flex align-items-center dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                <i class="fas fa-user"></i>
              </div>
              {{ displayName }}
            </button>
            <ul class="dropdown-menu">
              <template v-if="user">
                <li>
                  <router-link class="dropdown-item" to="/thongtintk">
                    <i class="fas fa-user me-2 text-dark"></i> Tài khoản của tôi
                  </router-link>
                </li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-box me-2 text-primary"></i> Đơn mua</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-heart me-2 text-danger"></i> Yêu thích</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="fas fa-sign-out-alt me-2 text-success"></i> Đăng xuất
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
                    <i class="fas fa-user-plus me-2 text-primary"></i> Đăng ký
                  </router-link>
                </li>
              </template>
            </ul>
          </div>

          <!-- Giỏ hàng -->
          <router-link class="dropdown-item" to="/giohang">
            <div class="d-flex align-items-center bg-dark text-white px-3 py-1 rounded-pill" style="cursor: pointer;">
              <img src="../../../assets/cart.png" alt="cart" width="18" height="18" class="me-2" />
              <span>Giỏ hàng</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <div class="bg-dark py-2">
      <div class="container d-flex flex-wrap justify-content-center gap-4">
        <a href="#" class="text-white text-decoration-none">Iphone 16</a>
        <a href="#" class="text-white text-decoration-none">Ipad</a>
        <a href="#" class="text-white text-decoration-none">TV Samsung</a>
        <a href="#" class="text-white text-decoration-none">Chuột logitech</a>
        <a href="#" class="text-white text-decoration-none">Loa mini</a>
        <a href="#" class="text-white text-decoration-none">Apple watch</a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  data() {
    return {
      showSuggestions: false,
      searchHistory: ["Tivi", "tai nghe", "Laptop"],
      trending: ["iphone 16", "Tivi sony", "Loa bluetooth", "Laptop Asus", "Chuột laptop"],
      user: null,
    };
  },
  computed: {
    displayName() {
      return this.user?.hoVaTen || "Tài khoản";
    },
  },
  methods: {
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
    }
  },
  mounted() {
    this.getStoredUser();
  }
};
</script>

<style scoped>
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  font-size: 14px;
}
</style>

<template>
  <header>
    <div class="header-fluid">
      <div class="top-header">
        <!-- Logo -->
        <router-link to="/" class="logo" style="text-decoration: none; color: inherit;">
          <img src="/src/assets/logotechmart.png" alt="logo" />
          <span>TechMartVN<span style="font-size: 10px">.com</span></span>
        </router-link>

        <!-- Search -->
        <div class="search-bar" ref="searchRef" v-click-outside-search>
          <input type="text" @focus="showSuggestions = true" placeholder="Tìm kiếm sản phẩm..." />
          <button>
            <i class="bi bi-search"></i>
          </button>

          <!-- Gợi ý tìm kiếm -->
          <div v-if="showSuggestions" class="search-suggestions">
            <div class="history-item" v-for="(item, index) in searchHistory" :key="index">
              <i class="bi bi-clock"></i>
              <span>{{ item }}</span>
              <i class="bi bi-x close-icon" @click="removeHistory(index)"></i>
            </div>
            <div class="see-more">Xem thêm</div>

            <div class="trending-section">
              <strong>Xu hướng tìm kiếm</strong>
              <div class="trending-tags">
                <span class="tag" v-for="(trend, index) in trending" :key="index">
                  <i class="bi bi-search"></i> {{ trend }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tài khoản & Giỏ hàng -->
        <div class="d-flex align-items-center gap-3">
          <!-- Dropdown -->
          <!-- Dropdown -->
          <div class="position-relative" ref="dropdownRef" v-click-outside-dropdown>
            <button class="user-button" @click="toggleDropdown">
              <span class="user-icon"><i class="fas fa-user"></i></span>
              <span class="user-name">Thuy Tien</span>
              <i class="fas fa-caret-down dropdown-caret"></i>
            </button>

            <ul v-if="isDropdownOpen" class="dropdown-menu show">
              <RouterLink to="/UserDetail" class="dropdown-item text-decoration-none">
                <i class="fas fa-user icon-black"></i> Tài khoản của tôi
              </RouterLink>
              <li><a class="dropdown-item" href="#"><i class="fas fa-box icon-blue"></i> Đơn mua</a></li>
              <li><a class="dropdown-item" href="#"><i class="fas fa-heart icon-red"></i> Sản phẩm yêu thích</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt icon-yellow"></i> Đăng xuất</a></li>
            </ul>
          </div>



          <!-- Giỏ hàng -->
          <router-link to="/cart" class="text-decoration-none">
            <div class="cart">
              <div class="cart-icon">
                <img src="/src/assets/cart.png" alt="cart" class="icon" />
              </div>
              <div class="text-white">Giỏ hàng</div>
            </div>
          </router-link>
        </div>
      </div>
      <!-- Nav links -->
      <div class="nav-links">
        <a href="#">Iphone 16</a>
        <a href="#">Ipad</a>
        <a href="#">TV Samsung</a>
        <a href="#">Chuột logitech</a>
        <a href="#">Loa mini</a>
        <a href="#">Apple watch</a>
      </div>
    </div>
  </header>
</template>


<script>
import { RouterLink } from 'vue-router';

export default {
  name: "HeaderComponent",
  data() {
    return {
      isDropdownOpen: false,
      showSuggestions: false,
      searchHistory: ["Tivi", "tai nghe", "Laptop"],
      trending: ["iphone 16", "Tivi sony", "Loa bluetooth", "Laptop Asus", "Chuột laptop"],
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    removeHistory(index) {
      this.searchHistory.splice(index, 1);
    },
  },
  directives: {
    clickOutsideSearch: {
      mounted(el, binding, vnode) {
        el._clickOutsideHandler = function (event) {
          const instance = binding.instance;
          const ref = instance.$refs.searchRef;
          if (ref && !ref.contains(event.target)) {
            instance.showSuggestions = false;
          }
        };
        document.addEventListener("click", el._clickOutsideHandler);
      },
      unmounted(el) {
        document.removeEventListener("click", el._clickOutsideHandler);
      },
    },
    clickOutsideDropdown: {
      mounted(el, binding, vnode) {
        el._clickOutsideHandler = function (event) {
          const instance = binding.instance;
          const ref = instance.$refs.dropdownRef;
          if (ref && !ref.contains(event.target)) {
            instance.isDropdownOpen = false;
          }
        };
        document.addEventListener("click", el._clickOutsideHandler);
      },
      unmounted(el) {
        document.removeEventListener("click", el._clickOutsideHandler);
      },
    },
  },
};
</script>



<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

.header-fluid {
  background-color: #4877DC;
  color: white;
  padding: 12px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 30px;
  margin-right: 8px;
}

.logo span {
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.5px;
}

.search-bar {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 12px 20px;
  max-width: 500px;
  position: relative;
}

.search-bar input {
  flex: 1;
  padding: 8px 14px;
  border: none;
  border-radius: 8px 0 0 8px;
  outline: none;
  font-size: 14px;
}

.search-bar button {
  padding: 8px 14px;
  border: none;
  background-color: white;
  color: #2563eb;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-bar button:hover {
  background-color: #e2e8f0;
}

.search-bar i {
  font-size: 18px;
}

.account-cart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.account-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.account-icon img {
  width: 35px;
  height: 35px;
}

.cart {
  background-color: #1e293b;
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.cart:hover {
  background-color: #334155;
}

.cart-icon img {
  width: 18px;
  height: 18px;
}

.nav-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 10px;
  margin-right: 90px;
  font-size: 14px;
  font-weight: 500;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  text-decoration: underline;
  color: #cbd5e1;
}

.icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.user-button {
  display: flex;
  align-items: center;
  background-color: #4877DC;
  /* Màu xanh trong ảnh */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.user-icon {
  background-color: white;
  color: #407BFF;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.user-icon i {
  font-size: 16px;
}

.dropdown-caret {
  margin-left: 8px;
  font-size: 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  color: black;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-width: 200px;
  z-index: 1000;
  padding: 8px 0;
}

.dropdown-item {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
}

.dropdown-item i {
  margin-right: 8px;
  width: 20px;
  text-align: center;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  color: black;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-top: 6px;
  font-size: 14px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
}

.history-item i {
  margin-right: 8px;
  color: #6b7280;
}

.close-icon {
  cursor: pointer;
  color: #9ca3af;
  margin-left: 10px;
}

.see-more {
  color: #2563eb;
  text-align: center;
  margin-top: 8px;
  cursor: pointer;
}

.trending-section {
  margin-top: 16px;
}

.trending-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
}

.tag i {
  margin-right: 6px;
}

.icon-black {
  color: #010912;
  /* màu xanh dương */
}

.icon-blue {
  color: #007bff;
  /* màu xanh dương */
}

.icon-red {
  color: #ee0f0f;
  /* màu xanh dương */
}

.icon-yellow {
  color: #9feb49;
  /* màu xanh dương */
}
</style>

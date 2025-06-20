<template>
  <header class="header">
    <div class="header-top">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <img :src="logo" alt="TechMart Logo" class="logo-icon" />
          <span class="site-name">TechMartVN.com</span>
        </router-link>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        <button><i class="fa fa-search"></i></button>
      </div>

      <div class="user-actions">
        <router-link to="/dangnhap-user" class="user-info">
          <i class="fa fa-user-circle"></i> Thuy Tien <i class="fa fa-caret-down"></i>
        </router-link>
        <router-link to="/gio-hang" class="cart">
          <i class="fa fa-shopping-cart"></i> Giỏ hàng
        </router-link>
      </div>
    </div>

    <nav class="nav-menu">
      <ul>
        <li><router-link to="/iphone-16">Iphone 16</router-link></li>
        <li><router-link to="/ipad">Ipad</router-link></li>
        <li><router-link to="/tv-samsung">TV Samsung</router-link></li>
        <li><router-link to="/chuot-logitech">Chuột Logitech</router-link></li>
        <li><router-link to="/loa-mini">Loa Mini</router-link></li>
        <li><router-link to="/apple-watch">Apple Watch</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>

</script>

<style scoped>
.header {
  background-color: #2d6cdf;
  color: white;
  padding: 10px 20px;
  font-family: Arial, sans-serif;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.logo-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
}

.logo-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}

.site-name {
  font-weight: bold;
  font-size: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.search-bar input {
  border: none;
  padding: 6px 10px;
  outline: none;
  width: 250px;
}

.search-bar button {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #2d6cdf;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.user-info,
.cart {
  cursor: pointer;
  white-space: nowrap;
  color: white;
  text-decoration: none;
}

.nav-menu {
  background-color: #3c80f0;
  margin-top: 10px;
  padding: 8px 0;
}

.nav-menu ul {
  display: flex;
  gap: 20px;
  list-style: none;
  padding-left: 0;
  margin: 0;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-menu li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-menu li a:hover {
  text-decoration: underline;
}
</style>

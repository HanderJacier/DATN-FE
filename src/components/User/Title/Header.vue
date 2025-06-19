<template>
  <header class="header">
    <div class="header-top">
      <div class="logo">
        <img src="/src/assets/logotechmart.png "alt="" class="logo-icon">
        <span>TechMartVN.com</span>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        <button><i class="fa fa-search"></i></button>
      </div>
      <div class="user-actions">
        <div class="user-info">
          <i class="fa fa-user-circle"></i> Thuy Tien <i class="fa fa-caret-down"></i>
        </div>
        <div class="cart">
          <i class="fa fa-shopping-cart"></i> Giỏ hàng
        </div>
      </div>
    </div>
    <nav class="nav-menu">
      <ul>
        <li>Iphone 16</li>
        <li>Ipad</li>
        <li>TV Samsung</li>
        <li>Chuột logitech</li>
        <li>Loa mini</li>
        <li>Apple watch</li>
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
}

.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.logo img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 4px;
  overflow: hidden;
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
}

.user-info,
.cart {
  cursor: pointer;
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
}

.nav-menu li {
  cursor: pointer;
  font-weight: 500;
}
</style>

<template>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/src/assets/logotechmart.png" alt="" class="logo-icon" />
        <span class="logo-text">TechMartVN.com</span>
      </div>
      <h4>QUẢN LÝ</h4>
      <ul class="menu">
        <li><i class="fa fa-box"></i> Quản lý sản phẩm</li>
        <li><i class="fa fa-shopping-cart"></i> Quản lý đơn hàng</li>
        <li><i class="fa fa-user"></i> Quản lý người dùng</li>
        <li><i class="fa fa-chart-bar"></i> Thống kê và báo cáo</li>
        <li><i class="fa fa-comment-dots"></i> Xem góp ý</li>
      </ul>
    </aside>

    <!-- Main content -->
    <main class="main">
      <header class="topbar">
        <button class="logout-btn">
          <i class="fa fa-sign-out-alt"></i> Đăng xuất
        </button>
      </header>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #1e3a8a; /* Xanh đậm */
  color: white;
  padding: 20px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
}
.logo-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.logo-text {
  color: white;
}

.sidebar h4 {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 10px;
  margin: 15px 0;
  background-color: #2563eb; /* Xanh sáng */
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu li:hover {
  background-color: #1d4ed8; /* Hover sáng hơn */
}

.menu i {
  margin-right: 10px;
}

/* Main */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  background-color: #1e3a8a;
  padding: 15px;
  text-align: right;
}

.logout-btn {
  background-color: #ef4444; /* Đỏ */
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #dc2626;
}
</style>

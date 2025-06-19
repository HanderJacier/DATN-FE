<template>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/src/assets/logotechmart.png "alt="" class="logo-icon">
        <span style="color:white">TechMartVN.com</span>
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
// Không cần logic JS hiện tại
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
  background-color: #3f7de0;
  color: white;
  padding: 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
  
}
.logo-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.sidebar h4 {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 10px;
  margin: 30px 0;
  background-color: #2f6bd0;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
 

   
}

.menu li:hover {
  background-color: #2559c0;
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
  background-color: #3f7de0;
  padding: 15px;
  text-align: right;
}

.logout-btn {
  background-color: #dfe818;
  color: #000;
  padding: 8px 15px;
  border: none;
  border-radius:10px;
  font-weight: bold;
  cursor: pointer;
}

.logout-btn i {
  margin-right: 5px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

/* Nút quay lại */
.btn-back {
  display: inline-block;
  margin-top: 20px;
  background-color: #6c757d;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
}

.btn-back:hover {
  background-color: #5a6268;
}
</style>
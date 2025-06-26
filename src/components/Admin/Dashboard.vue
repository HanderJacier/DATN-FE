<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-md-3 col-lg-2 bg-primary text-white min-vh-100 p-3">
        <div class="d-flex align-items-center mb-4">
          <img src="../../assets/logotechmart.png" alt="Logo" class="me-2" width="30" height="30" />
          <span class="fw-bold">TechMartVN.com</span>
        </div>

        <h6 class="text-uppercase opacity-75">Quản lý</h6>
        <ul class="list-group list-group-flush">
          <router-link to="/admin/sanpham" class="list-group-item bg-primary text-white border-0 my-2 rounded">
            <i class="fa fa-box me-2"></i> Quản lý sản phẩm
          </router-link>
          <router-link to="/admin/donhang" class="list-group-item bg-primary text-white border-0 my-2 rounded">
            <i class="fa fa-shopping-cart me-2"></i> Quản lý đơn hàng
          </router-link>
          <router-link to="/admin/nguoidung" class="list-group-item bg-primary text-white border-0 my-2 rounded">
            <i class="fa fa-user me-2"></i> Quản lý người dùng
          </router-link>
          <router-link to="/admin/thongke" class="list-group-item bg-primary text-white border-0 my-2 rounded">
            <i class="fa fa-chart-bar me-2"></i> Thống kê và báo cáo
          </router-link>
          <router-link to="/admin/gopy" class="list-group-item bg-primary text-white border-0 my-2 rounded">
            <i class="fa fa-comment-dots me-2"></i> Xem góp ý
          </router-link>
        </ul>
      </aside>

      <!-- Main content -->
      <main class="col-md-9 col-lg-10 d-flex flex-column p-0">
        <!-- Topbar -->
        <header class="bg-primary text-end p-3">
          <button class="btn btn-warning fw-bold align-items-center" @click="handleLogout">
            <i class="fa fa-sign-out-alt me-2"></i> Đăng xuất
          </button>
        </header>

        <!-- Content -->
        <div class="flex-fill bg-light p-4">
          <!-- Nội dung chính sẽ render qua <router-view> -->
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function handleLogout() {
    sessionStorage.clear();
    router.push('/dangnhap');
  }
</script>
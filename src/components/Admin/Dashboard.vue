<template>
  <div class="container-fluid d-flex p-0" style="height: 100vh; font-family: Arial, sans-serif;">
    <!-- Sidebar -->
    <aside class="bg-primary text-white p-3" style="width: 250px;">
      <div class="d-flex align-items-center mb-4">
        <img src="/src/assets/logotechmart.png" alt="Logo" class="me-2" style="width: 24px; height: 24px;" />
        <span class="fw-bold">TechMartVN.com</span>
      </div>
      <h6 class="opacity-75">QUẢN LÝ</h6>
      <ul class="list-group list-group-flush mt-3">
        <li class="list-group-item bg-primary text-white border-0 rounded-2 my-2" style="cursor: pointer;">
          <i class="fa fa-box me-2"></i> Quản lý sản phẩm
        </li>
        <li class="list-group-item bg-primary text-white border-0 rounded-2 my-2" style="cursor: pointer;">
          <i class="fa fa-shopping-cart me-2"></i> Quản lý đơn hàng
        </li>
        <li class="list-group-item bg-primary text-white border-0 rounded-2 my-2" style="cursor: pointer;">
          <i class="fa fa-user me-2"></i> Quản lý người dùng
        </li>
        <li class="list-group-item bg-primary text-white border-0 rounded-2 my-2" style="cursor: pointer;">
          <i class="fa fa-chart-bar me-2"></i> Thống kê và báo cáo
        </li>
        <li class="list-group-item bg-primary text-white border-0 rounded-2 my-2" style="cursor: pointer;">
          <i class="fa fa-comment-dots me-2"></i> Xem góp ý
        </li>
      </ul>
    </aside>

    <!-- Main content -->
    <main class="flex-grow-1 d-flex flex-column">
      <!-- Topbar -->
      <header class="bg-primary text-white px-4 py-3 d-flex justify-content-end align-items-center">
        <button class="btn btn-warning fw-bold d-flex align-items-center" @click="handleLogout">
          <i class="fa fa-sign-out-alt me-2"></i> Đăng xuất
        </button>
      </header>

      <!-- Nội dung chính -->
      <div class="flex-grow-1 bg-light p-4">
        <h3>Chào mừng đến trang quản trị</h3>
        <!-- Nội dung khác thêm tại đây -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
  sessionStorage.clear();
  router.push('/DangNhapAdmin');
}
</script>

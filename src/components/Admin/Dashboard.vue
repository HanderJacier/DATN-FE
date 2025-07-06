<template>
  <div class="admin-layout">
    <div class="row g-0">
      <!-- Sidebar -->
      <aside class="col-md-3 col-lg-2 sidebar p-3 text-white">
        <div class="d-flex align-items-center mb-4">
          <img src="@/assets/logotechmart.png" alt="Logo" class="me-2" width="30" height="30" />
          <span class="fw-bold">TechMartVN.com</span>
        </div>

        <h6 class="text-uppercase opacity-75">Quản lý</h6>
        <ul class="nav flex-column mt-3">
          <router-link
            to="/admin/qlsanpham"
            class="nav-link text-white py-2 rounded"
            :class="{ active: $route.path.includes('/admin/sanpham') }"
          >
            <i class="fa fa-box me-2"></i> Sản phẩm
          </router-link>

          <router-link
            to="/admin/donhang"
            class="nav-link text-white py-2 rounded"
            :class="{ active: $route.path.includes('/admin/donhang') }"
          >
            <i class="fa fa-shopping-cart me-2"></i> Đơn hàng
          </router-link>

          <router-link
            to="/admin/nguoidung"
            class="nav-link text-white py-2 rounded"
            :class="{ active: $route.path.includes('/admin/nguoidung') }"
          >
            <i class="fa fa-user me-2"></i> Người dùng
          </router-link>

          <router-link
            to="/admin/thongke"
            class="nav-link text-white py-2 rounded"
            :class="{ active: $route.path.includes('/admin/thongke') }"
          >
            <i class="fa fa-chart-bar me-2"></i> Thống kê
          </router-link>

          <router-link
            to="/admin/gopy"
            class="nav-link text-white py-2 rounded"
            :class="{ active: $route.path.includes('/admin/gopy') }"
          >
            <i class="fa fa-comment-dots me-2"></i> Góp ý
          </router-link>
        </ul>
      </aside>

      <!-- Main content -->
      <main class="col-md-9 col-lg-10 d-flex flex-column">
        <!-- Topbar -->
        <header class="topbar bg-white shadow-sm p-3 text-end">
          <button class="btn btn-outline-danger fw-bold" @click="handleLogout">
            <i class="fa fa-sign-out-alt me-2"></i> Đăng xuất
          </button>
        </header>

        <!-- Nội dung -->
        <div class="content flex-fill p-4 bg-light">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

function handleLogout() {
  sessionStorage.clear();
  router.push('/dangnhap');
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #4a55a2, #393e8f);
  min-height: 100vh;
}

.sidebar .nav-link {
  transition: background 0.2s;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
  border-left: 4px solid #ffc107;
  padding-left: 0.75rem;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
}

.content {
  background-color: #f8f9fa;
}
</style>

<template>
  <div class="bg-white rounded-4 shadow-sm p-4">
    <!-- Avatar + Tên người dùng -->
    <div class="text-center mb-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        width="80"
        height="80"
        class="rounded-circle mb-2 border border-2"
        alt="avatar"
      />
      <h5 class="fw-bold mb-0">{{ username }}</h5>
      <small class="text-muted">Thành viên TechMart</small>
    </div>

    <hr />

    <!-- Tài khoản -->
    <div class="mb-4">
      <h6 class="fw-bold text-primary mb-2">
        <i class="bi bi-person-fill me-2"></i> Tài khoản của tôi
      </h6>
      <ul class="list-unstyled ps-3">
        <li>
          <router-link
            to="/thongtintk"
            class="link-item"
            :class="{ active: $route.path === '/thongtintk' }"
          >
            <i class="bi bi-chevron-right me-1"></i> Thông tin cá nhân
          </router-link>
        </li>
        <li>
          <router-link
            to="/diachinguoidung"
            class="link-item"
            :class="{ active: $route.path === '/diachinguoidung' }"
          >
            <i class="bi bi-geo-alt me-1"></i> Địa chỉ
          </router-link>
        </li>
        <li>
          <router-link
            to="/doimatkhau"
            class="link-item"
            :class="{ active: $route.path === '/doimatkhau' }"
          >
            <i class="bi bi-shield-lock me-1"></i> Đổi mật khẩu
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Đơn mua -->
    <div class="mb-4">
      <h6 class="fw-bold text-success mb-2">
        <i class="bi bi-card-checklist me-2"></i> Đơn mua
      </h6>
      <ul class="list-unstyled ps-3">
        <li>
          <router-link
            to="/tatca"
            class="link-item"
            :class="{ active: $route.path === '/tatca'
              || $route.path === '/dangxuly'
              || $route.path === '/dagiao'
              || $route.path === '/danggiao'
              || $route.path === '/trahang' 
              || $route.path === '/dahuy'
             }"
          >
            <i class="bi bi-clock-history me-1"></i> Lịch sử mua hàng
          </router-link>
        </li>
        <li>
          <router-link
            to="/hoadon"
            class="link-item"
            :class="{ active: $route.path === '/hoadon' }"
          >
            <i class="bi bi-receipt-cutoff me-1"></i> Hóa đơn mua hàng
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Yêu thích -->
    <div>
      <router-link
        to="/sanphamyeuthich"
        class="link-item"
        :class="{ active: $route.path === '/sanphamyeuthich' }"
      >
        <i class="bi bi-heart-fill me-2 text-danger"></i> Sản phẩm yêu thích
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slidebar',
  data() {
    return {
      username: 'Thuy Tien', // set cứng
    };
  },
};
</script>

<style scoped>
.link-item {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s;
}

.link-item:hover {
  background-color: #f5f9ff;
  color: #0d6efd;
  padding-left: 16px;
}

.link-item.active {
  background-color: #e9f0ff;
  font-weight: bold;
  color: #0d6efd !important;
}
</style>

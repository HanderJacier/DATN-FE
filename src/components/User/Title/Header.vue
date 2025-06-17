<template>
  <header class="bg-primary text-white py-2 px-4 d-flex align-items-center justify-content-between">
    <!-- Logo -->
    <div class="d-flex align-items-center">
      <!-- <img src="" alt=" Logo" height="40" class="me-2" /> -->
      <span class="text-white fw-bold fs-5">TechMartVN<small class="text-white-50">.com</small></span>
    </div>
    <!-- Search + Menu wrapper -->
    <div class="flex-grow-1 mx-4 w-10">
      <!-- Search Bar -->
      <div class="d-flex justify-content-center">
        <div class="input-group w-50">
          <input type="text" class="form-control" placeholder="Tìm kiếm sản phẩm..." />
          <button class="btn btn-light" type="button">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- Menu Categories -->
      <nav class="bg-primary ">
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Iphone 16</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Ipad</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">TV Samsung</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Chuột logitech</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Loa mini</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Apple watch</a>
          </li>
        </ul>
      </nav>
    </div>


    <!-- User + Cart -->
    <div class="d-flex align-items-center gap-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-person-circle me-1"></i>
        <span>Thuy Tien</span>
        <i class="bi bi-caret-down-fill ms-1"></i>
      </div>
      <button class="btn btn-dark d-flex align-items-center">
        <i class="bi bi-cart me-2"></i> Giỏ hàng
      </button>
    </div>
  </header>
</template>


<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
header {
  font-size: 14px;
}
</style>
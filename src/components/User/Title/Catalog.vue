<template>
  <div class="catalog shadow-sm">
    <ul class="list-group list-group-flush">
      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 3 } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-laptop"></i>
          </div>
          <span>Laptop</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>

      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 1 } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-phone"></i>
          </div>
          <span>Điện Thoại Di Động</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>

      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 'phukien' } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-headphones"></i>
          </div>
          <span>Phụ Kiện</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>

      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 5 } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-tv"></i>
          </div>
          <span>Tivi</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>

      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 6 } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-speaker"></i>
          </div>
          <span>Loa & Tai Nghe</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>

      <li class="list-group-item d-flex align-items-center justify-content-between"
        @click.prevent="$router.push({ path: '/timkiem', query: { loai: 7 } })">
        <div class="d-flex align-items-center">
          <div class="icon-circle bg-light me-3">
            <i class="bi bi-smartwatch"></i>
          </div>
          <span>Đồng Hồ Thông Minh</span>
        </div>
        <i class="bi bi-chevron-right text-muted"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Catalog"
}
</script>

<style scoped>
.catalog {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid #e9ecef;
  max-width: 300px;
  width: 100%;
  margin-right: 8px;
}


.list-group-item {
  cursor: pointer;
  border: none;
  padding: 19px 15px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-group-item:hover {
  background: #f1f3f5;
  color: #000;
  transform: translateX(2px);
}

.list-group-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}
</style>
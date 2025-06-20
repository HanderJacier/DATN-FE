<template>
  <footer class="footer bg-dark text-white py-5">
    <div class="container">
      <!-- Giới thiệu trên cùng -->
      <p class="small">
        Hệ thống TechmartVN trên toàn quốc<br />
        Bao gồm Cửa hàng TechMartVN, Trung tâm Laptop, F.Studio, S.Studio, Garmin Brand Store
      </p>

      <!-- 5 cột nội dung -->
      <div class="row mt-4">
        <!-- Cột 1 -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold text-info">Kết nối với TechMartVN</h6>
          <div class="d-flex gap-3 align-items-center">
            <img src="/src/assets/logofb.png" alt="Facebook" width="24" height="24" />
            <img src="/src/assets/logoytb.png" alt="YouTube" width="24" height="24" />
            <img src="/src/assets/logotiktok.png" alt="tiktok" width="24" height="24" />
          </div>
          <h6 class="text-uppercase fw-bold mt-3">Tổng đài miễn phí</h6>
          <ul class="list-unstyled small">
            <li>Tư vấn mua hàng (Miễn phí)</li>
            <li>1800.6601 (Nhánh 1)</li>
            <li>Hỗ trợ kỹ thuật</li>
            <li>1800.6601 (Nhánh 2)</li>
            <li>Góp ý, khiếu nại</li>
            <li>1800.6616 (8h00 - 22h00)</li>
          </ul>
        </div>

        <!-- Cột 2 -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold">Về chúng tôi</h6>
          <ul class="list-unstyled small">
            <li>Giới thiệu về công ty</li>
            <li>Quy chế hoạt động</li>
            <li>Dự án doanh nghiệp</li>
            <li>Tin tức khuyến mãi</li>
            <li>Giới thiệu máy đổi trả</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Đại lý uỷ quyền của Apple</li>
            <li>Tra cứu hóa đơn điện tử</li>
            <li>Tra cứu bảo hành</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        <!-- Cột 3 -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold">Chính sách</h6>
          <ul class="list-unstyled small">
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách trả góp</li>
            <li>Chính sách khui hộp</li>
            <li>Chính sách giao hàng và lắp đặt</li>
            <li>Chính sách hàng di động</li>
            <li>Chính sách xử lý dữ liệu cá nhân</li>
            <li>Quy trình kỹ thuật và sao lưu dữ liệu</li>
          </ul>
        </div>

        <!-- Cột 4 -->
        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold">Hỗ trợ thanh toán</h6>
          <img src="/src/assets/pay.png" alt="Thanh toán" class="img-fluid mb-3" />

          <h6 class="text-uppercase fw-bold">Chứng nhận</h6>
          <img src="/src/assets/chungnhan.png" alt="Chứng nhận" class="img-fluid" />
        </div>

        <!-- ✅ Cột 5: Góp ý -->
        <div class="col-lg-3 col-md-6 mb-4">
          <h6 class="text-uppercase fw-bold">Góp ý cho chúng tôi</h6>
          <form @submit.prevent class="d-flex">
            <input type="text" class="form-control me-2" placeholder="Nhập góp ý của bạn..." />
            <button class="btn btn-primary">Gửi</button>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer ul {
  padding-left: 0;
  list-style: none;
}

.footer li {
  margin-bottom: 6px;
  font-size: 13px;
}

.footer h6 {
  font-size: 14px;
}

input::placeholder {
  font-size: 13px;
}
</style>

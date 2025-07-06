<template>
  <footer class="footer text-white py-5 px-5" style="background-color: #1f1f1f; border-top: 4px solid #764ba2;">
    <div class="container">
      <!-- Giới thiệu -->
      <p class="fs-6 fw-bold text-center mb-4">
        Hệ thống TechmartVN trên toàn quốc<br />
        Bao gồm Cửa hàng TechMartVN, Trung tâm Laptop, F.Studio, S.Studio, Garmin Brand Store
      </p>

      <!-- Các cột -->
      <div class="row justify-content-center mt-4 gy-4">
        <!-- Cột 1 -->
        <div class="col-lg-3 col-md-6">
          <h6 class="text-uppercase fw-bold text-info mb-3">Kết nối với TechMartVN</h6>
          <div class="d-flex gap-3 align-items-center mb-3">
            <img src="/src/assets/logofb.png" alt="Facebook" width="26" height="26" />
            <img src="/src/assets/logoytb.png" alt="YouTube" width="26" height="26" />
            <img src="/src/assets/logotiktok.png" alt="tiktok" width="26" height="26" />
          </div>
          <h6 class="text-uppercase fw-bold mt-3">Tổng đài miễn phí</h6>
          <ul class="list-unstyled small">
            <li>Tư vấn mua hàng: <strong>1800.6601</strong> (Nhánh 1)</li>
            <li>Hỗ trợ kỹ thuật: <strong>1800.6601</strong> (Nhánh 2)</li>
            <li>Góp ý, khiếu nại: <strong>1800.6616</strong> (8h00 - 22h00)</li>
          </ul>
        </div>

        <!-- Cột 2 -->
        <div class="col-lg-2 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Về chúng tôi</h6>
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
        <div class="col-lg-2 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Chính sách</h6>
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
        <div class="col-lg-3 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Hỗ trợ thanh toán</h6>
          <img src="/src/assets/pay.png" alt="Thanh toán" class="img-fluid mb-3" />

          <h6 class="text-uppercase fw-bold">Chứng nhận</h6>
          <img src="/src/assets/chungnhan.png" alt="Chứng nhận" class="img-fluid" />
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
  line-height: 1.6;
}

.footer h6 {
  font-size: 15px;
}

.footer p {
  line-height: 1.8;
}
</style>

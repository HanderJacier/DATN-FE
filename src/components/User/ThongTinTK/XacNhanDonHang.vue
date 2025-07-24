<template>
    <div class="container py-4">
        <!-- Địa chỉ nhận hàng -->
        <div class="card shadow-sm mb-4">
            <div class="card-body d-flex justify-content-between">
                <div>
                    <h6 class="text-danger fw-bold mb-2">
                        <i class="bi bi-geo-alt-fill me-2"></i>Địa Chỉ Nhận Hàng
                    </h6>
                    <p class="mb-1"><strong>Vũ Duy</strong> (+84) 357624947</p>
                    <p class="mb-0 text-muted">
                        Phường Linh Xuân, Thành Phố Thủ Đức, TP. Hồ Chí Minh
                    </p>
                </div>
                <div class="text-end">
                    <span class="badge bg-light text-danger border border-danger me-2">Mặc Định</span>
                    <a href="#" class="text-primary text-decoration-none">Thay Đổi</a>
                </div>
            </div>
        </div>

        <!-- Sản phẩm -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h6 class="fw-bold mb-4">
                    <i class="bi bi-box-seam-fill text-primary me-2"></i>Sản phẩm
                </h6>

                <div class="d-flex align-items-center justify-content-between flex-wrap mb-3">
                    <div class="d-flex">
                        <img src="https://cf.shopee.vn/file/sg-11134201-7rbm4-ll52bsvw3q0f79" alt="product"
                            class="me-3 rounded" style="width: 80px; height: 80px; object-fit: cover;">
                        <div>
                            <div class="fw-semibold">Iphone 15 Pro Max</div>
                            <div class="text-muted small mb-1">Màu sắc: <span class="fw-medium">Đen</span></div>
                            <div class="text-muted small">Số lượng: <span class="fw-medium">1</span></div>
                        </div>
                    </div>
                    <div class="text-end text-danger fw-bold fs-6 mt-3 mt-md-0">
                        ₫23.000.000
                    </div>
                </div>

                <div>
                    <label class="form-label fw-semibold">Lời nhắn cho người bán</label>
                    <input type="text" class="form-control shadow-sm" placeholder="Hàng dẽ móp">
                </div>
            </div>
        </div>

        <!-- Vận chuyển -->
        <div class="card shadow-sm mb-4">
            <div
                class="card-body d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row">

                <div class="mb-2 mb-md-0">
                    <div class="fw-semibold">
                        <i class="bi bi-truck text-primary me-2"></i>
                        Phương thức vận chuyển:
                        <span class="text-primary">Nhanh</span>
                    </div>
                    <small class="text-muted">Dự kiến giao từ <strong>23 - 24 Tháng 7</strong></small>
                </div>

                <div class="d-flex flex-column flex-md-row align-items-md-center text-end gap-2">
                    <a href="#" class="text-primary fw-semibold">Thay Đổi</a>
                    <div class="text-danger fw-semibold">₫16.500</div>
                </div>
            </div>
        </div>


        <!-- Phương thức thanh toán -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0">
                        <i class="bi bi-wallet2 me-2 text-primary"></i>Phương thức thanh toán
                    </h6>
                    <div class="text-end">
                        <span class="text-muted me-2">Thanh toán khi nhận hàng</span>
                        <a href="#" class="text-decoration-none text-primary fw-medium">Thay đổi</a>
                    </div>
                </div>

                <div class="border-top pt-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-secondary">Tổng tiền hàng</span>
                        <span>₫23.000.000</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-secondary">Phí vận chuyển</span>
                        <span>₫16.500</span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold fs-5 border-top pt-3 mt-2">
                        <span>Tổng thanh toán</span>
                        <span class="text-danger">₫23.016.500</span>
                    </div>
                </div>

                <p class="text-muted small mt-3">
                    Bằng việc nhấn <strong>"Đặt hàng"</strong>, bạn đã đồng ý với
                    <a href="#" class="text-decoration-none text-primary">Điều khoản Shopee</a>.
                </p>

                <div class="text-end">
                    <button class="btn btn-danger px-4 py-2 shadow-sm fw-semibold">
                        <i class="bi bi-cart-check-fill me-1"></i>Đặt hàng
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal đặt hàng -->
        <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content text-center">
                    <div class="modal-body p-5">
                        <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Success"
                            style="width: 100px;">
                        <h3 class="mt-3 text-success">Đặt hàng thành công!</h3>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
</script>
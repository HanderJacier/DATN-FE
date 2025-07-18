import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage hoặc sessionStorage
    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"))
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor để xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.response?.data)

    if (error.response?.status === 401) {
      // Xóa thông tin user và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("user")
      sessionStorage.removeItem("user")

      // Chỉ chuyển hướng nếu không phải đang ở trang đăng nhập
      if (window.location.pathname !== "/dangnhap") {
        alert("⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
        window.location.href = "/dangnhap"
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient

// ===== AUTHENTICATION API =====
export async function kiemTraPhien() {
  try {
    const response = await apiClient.get("/xacthuc/kiem-tra-phien")
    return response
  } catch (error) {
    throw error
  }
}

export function dangNhap(data) {
  return apiClient.post("/xacthuc/dangnhap", data)
}

export function dangXuat() {
  return apiClient.post("/xacthuc/dangxuat")
}

// ===== FEEDBACK API =====
export function postFeedback(data) {
  return apiClient.post("/san-pham/tao-gop-y", data)
}

export function fetchFeedback(page = 1, size = 10) {
  return apiClient.get("/san-pham/gop-y", {
    params: {
      p_pageNo: page,
      p_pageSize: size,
    },
  })
}

// ===== GIỎ HÀNG API =====
export function themVaoGioHang(data) {
  return apiClient.post("/gio-hang/them", data)
}

export function xemGioHang() {
  return apiClient.get("/gio-hang/xem")
}

export function capNhatGioHang(data) {
  return apiClient.put("/gio-hang/cap-nhat", data)
}

export function xoaKhoiGioHang(sanPhamId) {
  return apiClient.delete(`/gio-hang/xoa/${sanPhamId}`)
}

export function xoaTatCaGioHang() {
  return apiClient.delete("/gio-hang/xoa-tat-ca")
}

// ===== THANH TOÁN API =====
export function taoHoaDon(orderData) {
  return apiClient.post("/thanhtoan/tao-hoa-don", orderData)
}

export function lichSuDonHang() {
  return apiClient.get("/thanhtoan/lich-su")
}

export function chiTietHoaDon(hoaDonId) {
  return apiClient.get(`/thanhtoan/chi-tiet/${hoaDonId}`)
}

export function xacNhanThanhToan(maGiaoDich, trangThai) {
  return apiClient.post("/thanhtoan/xac-nhan-thanh-toan", null, {
    params: { maGiaoDich, trangThai },
  })
}

// ===== SẢN PHẨM API =====
export function layDanhSachSanPham() {
  return apiClient.get("/SanPham")
}

export function layChiTietSanPham(id) {
  return apiClient.get(`/SanPham/${id}`)
}

// ===== LEGACY (giữ lại để tương thích) =====
export function createMoMoPayment(orderData) {
  return taoHoaDon(orderData)
}

export function saveOrder(orderData) {
  return taoHoaDon(orderData)
}

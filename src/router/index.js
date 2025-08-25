import { createRouter, createWebHashHistory } from "vue-router"; // ✅ dùng hash mode
import { encId, decId } from "@/utils/idCodec";

// User
import Home from "../components/User/Home.vue";
import ThongTinTK from "../components/User/ThongTinTK/ThongTinTK.vue";
import DiaChi from "../components/User/ThongTinTK/DiaChi.vue";
import SPYeuThich from "../components/User/ThongTinTK/SPYeuThich.vue";
import HoaDonChiTiet from "../components/User/ThongTinTK/HoaDonChiTiet.vue";
import DoiMatKhau from "../components/User/ThongTinTK/DoiMatKhau.vue";
import PaymentResult from "../components/User/PaymentForm.vue";
import DangNhap from "../components/User/DangNhapUser.vue";
import DangKyUser from "../components/User/DangKyUser.vue";
import GioHang from "../components/User/GioHang.vue";
import ThanhToan from "../components/User/ThanhToan.vue";
import ChiTietSP from "../components/User/ChiTietSP.vue";
import TimKiem from "../components/User/TimKiem.vue";
import GopYUser from "../components/User/GopYUser.vue";
// import Return from "../view/Return.vue"; // ❌ trùng path /return với PaymentResult, tạm bỏ
import MoMoDemo from "../components/User/MoMoDemo.vue";

// Admin
import Dashboard from "../components/Admin/Dashboard.vue";
import GopY from "../components/Admin/GopY.vue";
import Order from "../components/Admin/Order.vue";
import QLSanPham from "../components/Admin/QLSanPham/Table.vue";
import ThongKe from "../components/Admin/ThongKe.vue";
import User from "../components/Admin/User.vue";
import OrderManagement from "../components/Admin/OrderManagement.vue";

// 🎯 Các trạng thái đơn hàng
import TatCa from "../components/User/ThongTinTK/HoaDon/TatCa.vue";
import DangXuLy from "../components/User/ThongTinTK/HoaDon/ChoXuLy.vue";
import DaXuLy from "../components/User/ThongTinTK/HoaDon/DaXuLy.vue";
import DaHuy from "../components/User/ThongTinTK/HoaDon/DaHuy.vue";
import XacNhanDonHang from "../components/User/ThongTinTK/XacNhanDonHang.vue";

/* ===== Helpers: mask cho Tìm kiếm (Base64 URL-safe) ===== */
function encodeSearchToken(query) {
  try {
    const json = JSON.stringify(query || {});
    const b64 = btoa(encodeURIComponent(json));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "") || "_";
  } catch {
    return "_";
  }
}
function decodeSearchToken(token) {
  try {
    if (!token || token === "_") return {};
    let b64 = String(token).replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(atob(b64));
    const q = JSON.parse(json);
    return q && typeof q === "object" ? q : {};
  } catch {
    return {};
  }
}

const routes = [
  { path: "/", component: Home },
  { path: "/dangnhap", component: DangNhap },
  { path: "/dangky", component: DangKyUser },

  // Payment / demo
  { path: "/return", component: PaymentResult }, // ✅ giữ path này
  // { path: "/return-vnpay", component: Return }, // <-- nếu cần dùng Return.vue, mở dòng này & đổi link gọi tới
  { path: "/payment/momo-demo", component: MoMoDemo },

  { path: "/thongtintk", component: ThongTinTK },
  { path: "/sanphamyeuthich", component: SPYeuThich },
  { path: "/diachinguoidung", component: DiaChi },

  // ====== HÓA ĐƠN ======
  { path: "/hoadonchitiet/:id(\\d+)", name: "hoadonchitiet", component: HoaDonChiTiet },
  {
    path: "/hoadonchitiet/:code",
    beforeEnter: (to) => {
      const id = decId(to.params.code);
      if (id == null) return false; // hoặc redirect 404
      return { name: "hoadonchitiet", params: { id }, replace: true };
    },
  },

  { path: "/doimatkhau", component: DoiMatKhau },
  { path: "/giohang", component: GioHang },
  { path: "/thanhtoan", component: ThanhToan },

  // ====== SẢN PHẨM ======
  { path: "/sanpham/:id(\\d+)", name: "ChiTietSanPham", component: ChiTietSP },
  {
    path: "/sanpham/:code",
    beforeEnter: (to) => {
      const id = decId(to.params.code);
      if (id == null) return false; // hoặc redirect 404
      return { name: "ChiTietSanPham", params: { id }, replace: true };
    },
  },

  // ====== TÌM KIẾM ======
  { path: "/timkiem", name: "TimKiem", component: TimKiem },
  {
    path: "/s/:token(.*)",
    name: "TimKiemMaskedEntry",
    beforeEnter: (to) => {
      const q = decodeSearchToken(to.params.token);
      return { name: "TimKiem", query: q, replace: true };
    },
  },

  { path: "/gopynguoidung", component: GopYUser },
  { path: "/xacnhandonhang", component: XacNhanDonHang },

  // lịch sử đơn hàng
  { path: "/tatca", component: TatCa },
  { path: "/dangxuly", component: DangXuLy },
  { path: "/daxuly", component: DaXuLy },
  { path: "/dahuy", component: DaHuy },

  // Admin
  {
    path: "/admin",
    component: Dashboard,
    children: [
      { path: "qlsanpham", component: QLSanPham },
      { path: "donhang", component: Order },
      { path: "nguoidung", component: User },
      { path: "qlhoadon", component: OrderManagement },
      { path: "thongke", component: ThongKe },
      { path: "gopy", component: GopY },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // ✅ hash mode => reload không 404
  routes,
});

// Guard đăng nhập giữ nguyên (thêm parse an toàn)
router.beforeEach((to, from, next) => {
  const user =
    JSON.parse(localStorage.getItem("user") || "null") ||
    JSON.parse(sessionStorage.getItem("user") || "null");

  if (to.path === "/dangnhap" && user) return next("/");
  if (to.path.startsWith("/admin") && !user) return next("/dangnhap");
  next();
});

// ❌ BỎ afterEach “làm đẹp URL” – hash mode không cần, tránh xung đột reload
// router.afterEach(() => {})

export default router;

import { createRouter, createWebHistory } from "vue-router";
import { encId, decId } from "@/utils/idCodec";
import Blank from '../components/User/Blank.vue' // Tạo file Blank.vue với <template></template>

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
import Return from "../components/User/Return.vue";
import MoMoDemo from "../components/User/MoMoDemo.vue";
// Admin
import Dashboard from "../components/Admin/Dashboard.vue";
import GopY from "../components/Admin/GopY.vue";
import Order from "../components/Admin/Order.vue";
import QLSanPham from "../components/Admin/QLSanPham/Table.vue";
import ThongKe from "../components/Admin/ThongKe.vue";
import User from "../components/Admin/User.vue";
import OrderManagement from "../components/Admin/OrderManagement.vue";
import PaymentSuccess from "../components/User/PaymentSuccess.vue";
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
    return (
      b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "") || "_"
    );
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
  { path: "/return", component: Return },
  { path: "/payment/momo-demo", component: MoMoDemo },
  { path: "/thongtintk", component: ThongTinTK },
  { path: "/sanphamyeuthich", component: SPYeuThich },
  { path: "/diachinguoidung", component: DiaChi },
  { path: "/payment/success", component: PaymentSuccess },
  // ====== HÓA ĐƠN ======
  // Route cũ (component đang dùng) – nhận id số
  {
    path: "/hoadonchitiet/:id(\\d+)",
    name: "hoadonchitiet",
    component: HoaDonChiTiet,
  },

  // Route “đẹp” – người dùng gõ URL mã hoá thì decode -> redirect về id số (component không đổi)
  {
  path: "/hoadonchitiet/:code",
  component: Blank,
  beforeEnter: (to) => {
    const id = decId(to.params.code)
    if (id == null) return false
    return { name: "hoadonchitiet", params: { id }, replace: true }
  }
},

  { path: "/doimatkhau", component: DoiMatKhau },
  { path: "/giohang", component: GioHang },
  { path: "/thanhtoan", component: ThanhToan },

  // ====== SẢN PHẨM ======
  // Route cũ (component đang dùng) – nhận id số
  { path: "/sanpham/:id(\\d+)", name: "ChiTietSanPham", component: ChiTietSP },

  // Route “đẹp” – decode -> redirect về id số
  {
  path: "/sanpham/:code",
  component: Blank,
  beforeEnter: (to) => {
    const id = decId(to.params.code)
    if (id == null) return false
    return { name: "ChiTietSanPham", params: { id }, replace: true }
  }
},

  // ====== TÌM KIẾM ======
  // Route thật: component đọc query từ route.query
  { path: "/timkiem", name: "TimKiem", component: TimKiem },

  // Masked entry: /s/<token> -> giải token -> quay lại /timkiem?...
  {
    path: "/s/:token(.*)",
    name: "TimKiemMaskedEntry",
    beforeEnter: (to) => {
      const q = decodeSearchToken(to.params.token);
      return { name: "TimKiem", query: q, replace: true };
    },
  },

  { path: "/gopynguoidung", component: GopYUser },
  { path: "/return", component: PaymentResult },
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
  history: createWebHistory(),
  routes,
});

// Guard cũ giữ nguyên
router.beforeEach((to, from, next) => {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  if (to.path === "/dangnhap" && user) return next("/");
  if (to.path.startsWith("/admin") && !user) return next("/dangnhap");
  next();
});

/**
 * Sau khi điều hướng tới route dùng id số,
 * thay URL hiển thị thành bản mã hoá (KHÔNG đổi route đang active)
 * + ẨN trang TÌM KIẾM bằng token /s/<token>
 */
router.afterEach((to) => {
  if (typeof window === "undefined") return;

  // giữ lại query & hash nếu có
  const q = to.fullPath.split("?")[1]
    ? `?${to.fullPath.split("?")[1].split("#")[0]}`
    : "";
  const h = to.fullPath.includes("#") ? `#${to.fullPath.split("#")[1]}` : "";

  // ===== SẢN PHẨM =====
  if (to.name === "ChiTietSanPham" && to.params?.id) {
    const id = String(to.params.id);
    if (/^\d+$/.test(id)) {
      const code = encId(id);
      const pretty = `/sanpham/${code}${q}${h}`;
      if (location.pathname !== `/sanpham/${code}`) {
        window.history.replaceState({}, "", pretty);
      }
      return;
    }
  }

  // ===== HÓA ĐƠN =====
  if (to.name === "hoadonchitiet" && to.params?.id) {
    const id = String(to.params.id);
    if (/^\d+$/.test(id)) {
      const code = encId(id);
      const pretty = `/hoadonchitiet/${code}${q}${h}`;
      if (location.pathname !== `/hoadonchitiet/${code}`) {
        window.history.replaceState({}, "", pretty);
      }
      return;
    }
  }

  // ===== TÌM KIẾM =====
  if (to.name === "TimKiem") {
    const token = encodeSearchToken(to.query || {});
    const masked = `/s/${token}${h}`;
    const current =
      window.location.pathname + window.location.search + window.location.hash;
    if (current !== masked) {
      window.history.replaceState({}, "", masked);
    }
  }
});

export default router;

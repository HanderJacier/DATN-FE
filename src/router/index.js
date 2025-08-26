// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import { decId } from "@/utils/idCodec";

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
import MoMoDemo from "../components/User/MoMoDemo.vue";

// Admin
import Dashboard from "../components/Admin/Dashboard.vue";
import GopY from "../components/Admin/GopY.vue";
import Order from "../components/Admin/Order.vue";
import QLSanPham from "../components/Admin/QLSanPham/Table.vue";
import ThongKe from "../components/Admin/ThongKe.vue";
import User from "../components/Admin/User.vue";
import OrderManagement from "../components/Admin/OrderManagement.vue";

// Trạng thái đơn hàng
import TatCa from "../components/User/ThongTinTK/HoaDon/TatCa.vue";
import DangXuLy from "../components/User/ThongTinTK/HoaDon/ChoXuLy.vue";
import DaXuLy from "../components/User/ThongTinTK/HoaDon/DaXuLy.vue";
import DaHuy from "../components/User/ThongTinTK/HoaDon/DaHuy.vue";
import XacNhanDonHang from "../components/User/ThongTinTK/XacNhanDonHang.vue";

// Helpers search
function encodeSearchToken(query) { /* giữ nguyên */ }
function decodeSearchToken(token) { /* giữ nguyên */ }

const routes = [
  { path: "/", component: Home },
  { path: "/dangnhap", component: DangNhap },
  { path: "/dangky", component: DangKyUser },

  { path: "/return", component: PaymentResult },
  { path: "/payment/momo-demo", component: MoMoDemo },

  { path: "/thongtintk", component: ThongTinTK },
  { path: "/sanphamyeuthich", component: SPYeuThich },
  { path: "/diachinguoidung", component: DiaChi },

  // ===== HÓA ĐƠN (chỉ code mã hoá) =====
  {
    path: "/hoadonchitiet/:code",
    name: "hoadonchitiet",
    component: HoaDonChiTiet,
    props: route => {
      const id = decId(route.params.code);
      return { id }; // id thật để truyền vào component
    },
  },

  { path: "/doimatkhau", component: DoiMatKhau },
  { path: "/giohang", component: GioHang },
  { path: "/thanhtoan", component: ThanhToan },

  // ===== SẢN PHẨM (chỉ code mã hoá) =====
  {
    path: "/sanpham/:code",
    name: "ChiTietSanPham",
    component: ChiTietSP,
    props: route => {
      const id = decId(route.params.code);
      return { id };
    },
  },

  // ===== TÌM KIẾM =====
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

  // Lịch sử đơn hàng
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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user =
    JSON.parse(localStorage.getItem("user") || "null") ||
    JSON.parse(sessionStorage.getItem("user") || "null");

  if (to.path === "/dangnhap" && user) return next("/");
  if (to.path.startsWith("/admin") && !user) return next("/dangnhap");
  next();
});

export default router;

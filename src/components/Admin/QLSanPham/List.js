// ===== Thương hiệu: PHẢI KHỚP DB =====
// Nếu DB của bạn là 1..20 (Apple..Huawei) thì dùng list 20 mục.
// Nếu DB đã rút về 1..10 (LENOVO..SONY) thì giữ list 1..10.
// === Ví dụ: KHỚP VỚI SEED 1..20 (Apple..Huawei) ===
export const brandList = [
  { id: 1, name: 'Lenovo' },
  { id: 2, name: 'HP' },
  { id: 3, name: 'Dell' },
  { id: 4, name: 'Apple' },
  { id: 5, name: 'ASUS' },
  { id: 6, name: 'Samsung' },
  { id: 7, name: 'Xiaomi' },
  { id: 8, name: 'Vivo' },
  { id: 9, name: 'OPPO' },
  { id: 10, name: 'Sony' },
  { id: 11, name: 'Acer' },
  { id: 12, name: 'LG' },
  { id: 13, name: 'Panasonic' },
  { id: 14, name: 'Canon' },
  { id: 15, name: 'Epson' },
  { id: 16, name: 'JBL' },
  { id: 17, name: 'Anker' },
  { id: 18, name: 'Huawei' }
];

export const formFields = {
  tensanpham: 'Tên sản phẩm',
  dongia: 'Giá (VND)',
  loai: 'Loại sản phẩm',        // dùng cho dropdown
  thuonghieu: 'Thương hiệu',   // dùng cho dropdown
  anhgoc: 'Ảnh gốc',
  model: 'Model',
  trongluong: 'Trọng lượng',
  pin: 'Pin',
  congketnoi: 'Cổng kết nối',
  tinhnang: 'Tính năng',
  mausac: 'Màu sắc',
  soluong: 'Số lượng',
  anhphu: 'Ảnh phụ',
  id_gg: 'Mức giảm (%)',       // dùng cho dropdown
  hangiamgia: 'Hạn giảm giá (dd/MM/yyyy)'
};

// Khớp SP_LOAI trong DB của bạn (đang 1..7)
export const loaiMap = {
  'Điện thoại di động': '1',
  'Máy tính bảng': '2',
  'Laptop': '3',
  'Phụ kiện': '4',
  'Tivi': '5',
  'Loa và tai nghe': '6',
  'Đồng hồ thông minh': '7'
};

// Field cho payload gửi backend
export const allowedProductFields = [
  'tensanpham', 'dongia', 'loai', 'thuonghieu',
  'anhgoc', 'model', 'trongluong', 'pin', 'congketnoi', 'tinhnang',
  'mausac', 'soluong', 'anhphu', 'id_gg', 'hangiamgia'
];

// Không render input text cho loai/thuonghieu/id_gg nữa (vì đã có dropdown riêng)
export function getVisibleFields() {
  return [
    'tensanpham', 'dongia',
    'anhgoc', 'anhphu',
    'model', 'trongluong', 'pin', 'congketnoi', 'tinhnang',
    'mausac', 'soluong'
  ];
}

export const defaultProduct = {
  tensanpham: '',
  dongia: 0,
  loai: '',          // bind dropdown
  thuonghieu: '',    // bind dropdown
  anhgoc: '',
  model: '',
  trongluong: '',
  pin: '',
  congketnoi: '',
  tinhnang: '',
  mausac: '',
  soluong: 0,
  anhphu: '',
  id_gg: 0,          // bind dropdown (0 = không giảm)
  hangiamgia: ''     // dd/MM/yyyy
};

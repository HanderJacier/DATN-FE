// ===== Thương hiệu: KHỚP DB =====
export const brandList = [
  { id: 1, name: 'LENOVO' },
  { id: 2, name: 'HP' },
  { id: 3, name: 'DELL' },
  { id: 4, name: 'APPLE' },
  { id: 5, name: 'ASUS' },
  { id: 6, name: 'SAMSUNG' },
  { id: 7, name: 'XIAOMI' },
  { id: 8, name: 'VIVO' },
  { id: 9, name: 'OPPO' },
  { id: 10, name: 'SONY' },
];

export const formFields = {
  tensanpham: 'Tên sản phẩm',
  dongia: 'Giá (VND)',
  loai: 'Loại sản phẩm',
  thuonghieu: 'Thương hiệu',
  anhgoc: 'Ảnh gốc',
  model: 'Model',
  trongluong: 'Trọng lượng',
  pin: 'Pin',
  congketnoi: 'Cổng kết nối',
  tinhnang: 'Tính năng',
  mausac: 'Màu sắc',
  soluong: 'Số lượng',
  anhphu: 'Ảnh phụ',
  id_gg: 'Mức giảm (%)',
  hangiamgia: 'Hạn giảm giá (dd/MM/yyyy)'
};

// Khớp SP_LOAI 1..7
export const loaiMap = {
  'Điện thoại di động': '1',
  'Máy tính bảng': '2',
  'Laptop': '3',
  'Phụ kiện': '4',
  'Tivi': '5',
  'Loa và tai nghe': '6',
  'Đồng hồ thông minh': '7'
};

// ⚠️ Nếu backend có cột diachianh thì thêm vào allowedProductFields
export const allowedProductFields = [
  'tensanpham', 'dongia', 'loai', 'thuonghieu',
  'anhgoc', 'model', 'trongluong', 'pin', 'congketnoi', 'tinhnang',
  'mausac', 'soluong', 'anhphu', 'id_gg', 'hangiamgia'
];

// Field render input text (dropdown riêng cho loai/thuonghieu/id_gg)
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
  loai: '',
  thuonghieu: '',
  anhgoc: '',
  diachianh: '',
  model: '',
  trongluong: '',
  pin: '',
  congketnoi: '',
  tinhnang: '',
  mausac: '',
  soluong: 0,
  anhphu: '',
  id_gg: 0,
  hangiamgia: ''
};

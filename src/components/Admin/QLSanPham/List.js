// src/constants/productConstants.js

export const brandList = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'Oppo' },
  { id: 5, name: 'Vivo' },
  { id: 6, name: 'Realme' },
  { id: 7, name: 'Nokia' },
  { id: 8, name: 'ASUS' },
  { id: 9, name: 'Dell' },
  { id: 10, name: 'HP' },
  { id: 11, name: 'Lenovo' },
  { id: 12, name: 'Acer' },
  { id: 13, name: 'Sony' },
  { id: 14, name: 'LG' },
  { id: 15, name: 'Panasonic' },
  { id: 16, name: 'Canon' },
  { id: 17, name: 'Epson' },
  { id: 18, name: 'JBL' },
  { id: 19, name: 'Anker' },
  { id: 20, name: 'Huawei' }
]

export const formFields = {
  tensanpham: 'Tên sản phẩm',
  dongia: 'Giá (VND)',
  anhgoc: 'Ảnh gốc',
  cpuBrand: 'CPU Brand',
  cpuModel: 'CPU Model',
  cpuType: 'CPU Type',
  cpuMinSpeed: 'CPU Min Speed',
  cpuMaxSpeed: 'CPU Max Speed',
  cpuCores: 'CPU Cores',
  cpuThreads: 'CPU Threads',
  cpuCache: 'CPU Cache',
  gpuBrand: 'GPU Brand',
  gpuModel: 'GPU Model',
  gpuFullName: 'GPU Full Name',
  gpuMemory: 'GPU Memory',
  ram: 'RAM',
  rom: 'ROM',
  screen: 'Màn hình',
  mausac: 'Màu sắc',
  soluong: 'Số lượng',
  anhphu: 'Ảnh phụ (có thể chọn nhiều)',
  hangiamgia: 'Hạn giảm giá'
}

export const loaiMap = {
  'Điện thoại di động': '1',
  'Máy tính bảng': '2',
  'Laptop': '3',
  'Máy tính để bàn': '4',
  'Thiết bị đeo thông minh': '5',
  'Phụ kiện điện thoại': '6',
  'Phụ kiện máy tính': '7',
  'Thiết bị mạng': '8',
  'Thiết bị lưu trữ': '9',
  'Tivi': '10',
  'Loa và tai nghe': '11',
  'Đồng hồ thông minh': '12',
  'Máy ảnh và máy quay': '13',
  'Máy in và mực in': '14',
  'Đồ gia dụng thông minh': '15'
}

// src/constants/productConstants.js

export const allowedProductFields = [
  'tensanpham', 'dongia', 'loai', 'thuonghieu',
  'anhgoc', 'cpuBrand', 'cpuModel', 'cpuType', 'cpuMinSpeed', 'cpuMaxSpeed',
  'cpuCores', 'cpuThreads', 'cpuCache', 'gpuBrand', 'gpuModel', 'gpuFullName',
  'gpuMemory', 'ram', 'rom', 'screen', 'mausac', 'soluong', 'anhphu',
  'id_gg', 'hangiamgia'
]

// Trả về danh sách field hiển thị tùy theo loại sản phẩm
export function getVisibleFields(loai) {
  const commonFields = [
    'tensanpham', 'dongia',
    'mausac', 'soluong', 'anhgoc', 'anhphu', 'hangiamgia'
  ];

  switch (Number(loai)) {
    case 1: // Điện thoại di động
    case 5: // Thiết bị đeo thông minh
    case 12: // Đồng hồ thông minh
      return [
        ...commonFields,
        'cpuBrand', 'cpuModel', 'cpuType', 'cpuMinSpeed', 'cpuMaxSpeed',
        'cpuCores', 'cpuThreads', 'cpuCache',
        'gpuBrand', 'gpuModel', 'gpuFullName', 'gpuMemory',
        'ram', 'rom', 'screen'
      ];

    case 2: // Máy tính bảng
      return [
        ...commonFields,
        'ram', 'rom', 'screen',
        'cpuBrand', 'cpuModel',
      ];

    case 3: // Laptop
    case 4: // Máy tính để bàn
      return [
        ...commonFields,
        'cpuBrand', 'cpuModel', 'cpuType', 'cpuMinSpeed', 'cpuMaxSpeed',
        'cpuCores', 'cpuThreads', 'cpuCache',
        'gpuBrand', 'gpuModel', 'gpuFullName', 'gpuMemory',
        'ram', 'rom', 'screen'
      ];

    case 6: // Phụ kiện điện thoại
    case 7: // Phụ kiện máy tính
    case 8: // Thiết bị mạng
    case 9: // Thiết bị lưu trữ
      return [
        ...commonFields
      ];

    case 10: // Tivi
      return [
        ...commonFields,
        'screen', 'gpuBrand', 'gpuModel'
      ];

    case 11: // Loa và tai nghe
      return [
        ...commonFields,
        'gpuBrand', 'gpuModel'
      ];

    case 13: // Máy ảnh và máy quay
      return [
        ...commonFields,
        'gpuBrand', 'gpuModel', 'ram', 'rom'
      ];

    case 14: // Máy in và mực in
      return [
        ...commonFields,
        'cpuBrand', 'ram', 'rom'
      ];

    case 15: // Đồ gia dụng thông minh
      return [
        ...commonFields,
        'screen', 'cpuBrand', 'ram'
      ];

    default:
      return [...commonFields];
  }
}

export const defaultProduct = {
  tensanpham: '',
  dongia: 0,
  loai: '',
  thuonghieu: '',
  anhgoc: '',
  cpuBrand: '',
  cpuModel: '',
  cpuType: '',
  cpuMinSpeed: '',
  cpuMaxSpeed: '',
  cpuCores: '',
  cpuThreads: '',
  cpuCache: '',
  gpuBrand: '',
  gpuModel: '',
  gpuFullName: '',
  gpuMemory: '',
  ram: '',
  rom: '',
  screen: '',
  mausac: '',
  soluong: 0,
  anhphu: [],
  id_gg: 0,
  hangiamgia: "",
}

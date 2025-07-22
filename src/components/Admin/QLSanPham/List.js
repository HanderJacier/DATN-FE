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
  loai: 'Loại',
  thuonghieu: 'Thương hiệu',
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
  anhphu: 'Ảnh phụ',
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

// Trả về danh sách field hiển thị tùy theo loại
export function getVisibleFields(loai) {
  const commonFields = [
    'tensanpham', 'thuonghieu', 'loai', 'dongia', 'mausac', 'soluong',
    'anhgoc', 'anhphu',
  ]

  if (loai === 1) {
    return [
      ...commonFields,
      'cpuBrand', 'cpuModel', 'cpuType', 'cpuMinSpeed', 'cpuMaxSpeed',
      'cpuCores', 'cpuThreads', 'cpuCache',
      'gpuBrand', 'gpuModel', 'gpuFullName', 'gpuMemory',
      'ram', 'rom', 'screen'
    ]
  }

  if (loai === 2) {
    return [
      ...commonFields,
      'ram', 'rom', 'screen'
    ]
  }

  // Phụ kiện hoặc loại khác
  return [...commonFields]
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
  anhphu: '',
  id_gg: 0,
  hangiamgia: "2025-08-30"
}

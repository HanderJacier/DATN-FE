// useProductTable composable - QLSP.js
import { ref, computed, nextTick } from 'vue'
import useSanPhamAdmin from '../CRUD/QLSanPham/Select'
import useSanPhamCreate from '../CRUD/QLSanPham/Create'
import useSanPhamUpdate from '../CRUD/QLSanPham/Update'

export function useProductTable() {
  const { products, loading, error } = useSanPhamAdmin()
  const { createProduct } = useSanPhamCreate()
  const { updateProduct } = useSanPhamUpdate()

  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = 8
  const productForm = ref({})
  const editingIndex = ref(null)
  const notification = ref('')
  const notificationType = ref('') // 'success' | 'error'

  const formFields = {
    tensanpham: 'Tên sản phẩm',
    thuonghieu: 'Thương hiệu',
    loai: 'Loại',
    loaiten: 'Loại tên',
    dongia: 'Giá (VND)',
    mausac: 'Màu sắc',
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
    soluong: 'Số lượng',
    diachianh: 'Chọn ảnh',
    chip: 'Chip',
    camera: 'Camera',
    pin: 'Pin'
  }

  function showNotification(message, type = 'success') {
    notification.value = message
    notificationType.value = type
    setTimeout(() => {
      notification.value = ''
      notificationType.value = ''
    }, 3000)
  }

  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(product =>
      Object.values(product).some(val =>
        String(val).toLowerCase().includes(query)
      )
    )
  })

  const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / pageSize)
  )

  const pagedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredProducts.value.slice(start, start + pageSize)
  })

  function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function formatDate(date) {
    return date ? new Date(date).toLocaleDateString('vi-VN') : '-'
  }

  const loaiMap = {
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

function mapLoaiTenToValue(loaiTen) {
  return loaiMap[loaiTen] || ''
}

function mapLoaiValueToTen(loai) {
  return Object.entries(loaiMap).find(([_, v]) => v === loai)?.[0] || ''
}



  function validateProductForm() {
    const requiredFields = ['tensanpham', 'thuonghieu', 'dongia', 'mausac', 'soluong', 'loai']

    for (const field of requiredFields) {
      const value = productForm.value[field]
      if (value === undefined || value === null || value === '') {
        showNotification(`Vui lòng nhập: ${formFields[field]}`, 'error')
        return false
      }
    }

    if (Number(productForm.value.dongia) < 0) {
      showNotification('Giá sản phẩm không được nhỏ hơn 0', 'error')
      return false
    }

    if (Number(productForm.value.soluong) < 0) {
      showNotification('Số lượng không được nhỏ hơn 0', 'error')
      return false
    }

    return true
  }

  async function editProduct(index) {
    handleReset()
    editingIndex.value = index

    const selected = { ...pagedProducts.value[index] }

    if (!selected.loai && selected.loaiTen) {
      selected.loai = mapLoaiTenToValue(selected.loaiTen)
    }

    productForm.value.loai = String(selected.loai)
    productForm.value.loaiTen = mapLoaiValueToTen(productForm.value.loai)

    await nextTick()

    for (const key in selected) {
      if (key !== 'loai') {
        productForm.value[key] = selected[key]
      }
    }
  }

  async function deleteProduct(index) {
  const globalIndex = (currentPage.value - 1) * pageSize + index
  const sp = { ...products.value[globalIndex], soluong: 0 }

  const result = await updateProduct(sp)
  if (result.success) {
    products.value[globalIndex].soluong = 0
    showNotification('Sản phẩm đã được xóa (số lượng = 0)', 'success')
  } else {
    showNotification('Xóa thất bại: ' + result.message, 'error')
  }

  if (editingIndex.value === index) handleReset()
}


  function handleReset() {
    productForm.value = {}
    editingIndex.value = null
  }

  function onImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      productForm.value.diachianh = URL.createObjectURL(file)
    }
  }

  const visibleFields = computed(() => {
    const loai = productForm.value?.loai

    const baseFields = [
      'tensanpham', 'thuonghieu', 'dongia', 'mausac',
      'screen', 'soluong', 'diachianh'
    ]
    const laptopFields = [
      'cpuBrand', 'cpuModel', 'cpuType', 'cpuMinSpeed', 'cpuMaxSpeed',
      'cpuCores', 'cpuThreads', 'cpuCache',
      'gpuBrand', 'gpuModel', 'gpuFullName', 'gpuMemory',
      'ram', 'rom'
    ]
    const dienthoaiFields = ['chip', 'ram', 'rom', 'camera', 'pin']

    switch (loai) {
      case '1':
      case '2':
        return [...baseFields, ...dienthoaiFields]
      case '3':
      case '4':
        return [...baseFields, ...laptopFields]
      case '5':
      case '12':
        return [...baseFields, 'pin', 'chip']
      case '10':
        return [...baseFields, 'screen', 'rom']
      case '13':
        return [...baseFields, 'camera']
      default:
        return [...baseFields]
    }
  })

  async function createNewProduct() {
    if (!validateProductForm()) return

    const result = await createProduct(productForm.value)
    if (!result.success) {
      showNotification(result.message, 'error')
      return
    }
    products.value.push({ ...productForm.value })
    showNotification('Thêm sản phẩm thành công!', 'success')
    handleReset()
  }

  async function updateExistingProduct() {
    if (editingIndex.value === null) return
    if (!validateProductForm()) return

    const result = await updateProduct(productForm.value)
    if (!result.success) {
      showNotification(result.message, 'error')
      return
    }

    const globalIndex = (currentPage.value - 1) * pageSize + editingIndex.value
    products.value[globalIndex] = { ...productForm.value }
    showNotification('Cập nhật sản phẩm thành công!', 'success')
    handleReset()
  }

  return {
    products,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    editingIndex,
    productForm,
    formFields,
    visibleFields,
    onImageChange,
    filteredProducts,
    totalPages,
    pagedProducts,
    changePage,
    formatDate,
    editProduct,
    deleteProduct,
    handleReset,
    createNewProduct,
    updateExistingProduct,
    notification,
    notificationType
  }
}

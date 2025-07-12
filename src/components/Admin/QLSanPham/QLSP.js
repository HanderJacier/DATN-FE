// useProductTable composable - QLSP.js
import { ref, computed } from 'vue'
  import { nextTick } from 'vue'

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

  const formFields = {
    tensanpham: 'Tên sản phẩm',
    thuonghieu: 'Thương hiệu',
    loai: 'Loại',
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

  function mapLoaiTenToValue(loaiTen) {
    if (loaiTen === 'Điện thoại di động') return '1'
    if (loaiTen === 'Laptop') return '3'
    return ''
  }


async function editProduct(index) {
  handleReset()
  editingIndex.value = index

  const selected = { ...pagedProducts.value[index] }

  if (!selected.loai) {
    selected.loai = mapLoaiTenToValue(selected.loaiTen || '')
  }

  // ⚠️ Bước 1: Gán chỉ loai để trigger visibleFields
  productForm.value.loai = String(selected.loai)

  // ⚠️ Bắt buộc chờ re-render sau khi loai được cập nhật
  await nextTick()

  // ⚠️ Bước 2: Gán từng field còn lại (sau khi form đã hiện đúng)
  for (const key in selected) {
    if (key !== 'loai') {
      productForm.value[key] = selected[key]
    }
  }
}





  function deleteProduct(index) {
    const globalIndex = (currentPage.value - 1) * pageSize + index
    products.value.splice(globalIndex, 1)
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

  const isFixedType = computed(() => {
    const loai = productForm.value?.loai
    return loai === '1' || loai === '3'
  })

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

    if (loai === '3') {
      return ['loai', ...baseFields, ...laptopFields]
    } else if (loai === '1') {
      return ['loai', ...baseFields, ...dienthoaiFields]
    } else {
      return ['loai', ...baseFields]
    }
  })

  async function createNewProduct() {
    const result = await createProduct(productForm.value)
    if (!result.success) {
      alert(result.message)
      return
    }
    products.value.push({ ...productForm.value })
    handleReset()
  }

  async function updateExistingProduct() {
    if (editingIndex.value === null) return

    const result = await updateProduct(productForm.value)
    if (!result.success) {
      alert(result.message)
      return
    }

    const globalIndex = (currentPage.value - 1) * pageSize + editingIndex.value
    products.value[globalIndex] = { ...productForm.value }
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
    isFixedType,
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
    updateExistingProduct
  }
}

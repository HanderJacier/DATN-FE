// src/composables/useProductTable.js
import { ref, computed } from 'vue'
import useSanPhamAdmin from '../CRUD/QLSanPham/Select' // dùng để lấy dữ liệu từ API

export function useProductTable() {
  const { products, loading, error } = useSanPhamAdmin() // lấy danh sách sản phẩm từ composable dùng onMounted

  const searchQuery = ref('')            // biến tìm kiếm
  const currentPage = ref(1)             // số trang hiện tại
  const pageSize = 8                     // số sản phẩm mỗi trang

  const productForm = ref({})            // object chứa dữ liệu form
  const editingIndex = ref(null)         // index đang sửa

  // để tự động sinh input form từ key-value
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
    diachianh: 'Chọn ảnh'
  }

  // lọc sản phẩm theo chuỗi tìm kiếm
  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(product =>
      Object.values(product).some(val =>
        String(val).toLowerCase().includes(query)
      )
    )
  })

  // tổng số trang
  const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / pageSize)
  )

  // lấy danh sách sản phẩm theo trang hiện tại
  const pagedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredProducts.value.slice(start, start + pageSize)
  })

  // chuyển trang
  function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // định dạng ngày theo kiểu Việt Nam
  function formatDate(date) {
    return date ? new Date(date).toLocaleDateString('vi-VN') : '-'
  }

  // nhấn nút sửa sản phẩm
  function editProduct(index) {
    handleReset()
    editingIndex.value = index
    productForm.value = { ...pagedProducts.value[index] }
  }

  // xóa sản phẩm
  function deleteProduct(index) {
    const globalIndex = (currentPage.value - 1) * pageSize + index
    products.value.splice(globalIndex, 1)
    if (editingIndex.value === index) handleReset()
  }

  // reset form
  function handleReset() {
    productForm.value = {}
    editingIndex.value = null
  }

  // xử lý chọn ảnh
  function onImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      productForm.value.diachianh = URL.createObjectURL(file)
    }
  }

  // thêm hoặc sửa sản phẩm
  function submitForm() {
    if (editingIndex.value === null) {
      products.value.push({ ...productForm.value }) // thêm mới
    } else {
      const globalIndex = (currentPage.value - 1) * pageSize + editingIndex.value
      products.value[globalIndex] = { ...productForm.value } // sửa
    }
    handleReset()
  }

  return {
    // state
    products,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    editingIndex,
    productForm,
    formFields,

    // computed
    filteredProducts,
    totalPages,
    pagedProducts,

    // methods
    changePage,
    formatDate,
    editProduct,
    deleteProduct,
    handleReset,
    onImageChange,
    submitForm
  }
}

import { ref, computed, nextTick } from 'vue'
import useSanPhamAdmin from '../CRUD/QLSanPham/Select'
import useSanPhamCreate from '../CRUD/QLSanPham/Create'
import useSanPhamUpdate from '../CRUD/QLSanPham/Update'
import {
  brandList,
  formFields,
  loaiMap,
  allowedProductFields,
  getVisibleFields,
  defaultProduct
} from './List'

export function useProductTable() {
  const { products, loading, error } = useSanPhamAdmin()
  const { createProduct } = useSanPhamCreate()
  const { updateProduct } = useSanPhamUpdate()

  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = 8
  const productForm = ref({ ...defaultProduct })
  const editingProductId = ref(null)
  const notification = ref('')
  const notificationType = ref('')

  const visibleFields = computed(() =>
    getVisibleFields(productForm.value?.loai)
  )

  function getBrandNameById(id) {
    return brandList.find(b => b.id === Number(id))?.name || ''
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
    return Array.isArray(products.value)
      ? products.value.filter(product =>
          Object.values(product).some(val =>
            String(val).toLowerCase().includes(query)
          )
        )
      : []
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
    const selected = { ...pagedProducts.value[index] }

    if (!selected.loai && selected.loaiTen) {
      selected.loai = mapLoaiTenToValue(selected.loaiTen)
    }

    productForm.value.loai = String(selected.loai)
    productForm.value.loaiTen = mapLoaiValueToTen(productForm.value.loai)

    productForm.value.thuonghieu =
      selected.thuonghieu ||
      brandList.find(b => b.name === selected.thuonghieuTen)?.id ||
      brandList.find(b => b.name === selected.thuonghieu)?.id ||
      ''

    productForm.value.diachianh = selected.diachianh || selected.anhgoc || ''
    editingProductId.value = selected.id_sp || null

    await nextTick()

    for (const key in selected) {
      if (!['loai', 'thuonghieu', 'diachianh'].includes(key)) {
        productForm.value[key] = selected[key]
      }
    }
  }

  async function uploadImageToCloud(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'DATN_PICTURES')

    const response = await fetch('https://api.cloudinary.com/v1_1/dkztehmmk/image/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Tải ảnh lên thất bại')

    const data = await response.json()
    return data.secure_url
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

    if (editingProductId.value === products.value[globalIndex].id_sp) handleReset()
  }

  function handleReset() {
    productForm.value = { anhphu: [] }
    editingProductId.value = null
  }

  async function onImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      productForm.value.diachianh = previewUrl
      productForm.value._imageFile = file
    }
  }

  async function onMultipleImagesChange(event) {
    const files = Array.from(event.target.files || [])
    const uploadedUrls = []

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'DATN_PICTURES')

      const response = await fetch('https://api.cloudinary.com/v1_1/dkztehmmk/image/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        uploadedUrls.push(data.secure_url)
      }
    }

    productForm.value.anhphu = uploadedUrls
  }

  async function createNewProduct() {
    if (!validateProductForm()) return

    try {
      if (productForm.value._imageFile) {
        const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
        productForm.value.anhgoc = imageUrl
        delete productForm.value._imageFile
      }

      const cleanForm = {}
      for (const key of allowedProductFields) {
        cleanForm[key] = productForm.value[key] ?? ''
      }
      if (Array.isArray(productForm.value.anhphu)) {
        cleanForm.anhphu = JSON.stringify(productForm.value.anhphu)
      }



      if (Array.isArray(productForm.value.anhphu)) {
        cleanForm.anhphu = JSON.stringify(productForm.value.anhphu)
      }

      const result = await createProduct(cleanForm)

      if (!result.success) {
        showNotification(result.message, 'error')
        return
      }

      productForm.value.loaiTen = mapLoaiValueToTen(productForm.value.loai)

      products.value.push({ ...productForm.value })
      showNotification('Thêm sản phẩm thành công!', 'success')
      handleReset()
    } catch (error) {
      showNotification('Tải ảnh thất bại', 'error')
    }
  }

  async function updateExistingProduct() {
    try {
      if (!productForm.value) return

      loading.value = true

      if (productForm.value._imageFile) {
        const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
        productForm.value.diachianh = imageUrl
        productForm.value.anhgoc = imageUrl
        delete productForm.value._imageFile
      }

      const payload = {
        ...productForm.value,
        anhphu: JSON.stringify(productForm.value.anhphu || [])
      }

      const success = await updateProduct(payload)

      if (success) {
        showNotification("Cập nhật sản phẩm thành công", 'success')
        handleReset()
      } else {
        showNotification("Cập nhật thất bại", 'error')
      }
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err)
      showNotification("Đã xảy ra lỗi khi cập nhật sản phẩm", 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    editingProductId,
    productForm,
    formFields,
    visibleFields,
    brandList,
    onImageChange,
    onMultipleImagesChange,
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
    notificationType,
    getBrandNameById
  }
}


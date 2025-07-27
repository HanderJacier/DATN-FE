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
  const { products, loading, error, fetchProducts } = useSanPhamAdmin()
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
  function handleReset() {
    // Reset về mặc định
    Object.assign(productForm.value, { ...defaultProduct })

    // Xóa ảnh phụ và ảnh gốc nếu có
    productForm.value.anhphu = []
    productForm.value.diachianh = ''
    delete productForm.value._imageFile

    // Reset trạng thái editing
    editingProductId.value = null
  }

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

    // **Gán id giảm giá (id_gg) nếu có trong selected**
    productForm.value.id_gg = selected.id_gg || null

    await nextTick()

    for (const key in selected) {
      if (selected[key] !== undefined) {
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

  async function deleteProduct() {
    try {
      if (!productForm.value) return
      loading.value = true

      // 👉 Dùng payload y hệt update nhưng chỉ set soluong = 0
      const cleanPayload = {
        id_sp: editingProductId.value,
      }

      for (const key of allowedProductFields) {
        cleanPayload[key] = productForm.value[key] ?? ''
      }

      cleanPayload.soluong = 0
      cleanPayload.anhphu = JSON.stringify(productForm.value.anhphu || [])

      const result = await updateProduct(cleanPayload)

      const isError =
        result && typeof result === 'object' &&
        ('success' in result && result.success === false || 'message' in result)

      if (isError) {
        showNotification(result.message || 'Xóa sản phẩm thất bại!', 'error')
        return
      }

      showNotification('Sản phẩm đã được xóa (số lượng = 0)', 'success')
      await fetchProducts()
      handleReset()
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err)
      showNotification("Đã xảy ra lỗi khi xóa sản phẩm", 'error')
    } finally {
      loading.value = false
    }
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
    productForm.value.anhphu = files // Lưu file, upload khi lưu
  }

  async function createNewProduct() {
    if (!validateProductForm()) return

    try {
      // Upload ảnh chính nếu có
      if (productForm.value._imageFile) {
        const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
        productForm.value.anhgoc = imageUrl
        delete productForm.value._imageFile
      }

      // Upload từng ảnh phụ nếu có
      if (Array.isArray(productForm.value.anhphu) && productForm.value.anhphu.length > 0) {
        const urls = []
        for (const file of productForm.value.anhphu) {
          if (file instanceof File) {
            const url = await uploadImageToCloud(file)
            urls.push(url)
          }
        }
        productForm.value.anhphu = urls
      }
    } catch (error) {
      showNotification('Tải ảnh thất bại', 'error')
      return
    }

    try {
      const cleanForm = {}
      for (const key of allowedProductFields) {
        cleanForm[key] = productForm.value[key] ?? ''
      }

      // Thêm id_gg vào payload (nếu chưa có trong allowedProductFields)
      cleanForm.id_gg = productForm.value.id_gg ?? null

      // Lưu mảng link ảnh phụ
      if (Array.isArray(productForm.value.anhphu)) {
        cleanForm.anhphu = JSON.stringify(productForm.value.anhphu)
      }

      const result = await createProduct(cleanForm)

      const isError =
        result && typeof result === 'object' &&
        ('success' in result && result.success === false || 'message' in result)

      if (isError) {
        const errorMsg = result.message || 'Thêm sản phẩm thất bại!'
        showNotification(errorMsg, 'error')
        return
      }

      await fetchProducts()
      showNotification('Thêm sản phẩm thành công!', 'success')
      handleReset()
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error)
      showNotification('Lỗi khi tạo sản phẩm', 'error')
    }
  }

  async function updateExistingProduct() {
    try {
      if (!productForm.value) return
      loading.value = true

      // Upload ảnh chính nếu có
      if (productForm.value._imageFile) {
        try {
          const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
          productForm.value.diachianh = imageUrl
          productForm.value.anhgoc = imageUrl
          delete productForm.value._imageFile
        } catch (error) {
          showNotification('Tải ảnh thất bại', 'error')
          return
        }
      }

      // Upload từng ảnh phụ nếu có file mới
      if (Array.isArray(productForm.value.anhphu) && productForm.value.anhphu.length > 0) {
        const urls = []
        for (const file of productForm.value.anhphu) {
          if (file instanceof File) {
            const url = await uploadImageToCloud(file)
            urls.push(url)
          } else if (typeof file === 'string') {
            urls.push(file) // Giữ lại link cũ nếu đã là link
          }
        }
        productForm.value.anhphu = urls
      }

      const cleanPayload = {
        id_sp: editingProductId.value,
      }

      for (const key of allowedProductFields) {
        cleanPayload[key] = productForm.value[key] ?? ''
      }

      cleanPayload.id_gg = productForm.value.id_gg ?? null
      cleanPayload.anhphu = JSON.stringify(productForm.value.anhphu || [])

      const result = await updateProduct(cleanPayload)

      const isError =
        result && typeof result === 'object' &&
        ('success' in result && result.success === false || 'message' in result)

      if (isError) {
        const errorMsg = result.message || 'Cập nhật sản phẩm thất bại!'
        showNotification(errorMsg, 'error')
        return
      }

      showNotification('Cập nhật sản phẩm thành công!', 'success')
      handleReset()
      await fetchProducts()
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
    getBrandNameById,
  }
}


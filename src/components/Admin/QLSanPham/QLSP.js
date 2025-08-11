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

// ===== Helper ngày dd/MM/yyyy =====
function parseDDMMYYYY(str) {
  if (!str || typeof str !== 'string') return null
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const [dStr, mStr, yStr] = parts
  const d = Number(dStr), m = Number(mStr), y = Number(yStr)
  if (!d || !m || !y) return null
  const date = new Date(y, m - 1, d)
  // Kiểm tra ngược để chắc đúng ngày
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

function formatToDDMMYYYY(value) {
  if (!value) return ''
  let date = null
  if (value instanceof Date) {
    date = value
  } else if (typeof value === 'string') {
    // Thử parse dd/MM/yyyy
    date = parseDDMMYYYY(value)
    if (!date) {
      // Thử parse dạng ISO hoặc chuỗi ngày khác
      const tmp = new Date(value)
      if (!isNaN(tmp.getTime())) date = tmp
    }
  }
  if (!date || isNaN(date.getTime())) return ''
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = String(date.getFullYear())
  return `${dd}/${mm}/${yyyy}`
}

// Chuẩn hoá về string dd/MM/yyyy (nếu không hợp lệ trả về '')
function normalizeDDMMYYYY(value) {
  return formatToDDMMYYYY(value)
}

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
    Object.assign(productForm.value, { ...defaultProduct })
    productForm.value.anhphu = ''
    productForm.value.diachianh = ''
    delete productForm.value._imageFile
    delete productForm.value._anhphuFile
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

  // Dùng cho table hiển thị ngày
  function formatDate(value) {
    if (value == null) return '-'
    let s = String(value).trim()
    if (!s) return '-'

    // Nếu đã đúng dd/MM/yyyy thì trả luôn
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s

    // Chuẩn hoá chuỗi kiểu "Jul  4 2025  9:19PM" -> "Jul 4 2025 9:19 PM"
    s = s.replace(/\s+/g, ' ').replace(/([AP]M)$/i, ' $1')

    // Thử parse bằng Date
    const d = new Date(s)
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }

    return '-'
  }

  function normalizeNameVN(s) {
    return (s ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')                 // tách dấu
      .replace(/[\u0300-\u036f]/g, '')  // bỏ dấu
      .replace(/\s+/g, ' ')             // gộp khoảng trắng
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

    // --- CHECK TRÙNG TÊN ---
    const newName = normalizeNameVN(productForm.value.tensanpham)
    const dup = (products.value ?? []).some(p =>
      normalizeNameVN(p.tensanpham) === newName &&
      (p.id_sp ?? p.id) !== editingProductId.value   // bỏ qua bản ghi đang sửa
    )
    if (dup) {
      showNotification('Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.', 'error')
      return false
    }
    // --- END CHECK TRÙNG TÊN ---

    // Nếu có giảm giá (id_gg > 0) thì cần hạn giảm giá (dd/MM/yyyy)
    if ((productForm.value.id_gg ?? 0) > 0) {
      const normalized = normalizeDDMMYYYY(productForm.value.hangiamgia)
      if (!normalized) {
        showNotification('Vui lòng chọn Hạn giảm giá (dd/MM/yyyy)', 'error')
        return false
      }
    }

    return true
  }


  function normalizeAnhPhuToString(val) {
    if (!val) return ''
    if (typeof val === 'string') {
      // nếu backend từng lưu JSON array: '["url1","url2"]'
      try {
        const parsed = JSON.parse(val)
        if (Array.isArray(parsed)) return parsed[0] || ''
        return val
      } catch {
        return val  // là string URL bình thường
      }
    }
    if (Array.isArray(val)) return val[0] || ''
    return ''
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

    // id giảm giá
    productForm.value.id_gg = selected.loaigiam ?? 0

    // chuẩn hoá hạn giảm giá -> dd/MM/yyyy (string)
    productForm.value.hangiamgia = normalizeDDMMYYYY(selected.hangiamgia)

    await nextTick()

    for (const key in selected) {
      if (selected[key] !== undefined) {
        if (key === 'hangiamgia') continue
        if (key === 'anhphu') continue       // <- thêm
        productForm.value[key] = selected[key]
      }
    }

    productForm.value.anhphu = normalizeAnhPhuToString(selected.diachianh)

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

      const cleanPayload = {
        id_sp: editingProductId.value,
      }

      for (const key of allowedProductFields) {
        cleanPayload[key] = productForm.value[key] ?? ''
      }

      cleanPayload.soluong = 0
      cleanPayload.anhphu = JSON.stringify(productForm.value.anhphu || [])

      // đảm bảo chuỗi dd/MM/yyyy
      cleanPayload.hangiamgia = normalizeDDMMYYYY(productForm.value.hangiamgia)

      const result = await updateProduct(cleanPayload)

      const isError =
        result && typeof result === 'object' &&
        (('success' in result && result.success === false) || 'message' in result)

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
    const file = files[0]
    if (file) {
      // Lưu file để upload khi lưu form
      productForm.value._anhphuFile = file
      // (tuỳ thích) hiển thị preview tạm
      productForm.value.anhphu = URL.createObjectURL(file)
    } else {
      productForm.value._anhphuFile = undefined
      productForm.value.anhphu = ''
    }
  }


  async function createNewProduct() {
    if (!validateProductForm()) return

    try {
      if (productForm.value._imageFile) {
        const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
        productForm.value.anhgoc = imageUrl
        delete productForm.value._imageFile
      }

      // --- Trong createNewProduct ---
      // --- Ảnh phụ: upload 1 file -> ra 1 URL string
      if (productForm.value._anhphuFile) {
        const url = await uploadImageToCloud(productForm.value._anhphuFile)
        productForm.value.anhphu = url
        delete productForm.value._anhphuFile
      }
      // Nếu đã là string URL sẵn thì giữ nguyên

    } catch (error) {
      showNotification('Tải ảnh thất bại', 'error')
      return
    }

    try {
      const cleanForm = {}
      for (const key of allowedProductFields) {
        cleanForm[key] = productForm.value[key] ?? ''
      }

      cleanForm.id_gg = productForm.value.id_gg ?? 0
      cleanForm.hangiamgia = normalizeDDMMYYYY(productForm.value.hangiamgia)
      cleanForm.anhphu = productForm.value.anhphu || ''  // BỎ JSON.stringify


      const result = await createProduct(cleanForm)

      const isError =
        result && typeof result === 'object' &&
        (('success' in result && result.success === false) || 'message' in result)

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

      if (productForm.value._anhphuFile) {
        const url = await uploadImageToCloud(productForm.value._anhphuFile)
        productForm.value.anhphu = url
        delete productForm.value._anhphuFile
      }
      // Không còn xử lý mảng; giữ string nếu đã có


      const cleanPayload = {
        id_sp: editingProductId.value,
      }

      for (const key of allowedProductFields) {
        cleanPayload[key] = productForm.value[key] ?? ''
      }

      cleanPayload.id_gg = productForm.value.id_gg ?? 0
      cleanPayload.anhphu = productForm.value.anhphu || ''  // BỎ JSON.stringify
      cleanPayload.hangiamgia = normalizeDDMMYYYY(productForm.value.hangiamgia)

      const result = await updateProduct(cleanPayload)

      const isError =
        result && typeof result === 'object' &&
        (('success' in result && result.success === false) || 'message' in result)

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

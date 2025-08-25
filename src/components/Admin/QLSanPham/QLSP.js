import { ref, computed, nextTick } from 'vue'
import useSanPhamAdmin from '../CRUD/QLSanPham/Select'
import useSanPhamCreate from '../CRUD/QLSanPham/Create'
import useSanPhamUpdate from '../CRUD/QLSanPham/Update'
import useSanPhamUpdateTrangThai from '../CRUD/QLSanPham/UPDTrangThai'

import {
  brandList,
  formFields,
  loaiMap,
  allowedProductFields,   // KHÔNG cần chứa ds_anh_phu
  getVisibleFields,
  defaultProduct
} from './List'

// ---- Helpers ngày dd/MM/yyyy ----
function parseDDMMYYYY(str) {
  if (!str || typeof str !== 'string') return null
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const [dStr, mStr, yStr] = parts
  const d = Number(dStr), m = Number(mStr), y = Number(yStr)
  if (!d || !m || !y) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}
function formatToDDMMYYYY(value) {
  if (!value) return ''
  let date = null
  if (value instanceof Date) date = value
  else if (typeof value === 'string') {
    date = parseDDMMYYYY(value)
    if (!date) {
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
function normalizeDDMMYYYY(value) { return formatToDDMMYYYY(value) }

// ---- Helper: lấy URL đầu tiên từ ds_anh_phu ----
function normalizeAnhPhuToString(val) {
  if (!val) return ''
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parsed[0] || ''
      return val
    } catch {
      return val
    }
  }
  if (Array.isArray(val)) return val[0] || ''
  return ''
}

// ---- Composable ----
export function useProductTable() {
  const { products, loading, error, fetchProducts } = useSanPhamAdmin()
  const { createProduct } = useSanPhamCreate()
  const { updateProduct } = useSanPhamUpdate()
  const { updateTrangThai } = useSanPhamUpdateTrangThai?.() ?? {}

  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = 8
  const productForm = ref({ ...defaultProduct })
  const editingProductId = ref(null)
  const notification = ref('')
  const notificationType = ref('')
  const actionLoading = ref(false)

  const visibleFields = computed(() => getVisibleFields(productForm.value?.loai))

  function showNotification(message, type = 'success') {
    notification.value = message
    notificationType.value = type
    setTimeout(() => { notification.value = ''; notificationType.value = '' }, 3000)
  }

  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return Array.isArray(products.value)
      ? products.value.filter(product =>
          Object.values(product).some(val => String(val).toLowerCase().includes(query))
        )
      : []
  })

  function handleReset() {
    Object.assign(productForm.value, { ...defaultProduct })
    delete productForm.value._imageFile
    delete productForm.value._anhphuFile
    editingProductId.value = null
  }

  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
  const pagedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredProducts.value.slice(start, start + pageSize)
  })
  function changePage(page) {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
  }

  function formatDate(value) {
    if (value == null) return '-'
    let s = String(value).trim()
    if (!s) return '-'
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s
    s = s.replace(/\s+/g, ' ').replace(/([AP]M)$/i, ' $1')
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
    return (s ?? '').toString().trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
  }
  function mapLoaiTenToValue(loaiTen) { return loaiMap[loaiTen] || '' }
  function mapLoaiValueToTen(loai) {
    return Object.entries(loaiMap).find(([_, v]) => v === loai)?.[0] || ''
  }

  // ---- VALIDATE ----
  function validateProductForm() {
    const requiredFields = ['tensanpham', 'thuonghieu', 'dongia', 'soluong', 'loai']
    for (const field of requiredFields) {
      const value = productForm.value[field]
      if (value === undefined || value === null || value === '') {
        showNotification(`Vui lòng nhập: ${formFields[field]}`, 'error')
        return false
      }
    }
    if (Number(productForm.value.dongia) < 0) {
      showNotification('Giá sản phẩm không được nhỏ hơn 0', 'error'); return false
    }
    if (Number(productForm.value.soluong) < 0) {
      showNotification('Số lượng không được nhỏ hơn 0', 'error'); return false
    }

    const newName = normalizeNameVN(productForm.value.tensanpham)
    const dup = (products.value ?? []).some(p =>
      normalizeNameVN(p.tensanpham) === newName && (p.id_sp ?? p.id) !== editingProductId.value
    )
    if (dup) { showNotification('Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.', 'error'); return false }

    const idGg = Number(productForm.value.id_gg || 0)
    const hanGg = (productForm.value.hangiamgia || '').trim()
    if ((idGg > 0 && !hanGg) || (idGg === 0 && hanGg)) {
      showNotification('Vui lòng chọn cả loại giảm giá và hạn giảm giá, hoặc bỏ trống cả hai!', 'error')
      return false
    }
    return true
  }

  // ---- EDIT ----
  async function editProduct(index) {
    handleReset()
    const selected = { ...pagedProducts.value[index] }

    if (!selected.loai && selected.loaiTen) selected.loai = mapLoaiTenToValue(selected.loaiTen)
    productForm.value.loai = String(selected.loai)
    productForm.value.loaiTen = mapLoaiValueToTen(productForm.value.loai)

    productForm.value.thuonghieu =
      selected.thuonghieu ||
      brandList.find(b => b.name === selected.thuonghieuTen)?.id ||
      brandList.find(b => b.name === selected.thuonghieu)?.id || ''

    productForm.value.diachianh = selected.diachianh || selected.anhgoc || ''
    productForm.value.anhgoc = selected.anhgoc || selected.diachianh || ''
    editingProductId.value = selected.id_sp || null

    productForm.value.id_gg = Number(selected.id_gg ?? selected.loaigiam ?? 0)
    const rawHan = selected.hangiamgia ?? selected.han_giam ?? selected.hanGiamGia ?? ''
    const normalized = normalizeDDMMYYYY(rawHan)
    productForm.value.hangiamgia = (!normalized || /^00\/00\/0000$/.test(normalized)) ? '' : normalized

    await nextTick()

    for (const key in selected) {
      if (selected[key] !== undefined) {
        if (key === 'hangiamgia' || key === 'ds_anh_phu') continue
        productForm.value[key] = selected[key]
      }
    }

    // đọc từ ds_anh_phu
    productForm.value.ds_anh_phu = selected.ds_anh_phu ?? selected.anh_phu ?? ''
  }

  // ---- Upload ảnh ----
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

  // ---- Handlers ảnh ----
  async function onImageChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      productForm.value.diachianh = previewUrl
      productForm.value._imageFile = file
    }
  }
  async function onMultipleImagesChange(event) {
    const file = Array.from(event.target.files || [])[0]
    if (file) {
      productForm.value._anhphuFile = file
      productForm.value.ds_anh_phu = URL.createObjectURL(file)
    } else {
      productForm.value._anhphuFile = undefined
      productForm.value.ds_anh_phu = ''
    }
  }

  // ---- CREATE ----
  async function createNewProduct() {
    if (!validateProductForm()) return false
    try {
      if (productForm.value._imageFile) {
        const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
        productForm.value.anhgoc = imageUrl
        productForm.value.diachianh = imageUrl
        delete productForm.value._imageFile
      }
      if (productForm.value._anhphuFile) {
        const url = await uploadImageToCloud(productForm.value._anhphuFile)
        productForm.value.ds_anh_phu = url
        delete productForm.value._anhphuFile
      }
      if (typeof productForm.value.ds_anh_phu === 'string' && productForm.value.ds_anh_phu.startsWith('blob:')) {
        showNotification('Ảnh phụ chưa được tải lên. Vui lòng chọn lại.', 'error')
        return false
      }
    } catch {
      showNotification('Tải ảnh thất bại', 'error'); return false
    }

    try {
      const payload = {}
      for (const key of allowedProductFields) payload[key] = productForm.value[key] ?? ''
      payload.id_gg = productForm.value.id_gg ?? 0
      payload.hangiamgia = normalizeDDMMYYYY(productForm.value.hangiamgia)
      // map ds_anh_phu -> anhphu
      payload.anhphu = JSON.stringify(
        Array.isArray(productForm.value.ds_anh_phu)
          ? productForm.value.ds_anh_phu
          : (productForm.value.ds_anh_phu ? [productForm.value.ds_anh_phu] : [])
      )

      const result = await createProduct(payload)
      const isError = result && typeof result === 'object' &&
        (('success' in result && result.success === false) || 'message' in result)
      if (isError) { showNotification(result.message || 'Thêm sản phẩm thất bại!', 'error'); return false }

      await fetchProducts()
      showNotification('Thêm sản phẩm thành công!', 'success')
      handleReset()
      return true
    } catch (e) {
      console.error('Lỗi khi tạo sản phẩm:', e)
      showNotification('Lỗi khi tạo sản phẩm', 'error')
      return false
    }
  }

  // ---- UPDATE ----
  async function updateExistingProduct() {
    if (!validateProductForm()) return false
    try {
      if (!productForm.value) return false
      loading.value = true

      if (productForm.value._imageFile) {
        try {
          const imageUrl = await uploadImageToCloud(productForm.value._imageFile)
          productForm.value.diachianh = imageUrl
          productForm.value.anhgoc = imageUrl
          delete productForm.value._imageFile
        } catch {
          showNotification('Tải ảnh thất bại', 'error'); return false
        }
      }
      if (productForm.value._anhphuFile) {
        const url = await uploadImageToCloud(productForm.value._anhphuFile)
        productForm.value.ds_anh_phu = url
        delete productForm.value._anhphuFile
      }
      if (typeof productForm.value.ds_anh_phu === 'string' && productForm.value.ds_anh_phu.startsWith('blob:')) {
        showNotification('Ảnh phụ chưa được tải lên. Vui lòng chọn lại.', 'error')
        return false
      }

      const payload = { id_sp: editingProductId.value }
      for (const key of allowedProductFields) payload[key] = productForm.value[key] ?? ''
      payload.id_gg = productForm.value.id_gg ?? 0
      payload.hangiamgia = normalizeDDMMYYYY(productForm.value.hangiamgia)
      payload.anhphu = JSON.stringify(
        Array.isArray(productForm.value.ds_anh_phu)
          ? productForm.value.ds_anh_phu
          : (productForm.value.ds_anh_phu ? [productForm.value.ds_anh_phu] : [])
      )

      const result = await updateProduct(payload)
      const isError = result && typeof result === 'object' &&
        (('success' in result && result.success === false) || 'message' in result)
      if (isError) { showNotification(result.message || 'Cập nhật sản phẩm thất bại!', 'error'); return false }

      showNotification('Cập nhật sản phẩm thành công!', 'success')
      handleReset()
      await fetchProducts()
      return true
    } catch (err) {
      console.error('Lỗi cập nhật sản phẩm:', err)
      showNotification('Đã xảy ra lỗi khi cập nhật sản phẩm', 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  // ---- Cập nhật trạng thái ----
  async function updateProductStatus(id_sp, status) {
    actionLoading.value = true
    try {
      if (!updateTrangThai) { console.warn('[updateProductStatus] updateTrangThai không tồn tại'); return false }
      const res = await updateTrangThai(id_sp, status === 1 ? 'Y' : 'N')
      let affected = 0
      if (Array.isArray(res)) affected = res[0]?.affected_rows || 0
      else if (res?.affected_rows) affected = res.affected_rows || 0

      if (Number(affected) > 0) {
        notification.value = '✅ Cập nhật trạng thái sản phẩm thành công'
        notificationType.value = 'success'
        return true
      } else {
        notification.value = '❌ Cập nhật trạng thái thất bại'
        notificationType.value = 'error'
        return false
      }
    } catch (e) {
      console.error('[updateProductStatus] error:', e)
      return false
    } finally {
      actionLoading.value = false
    }
  }

  async function reloadList() { await fetchProducts() }

  return {
    products, loading, error,
    searchQuery, currentPage, pageSize,
    editingProductId, productForm, formFields,
    visibleFields, brandList,
    onImageChange, onMultipleImagesChange,
    filteredProducts, totalPages, pagedProducts,
    changePage, formatDate,
    editProduct, handleReset,
    createNewProduct, updateExistingProduct,
    notification, notificationType,
    updateProductStatus, actionLoading, reloadList
  }
}

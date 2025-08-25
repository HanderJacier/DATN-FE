<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width:100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        QUẢN LÝ SẢN PHẨM
      </h5>

      <!-- Thanh công cụ -->
      <div class="row g-2 mb-3 align-items-center">
        <div class="col-md-6">
          <input
            v-model="searchQuery"
            placeholder="Tìm kiếm sản phẩm..."
            class="form-control"
            @input="currentPage = 1"
          />
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-success fw-bold me-2" @click="openAddModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm mới sản phẩm
          </button>
          <button class="btn btn-warning fw-bold" @click="reloadList" :disabled="actionLoading">
            <i class="bi bi-arrow-clockwise me-2"></i>Làm mới
          </button>
        </div>
      </div>

      <!-- Thông báo -->
      <div
        v-if="notification"
        :class="['alert', notificationType === 'success' ? 'alert-success' : 'alert-danger']"
      >
        {{ notification }}
      </div>

      <!-- Bảng -->
      <div class="table-responsive" style="max-height: 600px; overflow-x: auto;">
        <table class="table table-bordered table-hover align-middle text-center bg-white" style="width:max-content;min-width:100%;">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Giá (VND)</th>
              <th>Giá đã giảm</th>
              <th>Hạn giảm giá</th>
              <th>Màu sắc</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in pagedProducts" :key="product.id_sp || index">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="truncate-name" :title="product.tensanpham">{{ product.tensanpham }}</td>
              <td>{{ product.loaiTen }}</td>
              <td>{{ product.dongia?.toLocaleString() }}</td>
              <td>
                <span v-if="product.giamgia && product.giamgia < product.dongia">
                  {{ product.giamgia.toLocaleString() }}
                </span>
                <span v-else>-</span>
              </td>
              <td>{{ product.hangiamgia }}</td>
              <td>{{ product.mausac }}</td>
              <td>
                <img
                  v-if="product.anhgoc || product.diachianh"
                  :src="product.anhgoc || product.diachianh"
                  width="40" height="40" class="rounded" alt="Ảnh sản phẩm"
                />
                <span v-else>-</span>
              </td>
              <td>
                <div class="form-check form-switch d-flex justify-content-center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="product.trangthai === 'Y'"
                    :disabled="actionLoading"
                    @change="updateStatus(product, $event.target.checked)"
                  />
                </div>
              </td>
              <td>{{ formatDate(product.ngaytao) }}</td>
              <td>{{ product.soluong }}</td>
              <td>
                <button class="btn btn-sm btn-outline-info" @click="openEditModal(product)">
                  <i class="bi bi-pencil"></i> Sửa
                </button>
              </td>
            </tr>
            <tr v-if="pagedProducts.length === 0">
              <td colspan="12" class="text-muted">Không tìm thấy sản phẩm nào.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal Thêm/Sửa sản phẩm -->
    <div v-if="showProductModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-plus-circle'"></i>
              {{ modalTitle }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
              <!-- Dropdowns -->
              <div class="row">
                <div class="col-md-3 mb-3">
                  <label class="form-label">Chọn loại sản phẩm</label>
                  <select class="form-select" v-model="productForm.loai">
                    <option disabled value="">-- Chọn loại --</option>
                    <option v-for="item in loaiOptions" :key="item.value" :value="item.value">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Chọn thương hiệu</label>
                  <select class="form-select" v-model="productForm.thuonghieu">
                    <option disabled value="">-- Chọn thương hiệu --</option>
                    <option v-for="brand in brandList" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Chọn giảm giá</label>
                  <select class="form-select" v-model="productForm.id_gg" :disabled="loadingDiscounts">
                    <option :value="0">Không giảm</option>
                    <option v-for="item in giamGiaList" :key="item.id_gg" :value="item.id_gg">
                      Giảm {{ item.loaigiamTen }}%
                    </option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Hạn giảm giá</label>
                  <input type="date" class="form-control" v-model="hangiamgiaProxy" />
                </div>
              </div>

              <!-- Fields khác -->
              <div class="row g-3">
                <div class="col-md-4" v-for="key in visibleFieldsNoStatus" :key="key">
                  <label class="form-label">{{ fieldLabels[key] }}</label>

                  <div v-if="key === 'anhgoc'">
                    <input type="file" class="form-control" @change="onImageChange" />
                    <div v-if="isEditing && (productForm.anhgoc || productForm.diachianh)" class="mt-1 small text-secondary">
                    </div>
                  </div>

                  <div v-else-if="key === 'anhphu'">
                    <input type="file" class="form-control" @change="onAnhPhuChange" />
                    <div v-if="isEditing && (anhPhuUrl || productForm.ds_anh_phu)" class="mt-1 small text-secondary">
                    </div>
                  </div>

                  <input
                    v-else
                    :type="['dongia','soluong'].includes(key) ? 'number' : 'text'"
                    class="form-control"
                    v-model="productForm[key]"
                  />
                </div>

                <div class="col-md-4 p-2" v-if="productForm.diachianh || productForm.anhgoc">
                  <label class="form-label d-block">Xem trước ảnh chính</label>
                  <img
                    v-if="productForm.diachianh && productForm.diachianh.startsWith('blob:')"
                    :src="productForm.diachianh" width="100" height="100" class="rounded" style="object-fit:cover;"
                  />
                  <img
                    v-else-if="productForm.anhgoc"
                    :src="productForm.anhgoc" width="100" height="100" class="rounded" style="object-fit:cover;"
                  />
                </div>

                <div class="col-md-4 p-2" v-if="anhPhuUrl">
                  <label class="form-label d-block">Xem trước ảnh phụ</label>
                  <img :src="anhPhuUrl" width="100" height="100" class="rounded" style="object-fit:cover;" />
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="onCancel">
                  <i class="bi bi-x-circle"></i> Hủy
                </button>
                <button type="submit" class="btn btn-primary" :disabled="actionLoading">
                  <i class="bi bi-check-circle"></i> {{ isEditing ? 'Cập nhật' : 'Thêm' }}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div> <!-- /modal -->
  </div>
</template>

<script setup>
import {
  brandList as brandListConst,
  formFields as fieldLabels,
  loaiMap,
  getVisibleFields,
} from './List'

import { computed, ref, watch, onMounted } from 'vue'
import useGiamGiaList from '../CRUD/QLSanPham/GiamGia'
import { useProductTable } from './QLSP'

const { giamGiaList, loading: loadingDiscounts } = useGiamGiaList()

const {
  productForm,
  editingProductId,
  searchQuery,
  currentPage,
  pageSize,
  pagedProducts,
  totalPages,
  formatDate,
  changePage,
  editProduct,
  handleReset,
  onImageChange,
  onMultipleImagesChange,
  createNewProduct,
  updateExistingProduct,
  notification,
  notificationType,
  updateProductStatus,
  actionLoading,
  reloadList
} = useProductTable()

/* ---------------- Modal state ---------------- */
const showProductModal = ref(false)
const isEditing = computed(() => editingProductId.value !== null)
const modalTitle = computed(() => (isEditing.value ? 'Sửa sản phẩm' : 'Thêm mới sản phẩm'))

function onCancel() {
  handleReset()
  previewAnhPhu.value = ''
  productForm.value.anhgoc = ''
  productForm.value.diachianh = ''
  closeModal()
}

function openAddModal() {
  handleReset()
  if ('trangthai' in productForm.value) delete productForm.value.trangthai
  editingProductId.value = null
  showProductModal.value = true
}

async function openEditModal(product) {
  const idx = pagedProducts.value.findIndex(p => (p.id_sp || '') === (product.id_sp || ''))
  if (idx > -1) await editProduct(idx)  // chờ set form xong
  if ('trangthai' in productForm.value) delete productForm.value.trangthai
  showProductModal.value = true
}

function closeModal() { showProductModal.value = false }

/* ---------------- Fields render ---------------- */
const visibleFields = getVisibleFields()
const visibleFieldsNoStatus = computed(() =>
  (Array.isArray(visibleFields) ? visibleFields : []).filter(k => k !== 'trangthai')
)

/* ---------------- Ảnh phụ preview ---------------- */
const previewAnhPhu = ref('')
function onAnhPhuChange(event) {
  const file = (event.target.files || [])[0]
  previewAnhPhu.value = file ? URL.createObjectURL(file) : ''
  onMultipleImagesChange(event)
}
watch(() => productForm.value.ds_anh_phu, (val) => {
  if (!val || (typeof val === 'string' && (val.length === 0 || !val.startsWith('blob:')))) {
    previewAnhPhu.value = ''
  }
})
const anhPhuUrl = computed(() => {
  if (previewAnhPhu.value) return previewAnhPhu.value
  const v = productForm.value?.ds_anh_phu
  if (!v) return ''
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); if (Array.isArray(p)) return p[0] || '' } catch {}
    return v.startsWith('blob:') ? '' : v
  }
  if (Array.isArray(v)) return v[0] || ''
  return ''
})

/* ---------------- Date proxy dd/MM/yyyy <-> input[type=date] ---------------- */
function toDateInputValue(ddmmyyyy) {
  if (!ddmmyyyy || typeof ddmmyyyy !== 'string') return ''
  const [d, m, y] = ddmmyyyy.split('/')
  if (!d || !m || !y) return ''
  return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
}
function fromDateInputValue(yyyymmdd) {
  if (!yyyymmdd || typeof yyyymmdd !== 'string') return ''
  const [y, m, d] = yyyymmdd.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}
const hangiamgiaProxy = computed({
  get() { return toDateInputValue(productForm.value.hangiamgia) },
  set(v) { productForm.value.hangiamgia = fromDateInputValue(v) }
})

/* ---------------- Validate nhẹ ở UI (gọi composable) ---------------- */
function validateForm() {
  const required = ['tensanpham','thuonghieu','dongia','soluong','loai']
  for (const f of required) {
    const v = productForm.value[f]
    if (v === undefined || v === '' || v === null) {
      notification.value = `❌ Vui lòng nhập: ${fieldLabels[f]}`
      notificationType.value = 'error'
      return false
    }
    if (['dongia','soluong'].includes(f) && Number(v) < 0) {
      notification.value = `❌ ${fieldLabels[f]} không được âm`
      notificationType.value = 'error'
      return false
    }
  }
  return true
}
function handleCreate() { if (validateForm()) createNewProduct().then(() => closeModal()) }
function handleUpdate() { if (validateForm()) updateExistingProduct().then(() => closeModal()) }

/* ---------------- Update trạng thái ngoài bảng ---------------- */
async function updateStatus(product, checked) {
  try {
    const ok = await updateProductStatus(product.id_sp, checked ? 1 : 0)
    if (ok) {
      product.trangthai = checked ? 'Y' : 'N'
      notification.value = '✅ Cập nhật trạng thái sản phẩm thành công'
      notificationType.value = 'success'
    } else {
      product.trangthai = product.trangthai === 'Y' ? 'N' : 'Y'
      notification.value = '❌ Cập nhật trạng thái thất bại'
      notificationType.value = 'error'
    }
  } catch (e) {
    product.trangthai = product.trangthai === 'Y' ? 'N' : 'Y'
    notification.value = '❌ Có lỗi khi cập nhật trạng thái'
    notificationType.value = 'error'
    console.error('[updateStatus] error:', e)
  } finally { setTimeout(() => (notification.value = ''), 5000) }
}

/* ---------------- Options ---------------- */
const loaiOptions = computed(() =>
  Object.entries(loaiMap).map(([name, value]) => ({ name, value }))
)

onMounted(() => { if (typeof reloadList === 'function') reloadList() })

// expose cho template
const brandList = brandListConst
</script>

<style scoped>
.form-title{ font-size:18px; }
.modal{ background-color: rgba(0,0,0,0.5); }

.form-check-input:checked{ background-color:#198754; border-color:#198754; }
.form-check-input:not(:checked){ background-color:#dc3545; border-color:#dc3545; }
.truncate-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

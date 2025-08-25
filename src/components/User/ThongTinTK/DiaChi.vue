<template>
  <div class="container my-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <Slidebar />
      </div>

      <!-- Khối địa chỉ -->
      <div class="col-md-8">
        <h4 class="fw-bold mb-4">Địa chỉ của tôi</h4>

        <div class="bg-white border rounded p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>Địa chỉ</h5>
            <button class="btn btn-primary" type="button" @click="openAddModal" :disabled="!idTk">
              + Thêm địa chỉ mới
            </button>
          </div>

          <!-- Nếu chưa có id_tk -->
          <div v-if="!idTk" class="alert alert-warning mb-0">
            Bạn chưa đăng nhập hoặc thiếu <code>id_tk</code>. Vui lòng đăng nhập lại để quản lý địa chỉ.
          </div>

          <!-- Danh sách địa chỉ -->
          <template v-else>
            <div
              v-for="(addr, i) in addresses"
              :key="addr.id_dc ?? i"
              class="pt-3 mb-3 border-top"
            >
              <p class="mb-1">{{ addr.diachi }}</p>

              <div class="d-flex gap-2 w-100 justify-content-end mt-2">
                <button class="btn btn-primary" type="button" @click="openEditModal(i)">
                  Cập nhật
                </button>
                <button class="btn btn-outline-danger" type="button" @click="deleteAddress(i)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Trạng thái -->
            <div class="small mt-3">
              <span v-if="loadingFetch || loadingSubmit">Đang xử lý...</span>
              <span v-else-if="errorFetch || errorSubmit" class="text-danger">
                Có lỗi xảy ra, vui lòng thử lại.
              </span>
              <span v-else-if="addresses.length === 0" class="text-muted">
                Chưa có địa chỉ nào, hãy thêm địa chỉ mới.
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Modal Thêm / Cập nhật -->
      <div v-if="showModal">
        <div class="modal-backdrop fade show"></div>

        <div class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ isEdit ? 'Cập Nhật Địa Chỉ' : 'Địa Chỉ Mới' }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>

              <div class="modal-body">
                <div class="mb-3">
                  <textarea
                    class="form-control"
                    rows="3"
                    placeholder="Địa chỉ cụ thể (số nhà, đường...)"
                    v-model="formAddress.diachi"
                  ></textarea>
                </div>
              </div>

              <div class="modal-footer justify-content-between">
                <button class="btn btn-link text-decoration-none" @click="closeModal">
                  Trở Lại
                </button>
                <button class="btn btn-danger px-4" @click="saveAddress" :disabled="!idTk">
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Modal -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Slidebar from '@/components/User/Title/Slidebar.vue'

// SweetAlert2
import Swal from 'sweetalert2'
// import 'sweetalert2/dist/sweetalert2.min.css'

// Composables gọi API
import useDiaChiTheoTaiKhoan from '../LoadDB/SELDiaChi'
import useDiaChi from '../LoadDB/UPDDiachi'

/* ===== Helper đọc id_tk an toàn ===== */
function readIdTk() {
  if (typeof window === 'undefined') return null

  // 1) sessionStorage trực tiếp
  const s1 = sessionStorage.getItem('id_tk')
  if (s1 && !isNaN(+s1) && +s1 > 0) return +s1

  // 2) localStorage trực tiếp
  const s2 = localStorage.getItem('id_tk')
  if (s2 && !isNaN(+s2) && +s2 > 0) return +s2

  // 3) từ object "user" trong sessionStorage / localStorage
  let user = null
  try {
    user =
      JSON.parse(sessionStorage.getItem('user') || 'null') ||
      JSON.parse(localStorage.getItem('user') || 'null')
  } catch (e) {
    user = null
  }

  const fromUser = Number(user?.id_tk ?? user?.id ?? user?.taikhoan)
  if (!isNaN(fromUser) && fromUser > 0) return fromUser

  return null
}

// id_tk động
const idTk = ref(readIdTk())

// UI state
const showModal = ref(false)
const isEdit = ref(false)
const editingIndex = ref(null)

const formAddress = ref({
  id_dc: 0,
  diachi: ''
})

// API: lấy địa chỉ theo tài khoản
const {
  addresses: rawAddresses, // [{id_dc, diachi}]
  fetchDiaChiTheoTaiKhoan,
  loading: loadingFetch,
  error: errorFetch
} = useDiaChiTheoTaiKhoan()

// API: CRUD địa chỉ
const {
  createDiaChi,
  updateDiaChi,
  deleteDiaChi: apiDeleteDiaChi,
  loading: loadingSubmit,
  error: errorSubmit
} = useDiaChi()

// Toast helper
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true
})

// Map ra danh sách hiển thị
const addresses = computed(() => rawAddresses.value || [])

/* ===== Đồng bộ id_tk khi user login sau đó ===== */
async function ensureIdTkAndFetch() {
  const current = idTk.value
  const latest = readIdTk()
  if (latest && latest !== current) {
    idTk.value = latest
    await fetchDiaChiTheoTaiKhoan(idTk.value)
  }
}

function handleStorage() {
  // storage event (khác tab) – thử refresh id_tk
  ensureIdTkAndFetch()
}
function handleFocusOrVisible() {
  // khi quay lại tab hoặc trở lại visible – đọc lại id_tk
  ensureIdTkAndFetch()
}

onMounted(async () => {
  if (idTk.value) {
    await fetchDiaChiTheoTaiKhoan(idTk.value)
  }
  window.addEventListener('storage', handleStorage)
  window.addEventListener('focus', handleFocusOrVisible)
  document.addEventListener('visibilitychange', handleFocusOrVisible)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage)
  window.removeEventListener('focus', handleFocusOrVisible)
  document.removeEventListener('visibilitychange', handleFocusOrVisible)
})

// Nếu id_tk bị xóa khỏi storage trong runtime -> clear list
watch(idTk, (newVal, oldVal) => {
  if (!newVal) {
    rawAddresses.value = []
  }
})

// Mở modal thêm
function openAddModal() {
  if (!idTk.value) {
    Swal.fire({ icon: 'warning', title: 'Thiếu tài khoản', text: 'Vui lòng đăng nhập.' })
    return
  }
  isEdit.value = false
  editingIndex.value = null
  formAddress.value = { id_dc: 0, diachi: '' }
  showModal.value = true
}

// Mở modal sửa
function openEditModal(i) {
  if (!idTk.value) {
    Swal.fire({ icon: 'warning', title: 'Thiếu tài khoản', text: 'Vui lòng đăng nhập.' })
    return
  }
  const a = addresses.value[i]
  if (!a) return
  isEdit.value = true
  editingIndex.value = i
  formAddress.value = { id_dc: a.id_dc, diachi: a.diachi }
  showModal.value = true
}

// Lưu địa chỉ
async function saveAddress() {
  if (!idTk.value) {
    await Swal.fire({ icon: 'warning', title: 'Thiếu tài khoản', text: 'Vui lòng đăng nhập.' })
    return
  }
  const { id_dc, diachi } = formAddress.value
  if (!diachi || !diachi.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Thiếu địa chỉ',
      text: 'Vui lòng nhập địa chỉ.',
      confirmButtonText: 'Đã hiểu'
    })
    return
  }

  try {
    if (isEdit.value && id_dc > 0) {
      await updateDiaChi(id_dc, idTk.value, diachi.trim()) // action 3
      Toast.fire({ icon: 'success', title: 'Cập nhật địa chỉ thành công' })
    } else {
      await createDiaChi(idTk.value, diachi.trim()) // action 1
      Toast.fire({ icon: 'success', title: 'Thêm địa chỉ thành công' })
    }
    await fetchDiaChiTheoTaiKhoan(idTk.value)
    closeModal()
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: 'Vui lòng thử lại sau.'
    })
  }
}

// Xoá địa chỉ
async function deleteAddress(i) {
  if (!idTk.value) {
    await Swal.fire({ icon: 'warning', title: 'Thiếu tài khoản', text: 'Vui lòng đăng nhập.' })
    return
  }
  const a = addresses.value[i]
  if (!a?.id_dc) return

  const res = await Swal.fire({
    title: 'Xoá địa chỉ?',
    text: 'Thao tác này không thể hoàn tác.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#d33'
  })

  if (res.isConfirmed) {
    try {
      await apiDeleteDiaChi(a.id_dc, idTk.value) // action 2
      await fetchDiaChiTheoTaiKhoan(idTk.value)
      Toast.fire({ icon: 'success', title: 'Đã xoá địa chỉ' })
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Xoá thất bại',
        text: 'Vui lòng thử lại.'
      })
    }
  }
}

function closeModal() {
  showModal.value = false
  isEdit.value = false
  editingIndex.value = null
}
</script>

<style scoped>
.modal-backdrop {
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
</style>

<template>
  <div class="container my-4 mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Steps -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="step-item active">
              <div class="step-circle">1</div>
              <span class="step-label">Xác nhận đơn hàng</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <div class="step-circle">2</div>
              <span class="step-label">Thanh toán</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <div class="step-circle">3</div>
              <span class="step-label">Hoàn thành</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header bg-warning text-dark">
            <h4 class="mb-0">
              <i class="bi bi-clipboard-check"></i>
              Xác nhận đơn hàng
            </h4>
          </div>

          <div class="card-body">
            <!-- Loading -->
            <div v-if="processing || loadingAddresses" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Đang xử lý...</p>
            </div>

            <!-- Main -->
            <div v-else>
              <!-- Khách hàng -->
              <div class="mb-4">
                <h5 class="fw-bold mb-3">
                  <i class="bi bi-person"></i>
                  Thông tin khách hàng
                </h5>

                <div class="row">
                  <div class="col-md-6">
                    <label class="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="customerInfo.name"
                      :class="{ 'is-invalid': errors.name }"
                      required
                    />
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      class="form-control"
                      v-model="customerInfo.phone"
                      :class="{ 'is-invalid': errors.phone }"
                      required
                    />
                    <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="customerInfo.email"
                      :class="{ 'is-invalid': errors.email }"
                    />
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                  </div>

                  <!-- Địa chỉ giao hàng - COMBOBOX -->
                  <div class="col-md-6">
                    <label class="form-label d-flex align-items-center gap-2">
                      Địa chỉ giao hàng *
                      <span v-if="addresses.length === 0" class="badge bg-secondary">Nhập địa chỉ mới</span>
                    </label>

                    <div class="position-relative">
                      <input
                        ref="addrInput"
                        type="text"
                        class="form-control eqh pe-5"
                        v-model="addressSearch"
                        placeholder="Nhập hoặc chọn địa chỉ..."
                        @focus="addrDropdownOpen = true"
                        @keydown.down.prevent="moveAddrActive(1)"
                        @keydown.up.prevent="moveAddrActive(-1)"
                        @keydown.enter.prevent="enterSelectAddr()"
                        @blur="closeAddrDropdown"
                        :class="{ 'is-invalid': errors.address }"
                      />

                      <!-- nút X -->
                      <button
                        v-if="addressSearch"
                        type="button"
                        class="combobox-clear"
                        title="Xoá"
                        @mousedown.prevent.stop="clearAddress"
                      >
                        <i class="fa fa-times"></i>
                      </button>

                      <!-- dropdown -->
                      <ul
                        v-if="addrDropdownOpen"
                        class="list-group position-absolute w-100 combobox-dropdown"
                        style="max-height: 240px; overflow-y: auto; z-index: 1050;"
                      >
                        <li v-if="loadingAddresses" class="list-group-item text-muted small">
                          Đang tải địa chỉ...
                        </li>
                        <li v-else-if="errorAddresses" class="list-group-item text-danger small">
                          {{ errorAddresses }}
                        </li>
                        <li v-else-if="!filteredAddresses.length" class="list-group-item text-muted small">
                          Không có gợi ý — tiếp tục nhập để dùng địa chỉ mới
                        </li>
                        <li
                          v-for="(a, idx) in filteredAddresses"
                          :key="getAddrKey(a, idx)"
                          class="list-group-item list-group-item-action"
                          :class="{ active: idx === addrActiveIndex }"
                          @mousedown.prevent="selectAddress(a)"
                          @mousemove="addrActiveIndex = idx"
                        >
                          {{ renderAddressOption(a) }}
                        </li>
                      </ul>

                      <div v-if="errors.address" class="invalid-feedback d-block">
                        {{ errors.address }}
                      </div>
                    </div>

                    <div class="form-text mt-1">
                      <span class="text-muted">Bạn có thể gõ tự do để nhập địa chỉ mới hoặc chọn từ danh sách đã lưu.</span>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label">Ghi chú đơn hàng</label>
                  <textarea
                    class="form-control"
                    rows="2"
                    v-model="customerInfo.note"
                    placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                  ></textarea>
                </div>
              </div>

              <!-- Sản phẩm đã chọn -->
              <div class="mb-4">
                <h5 class="fw-bold mb-3">
                  <i class="bi bi-bag-check"></i>
                  Sản phẩm đã chọn ({{ selectedItems.length }} sản phẩm)
                </h5>

                <div v-if="selectedItems.length === 0" class="alert alert-warning">
                  <i class="bi bi-exclamation-triangle"></i>
                  Không có sản phẩm nào được chọn.
                  <router-link to="/giohang" class="btn btn-sm btn-primary ms-2">Quay lại giỏ hàng</router-link>
                </div>

                <div v-else class="table-responsive">
                  <table class="table table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedItems" :key="`${item.id}-${item.variant}`">
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              :src="item.image"
                              style="width: 50px; height: 50px; object-fit: cover;"
                              class="me-2 rounded"
                              :alt="item.name"
                              @error="handleImageError"
                            />
                            <div>
                              <div class="fw-semibold">{{ item.name }}</div>
                              <small class="text-muted">{{ item.variant }}</small>
                              <div class="text-muted small">{{ item.brand }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="text-danger fw-bold">{{ formatPrice(item.price) }} đ</div>
                          <div
                            v-if="item.originalPrice && item.originalPrice > item.price"
                            class="text-muted text-decoration-line-through small"
                          >
                            {{ formatPrice(item.originalPrice) }} đ
                          </div>
                        </td>
                        <td class="text-center">{{ item.quantity }}</td>
                        <td class="fw-bold text-danger">{{ formatPrice(item.price * item.quantity) }} đ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Tổng -->
              <div class="border-top pt-3 mb-4">
                <div class="row">
                  <div class="col-md-6 offset-md-6">
                    <div class="d-flex justify-content-between mb-2">
                      <span>Tạm tính:</span>
                      <span>{{ formatPrice(subtotal) }} đ</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Phí vận chuyển:</span>
                      <span class="text-success">Miễn phí</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Khuyến mãi:</span>
                      <span class="text-success">-{{ formatPrice(totalDiscount) }} đ</span>
                    </div>
                    <hr />
                    <div class="d-flex justify-content-between fw-bold fs-5">
                      <span>Tổng cộng:</span>
                      <span class="text-danger">{{ formatPrice(totalPrice) }} đ</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex justify-content-between">
                <router-link to="/giohang" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left"></i>
                  Quay lại giỏ hàng
                </router-link>
                <button
                  type="button"
                  class="btn btn-success btn-lg"
                  @click="proceedToPayment"
                  :disabled="processing || selectedItems.length === 0"
                >
                  <i class="bi bi-credit-card"></i>
                  {{ processing ? 'Đang xử lý...' : 'Xác nhận đơn hàng' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error toast -->
        <div v-if="errorMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="errorMessage = ''"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import useCartManagement from '../LoadDB/useCartManagement'
import useDiaChiTheoTaiKhoan from '../LoadDB/SELDiaChi'

export default {
  name: 'OrderConfirmation',
  setup() {
    const router = useRouter()
    const { loadCart } = useCartManagement()
    const { addresses, fetchDiaChiTheoTaiKhoan, loading: loadingAddresses, error: errorAddresses } =
      useDiaChiTheoTaiKhoan()

    const selectedItems = ref([])
    const processing = ref(false)
    const errorMessage = ref('')

    const customerInfo = ref({
      name: '',
      phone: '',
      email: '',
      address: '',
      note: ''
    })

    const errors = ref({})

    /* ===== Combobox địa chỉ (giống combobox sản phẩm) ===== */
    const addrInput = ref(null)
    const addressSearch = ref('')                // text hiển thị trong input (cũng là địa chỉ mới khi gõ tự do)
    const addrDropdownOpen = ref(false)
    const addrActiveIndex = ref(-1)

    // Danh sách gợi ý từ địa chỉ đã lưu
    const addressOptions = computed(() => {
      // chuẩn hoá: mảng [{diachi, sdt, macdinh, ...}]
      return Array.isArray(addresses.value) ? addresses.value : []
    })

    const filteredAddresses = computed(() => {
      const kw = addressSearch.value.trim().toLowerCase()
      const list = addressOptions.value
      const res = kw ? list.filter(a => (renderAddressOption(a) || '').toLowerCase().includes(kw)) : list
      addrActiveIndex.value = res.length ? 0 : -1
      return res
    })

    function renderAddressOption(a) {
      // Tuỳ field thật (ví dụ: a.diachi, a.sdt, a.tennguoinhan, a.macdinh)
      const line = a?.diachi || a?.address || ''
      const phone = a?.sdt || a?.phone || ''
      return phone ? `${line} — ${phone}` : line
    }
    function getAddrKey(a, idx) {
      return a?.id_dc || a?.id || idx
    }

    function selectAddress(a) {
      const text = renderAddressOption(a)
      addressSearch.value = a?.diachi || a?.address || ''
      customerInfo.value.address = addressSearch.value
      addrDropdownOpen.value = false
    }

    function clearAddress() {
      addressSearch.value = ''
      customerInfo.value.address = ''
      addrDropdownOpen.value = true
      nextTick(() => addrInput.value?.focus())
    }

    function moveAddrActive(step) {
      if (!addrDropdownOpen.value || !filteredAddresses.value.length) return
      const len = filteredAddresses.value.length
      addrActiveIndex.value = (addrActiveIndex.value + step + len) % len
      requestAnimationFrame(() => {
        const list = document.querySelector('.combobox-dropdown')
        const el = list?.children?.[addrActiveIndex.value]
        el?.scrollIntoView?.({ block: 'nearest' })
      })
    }

    function enterSelectAddr() {
      if (!addrDropdownOpen.value || addrActiveIndex.value < 0) {
        // không có item -> giữ text tự do
        customerInfo.value.address = (addressSearch.value || '').trim()
        return
      }
      const a = filteredAddresses.value[addrActiveIndex.value]
      if (a) selectAddress(a)
    }

    function closeAddrDropdown() {
      // setTimeout để click chọn không bị blur đóng trước
      setTimeout(() => {
        addrDropdownOpen.value = false
        // luôn đồng bộ địa chỉ theo text hiện tại (cho case gõ tự do)
        customerInfo.value.address = (addressSearch.value || '').trim()
      }, 120)
    }

    // gõ tới đâu lưu address tới đó (khi đang mở)
    watch(addressSearch, (v) => {
      if (addrDropdownOpen.value) customerInfo.value.address = (v || '').trim()
    })

    /* ===== Tổng tiền ===== */
    const subtotal = computed(() => {
      if (!Array.isArray(selectedItems.value)) return 0
      return selectedItems.value.reduce(
        (t, i) => t + (i.originalPrice || i.price) * i.quantity,
        0
      )
    })
    const totalPrice = computed(() => {
      if (!Array.isArray(selectedItems.value)) return 0
      return selectedItems.value.reduce((t, i) => t + i.price * i.quantity, 0)
    })
    const totalDiscount = computed(() => subtotal.value - totalPrice.value)

    /* ===== Helpers ===== */
    const formatPrice = (v) => (typeof v === 'number' ? v.toLocaleString('vi-VN') : '0')
    const handleImageError = (e) => { e.target.src = '/placeholder.svg?height=50&width=50' }

    /* ===== Validate & Submit ===== */
    const validateForm = () => {
      errors.value = {}
      let ok = true

      if (!customerInfo.value.name?.trim()) {
        errors.value.name = 'Vui lòng nhập họ và tên'; ok = false
      }
      const phone = (customerInfo.value.phone || '').trim()
      if (!phone) {
        errors.value.phone = 'Vui lòng nhập số điện thoại'; ok = false
      } else if (!/^[0-9]{10,11}$/.test(phone)) {
        errors.value.phone = 'Số điện thoại không hợp lệ (10-11 số)'; ok = false
      }
      if (customerInfo.value.email) {
        const email = customerInfo.value.email.trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.value.email = 'Email không hợp lệ'; ok = false
        }
      }
      if (!customerInfo.value.address?.trim()) {
        errors.value.address = 'Vui lòng nhập hoặc chọn địa chỉ giao hàng'; ok = false
      }

      return ok
    }

    const proceedToPayment = () => {
      if (!validateForm()) { errorMessage.value = 'Vui lòng kiểm tra lại thông tin'; return }
      if (!selectedItems.value?.length) { errorMessage.value = 'Không có sản phẩm nào để đặt hàng'; return }

      const orderData = {
        customerInfo: {
          name: customerInfo.value.name.trim(),
          phone: customerInfo.value.phone.trim(),
          email: customerInfo.value.email ? customerInfo.value.email.trim() : '',
          address: customerInfo.value.address.trim()
        },
        items: selectedItems.value,
        totalAmount: totalPrice.value,
        note: customerInfo.value.note || 'Đơn hàng từ website'
      }
      localStorage.setItem('orderData', JSON.stringify(orderData))
      router.push('/thanhtoan')
    }

    /* ===== Load data ===== */
    const loadSelectedItems = () => {
      try {
        const saved = localStorage.getItem('selectedCartItems')
        if (saved) {
          const items = JSON.parse(saved)
          selectedItems.value = Array.isArray(items) ? items : []
        } else {
          router.push('/giohang')
        }
      } catch {
        router.push('/giohang')
      }
    }

    const loadUserInfo = async () => {
      try {
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          customerInfo.value.name = user.hoveten || ''
          customerInfo.value.phone = user.sodienthoai || ''
          customerInfo.value.email = user.email || ''

          const id_tk = user.id_tk || user.id || user.taikhoan
          if (id_tk) {
            await fetchDiaChiTheoTaiKhoan(id_tk)
            // set mặc định: địa chỉ macdinh = 'Y', nếu không có thì lấy đầu tiên
            if (addresses.value?.length) {
              const defIdx = addresses.value.findIndex(a => a?.macdinh === 'Y' || a?.macdinh === true)
              const idx = defIdx >= 0 ? defIdx : 0
              const a = addresses.value[idx]
              addressSearch.value = a?.diachi || a?.address || ''
              customerInfo.value.address = addressSearch.value
            }
          }
        }
      } catch {}
    }

    onMounted(async () => {
      loadCart()
      loadSelectedItems()
      await loadUserInfo()
    })

    return {
      // state
      selectedItems, processing, errorMessage,
      customerInfo, errors,

      // address
      addresses, loadingAddresses, errorAddresses,
      addressSearch, addrDropdownOpen, addrActiveIndex, addrInput,
      filteredAddresses, renderAddressOption, getAddrKey,
      selectAddress, clearAddress, moveAddrActive, enterSelectAddr, closeAddrDropdown,

      // totals
      subtotal, totalPrice, totalDiscount,

      // helpers
      formatPrice, handleImageError, proceedToPayment
    }
  }
}
</script>

<style scoped>
.step-item { display:flex; flex-direction:column; align-items:center; flex:1; }
.step-circle { width:40px; height:40px; border-radius:50%; background:#e9ecef; color:#6c757d; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-bottom:8px; }
.step-item.completed .step-circle { background:#28a745; color:#fff; }
.step-item.active .step-circle { background:#007bff; color:#fff; }
.step-line { height:2px; background:#e9ecef; flex:1; margin:0 10px; margin-top:20px; }
.step-line.completed { background:#28a745; }
.step-label { font-size:.875rem; text-align:center; color:#6c757d; }
.step-item.completed .step-label, .step-item.active .step-label { color:#495057; font-weight:500; }

.card { border:1px solid #e0e0e0; }
.is-invalid { border-color:#dc3545; }
.invalid-feedback { display:block; color:#dc3545; font-size:.875em; margin-top:.25rem; }
.btn:disabled { opacity:.6; cursor:not-allowed; }

.eqh { height:44px; border-radius:10px; }

/* combobox style giống phần sản phẩm */
.combobox-dropdown {
  background:#fff;
  border:1px solid #e5e7eb;
  border-top:none;
  border-radius:0 0 10px 10px;
  box-shadow:0 8px 24px rgba(0,0,0,0.08);
  margin-top:2px;
}
.combobox-dropdown .list-group-item { cursor:pointer; user-select:none; padding:10px 12px; }
.combobox-dropdown .list-group-item.active {
  background-color:#e9f5ff;
  color:#0c63e4;
  border-color:#e9f5ff;
}

/* nút X clear */
.combobox-clear {
  position:absolute; right:10px; top:50%; transform:translateY(-50%);
  width:28px; height:28px; border:none; background:transparent; color:#6b7280;
  border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
}
.combobox-clear:hover { background:rgba(0,0,0,0.06); color:#111827; }

@media (max-width: 768px) {
  .container { padding: 0 10px; }
  .step-item { font-size:.8rem; }
  .step-circle { width:35px; height:35px; font-size:.9rem; }
  .table-responsive { font-size:.9em; }
  .btn-lg { font-size:1rem; padding:.5rem 1rem; }
}
</style>

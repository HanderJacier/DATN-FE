<template>
  <div class="container my-4 mt-5">
    <div class="row">
      <!-- Danh sách sản phẩm -->
      <div class="col-lg-8">
        <div class="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            class="form-check-input me-2"
            v-model="selectAll"
            @change="toggleAll"
          />
          <label class="form-check-label fw-semibold">
            Chọn tất cả ({{ selectedQuantity }})
          </label>
        </div>

        <!-- Empty cart -->
        <div v-if="cart.length === 0" class="alert alert-warning text-center">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
          <h5 class="mt-3">Giỏ hàng của bạn đang trống</h5>
          <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <router-link to="/" class="btn btn-primary">
            <i class="bi bi-shop"></i> Tiếp tục mua sắm
          </router-link>
        </div>

        <!-- Cart items -->
        <div v-else>
          <div
            v-for="(item, index) in cart"
            :key="`${item.id}-${item.variant || 'default'}`"
            class="card mb-3"
          >
            <div class="bg-white rounded p-3">
              <div class="d-flex align-items-center">
                <!-- Checkbox -->
                <input
                  class="form-check-input me-3"
                  type="checkbox"
                  v-model="item.selected"
                  @change="saveCartIfGuest"
                  :disabled="isDiscontinued(item)"
                />

                <!-- Ảnh -->
                <img
                  :src="item.image"
                  class="product-img me-3"
                  style="width: 100px; height: 100px; object-fit: cover;"
                  :alt="item.name"
                  @error="handleImageError"
                />

                <!-- Thông tin -->
                <div class="flex-grow-1">
                  <div class="fw-semibold text-wrap text-break w-75">
                    {{ item.name }}
                  </div>
                  <div class="text-muted small mt-1">
                    {{ item.brand || '' }}<template v-if="item.brand && item.category"> - </template>{{ item.category || '' }}
                  </div>
                  <select class="form-select form-select-sm mt-2 bg-light" style="width: 200px;" disabled>
                    <option selected>Phân loại: {{ item.variant || 'Mặc định' }}</option>
                  </select>

                  <div class="d-flex align-items-center gap-2 mt-2">
                    <div v-if="item.stockQuantity !== undefined" class="text-muted small">
                      Còn lại: {{ toNum(item.stockQuantity) }} sản phẩm
                    </div>
                    <span
                      v-if="isDiscontinued(item)"
                      class="badge bg-secondary"
                      title="Sản phẩm đã ngừng bán"
                    >
                      Ngừng bán
                    </span>
                  </div>
                </div>

                <!-- Giá -->
                <div class="text-end px-2">
                  <div class="text-danger fw-bold">{{ formatPrice(item.price) }} đ</div>
                  <div
                    v-if="toNum(item.originalPrice) > toNum(item.price)"
                    class="text-secondary text-decoration-line-through"
                    style="font-size: 0.9em;"
                  >
                    {{ formatPrice(item.originalPrice) }} đ
                  </div>
                </div>

                <!-- Số lượng -->
                <div class="ms-3 d-flex align-items-center px-2">
                  <template v-if="isDiscontinued(item)">
                    <span class="text-muted small">Không thể thay đổi số lượng</span>
                  </template>
                  <template v-else>
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="decreaseQty(index)"
                      :disabled="toNum(item.quantity) <= 1"
                      title="Giảm 1"
                    >−</button>

                    <input
                      class="form-control form-control-sm mx-2 text-center"
                      style="width: 70px;"
                      type="number"
                      :min="1"
                      :max="toNum(item.stockQuantity) || 999999999"
                      :value="toNum(item.quantity)"
                      @input="handleQtyInput(index, $event)"
                      @blur="handleQtyBlur(index)"
                    />

                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="increaseQty(index)"
                      :disabled="toNum(item.quantity) >= (toNum(item.stockQuantity) || 999999999)"
                      :title="toNum(item.quantity) >= (toNum(item.stockQuantity) || 999999999) ? 'Đã đạt tối đa số lượng trong kho' : 'Tăng 1'"
                    >+</button>
                  </template>
                </div>

                <!-- Xoá -->
                <button class="btn btn-sm btn-outline-danger ms-3" @click="removeItem(index)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin đơn hàng -->
      <div class="container my-4 mt-5">
        <h3 class="mb-4">Xác nhận đơn hàng</h3>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ formatPrice(item.price) }}đ</td>
              <td>{{ toNum(item.quantity) }}</td>
              <td>{{ formatPrice(toNum(item.lineTotal) || (toNum(item.price) * toNum(item.quantity))) }}đ</td>
            </tr>
          </tbody>
        </table>
        <div class="text-end fw-bold fs-5 mt-3">
          Tổng tiền:
          <span class="text-danger">
            {{ formatPrice(totalPrice) }}đ
          </span>
        </div>
        <button class="btn btn-primary mt-4" @click="goToOrderConfirmation" :disabled="selectedQuantity === 0">
          Xác nhận đơn hàng
        </button>
      </div>
    </div>

    <!-- Banner phụ -->
    <div v-if="actionResult" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div
        class="alert alert-dismissible fade show"
        :class="actionResult.success ? 'alert-success' : 'alert-danger'"
        role="alert"
      >
        <i :class="actionResult.success ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
        {{ actionResult.message }}
        <button type="button" class="btn-close" @click="actionResult = null"></button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useCartManagement from './LoadDB/useCartManagement.js'
import useCartProcedures from './LoadDB/GioHang.js'
import Swal from 'sweetalert2'

export default {
  name: 'ProductCart',
  setup() {
    const DEBUG = true // bật để xem log dữ liệu thật (không còn Proxy(Array))
    const router = useRouter()

    const {
      cart,
      actionResult,
      loadCart,      // chỉ dùng khi CHƯA đăng nhập
      saveCart,      // chỉ dùng khi CHƯA đăng nhập
      getSelectedItems
    } = useCartManagement()

    const {
      selGioHang,
      setCartQtyAPI,
      removeOneFromCartAPI,
      clearCartAPI
    } = useCartProcedures()

    const selectAll = ref(false)

    /* ====== Utils: ép số/format ====== */
    const toNum = (v) => {
      if (v === null || v === undefined) return 0
      if (typeof v === 'number') return Number.isFinite(v) ? v : 0
      const s = String(v).replace(/[^\d,.-]/g, '').replace(/,/g, '.')
      const n = Number(s)
      return Number.isFinite(n) ? n : 0
    }
    const formatPrice = (v) => toNum(v).toLocaleString('vi-VN')

    // chọn giá “phòng thủ”
    const pickPrice = (row) => {
      const cands = [
        row?.price,
        row?.dongia_ap_dung,
        row?.dongia,
        row?.gia,
        row?.giatri
      ]
      for (const c of cands) {
        const n = toNum(c)
        if (n > 0) return n
      }
      return 0
    }

    /* ====== Đăng nhập ====== */
    const user =
      JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
    const userId = user?.id_tk ? Number(user.id_tk) : null
    const isLoggedIn = !!userId

    const Toast = Swal.mixin({
      toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true
    })

    const isDiscontinued = (item) =>
      String(item?.trangthai ?? '').trim().toUpperCase() === 'N'

    const totalPrice = computed(() =>
      cart.value.reduce((s, it) => {
        const lt = toNum(it.lineTotal)
        const p  = toNum(it.price)
        const q  = toNum(it.quantity)
        return s + (lt || (p * q))
      }, 0)
    )
    const selectedQuantity = computed(() =>
      cart.value.reduce((s, it) => (it.selected ? s + toNum(it.quantity) : s), 0)
    )

    const handleImageError = (e) => { e.target.src = '/placeholder.svg?height=100&width=100' }
    const clampQuantity = (raw, stock) => {
      const max = Number.isFinite(toNum(stock)) ? toNum(stock) : Number.MAX_SAFE_INTEGER
      const n = Math.max(1, Math.min(max, parseInt(String(raw).replace(/[^\d-]/g, ''), 10) || 1))
      return n
    }

    const saveCartIfGuest = () => { if (!isLoggedIn) saveCart() }
    const syncOneToDB = async (spId, qty) => {
      if (!isLoggedIn) return
      try {
        await setCartQtyAPI(userId, Number(spId), Number(qty))
      } catch (e) {
        console.error('Sync qty error:', e)
        Toast.fire({ icon: 'error', title: 'Cập nhật số lượng thất bại' })
      }
    }

    /* ====== Chọn tất ====== */
    watch(selectAll, (on) => {
      cart.value.forEach((it) => { if (!isDiscontinued(it)) it.selected = !!on })
      saveCartIfGuest()
    })
    watch(cart, (newCart) => {
      if (newCart.length === 0) { selectAll.value = false; return }
      const selectable = newCart.filter(i => !isDiscontinued(i))
      if (selectable.length === 0) { selectAll.value = false; return }
      const allSelected = selectable.every(i => i.selected)
      const noneSelected = selectable.every(i => !i.selected)
      selectAll.value = allSelected ? true : (noneSelected ? false : false)
    }, { deep: true })

    /* ====== Số lượng ====== */
    const increaseQty = async (i) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' })
      const stock = toNum(it.stockQuantity || Number.MAX_SAFE_INTEGER)
      const current = toNum(it.quantity)
      if (current >= stock) return Toast.fire({ icon:'error', title:'Đã đạt số lượng tối đa trong kho' })
      it.quantity = clampQuantity(current + 1, stock)
      it.lineTotal = toNum(it.price) * toNum(it.quantity)
      if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
    }
    const decreaseQty = async (i) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' })
      const current = toNum(it.quantity)
      if (current <= 1) return
      it.quantity = clampQuantity(current - 1, it.stockQuantity || Number.MAX_SAFE_INTEGER)
      it.lineTotal = toNum(it.price) * toNum(it.quantity)
      if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
    }
    const handleQtyInput = async (i, evt) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) { evt.target.value = String(it.quantity); return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' }) }
      const stock = toNum(it.stockQuantity || Number.MAX_SAFE_INTEGER)
      const next = clampQuantity(evt.target.value, stock)
      if (toNum(evt.target.value) > stock) Toast.fire({ icon: 'warning', title: `Chỉ còn ${stock} sản phẩm trong kho` })
      if (next !== toNum(it.quantity)) {
        it.quantity = next
        it.lineTotal = toNum(it.price) * toNum(it.quantity)
        if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
      }
      evt.target.value = String(next)
    }
    const handleQtyBlur = async (i) => {
      const it = cart.value[i]; if (!it || isDiscontinued(it)) return
      const stock = toNum(it.stockQuantity || Number.MAX_SAFE_INTEGER)
      const fixed = clampQuantity(toNum(it.quantity), stock)
      if (fixed !== toNum(it.quantity)) {
        it.quantity = fixed
        it.lineTotal = toNum(it.price) * toNum(it.quantity)
        if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
      }
    }

    /* ====== Xoá 1 / Xoá tất ====== */
    const removeItem = async (i) => {
      const it = cart.value[i]; if (!it) return
      const ok = await Swal.fire({ icon:'warning', title:'Xác nhận xoá', text:'Xoá sản phẩm này khỏi giỏ?', showCancelButton:true, confirmButtonText:'Có, xoá', cancelButtonText:'Hủy' })
      if (!ok.isConfirmed) return
      try {
        if (isLoggedIn) {
          await removeOneFromCartAPI(userId, Number(it.id))
          await loadCartFromDB(userId)
        } else {
          cart.value.splice(i, 1); saveCart(); window.dispatchEvent(new CustomEvent('cartUpdated'))
        }
        Toast.fire({ icon:'success', title:'Đã xoá sản phẩm khỏi giỏ' })
      } catch (e) {
        console.error(e); Toast.fire({ icon:'error', title:'Xoá sản phẩm thất bại' })
      }
    }
    const clearAll = async () => {
      const ok = await Swal.fire({ icon:'warning', title:'Xoá toàn bộ giỏ?', text:'Thao tác này sẽ xoá tất cả sản phẩm.', showCancelButton:true, confirmButtonText:'Xoá tất cả', cancelButtonText:'Hủy' })
      if (!ok.isConfirmed) return
      try {
        if (isLoggedIn) { await clearCartAPI(userId); await loadCartFromDB(userId) }
        else { cart.value = []; saveCart(); window.dispatchEvent(new CustomEvent('cartUpdated')) }
        Toast.fire({ icon:'success', title:'Đã xoá toàn bộ giỏ hàng' })
      } catch (e) {
        console.error(e); Toast.fire({ icon:'error', title:'Không thể xoá giỏ hàng' })
      }
    }

    /* ====== Load DB (KHÔNG ghi Local khi đã login) ====== */
    const loadCartFromDB = async (uid) => {
      const res = await selGioHang(uid) // theo composable: { raw, items }

      // --- SỬA LỖI ƯU TIÊN TOÁN TỬ ---
      const raw = Array.isArray(res?.raw)
        ? res.raw
        : (Array.isArray(res) ? res : [])
      const baseItems = Array.isArray(res?.items)
        ? res.items
        : (Array.isArray(res) ? res : [])

      if (DEBUG) {
        console.group('[CART] DB result')
        console.log('raw =', JSON.parse(JSON.stringify(raw)))
        console.log('items =', JSON.parse(JSON.stringify(baseItems)))
        console.groupEnd()
      }

      cart.value = baseItems.map((i, idx) => {
        const price = pickPrice(i)
        const qty   = toNum(i.quantity)
        const line  = toNum(i.lineTotal) || (price * qty)
        const mapped = {
          ...i,
          id: i.id,
          name: i.name,
          image: i.image,
          trangthai: i.trangthai,
          stockQuantity: toNum(i.stockQuantity),
          quantity: qty,
          price,
          originalPrice: toNum(i.originalPrice) || toNum(i.dongia) || price,
          lineTotal: line,
          selected: false,
          variant: i.variant || 'Mặc định',
          brand: i.brand || '',
          category: i.category || ''
        }
        if (DEBUG && (price === 0 && toNum(i.dongia) > 0)) {
          console.warn(`[CART] Row ${idx} có dongia>0 nhưng price=0`, { row: i, mapped })
        }
        return mapped
      })

      if (DEBUG) {
        console.group('[CART] Mapped items')
        console.log(JSON.parse(JSON.stringify(cart.value)))
        console.groupEnd()
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }

    /* ====== Merge Local -> DB khi login ====== */
    const mergeGuestLocalToDB = async (uid) => {
      const snapshot = JSON.parse(localStorage.getItem('cart') || '[]')
      if (!Array.isArray(snapshot) || snapshot.length === 0) return
      await loadCartFromDB(uid)
      const currentMap = new Map(cart.value.map(i => [String(i.id), toNum(i.quantity || 0)]))
      for (const local of snapshot) {
        if (!local?.id || String(local?.trangthai || '').toUpperCase().trim() === 'N') continue
        const spId = Number(local.id)
        const desired = (currentMap.get(String(spId)) || 0) + toNum(local.quantity || 0)
        if (desired <= 0) continue
        try { await setCartQtyAPI(uid, spId, desired) } catch {}
      }
      await loadCartFromDB(uid)
      localStorage.removeItem('cart')
    }

    /* ====== Khởi tạo ====== */
    onMounted(async () => {
      if (isLoggedIn) {
        await mergeGuestLocalToDB(userId)
        await loadCartFromDB(userId)
      } else {
        loadCart()
      }
      window.addEventListener('cartUpdated', () => { if (!isLoggedIn) loadCart() })
    })

    // Ẩn banner phụ
    watch(actionResult, (v) => { if (v) setTimeout(() => (actionResult.value = null), 5000) })

    /* ====== Đặt hàng ====== */
    function goToOrderConfirmation() {
      if (selectedQuantity.value === 0) return Toast.fire({ icon:'info', title:'Vui lòng chọn ít nhất một sản phẩm' })
      if (!isLoggedIn) {
        Swal.fire({
          icon:'warning', title:'Cần đăng nhập', text:'Vui lòng đăng nhập để tiếp tục đặt hàng.',
          showCancelButton:true, confirmButtonText:'Đăng nhập', cancelButtonText:'Hủy'
        }).then((res)=>{ if(res.isConfirmed) router.push('/dangnhap') })
        return
      }
      const selectedItems = getSelectedItems()
      localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems))
      router.push('/xacnhandonhang')
    }

    return {
      cart, selectAll, totalPrice, selectedQuantity, actionResult,
      formatPrice, toNum,
      increaseQty, decreaseQty, handleQtyInput, handleQtyBlur,
      removeItem, clearAll,
      toggleAll: () => {},
      clearCartOnLogout: () => { localStorage.removeItem('cart'); window.dispatchEvent(new CustomEvent('cartUpdated')) },
      goToOrderConfirmation,
      saveCartIfGuest,
      isDiscontinued
    }
  }
}
</script>

<style scoped>
.product-img {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
.card { border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: box-shadow 0.2s ease; }
.card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.alert { border-radius: 8px; }
.text-break { word-break: break-word; }
@media (max-width: 768px) {
  .container { padding: 0 10px; }
  .product-img { width: 80px !important; height: 80px !important; }
}
</style>

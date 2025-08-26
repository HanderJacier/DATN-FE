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
            :key="`${item.id}-${item.variant}`"
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
                    {{ item.brand }} - {{ item.category }}
                  </div>
                  <select class="form-select form-select-sm mt-2 bg-light" style="width: 200px;" disabled>
                    <option selected>Phân loại: {{ item.variant }}</option>
                  </select>

                  <div class="d-flex align-items-center gap-2 mt-2">
                    <div v-if="item.stockQuantity !== undefined" class="text-muted small">
                      Còn lại: {{ item.stockQuantity }} sản phẩm
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
                    v-if="item.originalPrice > item.price"
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
                      @click="increaseQty(index)"
                      :disabled="item.quantity <= 1"
                      title="Giảm 1"
                    >−</button>

                    <input
                      class="form-control form-control-sm mx-2 text-center"
                      style="width: 70px;"
                      type="number"
                      :min="1"
                      :max="item.stockQuantity ?? 999999999"
                      :value="item.quantity"
                      @input="handleQtyInput(index, $event)"
                      @blur="handleQtyBlur(index)"
                    />

                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="increaseQty(index)"
                      :disabled="item.quantity >= (item.stockQuantity ?? 999999999)"
                      :title="item.quantity >= (item.stockQuantity ?? 999999999) ? 'Đã đạt tối đa số lượng trong kho' : 'Tăng 1'"
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
              <td>{{ item.price.toLocaleString() }}đ</td>
              <td>{{ item.quantity }}</td>
              <td>{{ (item.price * item.quantity).toLocaleString() }}đ</td>
            </tr>
          </tbody>
        </table>
        <div class="text-end fw-bold fs-5 mt-3">
          Tổng tiền:
          <span class="text-danger">
            {{ totalPrice.toLocaleString() }}đ
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
import useCartProcedures from './LoadDB/GioHang.js' // proc: select/update/delete
import Swal from 'sweetalert2'

export default {
  name: 'ProductCart',
  setup() {
    const router = useRouter()
    const {
      cart,
      actionResult,
      loadCart,      // chỉ dùng khi CHƯA đăng nhập
      saveCart,      // chỉ dùng khi CHƯA đăng nhập
      getSelectedItems
    } = useCartManagement()

    // PROC DB
    const {
      selGioHang,
      setCartQtyAPI,
      removeOneFromCartAPI,
      clearCartAPI
    } = useCartProcedures()

    const selectAll = ref(false)

    // trạng thái đăng nhập
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
      cart.value.reduce((s, it) => s + it.price * it.quantity, 0)
    )
    const selectedQuantity = computed(() =>
      cart.value.reduce((s, it) => (it.selected ? s + it.quantity : s), 0)
    )

    // ===== Helpers =====
    const formatPrice = (v) => v.toLocaleString('vi-VN')
    const handleImageError = (e) => { e.target.src = '/placeholder.svg?height=100&width=100' }
    const clampQuantity = (raw, stock) => {
      const max = Number.isFinite(Number(stock)) ? Number(stock) : Number.MAX_SAFE_INTEGER
      let n = parseInt(raw, 10); if (isNaN(n) || n < 1) n = 1; if (n > max) n = max; return n
    }

    // chỉ lưu local khi chưa đăng nhập
    const saveCartIfGuest = () => { if (!isLoggedIn) saveCart() }

    // đồng bộ 1 sản phẩm lên DB khi đã đăng nhập
    const syncOneToDB = async (spId, qty) => {
      if (!isLoggedIn) return
      try {
        await setCartQtyAPI(userId, Number(spId), Number(qty))
      } catch (e) {
        console.error('Sync qty error:', e)
        Toast.fire({ icon: 'error', title: 'Cập nhật số lượng thất bại' })
      }
    }

    // chọn tất
    watch(selectAll, (on) => {
      cart.value.forEach((it) => {
        if (!isDiscontinued(it)) it.selected = !!on
      })
      saveCartIfGuest()
    })

    // đồng bộ trạng thái selectAll (không ghi local khi đã đăng nhập)
    watch(cart, (newCart) => {
      if (newCart.length === 0) { selectAll.value = false; return }
      const selectable = newCart.filter(i => !isDiscontinued(i))
      if (selectable.length === 0) { selectAll.value = false; return }
      const allSelected = selectable.every(i => i.selected)
      const noneSelected = selectable.every(i => !i.selected)
      selectAll.value = allSelected ? true : (noneSelected ? false : false)
    }, { deep: true })

    // ===== Quantity handlers =====
    const increaseQty = async (i) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' })
      const stock = Number(it.stockQuantity ?? Number.MAX_SAFE_INTEGER)
      if (it.quantity >= stock) return Toast.fire({ icon:'error', title:'Đã đạt số lượng tối đa trong kho' })
      it.quantity = clampQuantity(it.quantity + 1, stock)
      if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
    }
    const decreaseQty = async (i) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' })
      if (it.quantity <= 1) return
      it.quantity = clampQuantity(it.quantity - 1, it.stockQuantity ?? Number.MAX_SAFE_INTEGER)
      if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
    }
    const handleQtyInput = async (i, evt) => {
      const it = cart.value[i]; if (!it) return
      if (isDiscontinued(it)) { evt.target.value = String(it.quantity); return Toast.fire({ icon:'info', title:'Sản phẩm đã ngừng bán — chỉ có thể xoá' }) }
      const stock = Number(it.stockQuantity ?? Number.MAX_SAFE_INTEGER)
      const next = clampQuantity(evt.target.value, stock)
      if (Number(evt.target.value) > stock) Toast.fire({ icon: 'warning', title: `Chỉ còn ${stock} sản phẩm trong kho` })
      if (next !== it.quantity) {
        it.quantity = next
        if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
      }
      evt.target.value = String(next)
    }
    const handleQtyBlur = async (i) => {
      const it = cart.value[i]; if (!it || isDiscontinued(it)) return
      const stock = Number(it.stockQuantity ?? Number.MAX_SAFE_INTEGER)
      const fixed = clampQuantity(it.quantity, stock)
      if (fixed !== it.quantity) {
        it.quantity = fixed
        if (isLoggedIn) await syncOneToDB(it.id, it.quantity); else saveCart()
      }
    }

    // ===== Xoá 1 / Xoá tất =====
    const removeItem = async (i) => {
      const it = cart.value[i]; if (!it) return
      const ok = await Swal.fire({ icon:'warning', title:'Xác nhận xoá', text:'Xoá sản phẩm này khỏi giỏ?', showCancelButton:true, confirmButtonText:'Có, xoá', cancelButtonText:'Hủy' })
      if (!ok.isConfirmed) return
      try {
        if (isLoggedIn) {
          await removeOneFromCartAPI(userId, Number(it.id))
          await loadCartFromDB(userId) // không lưu local
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
        if (isLoggedIn) {
          await clearCartAPI(userId)
          await loadCartFromDB(userId) // không lưu local
        } else {
          cart.value = []; saveCart(); window.dispatchEvent(new CustomEvent('cartUpdated'))
        }
        Toast.fire({ icon:'success', title:'Đã xoá toàn bộ giỏ hàng' })
      } catch (e) {
        console.error(e); Toast.fire({ icon:'error', title:'Không thể xoá giỏ hàng' })
      }
    }

    // ===== Load từ DB khi login (không ghi local) =====
    const loadCartFromDB = async (uid) => {
      const { items } = await selGioHang(uid)
      cart.value = items.map(row => ({
        id_gh: row.id_gh, id: row.id, name: row.name, image: row.image,
        trangthai: row.trangthai, stockQuantity: row.stockQuantity, quantity: row.quantity,
        originalPrice: row.originalPrice, price: row.price, lineTotal: row.lineTotal,
        selected: false, variant: 'Mặc định', brand: '', category: ''
      }))
      // KHÔNG saveCart() khi đã đăng nhập
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }

    // ===== Gộp Local -> DB MỖI LẦN vào trang nếu đang đăng nhập =====
    const mergeGuestLocalToDB = async (uid) => {
      const snapshot = JSON.parse(localStorage.getItem('cart') || '[]')
      if (!Array.isArray(snapshot) || snapshot.length === 0) return

      // Load DB hiện tại để cộng dồn đúng
      await loadCartFromDB(uid)
      const currentMap = new Map(cart.value.map(i => [String(i.id), Number(i.quantity || 0)]))

      for (const local of snapshot) {
        if (!local?.id || String(local?.trangthai || '').toUpperCase().trim() === 'N') continue
        const spId = Number(local.id)
        const desired = (currentMap.get(String(spId)) || 0) + Number(local.quantity || 0)
        if (desired <= 0) continue
        try { await setCartQtyAPI(uid, spId, desired) } catch {}
      }

      // reload DB & dọn Local
      await loadCartFromDB(uid)
      localStorage.removeItem('cart')
    }

    // ===== Khởi tạo =====
    onMounted(async () => {
      if (isLoggedIn) {
        await mergeGuestLocalToDB(userId) // luôn merge nếu local còn dữ liệu
        await loadCartFromDB(userId)      // luôn dùng DB, không ghi local
      } else {
        loadCart()                         // guest -> Local
      }
      window.addEventListener('cartUpdated', () => { if (!isLoggedIn) loadCart() })
    })

    // Ẩn banner phụ
    watch(actionResult, (v) => { if (v) setTimeout(() => (actionResult.value = null), 5000) })

    // ===== Đặt hàng =====
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
      // vẫn lưu selectedItems để qua trang xác nhận (không phải giỏ)
      localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems))
      router.push('/xacnhandonhang')
    }

    return {
      cart, selectAll, totalPrice, selectedQuantity, actionResult,
      formatPrice, handleImageError,
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

.card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sticky-top {
  position: sticky;
}

.alert {
  border-radius: 8px;
}

.text-break {
  word-break: break-word;
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .product-img {
    width: 80px !important;
    height: 80px !important;
  }

  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
}
</style>

<template>
  <div class="container my-4">
    <!-- Thanh thông báo -->
    <div v-if="thongBao.show"
      :class="['alert', thongBao.type === 'success' ? 'alert-success' : 'alert-danger', 'alert-dismissible', 'fade', 'show']"
      role="alert"
      style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; min-width: 300px;">
      {{ thongBao.message }}
      <button type="button" class="btn-close" aria-label="Close" @click="thongBao.show = false"></button>
    </div>

    <h4 class="mb-3">Đánh giá sản phẩm</h4>

    <!-- Bộ lọc sao -->
    <div class="d-flex gap-2 mb-3">
      <button v-for="s in [0, 5, 4, 3, 2, 1]" :key="s" class="btn btn-sm rounded-pill" :class="{
        'btn-outline-warning': selectedStar !== s,
        'btn-warning text-white': selectedStar === s
      }" @click="selectedStar = s">
        <template v-if="s === 0">Tất cả</template>
        <template v-else>{{ s }} <i class="fa-regular fa-star"></i></template>
      </button>
    </div>

    <!-- Danh sách đánh giá -->
    <div v-if="danhGiaLoc.length > 0">
      <div v-for="(review, index) in danhGiaLoc" :key="index" class="card shadow-sm mb-3 border-0">
        <div class="card-body">
          <div class="d-flex align-items-start">
            <div
              class="rounded-circle text-white bg-primary flex-shrink-0 d-flex justify-content-center align-items-center me-3"
              style="width: 48px; height: 48px; font-weight: 500; font-size: 18px;">
              {{ review.tenNguoiDung?.charAt(0) || "U" }}
            </div>
            <div class="flex-grow-1">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <h6 class="mb-0 fw-semibold text-dark">{{ review.tenNguoiDung || "Người dùng" }}</h6>
                <div class="text-warning">
                  <i v-for="n in 5" :key="n" :class="n <= review.diemSo ? 'fas fa-star' : 'far fa-star'"></i>
                </div>
              </div>
              <small class="text-muted">{{ thoiGian(review.ngay) }}</small>
              <p class="mt-2 mb-0 text-body">{{ review.noiDung }}</p>
            </div>
            <!-- Nút sửa -->
            <div v-if="review.isOwner" class="ms-3">
              <button class="btn btn-sm btn-outline-primary" @click="batDauSuaDanhGia(review)">
                <i class="fas fa-edit me-1"></i> Sửa đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-muted text-center py-4">
      Không tìm thấy đánh giá phù hợp.
    </div>

    <!-- Phân trang -->
    <nav v-if="soTrang > 1" class="d-flex justify-content-center mt-3">
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: trangHienTai === 1 }">
          <button class="page-link rounded-circle" @click="trangHienTai--">«</button>
        </li>
        <li v-for="page in soTrang" :key="page" class="page-item" :class="{ active: page === trangHienTai }">
          <button class="page-link rounded"
            :class="{ 'border': page !== trangHienTai, 'bg-primary text-white border-primary': page === trangHienTai }"
            @click="trangHienTai = page">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: trangHienTai === soTrang }">
          <button class="page-link rounded-circle" @click="trangHienTai++">»</button>
        </li>
      </ul>
    </nav>

    <!-- Sửa hoặc gửi đánh giá -->
    <div v-if="!dangSuaDanhGia && daGuiDanhGia">
      <button class="btn btn-outline-secondary w-100 py-2 rounded-pill" @click="batDauSuaDanhGia(danhGiaDangGui)">
        <i class="fas fa-edit me-2"></i> Sửa đánh giá của bạn
      </button>
    </div>

    <div v-if="!daGuiDanhGia || dangSuaDanhGia" class="mt-4">
      <h4 class="mb-3">{{ dangSuaDanhGia ? 'Sửa đánh giá của bạn' : 'Gửi đánh giá của bạn' }}</h4>

      <div class="mb-3">
        <label class="form-label fw-semibold text-secondary">Điểm đánh giá:</label>
        <div class="d-flex gap-1">
          <span v-for="index in 5" :key="index"
            class="text-warning star-rating d-inline-flex align-items-center justify-content-center rounded-circle"
            :class="index <= diemSo ? 'bg-warning bg-opacity-25' : ''" role="button" @click="diemSo = index"
            style="width: 38px; height: 38px; font-size: 20px; transition: transform 0.2s;">
            <i :class="index <= diemSo ? 'fas fa-star' : 'far fa-star'"></i>
          </span>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold text-secondary">Nội dung đánh giá:</label>
        <textarea class="form-control rounded-4 shadow-sm" v-model="noiDung" rows="4"
          placeholder="Nhập nội dung đánh giá..." style="transition: box-shadow 0.2s;"
          @focus="$event.target.classList.add('shadow-lg')"
          @blur="$event.target.classList.remove('shadow-lg')"></textarea>
      </div>

      <button type="button" class="btn btn-primary w-100 py-2 rounded-pill shadow" @click="guiDanhGia">
        <i class="fas fa-paper-plane me-2"></i> {{ dangSuaDanhGia ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
      </button>

      <button v-if="dangSuaDanhGia" type="button" class="btn btn-secondary w-100 py-2 rounded-pill mt-2"
        @click="huySuaDanhGia">
        Hủy
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('vi')
dayjs.extend(relativeTime)

const route = useRoute()
const sanPhamId = parseInt(route.params.id)

const danhSachDanhGia = ref([])
const selectedStar = ref(0)
const diemSo = ref(0)
const noiDung = ref('')

const trangHienTai = ref(1)
const soDanhGiaMoiTrang = 4

let taiKhoanId = null
const userData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
if (userData && userData.id_tk) {
  taiKhoanId = userData.id_tk
}

// Thông báo
const thongBao = ref({ show: false, message: '', type: 'success' })
function hienThiThongBao(message, type = 'success') {
  thongBao.value = { show: true, message, type }
  setTimeout(() => (thongBao.value.show = false), 3000)
}

// Trạng thái form
const dangSuaDanhGia = ref(false)
const daGuiDanhGia = ref(false)
const danhGiaDangGui = ref(null)

// Lấy từ localStorage nếu có
if (taiKhoanId) {
  const reviewedKey = `reviewed_${sanPhamId}_${taiKhoanId}`
  if (localStorage.getItem(reviewedKey) === 'true') {
    daGuiDanhGia.value = true
  }
}

// Lọc + phân trang
const danhGiaLoc = computed(() => {
  const ds = selectedStar.value === 0
    ? danhSachDanhGia.value
    : danhSachDanhGia.value.filter(dg => dg.diemSo === selectedStar.value)
  ds.forEach(dg => {
    dg.isOwner = taiKhoanId && dg.id_tk === taiKhoanId
  })
  const batDau = (trangHienTai.value - 1) * soDanhGiaMoiTrang
  return ds.slice(batDau, batDau + soDanhGiaMoiTrang)
})

const soTrang = computed(() => {
  const ds = selectedStar.value === 0
    ? danhSachDanhGia.value
    : danhSachDanhGia.value.filter(dg => dg.diemSo === selectedStar.value)
  return Math.ceil(ds.length / soDanhGiaMoiTrang)
})

watch(selectedStar, () => {
  trangHienTai.value = 1
})

// Hàm chuẩn hóa ngày
function parseNgay(ngay) {
  if (!ngay) return new Date().toISOString()
  const parsed = dayjs(ngay, ['YYYY-MM-DD', 'DD/MM/YYYY', 'YYYY-MM-DDTHH:mm:ss', 'YYYY/MM/DD'], true)
  return parsed.isValid() ? parsed.toISOString() : new Date().toISOString()
}

// Fetch API
const fetchDanhGia = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/datn/WBH_US_SEL_DANH_GIA_THEO_SP', {
      params: { p_sanpham: sanPhamId, p_pageNo: 1, p_pageSize: 100 }
    })

    const danhGiaRaw = res.data.map(item => {
      const f = item.fields
      return {
        id: f.id_dg,
        id_tk: f.id_tk,
        tenNguoiDung: f.hoveten || 'Người dùng',
        ngay: parseNgay(f.ngaytao),
        diemSo: f.diemso,
        noiDung: f.noidung
      }
    }).filter(dg => dg.noiDung.trim() !== '' && dg.diemSo > 0)

    danhSachDanhGia.value = danhGiaRaw

    // Kiểm tra user đã gửi chưa
    const dgCuaUser = danhGiaRaw.find(dg => dg.id_tk === taiKhoanId)
    if (dgCuaUser) {
      daGuiDanhGia.value = true
      danhGiaDangGui.value = dgCuaUser
      localStorage.setItem(`reviewed_${sanPhamId}_${taiKhoanId}`, 'true')
    }
  } catch (err) {
    console.error(err)
    danhSachDanhGia.value = []
  }
}

const guiDanhGia = async () => {
  if (!taiKhoanId) return hienThiThongBao('Vui lòng đăng nhập!', 'danger')

  if (diemSo.value === 0 && noiDung.value.trim() === '') {
    return hienThiThongBao('Vui lòng nhập đầy đủ thông tin!', 'danger');
  }

  if (diemSo.value === 0) {
    return hienThiThongBao('Vui lòng chọn số sao đánh giá!', 'danger');
  }

  if (noiDung.value.trim() === '') {
    return hienThiThongBao('Vui lòng nhập nội dung đánh giá!', 'danger');
  }


  try {
    await axios.post('http://localhost:8080/api/datn/WBH_US_CRT_DANH_GIA', {
      params: { p_taikhoan: taiKhoanId, p_sanpham: sanPhamId, p_noidung: noiDung.value, p_diemso: diemSo.value }
    })
    await fetchDanhGia()
    dangSuaDanhGia.value = false
    daGuiDanhGia.value = true
    localStorage.setItem(`reviewed_${sanPhamId}_${taiKhoanId}`, 'true')
    diemSo.value = 0
    noiDung.value = ''
    hienThiThongBao('Đánh giá đã được gửi!', 'success')
  } catch (err) {
    console.error(err)
    hienThiThongBao('Gửi đánh giá thất bại!', 'danger')
  }
}

const thoiGian = isoDate => dayjs(isoDate).format('DD/MM/YYYY')
const batDauSuaDanhGia = dg => { dangSuaDanhGia.value = true; diemSo.value = dg.diemSo; noiDung.value = dg.noiDung }
const huySuaDanhGia = () => { dangSuaDanhGia.value = false; diemSo.value = 0; noiDung.value = '' }

onMounted(fetchDanhGia)
</script>

<style scoped>
i {
  cursor: pointer;
}

.page-link {
  width: 36px;
  height: 36px;
  padding: 0;
  text-align: center;
  border-radius: 0.5rem !important;
  font-size: 15px;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}

.star-rating:hover {
  transform: scale(1.2);
}
</style>

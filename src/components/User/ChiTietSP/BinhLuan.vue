<template>
  <div class="container my-4">
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
      <div v-for="(review, index) in danhGiaLoc" :key="index" class="border p-3 rounded mb-3">
        <div class="d-flex align-items-center mb-2">
          <div class="rounded-circle text-white bg-primary d-flex justify-content-center align-items-center me-2"
            style="width: 40px; height: 40px;">
            {{ review.tenNguoiDung?.charAt(0) || "U" }}
          </div>
          <div>
            <strong>{{ review.tenNguoiDung || 'Người dùng' }}</strong>
            <div class="text-muted" style="font-size: 13px;">
              {{ thoiGian(review.ngay) }}
            </div>
          </div>
          <div class="ms-auto text-warning">
            <i v-for="n in 5" :key="n" :class="n <= review.diemSo ? 'fas fa-star' : 'far fa-star'"></i>
          </div>
        </div>
        <p class="mb-1">{{ review.noiDung }}</p>
      </div>
    </div>
    <div v-else class="text-muted">Không tìm thấy đánh giá phù hợp.</div>

    <!-- Phân trang -->
    <nav v-if="soTrang > 1" class="d-flex justify-content-center mt-3">
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: trangHienTai === 1 }">
          <button class="page-link rounded-circle" @click="trangHienTai--" aria-label="Previous">«</button>
        </li>
        <li v-for="page in soTrang" :key="page" class="page-item" :class="{ active: page === trangHienTai }">
          <button class="page-link rounded" :class="{
            'border': page !== trangHienTai,
            'bg-primary text-white border-primary': page === trangHienTai
          }" @click="trangHienTai = page">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: trangHienTai === soTrang }">
          <button class="page-link rounded-circle" @click="trangHienTai++" aria-label="Next">»</button>
        </li>
      </ul>
    </nav>

    <!-- Gửi đánh giá -->
    <h5 class="mt-4 mb-3">Gửi đánh giá của bạn</h5>

    <div class="mb-3">
      <label class="form-label">Điểm đánh giá:</label>
      <span v-for="index in 5" :key="index" class="text-warning me-1" role="button" @click="diemSo = index"
        style="font-size: 22px;">
        <i :class="index <= diemSo ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>

    <div class="mb-3">
      <textarea class="form-control" v-model="noiDung" rows="4" placeholder="Nội dung đánh giá..."></textarea>
    </div>

    <button type="button" class="btn btn-primary" @click="guiDanhGia">Gửi đánh giá</button>
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
} else {
  console.warn("Không tìm thấy thông tin tài khoản trong localStorage/sessionStorage.")
}

// Lọc và phân trang
const danhGiaLoc = computed(() => {
  const daLoc = selectedStar.value === 0
    ? danhSachDanhGia.value
    : danhSachDanhGia.value.filter(dg => dg.diemSo === selectedStar.value)

  const batDau = (trangHienTai.value - 1) * soDanhGiaMoiTrang
  return daLoc.slice(batDau, batDau + soDanhGiaMoiTrang)
})

const soTrang = computed(() => {
  const tong = selectedStar.value === 0
    ? danhSachDanhGia.value.length
    : danhSachDanhGia.value.filter(dg => dg.diemSo === selectedStar.value).length
  return Math.ceil(tong / soDanhGiaMoiTrang)
})

watch(selectedStar, () => {
  trangHienTai.value = 1
})

const fetchDanhGia = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/datn/WBH_US_SEL_DANH_GIA_THEO_SP', {
      params: {
        p_sanpham: sanPhamId,
        p_pageNo: 1,
        p_pageSize: 100
      }
    })

    danhSachDanhGia.value = res.data.map(item => {
      const f = item.fields
      return {
        id: f.id_dg,
        tenNguoiDung: f.hoveten || 'Người dùng',
        ngay: f.ngaytao || new Date().toISOString(),
        diemSo: f.diemso,
        noiDung: f.noidung
      }
    })
  } catch (err) {
    console.error(err)
    danhSachDanhGia.value = []
  }
}

const guiDanhGia = async () => {
  if (!taiKhoanId) {
    alert('Vui lòng đăng nhập để gửi đánh giá!')
    return
  }

  if (diemSo.value === 0 || noiDung.value.trim() === '') {
    alert('Vui lòng chọn chất lượng và nhập nội dung đánh giá!')
    return
  }

  const payload = {
    params: {
      p_taikhoan: taiKhoanId,
      p_sanpham: sanPhamId,
      p_noidung: noiDung.value,
      p_diemso: diemSo.value
    }
  }

  try {
    await axios.post('http://localhost:8080/api/datn/WBH_US_CRT_DANH_GIA', payload)
    await fetchDanhGia()
    diemSo.value = 0
    noiDung.value = ''
    alert('Đánh giá của bạn đã được gửi thành công!')
  } catch (error) {
    console.error(error)
    alert('Gửi đánh giá thất bại, vui lòng kiểm tra đăng nhập!')
  }
}

const thoiGian = (isoDate) => {
  return dayjs(isoDate).format('HH:mm DD/MM/YYYY')
}

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
  line-height: 36px;
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
</style>

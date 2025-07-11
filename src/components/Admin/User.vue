<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width: 100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        QUẢN LÝ NGƯỜI DÙNG
      </h5>

      <!-- Form tìm kiếm -->
      <div class="row g-2 mb-3">
        <div class="col-md-8">
          <input v-model="searchQuery" placeholder="Tìm kiếm người dùng..." class="form-control" />
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-warning fw-bold" @click="createUser">Thêm người dùng mới</button>
        </div>
      </div>

      <!-- Form nhập người dùng -->
      <div class="row g-3 mb-4">
        <div class="col-md-3" v-if="editingId !== null">
          <label class="form-label">ID</label>
          <input v-model="newUser.id_tk" class="form-control" disabled />
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên đăng nhập</label>
          <input v-model="newUser.tenDangNhap" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Họ tên</label>
          <input v-model="newUser.hoVaTen" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Email</label>
          <input v-model="newUser.email" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="newUser.matKhau" class="form-control" type="password" />
        </div>
        <div class="col-md-3">
          <label class="form-label">SĐT</label>
          <input v-model="newUser.soDienThoai" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Vai trò</label>
          <select v-model="newUser.vaiTro" class="form-select">
            <option :value="true">Quản trị</option>
            <option :value="false">Người dùng</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <label class="me-2">Trạng thái:</label>
          <input type="checkbox" v-model="newUser.trangThai" />
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-secondary me-2" @click="resetForm">Hủy</button>
          <button class="btn btn-warning fw-bold" @click="handleSave">
            {{ editingId === null ? 'Thêm' : 'Lưu' }}
          </button>
        </div>
      </div>

      <!-- Bảng người dùng -->
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle" style="width: 100%;">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="index">
              <td>{{ user.id_tk }}</td>
              <td>{{ user.tenDangNhap }}</td>
              <td>{{ user.hoVaTen }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.vaiTro ? 'Quản trị' : 'Người dùng' }}</td>
              <td>{{ user.soDienThoai }}</td>
              <td>
                <span :class="{ 'text-success': user.trangThai, 'text-danger': !user.trangThai }">
                  {{ user.trangThai ? '✓' : '✗' }}
                </span>
              </td>
              <td>
                <button class="btn btn-outline-primary btn-sm me-1" @click="editUser(user)">✏️</button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteUser(user.id_tk)">🗑️</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="8" class="text-muted">Không tìm thấy người dùng nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/components/Admin/CRUD/QLTaiKhoan/userService.js'

const userList = ref([])
const searchQuery = ref('')
const editingId = ref(null)

const newUser = ref({
  id_tk: null,
  tenDangNhap: '',
  hoVaTen: '',
  email: '',
  matKhau: '',
  soDienThoai: '',
  vaiTro: false,
  trangThai: true
})

const fetchUsers = async () => {
  const res = await userService.getAll()
  userList.value = res.data
}

const createUser = async () => {
  await userService.create(newUser.value)
  alert('✅ Thêm người dùng thành công')
  await fetchUsers()
  resetForm()
}

const updateUser = async () => {
  await userService.update(editingId.value, newUser.value)
  alert('✅ Cập nhật người dùng thành công')
  await fetchUsers()
  resetForm()
}

const handleSave = async () => {
  try {
    if (editingId.value === null) {
      await createUser()
    } else {
      await updateUser()
    }
  } catch (err) {
    alert(err.response?.data || '❌ Lỗi xử lý dữ liệu')
  }
}

const deleteUser = async (id) => {
  if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
    await userService.remove(id)
    await fetchUsers()
  }
}

const editUser = (user) => {
  editingId.value = user.id_tk
  newUser.value = { ...user }
}

const startCreateUser = () => {
  resetForm()
}

const resetForm = () => {
  editingId.value = null
  newUser.value = {
    id_tk: null,
    tenDangNhap: '',
    hoVaTen: '',
    email: '',
    matKhau: '',
    soDienThoai: '',
    vaiTro: false,
    trangThai: true
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userList.value
  return userList.value.filter(user =>
    user.tenDangNhap?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.hoVaTen?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(fetchUsers)
</script>


<style scoped>
.form-title {
  font-size: 18px;
}
</style>

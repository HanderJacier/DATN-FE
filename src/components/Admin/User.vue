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
          <button class="btn btn-warning fw-bold" @click="resetForm">Thêm người dùng mới</button>
        </div>
      </div>

      <!-- Form nhập người dùng -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <label class="form-label">ID</label>
          <input v-model="newUser.id" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên đăng nhập</label>
          <input v-model="newUser.username" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Họ tên</label>
          <input v-model="newUser.fullname" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Email</label>
          <input v-model="newUser.email" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="newUser.password" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">SĐT</label>
          <input v-model="newUser.phone" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Vai trò</label>
          <input v-model="newUser.role" class="form-control" />
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <label class="me-2">Trạng thái:</label>
          <input type="checkbox" v-model="newUser.active" />
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-secondary me-2" @click="resetForm">Hủy</button>
          <button class="btn btn-warning fw-bold" @click="saveUser">Lưu</button>
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
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span :class="{ 'text-success': user.active, 'text-danger': !user.active }">
                  {{ user.active ? '✓' : '✗' }}
                </span>
              </td>
              <td>
                <button class="btn btn-outline-primary btn-sm me-1" @click="editUser(index)">
                  ✏️
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteUser(index)">
                  🗑️
                </button>
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
import { ref, computed } from 'vue'

const newUser = ref({
  id: '', username: '', fullname: '', email: '', password: '',
  phone: '', role: '', active: true
})
const userList = ref([])
const searchQuery = ref('')
const editingIndex = ref(null)

const saveUser = () => {
  if (editingIndex.value !== null) {
    userList.value[editingIndex.value] = { ...newUser.value }
    editingIndex.value = null
  } else {
    userList.value.push({ ...newUser.value })
  }
  resetForm()
}

const resetForm = () => {
  newUser.value = {
    id: '', username: '', fullname: '', email: '', password: '',
    phone: '', role: '', active: true
  }
  editingIndex.value = null
}

const editUser = (index) => {
  editingIndex.value = index
  newUser.value = { ...userList.value[index] }
}

const deleteUser = (index) => {
  userList.value.splice(index, 1)
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userList.value
  return userList.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.form-title {
  font-size: 18px;
}
</style>

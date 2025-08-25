<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width: 100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        QUẢN LÝ NGƯỜI DÙNG
      </h5>

      <!-- Form tìm kiếm và nút thêm mới -->
      <div class="row g-2 mb-3 align-items-center">
        <div class="col-md-6">
          <input 
            v-model="searchQuery" 
            placeholder="Tìm kiếm người dùng..." 
            class="form-control" 
            @keyup.enter="refreshUsers" 
          />
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-success fw-bold me-2" @click="openAddModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm mới người dùng
          </button>
          <button class="btn btn-warning fw-bold" @click="refreshUsers" :disabled="usersLoading">
            <i class="bi bi-arrow-clockwise me-2"></i>Làm mới
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="usersLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Đang tải danh sách người dùng...</p>
      </div>

      <!-- Error message -->
      <div v-else-if="usersError" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i>
        Có lỗi xảy ra khi tải dữ liệu: {{ usersError }}
      </div>

      <!-- Bảng người dùng -->
      <div v-else class="table-responsive">
        <table class="table table-bordered text-center align-middle" style="width: 100%;">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id_tk">
              <td>{{ user.id_tk }}</td>
              <td>{{ user.tendangnhap }}</td>
              <td>{{ user.hoveten }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.sodienthoai }}</td>
              <td>
                <span class="badge" :class="user.vaitro == 1 ? 'bg-danger' : 'bg-primary'">
                  {{ user.vaitro == 1 ? 'Quản trị viên' : 'Người dùng' }}
                </span>
              </td>
              <td>
                <div class="form-check form-switch d-flex justify-content-center">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="user.trangthai"
                    @change="updateStatus(user.id_tk, $event.target.checked)"
                    :disabled="actionLoading"
                  >
                </div>
              </td>
              <td>{{user.ngaytao }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-info"
                  @click="openEditModal(user.id_tk)"
                  :disabled="actionLoading"
                >
                  <i class="bi bi-pencil"></i> Sửa
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="9" class="text-muted">Không tìm thấy người dùng nào.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Thông báo -->
      <div v-if="actionResult" class="alert mt-3" :class="actionResult.success ? 'alert-success' : 'alert-danger'">
        <i :class="actionResult.success ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
        {{ actionResult.message }}
      </div>

      <div v-if="actionError" class="alert alert-danger mt-3">
        <i class="bi bi-exclamation-triangle"></i>
        Lỗi thực hiện thao tác: {{ actionError.message }}
      </div>
    </div>

    <!-- Modal Thêm/Sửa người dùng -->
    <div v-if="showUserModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="isEditMode ? 'bi bi-pencil' : 'bi bi-plus-circle'"></i>
              {{ modalTitle }}
            </h5>
            <button type="button" class="btn-close" @click="closeUserModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Đang tải thông tin người dùng...</p>
            </div>
            <form v-else @submit.prevent="saveUser">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="tendangnhap" class="form-label">
                      Tên đăng nhập <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="tendangnhap" 
                      v-model="currentUser.tendangnhap" 
                      required 
                      :disabled="isEditMode"
                      :class="{ 'is-invalid': formErrors.tendangnhap }"
                    />
                    <div v-if="formErrors.tendangnhap" class="invalid-feedback">
                      {{ formErrors.tendangnhap }}
                    </div>
                    <div v-if="!isEditMode" class="form-text">
                      Tên đăng nhập phải có ít nhất 3 ký tự
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="!isEditMode">
                  <div class="mb-3">
                    <label for="matkhau" class="form-label">
                      Mật khẩu <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="password" 
                      class="form-control" 
                      id="matkhau" 
                      v-model="currentUser.matkhau" 
                      required 
                      :class="{ 'is-invalid': formErrors.matkhau }"
                    />
                    <div v-if="formErrors.matkhau" class="invalid-feedback">
                      {{ formErrors.matkhau }}
                    </div>
                    <div class="form-text">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="hoveten" class="form-label">
                      Họ và tên <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="hoveten" 
                      v-model="currentUser.hoveten" 
                      required 
                      :class="{ 'is-invalid': formErrors.hoveten }"
                    />
                    <div v-if="formErrors.hoveten" class="invalid-feedback">
                      {{ formErrors.hoveten }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Email <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="currentUser.email" 
                      required 
                      :class="{ 'is-invalid': formErrors.email }"
                    />
                    <div v-if="formErrors.email" class="invalid-feedback">
                      {{ formErrors.email }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="sodienthoai" class="form-label">
                      Số điện thoại <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="sodienthoai" 
                      v-model="currentUser.sodienthoai" 
                      required
                      :class="{ 'is-invalid': formErrors.sodienthoai }"
                    />
                    <div v-if="formErrors.sodienthoai" class="invalid-feedback">
                      {{ formErrors.sodienthoai }}
                    </div>
                    <div class="form-text">
                      Số điện thoại phải có 10-11 chữ số
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label for="vaitro" class="form-label">Vai trò</label>
                    <select 
                      class="form-select" 
                      :class="{ 'bg-light': isEditMode }"
                      id="vaitro" 
                      v-model="currentUser.vaitro" 
                      :disabled="isEditMode"
                    >
                      <option :value="0">Người dùng</option>
                      <option :value="1">Quản trị viên</option>
                    </select>
                    <div v-if="isEditMode" class="form-text text-muted">
                      <i class="bi bi-info-circle"></i> Vai trò không thể thay đổi
                    </div>
                    <div v-else class="form-text">
                      Chọn vai trò cho người dùng mới
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label for="trangthai" class="form-label">Trạng thái</label>
                    <select class="form-select" id="trangthai" v-model="currentUser.trangthai">
                      <option :value="1">Hoạt động</option>
                      <option :value="0">Bị khóa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeUserModal">
                  <i class="bi bi-x-circle"></i> Hủy
                </button>
                <button type="submit" class="btn btn-primary" :disabled="actionLoading">
                  <i class="bi bi-check-circle"></i>
                  {{ actionLoading ? 'Đang xử lý...' : 'Lưu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import useUserManagement from './QLND/useUserManagement.js'

export default {
  name: 'UserManagement',
  setup() {
    const {
      users,
      userDetail,
      usersLoading,
      usersError,
      detailLoading,
      detailError,
      actionLoading,
      actionError,
      actionResult: useUserManagementActionResult,
      fetchAllUsers,
      fetchUserDetail,
      createUser,
      updateUser,
      updateUserComplete, // Import hàm mới
      updateUserStatus,
      updateUserRole,
      validateUserData
    } = useUserManagement()

    const searchQuery = ref('')
    const actionResult = ref(null)
    const showUserModal = ref(false)
    const modalTitle = ref('')
    const isEditMode = ref(false)
    const formErrors = ref({})
    
    const currentUser = ref({
      id_tk: null,
      tendangnhap: '',
      matkhau: '',
      hoveten: '',
      email: '',
      sodienthoai: '',
      vaitro: 0,
      trangthai: 1,
    })

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user =>
        user.tendangnhap?.toLowerCase().includes(query) ||
        user.hoveten?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.sodienthoai?.includes(query)
      )
    })

    // Watch for changes in userDetail from composable to populate form
    watch(userDetail, (newVal) => {
      if (newVal && isEditMode.value) {
        currentUser.value = { 
          ...newVal, 
          matkhau: '',
          vaitro: Number(newVal.vaitro),
          trangthai: Number(newVal.trangthai)
        }
        console.log("[UserManagement.vue] User detail loaded into form:", currentUser.value)
      }
    })

    // Watch for action result from composable
    watch(useUserManagementActionResult, (newVal) => {
      if (newVal) {
        actionResult.value = newVal
        setTimeout(() => {
          actionResult.value = null
        }, 5000)
      }
    })

    const refreshUsers = async () => {
      console.log("[UserManagement.vue] Refreshing user list...")
      await fetchAllUsers()
      actionResult.value = null
    }

    const validateForm = () => {
      const errors = validateUserData(currentUser.value)
      formErrors.value = {}
      
      if (errors.length > 0) {
        errors.forEach(error => {
          if (error.includes('đăng nhập')) formErrors.value.tendangnhap = error
          if (error.includes('mật khẩu')) formErrors.value.matkhau = error
          if (error.includes('tên')) formErrors.value.hoveten = error
          if (error.includes('Email')) formErrors.value.email = error
          if (error.includes('điện thoại')) formErrors.value.sodienthoai = error
        })
        return false
      }
      return true
    }

    const openAddModal = () => {
      isEditMode.value = false
      modalTitle.value = 'Thêm mới người dùng'
      formErrors.value = {}
      currentUser.value = {
        id_tk: null,
        tendangnhap: '',
        matkhau: '',
        hoveten: '',
        email: '',
        sodienthoai: '',
        vaitro: 0,
        trangthai: 1,
      }
      showUserModal.value = true
      console.log("[UserManagement.vue] Opening Add User modal.")
    }

    const openEditModal = async (userId) => {
      isEditMode.value = true
      modalTitle.value = 'Sửa thông tin người dùng'
      formErrors.value = {}
      showUserModal.value = true
      console.log(`[UserManagement.vue] Opening Edit User modal for ID: ${userId}`)
      await fetchUserDetail(userId)
    }

    const closeUserModal = () => {
      showUserModal.value = false
      formErrors.value = {}
      currentUser.value = {
        id_tk: null,
        tendangnhap: '',
        matkhau: '',
        hoveten: '',
        email: '',
        sodienthoai: '',
        vaitro: 0,
        trangthai: 1,
      }
      console.log("[UserManagement.vue] Closing User modal.")
    }

    const saveUser = async () => {
      console.log("[UserManagement.vue] Attempting to save user:", currentUser.value)
      
      if (!validateForm()) {
        return
      }

      let success = false
      if (isEditMode.value) {
        success = await updateUserComplete(currentUser.value.id_tk, currentUser.value)
      } else {
        success = await createUser(currentUser.value)
      }

      if (success) {
        console.log(`[UserManagement.vue] User ${isEditMode.value ? 'updated' : 'created'} successfully.`)
        closeUserModal()
        await refreshUsers()
      } else {
        console.error(`[UserManagement.vue] User ${isEditMode.value ? 'update' : 'creation'} failed.`)
      }
    }

    const updateStatus = async (userId, status) => {
      console.log(`[UserManagement.vue] Updating status for user ${userId} to ${status}`)
      const success = await updateUserStatus(userId, status ? 1 : 0)
      
      if (success) {
        // Update local data
        const user = users.value.find(u => u.id_tk === userId)
        if (user) {
          user.trangthai = status ? 1 : 0
        }
      }
    }

    const updateRole = async (userId, role) => {
      console.log(`[UserManagement.vue] Role update disabled for user ${userId}`)
      actionResult.value = {
        success: false,
        message: "Chức năng cập nhật vai trò đã bị vô hiệu hóa"
      }
      return false
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('vi-VN')
    }

    onMounted(() => {
      refreshUsers()
    })

    return {
      users,
      usersLoading,
      usersError,
      detailLoading,
      detailError,
      actionLoading,
      actionError,
      searchQuery,
      filteredUsers,
      actionResult,
      showUserModal,
      modalTitle,
      isEditMode,
      currentUser,
      formErrors,
      refreshUsers,
      openAddModal,
      openEditModal,
      closeUserModal,
      saveUser,
      updateStatus,
      updateRole,
      formatDate
    }
  }
}
</script>

<style scoped>
.form-title {
  font-size: 18px;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.form-check-input:not(:checked) {
  background-color: #dc3545;
  border-color: #dc3545;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}

.form-text {
  font-size: 0.875em;
  color: #6c757d;
}

.alert {
  border-radius: 0.375rem;
}

.alert i {
  margin-right: 0.5rem;
}
</style>

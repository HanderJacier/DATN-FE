<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width: 100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">
        QUẢN LÝ NGƯỜI DÙNG
      </h5>
      <!-- Form tìm kiếm và nút thêm mới -->
      <div class="row g-2 mb-3 align-items-center">
        <div class="col-md-6">
          <input v-model="searchQuery" placeholder="Tìm kiếm người dùng..." class="form-control" @keyup.enter="refreshUsers" />
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-success fw-bold me-2" @click="openAddModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm mới người dùng
          </button>
          <button class="btn btn-warning fw-bold" @click="refreshUsers">
            <i class="bi bi-arrow-clockwise me-2"></i>Làm mới
          </button>
        </div>
      </div>
      <!-- Loading -->
      <div v-if="usersLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Đang tải danh sách người dùng...</p>
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
                <span :class="user.vaitro ? 'badge bg-danger' : 'badge bg-primary'">
                  {{ user.vaitro ? 'Quản trị' : 'Người dùng' }}
                </span>
              </td>
              <td>
                <span :class="user.trangthai ? 'text-success' : 'text-danger'">
                  {{ user.trangthai ? '✓ Hoạt động' : '✗ Bị khóa' }}
                </span>
              </td>
              <td>{{ formatDate(user.ngaytao) }}</td>
              <td>
                <div class="btn-group" role="group">
                  <!-- Sửa -->
                  <button 
                    class="btn btn-sm btn-outline-info"
                    @click="openEditModal(user.id_tk)"
                    :disabled="actionLoading"
                  >
                    Sửa
                  </button>
                  <!-- Xóa -->
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDeleteUser(user)"
                    :disabled="actionLoading"
                  >
                    Xóa
                  </button>
                </div>
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
        {{ actionResult.message }}
      </div>
      <div v-if="usersError" class="alert alert-danger mt-3">
        Lỗi tải dữ liệu người dùng: {{ usersError.message }}
      </div>
      <div v-if="actionError" class="alert alert-danger mt-3">
        Lỗi thực hiện thao tác: {{ actionError.message }}
      </div>
    </div>

    <!-- Modal Thêm/Sửa người dùng -->
    <div v-if="showUserModal" class="modal fade show d-block" tabindex="-1">
      <!-- Đã loại bỏ <div class="modal-backdrop fade show"></div> -->
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeUserModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2">Đang tải thông tin người dùng...</p>
            </div>
            <form v-else @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="tendangnhap" class="form-label">Tên đăng nhập</label>
                <input type="text" class="form-control" id="tendangnhap" v-model="currentUser.tendangnhap" required :disabled="isEditMode" />
              </div>
              <div class="mb-3" v-if="!isEditMode">
                <label for="matkhau" class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" id="matkhau" v-model="currentUser.matkhau" required />
              </div>
              <div class="mb-3">
                <label for="hoveten" class="form-label">Họ và tên</label>
                <input type="text" class="form-control" id="hoveten" v-model="currentUser.hoveten" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="currentUser.email" required />
              </div>
              <div class="mb-3">
                <label for="sodienthoai" class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" id="sodienthoai" v-model="currentUser.sodienthoai" />
              </div>
              <div class="mb-3">
                <label for="vaitro" class="form-label">Vai trò</label>
                <select class="form-select" id="vaitro" v-model="currentUser.vaitro">
                  <option :value="0">Người dùng</option>
                  <option :value="1">Quản trị viên</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="trangthai" class="form-label">Trạng thái</label>
                <select class="form-select" id="trangthai" v-model="currentUser.trangthai">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Bị khóa</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeUserModal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="actionLoading">
                  {{ actionLoading ? 'Đang xử lý...' : 'Lưu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteConfirmModal" class="modal fade show d-block" tabindex="-1">
      <!-- Đã loại bỏ <div class="modal-backdrop fade show"></div> -->
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>{{ userToDelete?.hoveten }} (ID: {{ userToDelete?.id_tk }})</strong>?</p>
            <p class="text-danger">
              <i class="bi bi-exclamation-triangle me-1"></i>
              Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan!
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteConfirmModal">Hủy</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteUserConfirmed"
              :disabled="actionLoading"
            >
              {{ actionLoading ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import useUserManagement from '../Admin/QLND/useUserManagement.js'

export default {
  name: 'UserManagement',
  setup() {
    const {
      users,
      userDetail, // Now available from composable
      usersLoading,
      usersError,
      detailLoading, // Now available from composable
      detailError, // Now available from composable
      actionLoading,
      actionError,
      actionResult: useUserManagementActionResult,
      fetchAllUsers,
      fetchUserDetail, // Now available from composable
      createUser,
      updateUser,
      deleteUser
    } = useUserManagement()

    const searchQuery = ref('')
    const actionResult = ref(null) // Local state for displaying action feedback

    const showUserModal = ref(false)
    const modalTitle = ref('')
    const isEditMode = ref(false)
    const currentUser = ref({
      id_tk: null,
      tendangnhap: '',
      matkhau: '', // Only for add mode
      hoveten: '',
      email: '',
      sodienthoai: '',
      vaitro: 0, // Default to user
      trangthai: 1, // Default to active
    })

    const showDeleteConfirmModal = ref(false)
    const userToDelete = ref(null)

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
        currentUser.value = { ...newVal, matkhau: '' }; // Copy data, clear password for security
        console.log("[User.vue] User detail loaded into form:", currentUser.value);
      }
    });

    const refreshUsers = async () => {
      console.log("[User.vue] Refreshing user list...")
      await fetchAllUsers()
      actionResult.value = null // Clear previous action message
    }

    const openAddModal = () => {
      isEditMode.value = false
      modalTitle.value = 'Thêm mới người dùng'
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
      console.log("[User.vue] Opening Add User modal.")
    }

    const openEditModal = async (userId) => {
      isEditMode.value = true
      modalTitle.value = 'Sửa thông tin người dùng'
      showUserModal.value = true
      console.log(`[User.vue] Opening Edit User modal for ID: ${userId}`)
      await fetchUserDetail(userId) // This will update userDetail ref, which is watched
    }

    const closeUserModal = () => {
      showUserModal.value = false
      currentUser.value = { // Reset form
        id_tk: null, tendangnhap: '', matkhau: '', hoveten: '', email: '', sodienthoai: '', vaitro: 0, trangthai: 1,
      }
      console.log("[User.vue] Closing User modal.")
    }

    const saveUser = async () => {
      console.log("[User.vue] Attempting to save user:", currentUser.value)
      let success = false;
      if (isEditMode.value) {
        success = await updateUser(currentUser.value.id_tk, currentUser.value)
      } else {
        success = await createUser(currentUser.value)
      }

      if (success) {
        actionResult.value = {
          success: true,
          message: `${isEditMode.value ? 'Cập nhật' : 'Thêm mới'} người dùng thành công`
        }
        console.log(`[User.vue] User ${isEditMode.value ? 'updated' : 'created'} successfully.`)
        closeUserModal()
        await refreshUsers() // Refresh list after successful operation
      } else {
        actionResult.value = {
          success: false,
          message: useUserManagementActionResult.value?.message || `${isEditMode.value ? 'Cập nhật' : 'Thêm mới'} người dùng thất bại`
        }
        console.error(`[User.vue] User ${isEditMode.value ? 'update' : 'creation'} failed. Result:`, useUserManagementActionResult.value)
      }
      
      setTimeout(() => {
        actionResult.value = null
      }, 3000)
    }

    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteConfirmModal.value = true
      console.log(`[User.vue] Confirming deletion for user ID: ${user.id_tk}`)
    }

    const closeDeleteConfirmModal = () => {
      showDeleteConfirmModal.value = false
      userToDelete.value = null
      console.log("[User.vue] Closing delete confirmation modal.")
    }

    const deleteUserConfirmed = async () => {
      console.log(`[User.vue] Attempting to delete user ID: ${userToDelete.value.id_tk}`)
      const successDelete = await deleteUser(userToDelete.value.id_tk)
      
      if (successDelete) {
        // Xóa khỏi danh sách local
        const index = users.value.findIndex(u => u.id_tk === userToDelete.value.id_tk)
        if (index !== -1) {
          users.value.splice(index, 1)
        }
        
        actionResult.value = {
          success: true,
          message: 'Xóa tài khoản thành công'
        }
        console.log("[User.vue] User deletion successful.")
        closeDeleteConfirmModal()
      } else {
        actionResult.value = {
          success: false,
          message: useUserManagementActionResult.value?.message || 'Xóa tài khoản thất bại'
        }
        console.error("[User.vue] User deletion failed. Result:", useUserManagementActionResult.value)
      }
      
      setTimeout(() => {
        actionResult.value = null
      }, 3000)
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
      showDeleteConfirmModal,
      userToDelete,
      refreshUsers,
      openAddModal,
      openEditModal,
      closeUserModal,
      saveUser,
      confirmDeleteUser,
      closeDeleteConfirmModal,
      deleteUserConfirmed,
      formatDate
    }
  }
}
</script>

<style scoped>
.form-title {
  font-size: 18px;
}
.btn-group .btn {
  margin-right: 2px;
}
.btn-group .btn:last-child {
  margin-right: 0;
}

</style>

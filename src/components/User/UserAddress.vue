<template>

    <!--Nav-->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Tài khoản</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Thông tin cá nhân</li>
        </ol>
    </nav>

    <!--Menu tài khoản-->
    <div class="container my-5">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3">
                <div class="bg-light rounded p-3">
                    <div class="text-center mb-3">
                        <div class="d-flex align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="60" alt="avatar"
                                class="me-2" />
                            <h5 class="fw-bold mb-0">{{ username }}</h5>
                        </div>
                    </div>
                    <hr />
                    <div class="ps-4">
                        <h6 class="fw-bold"><i class="bi bi-person-fill"></i> Tài khoản của tôi</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li><router-link to="/thongtintk" class="text-dark text-decoration-none">Thông tin cá
                                    nhân</router-link></li>
                            <li><router-link to="/diachinguoidung" class="text-primary text-decoration-none">> Địa
                                    chỉ</router-link>
                            </li>
                            <li><router-link to="/doimatkhaunguoidung" class="text-dark text-decoration-none">Đổi mật
                                    khẩu</router-link></li>
                        </ul>

                        <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li>Lịch sử mua hàng</li>
                            <li>Hóa đơn mua hàng</li>
                        </ul>

                        <h6 class="fw-bold text-danger"><i class="bi bi-heart-fill"></i> Sản phẩm yêu thích</h6>
                        <h6 class="fw-bold text-warning mt-3"><i class="bi bi-box-arrow-right"></i> Đăng xuất</h6>
                    </div>
                </div>
            </div>

            <!-- ===== Khối địa chỉ ===== -->
            <div class="col-md-8">
                <h4 class="fw-bold mb-4">Địa chỉ của tôi</h4>
                <div class="bg-white border rounded p-4 shadow-sm">
                    <form @submit.prevent="submitAddresses">
                        <div class="container mt-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5>Địa chỉ</h5>
                                <router-link to="/diachinguoidungmoi" class="btn btn-primary">
                                    + Thêm địa chỉ mới
                                </router-link>
                            </div>

                            <!-- Danh sách địa chỉ -->
                            <div v-for="(addr, i) in addresses" :key="i" :class="[
                                'pt-3 mb-3',
                                i !== 0 ? 'border-top mt-4' : 'pb-3',
                            ]">
                                <p class="mb-1 fw-semibold">
                                    {{ addr.name }} | {{ addr.phone }}
                                </p>
                                <p class="mb-1">{{ addr.street }}</p>
                                <p class="mb-1">
                                    {{ addr.ward }}, {{ addr.district }}, {{ addr.city }}
                                </p>

                                <!-- Huy hiệu mặc định -->
                                <span v-if="addr.default"
                                    class="badge bg-light text-primary border border-primary px-2 py-1">
                                    Mặc định
                                </span>

                                <div class="d-flex gap-2 w-100 justify-content-end mt-2">

                                    <!-- Chỉ hiển thị khi chưa phải mặc định -->
                                    <button v-if="!addr.default" class="btn btn-outline-secondary" type="button"
                                        @click="setDefault(i)">
                                        Đặt mặc định
                                    </button>

                                    <button class="btn btn-primary" type="button" @click="editAddress(i)">
                                        Cập nhật
                                    </button>

                                    <button class="btn btn-outline-danger" type="button" @click="deleteAddress(i)">
                                        <i class="bi bi-trash"></i>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>

                    <div v-if="isAddressSaved" class="text-success mt-2">
                        ✔ Đã lưu thay đổi địa chỉ
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'PersonalInfoPage',

    data() {
        return {
            /* ---------- Thông tin cá nhân ---------- */
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',
            isProfileSaved: false,

            /* ---------- Danh sách địa chỉ ---------- */
            addresses: [
                {
                    name: 'Thuy Tien',
                    phone: '(+84) 789 345 123',
                    street: 'Số 123, Đường Hiệp Thành 13',
                    ward: 'Phường Hiệp Thành',
                    district: 'Quận 12',
                    city: 'TP. Hồ Chí Minh',
                    default: true,
                },
                {
                    name: 'Thuy Tien',
                    phone: '(+84) 789 345 123',
                    street: 'Công Viên Phần Mềm Quang Trung',
                    ward: 'Phường Trung Mỹ Tây',
                    district: 'Quận 12',
                    city: 'TP. Hồ Chí Minh',
                    default: false,
                },
            ],
            isAddressSaved: false,
        };
    },

    methods: {
        /* ===== Thông tin cá nhân ===== */
        submitProfile() {
            // Gọi API cập nhật hồ sơ nếu có
            console.log('Đã lưu hồ sơ:', {
                username: this.username,
                email: this.email,
                phone: this.phone,
                gender: this.gender,
            });
            this.flash('isProfileSaved');
        },

        /* ===== Địa chỉ ===== */
        submitAddresses() {
            // Gọi API batch update địa chỉ nếu muốn
            console.log('Đã lưu danh sách địa chỉ:', this.addresses);
            this.flash('isAddressSaved');
        },

        addAddress() {
            this.addresses.push({
                name: this.username,
                phone: this.phone,
                street: '',
                ward: '',
                district: '',
                city: '',
                default: false,
            });
        },

        editAddress(index) {
            // Bạn có thể mở modal ở đây
            alert(`Chỉnh sửa địa chỉ #${index + 1}`);
        },

        deleteAddress(index) {
            if (confirm('Chắc chắn xoá địa chỉ này?')) {
                this.addresses.splice(index, 1);
                // Nếu xoá địa chỉ mặc định, chuyển phần tử đầu tiên thành mặc định
                if (!this.addresses.some((a) => a.default) && this.addresses[0])
                    this.addresses[0].default = true;
            }
        },

        setDefault(index) {
            this.addresses.forEach((a, i) => {
                a.default = i === index;
            });
        },

        /* ===== Tiện ích ===== */
        flash(flag) {
            this[flag] = true;
            setTimeout(() => (this[flag] = false), 2000);
        },
    },
    mounted() {
        const savedAddress = localStorage.getItem('newAddress');
        if (savedAddress) {
            const parsed = JSON.parse(savedAddress);
            this.addresses.push(parsed);
            localStorage.removeItem('newAddress');
        }
    },
};
</script>

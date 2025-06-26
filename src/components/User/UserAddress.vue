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
            <li class="breadcrumb-item active text-muted" aria-current="page">Địa chỉ</li>
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
                            <li><router-link to="/diachinguoidung" class="text-dark text-decoration-none">Địa
                                    chỉ</router-link>
                            </li>
                            <li><router-link to="/doimatkhau" class="text-dark text-decoration-none">Đổi mật
                                    khẩu</router-link></li>
                        </ul>

                        <h6 class="fw-bold"><i class="bi bi-card-checklist"></i> Đơn mua</h6>
                        <ul class="list-unstyled ps-3 mb-3">
                            <li><router-link to="/lichsumuahang" class="text-dark text-decoration-none">Lịch sử mua
                                    hàng</router-link></li>
                            <li><router-link to="/hoadon" class="text-primary text-decoration-none">> Hóa đơn mua
                                    hàng</router-link></li>
                        </ul>

                        <router-link to="/sanphamyeuthich" class="text-dark text-decoration-none">
                            <h6 class="fw-bold text-danger mb-0">
                                <i class="bi bi-heart-fill"></i> Sản phẩm yêu thích
                            </h6>
                        </router-link>
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
                                <button class="btn btn-primary" type="button" @click="openAddModal">
                                    + Thêm địa chỉ mới
                                </button>
                            </div>

                            <!-- Danh sách địa chỉ -->
                            <div v-for="(addr, i) in addresses" :key="i"
                                :class="['pt-3 mb-3', i !== 0 ? 'border-top mt-4' : 'pb-3']">
                                <p class="mb-1 fw-semibold">{{ addr.name }} | {{ addr.phone }}</p>
                                <p class="mb-1">{{ addr.street }}</p>
                                <p class="mb-1">
                                    {{ addr.ward }}, {{ addr.district }}, {{ addr.city }}
                                </p>

                                <span v-if="addr.default"
                                    class="badge bg-light text-primary border border-primary px-2 py-1">
                                    Mặc định
                                </span>

                                <div class="d-flex gap-2 w-100 justify-content-end mt-2">
                                    <button v-if="!addr.default" class="btn btn-outline-secondary" type="button"
                                        @click="setDefault(i)">
                                        Đặt mặc định
                                    </button>

                                    <button class="btn btn-primary" type="button" @click="openEditModal(i)">
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

            <!-- ===== Modal Bootstrap (Thêm / Cập nhật) ===== -->
            <div v-if="showModal">
                <div class="modal-backdrop fade show"></div>

                <div class="modal fade show d-block" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">

                            <div class="modal-header">
                                <h5 class="modal-title">
                                    {{ isEdit ? 'Cập Nhật Địa Chỉ' : 'Địa Chỉ Mới' }}
                                </h5>
                                <button type="button" class="btn-close" @click="closeModal"></button>
                            </div>

                            <!-- ========= modal-body mới ========= -->
                            <div class="modal-body">
                                <!-- Họ & SĐT cùng hàng -->
                                <div class="row mb-3">
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="Họ và tên"
                                            v-model="formAddress.name" />
                                    </div>
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="Số điện thoại"
                                            v-model="formAddress.phone" />
                                    </div>
                                </div>

                                <!-- Input + datalist cho địa giới hành chính -->
                                <div class="mb-3">
                                    <input type="text" class="form-control"
                                        placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" list="locationOptions"
                                        v-model="formAddress.location" />
                                    <datalist id="locationOptions">
                                        <option value="TP.HCM - Q.12 - Hiệp Thành"></option>
                                        <option value="Hà Nội - Cầu Giấy - Dịch Vọng"></option>
                                        <option value="Đà Nẵng - Hải Châu - Thạch Thang"></option>
                                        <option value="Cần Thơ - Ninh Kiều - Tân An"></option>
                                    </datalist>
                                </div>

                                <!-- Địa chỉ cụ thể -->
                                <div class="mb-3">
                                    <textarea class="form-control" rows="2" placeholder="Địa chỉ cụ thể"
                                        v-model="formAddress.street"></textarea>
                                </div>
                            </div>

                            <!-- ========= modal-footer mới ========= -->
                            <div class="modal-footer justify-content-between">
                                <button class="btn btn-link text-decoration-none" @click="closeModal">
                                    Trở Lại
                                </button>
                                <button class="btn btn-danger px-4" @click="saveAddress">
                                    Hoàn thành
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>


<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'UserAddress',
    components: { RouterLink },

    data() {
        return {
            isAddressSaved: false,

            /* modal state */
            showModal: false,
            isEdit: false,
            editingIndex: null,

            /* form trong modal */
            formAddress: {
                name: '',
                phone: '',
                location: '', // Tỉnh/TP - Quận/Huyện - Phường/Xã
                street: '',
                default: false,
            },

            /* danh sách hiển thị */
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
            ],

            /* DỮ LIỆU từ script2 */
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',
        };
    },

    methods: {
        /* mở modal thêm mới */
        openAddModal() {
            this.isEdit = false;
            this.editingIndex = null;
            this.formAddress = {
                name: '',
                phone: '',
                location: '',
                street: '',
                default: false,
            };
            this.showModal = true;
        },

        /* mở modal chỉnh sửa */
        openEditModal(i) {
            const a = this.addresses[i];
            this.isEdit = true;
            this.editingIndex = i;
            this.formAddress = {
                name: a.name,
                phone: a.phone,
                location: `${a.city} - ${a.district} - ${a.ward}`,
                street: a.street,
                default: a.default,
            };
            this.showModal = true;
        },

        /* lưu địa chỉ */
        saveAddress() {
            const { name, phone, location, street, default: isDef } = this.formAddress;

            if (!name || !phone) {
                alert('Vui lòng nhập Họ tên và Số điện thoại.');
                return;
            }

            const [city = '', district = '', ward = ''] = location.split('-').map((s) => s.trim());

            const obj = { name, phone, street, ward, district, city, default: isDef };

            if (this.isEdit && this.editingIndex !== null) {
                this.addresses.splice(this.editingIndex, 1, obj);
            } else {
                this.addresses.push(obj);
            }

            if (obj.default) {
                const idx = this.isEdit ? this.editingIndex : this.addresses.length - 1;
                this.setDefault(idx);
            }

            this.closeModal();
            this.flash('isAddressSaved');
        },

        /* đặt mặc định */
        setDefault(i) {
            this.addresses.forEach((addr, idx) => (addr.default = idx === i));
        },

        /* xoá địa chỉ */
        deleteAddress(i) {
            if (confirm('Chắc chắn xoá địa chỉ này?')) {
                this.addresses.splice(i, 1);
                if (!this.addresses.some((a) => a.default) && this.addresses[0]) {
                    this.addresses[0].default = true;
                }
            }
        },

        submitAddresses() {
            console.log('Danh sách địa chỉ:', this.addresses);
        },

        closeModal() {
            this.showModal = false;
            this.isEdit = false;
            this.editingIndex = null;
        },

        flash(flag) {
            this[flag] = true;
            setTimeout(() => (this[flag] = false), 2000);
        },

        /* PHƯƠNG THỨC từ script2 */
        submitForm() {
            alert(`Thông tin đã cập nhật:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}`);
        },
    },
};
</script>

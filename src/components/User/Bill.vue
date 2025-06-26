<template>

    <!--Nav-->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-2 mt-2" style="background-color: #eaf0fc;">
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Trang chủ</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/" class="text-primary">Đơn mua</a>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">Hóa đơn mua hàng</li>
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
                            <li><router-link to="/doimatkhau" class="text-dark text-decoration-none">Lịch sử mua
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

            <!-- Thông tin cá nhân -->
            <div id="app" class="col-md-9">
                <h4 class="fw-bold mb-4">Hóa đơn mua hàng</h4>
                <div class="bg-white border rounded p-1 shadow-sm">
                    <form @submit.prevent="submitForm">
                        <div class="container-fluid my-4">
                            <div class="bg-white p-4 rounded mx-auto">
                                <h5 class="fw-bold mb-3">Thông tin hóa đơn</h5>
                                <!-- Thông tin hóa đơn -->
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Số hóa đơn</label>
                                        <input type="text" class="form-control" v-model="invoice.number">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Ngày lập hóa đơn</label>
                                        <input type="date" class="form-control" v-model="invoice.date">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Trạng thái</label>
                                        <select class="form-select" v-model="invoice.status">
                                            <option>Đã thanh toán</option>
                                            <option>Chưa thanh toán</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Thông tin khách hàng -->
                                <h5 class="fw-bold mb-3">Thông tin khách hàng</h5>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Tên khách hàng</label>
                                        <input type="text" class="form-control" v-model="customer.name">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Địa chỉ</label>
                                        <input type="text" class="form-control" v-model="customer.address">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label">SĐT</label>
                                        <input type="text" class="form-control" v-model="customer.phone">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label">Mã KH</label>
                                        <input type="text" class="form-control" v-model="customer.code">
                                    </div>
                                </div>

                                <!-- Bảng sản phẩm -->
                                <table class="table table-bordered text-center align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Giảm giá (%)</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(product, index) in products" :key="index">
                                            <td>{{ index + 1 }}</td>
                                            <td><input v-model="product.name" class="form-control" /></td>
                                            <td><input v-model.number="product.quantity" type="number"
                                                    class="form-control" /></td>
                                            <td><input v-model.number="product.price" type="number"
                                                    class="form-control" /></td>
                                            <td><input v-model.number="product.discount" type="number"
                                                    class="form-control" /></td>
                                            <td>{{ formatCurrency(productTotal(product)) }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <button type="button" class="btn btn-primary mb-3" @click="addProduct">+ Thêm sản
                                    phẩm</button>

                                <!-- Tổng kết -->
                                <div class="row">
                                    <div class="col-md-4">
                                        <p class="mb-1">Tổng tiền hàng: <strong>{{ formatCurrency(totalAmount)
                                                }}</strong></p>
                                        <p class="mb-1">Chiết khấu: <strong>0</strong></p>
                                        <p class="mb-1">Thuế: <strong>0</strong></p>
                                    </div>
                                    <div class="col-md-4">
                                        <p class="mb-1">Tổng thanh toán: <strong>{{ formatCurrency(totalAmount)
                                                }}</strong></p>
                                        <p class="mb-1">Số tiền đã thanh toán: <strong>{{ formatCurrency(totalAmount)
                                                }}</strong></p>
                                    </div>
                                </div>

                                <!-- Phương thức thanh toán -->
                                <div class="mt-4">
                                    <h6 class="fw-bold mb-2">Phương thức thanh toán</h6>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="ck" value="Chuyển khoản"
                                            v-model="paymentMethod">
                                        <label class="form-check-label" for="ck">Chuyển khoản</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="the" value="Thẻ"
                                            v-model="paymentMethod">
                                        <label class="form-check-label" for="the">Thẻ</label>
                                    </div>
                                </div>

                                <!-- Ghi chú -->
                                <div class="mt-3">
                                    <label class="form-label">Ghi chú</label>
                                    <textarea class="form-control" rows="3" v-model="note"></textarea>
                                </div>

                                <!-- Nút hành động -->
                                <div class="mt-4 text-end">
                                    <button class="btn btn-primary">Lưu hóa đơn</button>
                                    <button type="button" class="btn btn-secondary ms-2">Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'PersonalInfoPage',
    data() {
        return {
            // Thông tin người dùng cá nhân
            username: 'Thuy Tien',
            email: 'tranthithuytien@gmail.com',
            phone: '0789 345 123',
            gender: 'Nữ',

            // Thông tin hóa đơn
            invoice: {
                number: '12345',
                date: '2025-03-15',
                status: 'Đã thanh toán'
            },

            // Thông tin khách hàng
            customer: {
                name: 'Nguyễn Văn A',
                address: '12, Quận 12, TP.HCM',
                phone: '0345678123',
                code: '001'
            },

            // Danh sách sản phẩm
            products: [
                { name: 'iPhone 15 128GB', quantity: 1, price: 22990000, discount: 31 },
                { name: 'Chuột Bluetooth PMB8001', quantity: 1, price: 319000, discount: 13 },
                { name: 'Loa Bluetooth SOUNARC P2', quantity: 1, price: 490000, discount: 19 }
            ],

            // Khác
            paymentMethod: 'Chuyển khoản',
            note: ''
        };
    },
    computed: {
        totalAmount() {
            return this.products.reduce((sum, p) => {
                return sum + this.productTotal(p);
            }, 0);
        }
    },
    methods: {
        productTotal(product) {
            const priceAfterDiscount = product.price * (1 - product.discount / 100);
            return product.quantity * priceAfterDiscount;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        addProduct() {
            this.products.push({ name: '', quantity: 1, price: 0, discount: 0 });
        },
        submitForm() {
            alert(`✅ Hóa đơn đã được lưu thành công!

 Người dùng:
- Tên: ${this.username}
- Email: ${this.email}
- SĐT: ${this.phone}
- Giới tính: ${this.gender}

 Hóa đơn:
- Số: ${this.invoice.number}
- Ngày: ${this.invoice.date}
- Trạng thái: ${this.invoice.status}

 Khách hàng:
- Tên: ${this.customer.name}
- Địa chỉ: ${this.customer.address}
- SĐT: ${this.customer.phone}
- Mã KH: ${this.customer.code}

 Thanh toán: ${this.paymentMethod}
 Ghi chú: ${this.note}

 Tổng thanh toán: ${this.formatCurrency(this.totalAmount)}
`);
            console.log({
                username: this.username,
                email: this.email,
                phone: this.phone,
                gender: this.gender,
                invoice: this.invoice,
                customer: this.customer,
                products: this.products,
                total: this.totalAmount,
                paymentMethod: this.paymentMethod,
                note: this.note
            });
        }
    }
};
</script>

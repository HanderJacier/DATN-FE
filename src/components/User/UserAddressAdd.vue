<template>
    <div class="container mt-5 col-md-6">
        <h4 class="fw-bold mb-4">Thêm địa chỉ mới</h4>
        <form @submit.prevent="saveAddress">
            <div class="mb-3">
                <label class="form-label">Họ tên</label>
                <input v-model="address.name" type="text" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input v-model="address.phone" type="text" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input v-model="address.street" type="text" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Phường</label>
                <input v-model="address.ward" type="text" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Quận</label>
                <input v-model="address.district" type="text" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Thành phố</label>
                <input v-model="address.city" type="text" class="form-control" />
            </div>
            <button class="btn btn-success">Lưu địa chỉ</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddAddressPage',
    data() {
        return {
            address: {
                name: '',
                phone: '',
                street: '',
                ward: '',
                district: '',
                city: '',
                default: false,
            },
        };
    },
    methods: {
        saveAddress() {
            // Lưu vào localStorage (1 lần) → sau đó trang chính sẽ đọc
            localStorage.setItem('newAddress', JSON.stringify(this.address));

            // Quay về lại trang chính
            this.$router.push('/diachinguoidung'); // thay bằng router đúng nếu khác
        },
    },
};
</script>
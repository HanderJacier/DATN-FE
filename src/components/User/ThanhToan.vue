<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header">Thông tin khách hàng</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ và tên *</label>
                <input v-model="orderData.customerInfo.name" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại *</label>
                <input v-model="orderData.customerInfo.phone" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input v-model="orderData.customerInfo.email" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input v-model="orderData.customerInfo.address" class="form-control" required />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea v-model="orderData.note" class="form-control"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header">Phương thức thanh toán</div>
          <div class="card-body">
            <div class="form-check mb-2">
              <input v-model="paymentMethod" value="COD" type="radio" class="form-check-input" id="cod" />
              <label class="form-check-label" for="cod">Thanh toán khi nhận hàng (COD)</label>
            </div>
            <div class="form-check mb-2">
              <input v-model="paymentMethod" value="BANK" type="radio" class="form-check-input" id="bank" />
              <label class="form-check-label" for="bank">Chuyển khoản ngân hàng</label>
            </div>
            <div class="form-check mb-2">
              <input v-model="paymentMethod" value="MOMO" type="radio" class="form-check-input" id="momo" />
              <label class="form-check-label" for="momo">Thanh toán MoMo</label>
            </div>
          </div>
        </div>
        <div v-if="paymentMethod === 'BANK'" class="card mb-4">
          <div class="card-header">Thông tin chuyển khoản</div>
          <div class="card-body">
            <p><strong>Ngân hàng:</strong> Techcombank</p>
            <p><strong>Số tài khoản:</strong> 1234567890123</p>
            <p><strong>Chủ tài khoản:</strong> Công ty XYZ</p>
            <p><strong>Nội dung chuyển khoản:</strong> {{ transferContent }} <button @click="copyToClipboard(transferContent)" class="btn btn-sm btn-outline-secondary"><i class="bi bi-clipboard"></i></button></p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header">Tóm tắt đơn hàng</div>
          <div class="card-body">
            <div v-for="item in orderData.items" :key="item.id" class="mb-2">
              <p><strong>{{ item.name }}</strong> x {{ item.quantity }}</p>
              <p>{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
            <hr />
            <p><strong>Tạm tính:</strong> {{ formatPrice(subtotal) }}</p>
            <p><strong>Giảm giá:</strong> {{ formatPrice(discount) }}</p>
            <p><strong>Tổng tiền:</strong> {{ formatPrice(finalAmount) }}</p>
            <div class="form-check mb-3">
              <input v-model="agreeTerms" type="checkbox" class="form-check-input" id="terms" />
              <label class="form-check-label" for="terms">Tôi đồng ý với điều khoản và điều kiện</label>
            </div>
            <button @click="processPayment" :disabled="processing || !agreeTerms" class="btn btn-primary w-100">
              <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
              {{ getPaymentButtonText() }}
            </button>
            <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success mt-2">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import usePayment from './LoadDB/usePayment.js';
import useMoMo from './LoadDB/useMoMo.js';

export default {
  name: 'Payment',
  setup() {
    const router = useRouter();
    const { processPayment: executePayment, processing, paymentResult } = usePayment();
    const { createPaymentUrl: createMoMoUrl, redirectToPayment, openMoMoApp } = useMoMo();

    const orderData = ref({
      customerInfo: { name: '', phone: '', email: '', address: '', id_tk: null },
      items: [],
      totalAmount: 0,
      note: '',
    });
    const paymentMethod = ref('');
    const agreeTerms = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const subtotal = computed(() => {
      return orderData.value.items.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0);
    });
    const discount = computed(() => {
      let baseDiscount = subtotal.value - orderData.value.items.reduce((total, item) => total + item.price * item.quantity, 0);
      if (paymentMethod.value === 'BANK') baseDiscount += orderData.value.items.reduce((total, item) => total + item.price * item.quantity, 0) * 0.02;
      return Math.round(baseDiscount);
    });
    const finalAmount = computed(() => {
      let total = orderData.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (paymentMethod.value === 'BANK') total *= 0.98;
      return Math.round(total);
    });
    const transferContent = computed(() => {
      return `HD${String(Date.now()).slice(-6)} ${orderData.value.customerInfo?.phone || ''}`;
    });

    const formatPrice = (val) => val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const getPaymentButtonText = () => {
      switch (paymentMethod.value) {
        case 'COD': return 'Xác nhận đặt hàng';
        case 'BANK': return 'Xác nhận chuyển khoản';
        case 'MOMO': return 'Thanh toán MoMo';
        default: return 'Thanh toán ngay';
      }
    };
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        successMessage.value = `Đã sao chép: ${text}`;
        setTimeout(() => (successMessage.value = ''), 2000);
      } catch (err) {
        errorMessage.value = 'Không thể sao chép. Vui lòng copy thủ công.';
      }
    };

    const processPayment = async () => {
      if (!paymentMethod.value) {
        errorMessage.value = 'Vui lòng chọn phương thức thanh toán';
        return;
      }
      if (!agreeTerms.value) {
        errorMessage.value = 'Vui lòng đồng ý với điều khoản và điều kiện';
        return;
      }
      if (!orderData.value.items || orderData.value.items.length === 0) {
        errorMessage.value = 'Không có sản phẩm để thanh toán';
        return;
      }

      try {
        const paymentData = {
          ...orderData.value,
          paymentMethod: paymentMethod.value,
          finalAmount: finalAmount.value,
          transferContent: paymentMethod.value === 'BANK' ? transferContent.value : null,
        };

        if (paymentMethod.value === 'MOMO') {
          const momoResult = await createMoMoUrl(paymentData);
          if (momoResult.success) {
            localStorage.setItem('pendingOrder', JSON.stringify(paymentData));
            const result = await Swal.fire({
              title: 'Thanh toán MoMo (Demo)',
              html: `
                <div class="text-center">
                  <p>Chọn cách thanh toán MoMo:</p>
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary" id="momo-app">
                      <i class="bi bi-phone"></i> Mở ứng dụng MoMo
                    </button>
                    <button class="btn btn-outline-primary" id="momo-web">
                      <i class="bi bi-globe"></i> Thanh toán trên web
                    </button>
                    <img src="${momoResult.qrCodeUrl}" alt="QR Code" class="mt-3" style="max-width: 200px;" />
                  </div>
                </div>
              `,
              icon: 'info',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
              showConfirmButton: false,
              didOpen: () => {
                document.getElementById('momo-app').onclick = () => {
                  openMoMoApp(momoResult.deeplink, momoResult.isDemo, momoResult.hoadonId, momoResult.orderId);
                  Swal.close();
                };
                document.getElementById('momo-web').onclick = () => {
                  redirectToPayment(momoResult.paymentUrl, momoResult.isDemo, momoResult.hoadonId);
                  Swal.close();
                };
              },
            });
          } else {
            errorMessage.value = momoResult.message || 'Lỗi tạo URL thanh toán MoMo';
          }
          return;
        }

        const result = await executePayment(paymentData);
        if (result.success) {
          localStorage.setItem('orderResult', JSON.stringify({
            orderId: result.orderId,
            invoiceId: result.invoiceId,
            invoiceNumber: result.invoiceNumber,
            totalAmount: finalAmount.value,
            paymentMethod: paymentMethod.value,
          }));

          await Swal.fire({
            title: 'Thanh toán thành công!',
            html: `
              <div class="text-center">
                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                <h4 class="mt-3 mb-2">Đơn hàng đã được tạo thành công!</h4>
                <p class="text-muted mb-3">
                  Mã đơn hàng: <strong>HD${String(result.orderId).padStart(6, '0')}</strong><br>
                  ${result.invoiceNumber ? `Số hóa đơn: <strong>${result.invoiceNumber}</strong><br>` : ''}
                  Tổng tiền: <strong>${finalAmount.value.toLocaleString('vi-VN')} đ</strong>
                </p>
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút để xác nhận đơn hàng
                </div>
              </div>
            `,
            icon: 'success',
            confirmButtonText: '<i class="fas fa-home me-2"></i>Về trang chủ',
            confirmButtonColor: '#007bff',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          localStorage.removeItem('orderData');
          localStorage.removeItem('selectedCartItems');
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          const remainingCart = cart.filter(
            (cartItem) => !paymentData.items.some((orderItem) => orderItem.id === cartItem.id)
          );
          localStorage.setItem('cart', JSON.stringify(remainingCart));
          window.dispatchEvent(new Event('storage'));
          router.push('/');
        } else {
          await Swal.fire({
            title: 'Thanh toán thất bại!',
            text: result.message || 'Có lỗi xảy ra khi xử lý thanh toán',
            icon: 'error',
            confirmButtonText: 'Thử lại',
          });
          errorMessage.value = result.message || 'Có lỗi xảy ra khi xử lý thanh toán';
        }
      } catch (error) {
        await Swal.fire({
          title: 'Lỗi hệ thống!',
          text: 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.',
          icon: 'error',
          confirmButtonText: 'Đóng',
        });
        errorMessage.value = 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.';
      }
    };

    const loadOrderData = () => {
      try {
        const saved = localStorage.getItem('orderData');
        if (saved) {
          const parsedData = JSON.parse(saved);
          orderData.value = {
            customerInfo: parsedData.customerInfo || { name: '', phone: '', email: '', address: '', id_tk: null },
            items: parsedData.items || [],
            totalAmount: parsedData.totalAmount || 0,
            note: parsedData.note || '',
          };
        } else {
          router.push('/giohang');
        }
      } catch (error) {
        router.push('/giohang');
      }
    };

    onMounted(loadOrderData);

    return {
      orderData,
      paymentMethod,
      agreeTerms,
      errorMessage,
      successMessage,
      processing,
      subtotal,
      discount,
      finalAmount,
      transferContent,
      formatPrice,
      getPaymentButtonText,
      copyToClipboard,
      processPayment,
    };
  },
};
</script>

<style scoped>
.card { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: none; }
.btn { padding: 10px 20px; }
.text-danger, .text-success { font-size: 0.9rem; }
</style>
import { ref } from "vue";
import CryptoJS from "crypto-js";

export default function useMoMo() {
  const processing = ref(false);
  const error = ref("");

  const getEnvironmentConfig = () => {
    const isProduction = import.meta.env.VITE_MOMO_ENV === "production";

    if (isProduction) {
      return {
        partnerCode: "MOMOK8IO20250706",
        accessKey: "ducSZ1riTlkXkOiF",
        secretKey: "5Ki9RMxM32z3K5eeWkYXBDVG93BbWyak",
        endpoint: "https://payment.momo.vn/v2/gateway/api/create",
        environment: "PRODUCTION",
      };
    } else {
      return {
        partnerCode: import.meta.env.VITE_MOMO_PARTNER_CODE,
        accessKey: import.meta.env.VITE_MOMO_ACCESS_KEY,
        secretKey: import.meta.env.VITE_MOMO_SECRET_KEY,
        endpoint: import.meta.env.VITE_MOMO_ENDPOINT,
        environment: "TEST",
      };
    }
  };

  const createPaymentUrl = async (orderData) => {
    processing.value = true;
    error.value = "";

    try {
      const config = getEnvironmentConfig();
      const { partnerCode, accessKey, secretKey, endpoint, environment } =
        config;

      // ⚠️ CẢNH BÁO BẢO MẬT: SECRET_KEY không được sử dụng ở frontend trong production
      console.warn(
        `🚨 ${environment} MODE: SECRET_KEY đang được expose ở frontend - chỉ dùng cho demo!`
      );

      const requestId = `REQ_${Date.now()}`;
      const orderId = `ORDER_${Date.now()}`;
      const amount = orderData.finalAmount.toString();
      const orderInfo = `Thanh toán đơn hàng ${
        orderData.customerInfo?.name || "Khách hàng"
      }`;
      const redirectUrl = import.meta.env.VITE_RETURN_URL;
      const ipnUrl = import.meta.env.VITE_NOTIFY_URL;
      const requestType = "captureWallet";
      const extraData = JSON.stringify({
        customerInfo: orderData.customerInfo,
        items: orderData.items,
      });

      // Tạo signature theo MoMo API spec
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString();

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        signature,
        lang: "vi",
      };

      try {
        console.log(`🔄 Calling MoMo ${environment} API:`, endpoint);

        // Gọi MoMo API thực tế
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        // Kiểm tra nếu MoMo yêu cầu xác nhận điều khoản
        if (result.message && result.message.includes("Điều khoản hợp tác")) {
          console.warn(
            "🚨 MoMo yêu cầu xác nhận Điều khoản hợp tác - chuyển sang demo mode"
          );
          return createDemoPayment(orderId, orderData);
        }

        processing.value = false;

        if (result.resultCode === 0) {
          return {
            success: true,
            paymentUrl: result.payUrl,
            deeplink: result.deeplink,
            qrCodeUrl: result.qrCodeUrl,
            orderId: orderId,
            environment: environment,
          };
        } else {
          console.error("MoMo API Error:", result);
          return createDemoPayment(orderId, orderData);
        }
      } catch (apiError) {
        if (
          apiError.message.includes("Failed to fetch") ||
          apiError.message.includes("CORS") ||
          apiError.message.includes("Access-Control-Allow-Origin")
        ) {
          console.warn(`🚨 CORS ERROR: MoMo API không cho phép gọi từ browser`);
          console.warn(`💡 GIẢI PHÁP: Cần tạo backend proxy để gọi MoMo API`);
          console.warn(`🎭 Tạm thời chuyển sang demo mode để test UI`);

          return {
            ...createDemoPayment(orderId, orderData),
            corsError: true,
            message:
              "🚫 CORS Error: MoMo API không cho phép gọi trực tiếp từ browser. Cần backend proxy để sử dụng thực tế.",
          };
        }

        console.warn(
          `🚨 MoMo ${environment} API không khả dụng - chuyển sang demo mode:`,
          apiError.message
        );
        return createDemoPayment(orderId, orderData);
      }
    } catch (err) {
      processing.value = false;
      error.value = err.message;
      return {
        success: false,
        message: "Lỗi kết nối MoMo: " + err.message,
      };
    }
  };

  const createDemoPayment = (orderId, orderData) => {
    processing.value = false;

    // Tạo demo payment URL
    const demoPaymentUrl = `${window.location.origin}/payment/momo-demo?orderId=${orderId}&amount=${orderData.finalAmount}`;

    return {
      success: true,
      paymentUrl: demoPaymentUrl,
      deeplink: `momo://payment?orderId=${orderId}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        demoPaymentUrl
      )}`,
      orderId: orderId,
      isDemo: true,
      message: "🎭 DEMO MODE: MoMo chưa kích hoạt - sử dụng thanh toán giả lập",
    };
  };

  const redirectToPayment = (paymentUrl, isDemo = false) => {
    if (isDemo) {
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate for demo
        const returnUrl = success
          ? `${
              import.meta.env.VITE_RETURN_URL
            }?status=success&orderId=${Date.now()}`
          : `${
              import.meta.env.VITE_RETURN_URL
            }?status=failed&orderId=${Date.now()}`;

        alert(
          success
            ? "✅ Demo: Thanh toán thành công!"
            : "❌ Demo: Thanh toán thất bại!"
        );
        window.location.href = returnUrl;
      }, 2000);
    } else {
      window.location.href = paymentUrl;
    }
  };

  const openMoMoApp = (deeplink, isDemo = false) => {
    if (isDemo) {
      alert("🎭 Demo: Mở ứng dụng MoMo giả lập...");
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for app demo
        alert(
          success
            ? "✅ Demo: Thanh toán qua app thành công!"
            : "❌ Demo: Thanh toán qua app thất bại!"
        );
      }, 1500);
      return;
    }

    // Thử mở app MoMo thực tế
    window.location.href = deeplink;

    // Fallback về web sau 2 giây nếu không mở được app
    setTimeout(() => {
      console.log("Fallback to web payment");
    }, 2000);
  };

  return {
    processing,
    error,
    createPaymentUrl,
    redirectToPayment,
    openMoMoApp,
  };
}

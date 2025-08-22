"use client";

import { ref } from "vue";
import { usePostData } from "../component_callApi/callAPI";
import useAuth from "./useAuth";

export default function useGoogleLogin() {
  const userData = ref(null);
  const loginError = ref(null);
  const isLoading = ref(false);

  const { data, callAPI } = usePostData();
  const { login } = useAuth();

  const initGoogleSignIn = () => {
    return new Promise((resolve) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  };

  const handleGoogleLogin = async () => {
    try {
      isLoading.value = true;
      await initGoogleSignIn();

      window.google.accounts.id.initialize({
        client_id:
          "906002581004-c8p6pp86h4edksknu0dc3j2p8mtvtpjo.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Lỗi khởi tạo Google Login:", error);
      loginError.value = "Không thể khởi tạo Google Login";
      isLoading.value = false;
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));

      console.log("Google user info:", payload);

      await callAPI("WBH_US_GOOGLE_LOGIN", {
        params: {
          p_email: payload.email,
          p_hoveten: payload.name,
          p_google_id: payload.sub,
        },
      });

      if (Array.isArray(data.value) && data.value.length > 0) {
        const userResult = data.value[0];
        const userWithGoogleInfo = {
          ...userResult,
          google_name: payload.name,
          google_picture: payload.picture,
          google_email: payload.email,
          login_type: "google",
        };

        userData.value = userWithGoogleInfo;
        login(userWithGoogleInfo);
        loginError.value = null;

        const message =
          userResult.user_type === "new"
            ? `Chào mừng ${payload.name}! Tài khoản đã được tạo thành công.`
            : `Xin chào ${payload.name}! Đăng nhập thành công.`;

        console.log("[v0] Google login successful:", message);
      } else {
        loginError.value = "Không thể đăng nhập Google";
      }
    } catch (error) {
      console.error("Lỗi xử lý Google Login:", error);
      loginError.value = "Lỗi đăng nhập Google";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userData,
    loginError,
    isLoading,
    handleGoogleLogin,
  };
}

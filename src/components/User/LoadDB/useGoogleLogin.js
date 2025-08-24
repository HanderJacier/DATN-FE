// useGoogleLogin.js
"use client";

import { ref, onUnmounted } from "vue";
import { usePostData } from "@/components/component_callApi/callAPI";
import useAuth from "./useAuth";

function b64urlDecode(s) {
  if (!s) return "";
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4; if (pad) s += "=".repeat(4 - pad);
  try { return atob(s); } catch { return ""; }
}

export default function useGoogleLogin() {
  const userData = ref(null);
  const loginError = ref(null);
  const isLoading = ref(false);

  const { callAPI } = usePostData();
  const { login } = useAuth();

  let gsiLoaded = false, gsiInited = false;

  const initGoogleSignIn = () => new Promise((resolve, reject) => {
    if (window.google) { gsiLoaded = true; resolve(); return; }
    if (gsiLoaded) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true; script.defer = true;
    script.onload = () => { gsiLoaded = true; resolve(); };
    script.onerror = () => reject(new Error("Load Google GSI failed"));
    document.head.appendChild(script);
  });

  const handleGoogleLogin = async () => {
    try {
      isLoading.value = true; loginError.value = null;
      await initGoogleSignIn();
      if (!gsiInited) {
        window.google.accounts.id.initialize({
          client_id: "906002581004-c8p6pp86h4edksknu0dc3j2p8mtvtpjo.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        gsiInited = true;
      }
      window.google.accounts.id.prompt(); // hoặc renderButton ở component nút
    } catch (e) {
      console.error(e);
      loginError.value = "Không thể khởi tạo Google Login";
      isLoading.value = false;
    }
  };

  const handleGoogleResponse = async (response) => {
  try {
    const cred = response?.credential;
    if (!cred) { loginError.value = "Không nhận được thông tin xác thực từ Google"; return; }

    const payload = JSON.parse(b64urlDecode(cred.split(".")[1] || ""));
    if (!payload?.email) { loginError.value = "Không lấy được email từ Google"; return; }

    // Gọi proc
    await callAPI("WBH_US_CRT_GOOGLE_LOGIN", {
      params: {
        p_email: payload.email,
        p_hoveten: payload.name,
      },
    });

    // Dùng data.value giống useHomeLogic
    const result = data.value || [];
    const first = result[0]?.fields ?? result[0];

    if (first && first.id_tk) {
      const user = {
        ...first,
        google_name: payload.name,
        google_picture: payload.picture,
        google_email: payload.email,
        login_type: "google",
      };

      userData.value = user;
      login(user);  // useAuth sẽ lo lưu xuống localStorage/sessionStorage
      loginError.value = null;
    } else {
      loginError.value = "Không thể đăng nhập Google (DB không trả dữ liệu)";
    }
  } catch (e) {
    console.error("Lỗi đăng nhập Google:", e);
    loginError.value = "Lỗi đăng nhập Google";
  } finally {
    isLoading.value = false;
  }
};

  onUnmounted(() => {
    try { window.google?.accounts.id.disableAutoSelect?.(); } catch {}
  });

  return { userData, loginError, isLoading, handleGoogleLogin, handleGoogleResponse, initGoogleSignIn };
}

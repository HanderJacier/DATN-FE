<template>
  <div>
    <div ref="googleButtonRef" ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import Swal from "sweetalert2"
import { usePostData } from "@/components/component_callApi/callAPI"

const googleButtonRef = ref(null)
const GOOGLE_CLIENT_ID =
  "906002581004-c8p6pp86h4edksknu0dc3j2p8mtvtpjo.apps.googleusercontent.com"

let googleScript = null
const { data, callAPI } = usePostData()   // 👉 lấy cả data.value

// decode JWT base64url
function b64urlDecode(s) {
  if (!s) return ""
  s = s.replace(/-/g, "+").replace(/_/g, "/")
  const pad = s.length % 4
  if (pad) s += "=".repeat(4 - pad)
  try {
    return atob(s)
  } catch {
    return ""
  }
}

// tiện ích chuẩn hóa kết quả trả về
function pickFirstRow(raw) {
  if (!raw) return null
  if (Array.isArray(raw) && raw.length) return raw[0].fields ?? raw[0]
  if (raw.rows && raw.rows.length) return raw.rows[0].fields ?? raw.rows[0]
  if (raw.recordset && raw.recordset.length) return raw.recordset[0]
  return null
}

// load script GSI
const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }
    googleScript = document.createElement("script")
    googleScript.src = "https://accounts.google.com/gsi/client"
    googleScript.async = true
    googleScript.defer = true
    googleScript.onload = resolve
    googleScript.onerror = reject
    document.head.appendChild(googleScript)
  })
}

// init Google button
const initializeGoogleLogin = () => {
  if (!window.google || !googleButtonRef.value) return

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  })

  window.google.accounts.id.renderButton(googleButtonRef.value, {
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "rectangular",
    width: 320, // số, không phải "100%"
  })
}

// xử lý login callback
const handleGoogleResponse = async (response) => {
  if (!response?.credential) {
    return Swal.fire({
      icon: "error",
      title: "Không nhận được mã xác thực từ Google!",
    })
  }

  try {
    const payload = JSON.parse(b64urlDecode(response.credential.split(".")[1]))
    if (!payload?.email) {
      return Swal.fire({
        icon: "error",
        title: "Không lấy được email từ Google!",
      })
    }

    // gọi proc lưu/tạo user
    await callAPI("WBH_US_CRT_GOOGLE_LOGIN", {
      params: {
        p_email: payload.email,
        p_hoveten: payload.name,
      },
    })

    // đọc từ data.value
    const result = data.value || []
    const first = pickFirstRow(result)

    if (first && (first.id_tk != null || first.ID_TK != null)) {
      const user = {
        ...first,
        google_name: payload.name,
        google_picture: payload.picture,
        google_email: payload.email,
        login_type: "google",
      }

      // lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("isAuthenticated", "true")
      window.dispatchEvent(new Event("storage"))

      await Swal.fire({
        icon: "success",
        title: `Xin chào ${user.hoveten || payload.name}!`,
        timer: 1500,
        showConfirmButton: false,
      })

      window.location.reload()
    } else {
      Swal.fire({
        icon: "error",
        title: "Không thể đăng nhập Google (DB không trả dữ liệu)",
      })
    }
  } catch (err) {
    console.error("Google login error:", err)
    Swal.fire({
      icon: "error",
      title: "Lỗi xử lý Google Login!",
    })
  }
}

// lifecycle
onMounted(async () => {
  try {
    await loadGoogleScript()
    initializeGoogleLogin()
  } catch (error) {
    console.error("Failed to load Google script:", error)
  }
})

onUnmounted(() => {
  if (googleScript && googleScript.parentNode) {
    googleScript.parentNode.removeChild(googleScript)
  }
  try {
    window.google?.accounts.id.disableAutoSelect?.()
  } catch {}
})
</script>

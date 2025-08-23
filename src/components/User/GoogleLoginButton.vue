<template>
  <div class="w-100">
    <div ref="googleButtonRef" class="w-100"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'

const googleButtonRef = ref(null)

const GOOGLE_CLIENT_ID = "906002581004-c8p6pp86h4edksknu0dc3j2p8mtvtpjo.apps.googleusercontent.com"

let googleScript = null

const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.onload = resolve
    googleScript.onerror = reject
    document.head.appendChild(googleScript)
  })
}

const initializeGoogleLogin = () => {
  if (!window.google || !googleButtonRef.value) return

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  })

  window.google.accounts.id.renderButton(googleButtonRef.value, {
    theme: 'outline',
    size: 'large',
    width: '100%',
    text: 'signin_with',
    shape: 'rectangular'
  })
}

const handleGoogleResponse = async (response) => {
  if (!response.credential) {
    return Swal.fire({
      icon: "error",
      title: "Không nhận được mã xác thực từ Google!",
      customClass: {
        title: 'text-sm'
      }
    })
  }

  try {
    const decoded = JSON.parse(atob(response.credential.split('.')[1]))
    
    const googleUser = {
      id_tk: null,
      tendangnhap: decoded.email,
      matkhau: "google_auth",
      vaitro: 0,
      hoveten: decoded.name,
      sodienthoai: "không có",
      email: decoded.email,
      trangthai: 1,
      google_id: decoded.sub,
      avatar_url: decoded.picture,
      login_type: 'google'
    }

    localStorage.setItem('user', JSON.stringify(googleUser))
    localStorage.setItem('isAuthenticated', 'true')
    
    window.dispatchEvent(new Event('storage'))
    
    await Swal.fire({
      icon: "success",
      title: `Xin chào ${googleUser.hoveten}`,
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        title: 'text-sm'
      }
    })

    window.location.reload()

  } catch (error) {
    console.error("Google login error:", error)
    Swal.fire({
      icon: "error",
      title: "Lỗi xử lý thông tin người dùng Google!",
      customClass: {
        title: 'text-sm'
      }
    })
  }
}

onMounted(async () => {
  try {
    await loadGoogleScript()
    initializeGoogleLogin()
  } catch (error) {
    console.error('Failed to load Google script:', error)
  }
})

onUnmounted(() => {
  if (googleScript && googleScript.parentNode) {
    googleScript.parentNode.removeChild(googleScript)
  }
})
</script>

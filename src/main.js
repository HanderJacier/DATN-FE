import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap & Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// 👉 Import directive
import clickOutside from './directives/v-click-outside.js'

const app = createApp(App)

// 👉 Đăng ký directive
app.directive('click-outside', clickOutside)

// Mount app
app.use(router).mount('#app')

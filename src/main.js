import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// import bootstrap JS nếu bạn dùng tooltip/modal...
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


// import fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).use(router).mount('#app')


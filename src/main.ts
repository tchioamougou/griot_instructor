import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import  {  POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

const options: PluginOptions = {
  timeout: 5000,
  position: POSITION.BOTTOM_RIGHT,
}

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(Toast, options)
app.mount('#app')

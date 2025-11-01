import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { useToast } from 'vue-toast-notification'
import VueApexCharts from 'vue3-apexcharts'

import 'vue-toast-notification/dist/theme-default.css'
import './style.css'
createApp(App).use(store).use(router).use(useToast).use(VueApexCharts).mount('#app')

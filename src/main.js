import { createApp } from 'vue'
import { useToast } from 'vue-toast-notification'
import App from './App.vue'
import router from './router'
import store from './store'

import 'vue-toast-notification/dist/theme-default.css'

import './style.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(useToast)

app.mount('#app')

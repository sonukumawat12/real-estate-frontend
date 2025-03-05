import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.use(router)
app.use(Toast)
app.use(vuetify)

app.mount('#app')

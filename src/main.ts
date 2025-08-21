import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'
import App from './App.vue'
import { FontAwesomeIcon } from './plugins/fontawesome'

const app = createApp(App)

app.component('Icon', FontAwesomeIcon)

app.mount('#app')

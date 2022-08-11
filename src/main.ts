import { createApp } from 'vue'
import './style.css'
import 'normalize.css/normalize.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store from './store'

// antd
import 'ant-design-vue/es/message/style/index.css'

createApp(App).use(router).use(store).mount('#app')

import { createApp } from 'vue'
import './style.css'
import 'normalize.css/normalize.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store from './store'

// antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import registerComponents from './common/registerComponents'

const app = createApp(App)

app.use(Antd).use(registerComponents).use(router).use(store).mount('#app')

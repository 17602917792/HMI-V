import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import '@/custom-component' // 注册自定义组件

import '@/assets/iconfont/iconfont.css'
import '@/styles/animate.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/reset.css'

// 引入 vue-tag-textarea
import VueTagTextarea from 'vue-tag-textarea'
import 'vue-tag-textarea/lib/vue-tag-textarea.css'
// 导入rem适配方案
import 'amfe-flexible'
// 导入IP输入框
import KdIpInput from 'kd-ip-input'
// 导入权限配置
import '@/permission' 
// 导入自定义插件
import MyPlugins from './utils/index'

Vue.use(MyPlugins)
Vue.use(VueTagTextarea)
Vue.use(KdIpInput)
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})

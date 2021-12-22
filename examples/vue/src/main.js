import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import { store } from './store'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import './index.less'

Vue.use(VueRouter)
Vue.use(Element)
Vue.config.productionTip = false

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

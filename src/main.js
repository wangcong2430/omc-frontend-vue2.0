import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import '@/utils/import-sentry'

import './auth/permission' // permission control at first

import './styles/theme.less'
import './styles/index.less'
import './styles/reset-antd.less'

// load antd components as lazy
import './utils/lazy-load-antd'

// load highcharts
import './utils/load-highcharts'

import * as filters from './filters' // global filters
import '@/directive/permission/index'

import '@/utils/import-aegis'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

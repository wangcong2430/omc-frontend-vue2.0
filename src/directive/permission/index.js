import Vue from 'vue'
import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
}

Vue.use(install)

permission.install = install
export default permission

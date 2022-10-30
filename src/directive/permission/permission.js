import store from '@/store'

/**
 * 权限类型：menu/system-系统配置
 */
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const perms = store.getters && store.getters.perms

    if (value && value instanceof Array && value.length > 0) {
      const permission = value

      const hasPermission = perms.some(perm => {
        if (!perm.includes('*')) {
          return permission.includes(perm)
        }
        const reg = new RegExp(perm.replace(/(\*)/g, '.*'))
        if (Array.isArray(permission)) {
          return permission.findIndex(p => reg.test(p)) > -1
        }
        return false
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need perms! Like v-permission="['xxx']"`)
    }
  }
}

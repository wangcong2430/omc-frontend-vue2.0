import router from '../router'
import store from '../store/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { checkEntryStatus } from '@/utils/permission'
import { microAppPaths } from '@/utils/micro-config'

let requestIndex = 0 // 请求重试次数
/**
 * Use meta.perms to determine if the current user has permission
 * @param perms the permissions of current user
 * @param route the current route
 */
function hasPermission(perms, route) {
  // return false
  if (route.meta && route.meta.perms) {
    // const permStatus = perms.some(perm => route.meta.perms.includes(perm))
    const permStatus = perms.some(perm => {
      if (!perm.includes('*')) {
        return route.meta.perms.includes(perm)
      }
      const reg = new RegExp(perm.replace(/(\*)/g, '.*'))
      if (Array.isArray(route.meta.perms)) {
        return route.meta.perms.findIndex(p => reg.test(p)) > -1
      }
      return false
    })
    const isRootPerm = perms.some(perm => perm === 'menu/system')
    // check entry open status when the route is `ContentBudget` or `ResearchBudget`
    if (route.name === 'ContentBudget') {
      // Don't close when the user role is root
      return (checkEntryStatus('cp') && permStatus) || isRootPerm
    }
    if (route.name === 'ResearchBudget') {
      return (checkEntryStatus('rd') && permStatus) || isRootPerm
    }
    return permStatus
  } else {
    return true
  }
}

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  const hasPerms = store.getters.perms && store.getters.perms.length > 0

  if (!hasPerms && requestIndex < 3) {
    if (requestIndex < 3) { // 最多重试获取权限信息3次
      try {
        const perms = await store.dispatch('user/getUserPerms')
        const accessRoutes = await store.dispatch('permission/generateRoutes', perms)
        router.addRoutes(accessRoutes)

        // // Get entry setting
        await store.dispatch('omc/getEntrySetting')

        next({ ...to, replace: true })
      } catch (error) {
        NProgress.done()
      } finally {
        requestIndex += 1
      }
    } else {
      next({ path: '/401' })
      NProgress.done()
    }
  } else {
    if (hasPermission(store.getters.perms, to)) {
      if (to.name) {
        // 主应用
        next()
        return
      } else if (
        microAppPaths.some((item) => to.path.includes(item)) &&
        to.meta.mode === 'micro'
      ) {
        // 子应用
        next()
        return
      } else {
        next({ path: '/404' })
        NProgress.done()
        return
      }
    } else {
      next({ path: '/401' })
      NProgress.done()
    }

    if (to.name) {
      next({ path: '/404' })
      NProgress.done()
      return
    }
    next()
    NProgress.done()
  }
})

router.afterEach((to) => {
  // finish progress bar
  NProgress.done()
})

router.onError((error) => {
  const pattern = /Loading chunk chunk-(\w)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

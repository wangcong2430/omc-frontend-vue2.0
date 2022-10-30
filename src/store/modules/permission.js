import { constantRoutes, asyncRoutes, resetRouter } from '@/router/index'

function hasPermission(perms, route) {
  if (route.meta && route.meta.perms) {
    return perms.some(perm => {
      if (!perm.includes('*')) {
        return route.meta.perms.includes(perm)
      }
      const reg = new RegExp(perm.replace(/(\*)/g, '.*'))
      if (Array.isArray(route.meta.perms)) {
        return route.meta.perms.findIndex(p => reg.test(p)) > -1
      }
      return false
    })
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, perms) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(perms, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, perms)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, perms) {
    // 生成新的路由之前需要清除旧的路由，避免重复生成
    resetRouter()
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, perms)

    return new Promise(resolve => {
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

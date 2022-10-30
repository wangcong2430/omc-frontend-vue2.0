import Cookies from 'js-cookie'
import { set } from 'lodash/object'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false
  },
  cachedViews: [],
  badge: [] // 包括route和badge两个key，其中route是路由表中路由项的name, badge是数据
}

const mutations = {
  TOGGLE_SIDEBAR: (state, status) => {
    state.sidebar.opened = status || !state.sidebar.opened
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (view.meta && view.meta.cache) {
      state.cachedViews.push(view.name)
    }
  },
  SET_BADGE: (state, { route, badge }) => {
    const targetIndex = state.badge.findIndex(item => item.route === route)
    if (targetIndex !== -1) {
      state.badge = set(state.badge, [targetIndex, 'badge'], badge)
    } else {
      state.badge.push({
        route,
        badge
      })
    }
  }
}

const actions = {
  toggleSideBar({ commit }, status) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }) {
    commit('CLOSE_SIDEBAR')
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  // 设置sidebar中的badge的数据
  setBadge({ commit }, { route, badge }) {
    commit('SET_BADGE', { route, badge })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// 个人工作台store
import { getSummary } from '@/api/workflow'
import { getWbpCount } from '@/api/workbench'

const state = {
  wbpVerifyCount: {
    doingCout: 0,
    demandCount: 0,
    approveCount: 0,
    allCount: 0
  },
  wbpChangeCount: {
    auditCount: 0,
    personCount: 0,
    allCount: 0
  },
  wbpTotalCount: 0,
  iomcTodoCount: 0,
  iomcDoneCount: 0
}

const mutations = {
  SET_WBPVERIFY_COUNT: (state, data) => {
    state.wbpVerifyCount = data
  },
  SET_WBPCHANGE_COUNT: (state, data) => {
    state.wbpChangeCount = data
  },
  SET_WBPTOTAL_COUNT: (state, data) => {
    state.wbpTotalCount = data
  },
  SET_IOMC_TODO_COUNT: (state, data) => {
    state.iomcTodoCount = data
  },
  SET_IOMC_DONE_COUNT: (state, data) => {
    state.iomcDoneCount = data
  }
}

const actions = {
  getTodoCount({ commit, state }) {
    console.log('getTodoCount')
    getSummary(1).then(res => {
      const { content } = res
      if (!content) {
        return
      }
      const count = content.reduce((acc, cur) => {
        return acc + cur.count
      }, 0)
      commit('SET_IOMC_TODO_COUNT', count)
      commit('app/SET_BADGE', { route: 'Workbench', badge: count + state.wbpTotalCount }, { root: true })
    })
  },
  getDoneCount({ commit, state }) {
    console.log('getDoneCount')
    getSummary(2).then(res => {
      const { content } = res
      if (!content) {
        return
      }
      const count = content.reduce((acc, cur) => {
        return acc + cur.count
      }, 0)
      commit('SET_IOMC_DONE_COUNT', count)
    })
  },
  getWbpCount({ commit, state, rootState }) {
    getWbpCount().then(res => {
      const wbpVerifyCount = {
        doingCout: 0,
        demandCount: 0,
        approveCount: 0,
        allCount: 0
      }
      const wbpChangeCount = {
        auditCount: 0,
        personCount: 0,
        allCount: 0
      }
      let totalCount = 0
      let iomcCount = 0
      const { content } = res
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (item.tab === 'verify' && item.flow === 11010) {
            wbpVerifyCount.doingCout = item.count
          } else if (item.tab === 'verify' && item.flow === 11000) {
            wbpVerifyCount.demandCount = item.count
          } else if (item.tab === 'verify' && item.flow === 11300) {
            wbpVerifyCount.approveCount = item.count
          } else if (item.tab === 'change' && item.flow === 10930) {
            wbpChangeCount.auditCount = item.count
          } else if (item.tab === 'change' && item.flow === 10910) {
            wbpChangeCount.personCount = item.count
          }

          totalCount += item.count
        })

        // 设置WBP验收和变更的总数
        wbpVerifyCount.allCount = wbpVerifyCount.doingCout + wbpVerifyCount.demandCount + wbpVerifyCount.approveCount
        wbpChangeCount.allCount = wbpChangeCount.auditCount + wbpChangeCount.personCount

        const workbenchBadge = rootState.app.badge.find(item => item.route === 'Workbench')
        if (workbenchBadge) {
          iomcCount = workbenchBadge.badge
        }
        commit('SET_WBPVERIFY_COUNT', wbpVerifyCount)
        commit('SET_WBPCHANGE_COUNT', wbpChangeCount)
        commit('SET_WBPTOTAL_COUNT', totalCount)
        commit('app/SET_BADGE', { route: 'Workbench', badge: totalCount + iomcCount }, { root: true })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

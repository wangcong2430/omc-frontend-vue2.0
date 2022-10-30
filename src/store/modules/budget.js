// budget store
import { getFinanceProduct, getDepart, getCoscenter } from '@/api/budget/index'
import { getRelateProject } from '@/api/budget/research'

const state = {
  orgId: '', // 选择的部门的id
  orgName: '', // 选择的部门的名称
  productCodesOpt: [],
  productNames: [],
  coscenterLists: [],
  subordinate: [],
  departments: [], // 部门列表
  costCenters: [], // 成本中心列表
  relateProject: [] // 关联历史项目列表
}

const mutations = {
  SET_SELECTED_ORG: (state, { id, name }) => {
    state.orgId = id
    state.orgName = name
  },
  GET_PRODUCT_CODES: (state, data) => {
    state.productCodesOpt = data
  },
  SET_PRODUCT_NAMES: (state, data) => {
    state.productNames = data
  },
  SET_COSCENTER_LISTS: (state, data) => {
    state.coscenterLists = data
  },
  SET_SUBORDINATE: (state, data) => {
    state.subordinate = data
  },
  SET_DEPARTMETS: (state, data) => {
    state.departments = data
  },
  SET_COST_CENTERS: (state, data) => {
    state.costCenters = data
  },
  SET_RELATE_PROJECT: (state, data) => {
    state.relateProject = data
  }
}

const actions = {
  setSelectedOrg({ commit }, { id, name }) {
    commit('SET_SELECTED_ORG', { id, name })
  },
  getProductCodes({ commit }) {
    return new Promise((resolve, reject) => {
      getFinanceProduct().then(res => {
        const { data } = res
        const productNames = []
        const productCodesOpt = data.map(item => {
          productNames.push({
            code: item.product_code,
            name: item.product_name
          })
          return {
            value: item.product_code,
            label: `${item.product_code}(${item.product_name})`
          }
        })
        commit('GET_PRODUCT_CODES', productCodesOpt)
        commit('SET_PRODUCT_NAMES', productNames)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getCoscenterLists({ commit }, id) {
    if (!id) {
      return
    }
    return new Promise((resolve, reject) => {
      getCoscenter(id).then(res => {
        const { data } = res
        const coscenterLists = []
        const costCenters = []
        data.forEach(item => {
          coscenterLists.push({
            id: item.cost_center_code,
            value: item.cost_center_name,
            label: item.cost_center_name
          })
          costCenters.push({
            label: item.cost_center_name,
            value: item.cost_center_code
          })
        })
        commit('SET_COSCENTER_LISTS', coscenterLists)
        commit('SET_COST_CENTERS', costCenters)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDepart({ commit }) {
    return new Promise((resolve, reject) => {
      getDepart().then(res => {
        const { data } = res
        const subordinate = []
        const departments = []
        data.forEach(item => {
          subordinate.push({
            id: item.depart_id,
            label: item.depart_name,
            value: item.depart_name
          })
          departments.push({
            label: item.depart_name,
            value: item.depart_id
          })
        })
        commit('SET_SUBORDINATE', subordinate)
        commit('SET_DEPARTMETS', departments)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getRelateProject({ commit }) {
    return new Promise((resolve, reject) => {
      getRelateProject().then(res => {
        const { data } = res
        const relateProjectOpt = data.map(item => {
          return {
            id: item.id,
            label: item.project_name,
            value: item.project_name
          }
        })
        commit('SET_RELATE_PROJECT', relateProjectOpt)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 重置内容制作费预算填报数据
  resetContentData({ dispatch, commit, rootState }) {
    // 设置默认部门信息
    commit('SET_SELECTED_ORG', { id: rootState['user'].departmentId, name: rootState['user'].departmentName })
    // 重置预算填报表单
    commit('content/SET_CONTENT_FORMS', [], { root: true })
    // 重置是否是填报/编辑预算
    commit('content/CHANGE_IS_EDIT', false, { root: true })
    // 重置预算年份
    commit('content/SET_BUDGET_YEAR', new Date().getFullYear() + 1, { root: true })
    // 重置成本中心数据
    dispatch('getCoscenterLists', rootState['user'].departmentId)
  },
  // 重置研发费预算填报数据
  resetResearchData({ dispatch, commit, rootState }) {
    // 设置默认部门信息
    commit('SET_SELECTED_ORG', { id: rootState['user'].departmentId, name: rootState['user'].departmentName })
    // 重置预算填报表单
    commit('research/SET_RESEARCH_FORMS', [], { root: true })
    // 重置是否是填报/编辑预算
    commit('research/CHANGE_IS_EDIT', false, { root: true })
    // 重置预算年份
    commit('research/SET_BUDGET_YEAR', new Date().getFullYear() + 1, { root: true })
    // 重置成本中心数据
    dispatch('getCoscenterLists', rootState['user'].departmentId)
  },
  // 重置外包人力预算填报数据
  resetOutsourceTable({ commit }) {
    commit('outsource/RESET_OUTSOURCE_TABLE', null, { root: true })
  },
  // 重置内容制作费预算追加数据
  resetContentIncrease({ dispatch, commit, rootState }) {
    // 设置默认部门信息
    commit('SET_SELECTED_ORG', { id: rootState['user'].departmentId, name: rootState['user'].departmentName })
    // 重置预算填报表单
    commit('contentIncrease/SET_CONTENT_FORMS', [], { root: true })
    // 重置追加申请信息
    commit('contentIncrease/RESET_ADDITIONAL', null, { root: true })
    // 重置是否是追加/编辑预算
    commit('contentIncrease/CHANGE_IS_EDIT', false, { root: true })
    // 重置预算年份
    commit('contentIncrease/SET_BUDGET_YEAR', new Date().getFullYear() + 1, { root: true })
    // 重置成本中心数据
    dispatch('getCoscenterLists', rootState['user'].departmentId)
  },
  // 重置研发预算追加数据
  resetResearchIncrease({ dispatch, commit, rootState }) {
    // 设置默认部门信息
    commit('SET_SELECTED_ORG', { id: rootState['user'].departmentId, name: rootState['user'].departmentName })
    // 重置预算填报表单
    commit('researchIncrease/SET_RESEARCH_FORMS', [], { root: true })
    // 重置追加申请信息
    commit('researchIncrease/RESET_ADDITIONAL', null, { root: true })
    // 重置是否是追加/编辑预算
    commit('researchIncrease/CHANGE_IS_EDIT', false, { root: true })
    // 重置预算年份
    commit('researchIncrease/SET_BUDGET_YEAR', new Date().getFullYear() + 1, { root: true })
    // 重置成本中心数据
    dispatch('getCoscenterLists', rootState['user'].departmentId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// 研发费store
import { getMaterialCategory } from '@/api/budget/research'
import {
  addCenter,
  deleteCenter,
  addBudget,
  deleteBudget,
  addChild,
  deleteChild,
  addAttaments,
  deleteAttaments,
  setFormItem
} from '@/utils/form'

const state = {
  researchForms: [],
  materialData: [],
  materialOpt: [],
  isEdit: false, // 是否是编辑预算
  budgetYear: new Date().getFullYear() + 1 // 预算年份
}

const mutations = {
  SET_RESEARCH_FORMS: (state, data) => {
    state.researchForms = data
  },
  ADD_CENTER: (state, data) => {
    const form = addCenter(state.researchForms, data)
    state.researchForms = form
  },
  DELETE_CENTER: (state, index) => {
    const form = deleteCenter(state.researchForms, index)
    state.researchForms = form
  },
  ADD_BUDGET: (state, { centerId, data }) => {
    const form = addBudget(state.researchForms, centerId, data)
    state.researchForms = form
  },
  DELETE_BUDGET: (state, { centerId, projectId }) => {
    const form = deleteBudget(state.researchForms, centerId, projectId)
    state.researchForms = form
  },
  ADD_CHILD: (state, { centerId, projectId, data }) => {
    const form = addChild(state.researchForms, centerId, projectId, data)
    state.researchForms = form
  },
  DELETE_CHILD: (state, { centerId, projectId, childId }) => {
    const form = deleteChild(state.researchForms, centerId, projectId, childId)
    state.researchForms = form
  },
  ADD_ATTAMENTS: (state, { centerId, projectId, data }) => {
    const form = addAttaments(state.researchForms, centerId, projectId, data)
    state.researchForms = form
  },
  DELETE_ATTAMENTS: (state, { centerId, projectId, fileId }) => {
    const form = deleteAttaments(state.researchForms, centerId, projectId, fileId)
    state.researchForms = form
  },
  OPEN_CENTER_CONTENT: (state, id) => {
    const form = state.researchForms.map((item, index) => {
      if (index === id) {
        return Object.assign(item, { open: !item.open })
      } else {
        return item
      }
    })
    state.researchForms = form
  },
  EDIT_CENTER_NAME: (state, { index, cost_center_code, name }) => {
    const form = state.researchForms.map((item, i) => {
      if (i === index) {
        return Object.assign(item, { cost_center_code, name })
      } else {
        return item
      }
    })
    state.researchForms = form
  },
  // 更新表单项数据
  SET_REACH_FORM_ITEM: (state, { centerId, projectId, childId, formName, formValue }) => {
    const form = setFormItem(state.researchForms, centerId, projectId, childId, formName, formValue)
    state.researchForms = form
  },
  SET_MATERIAL_DATA: (state, data) => {
    state.materialData = data
  },
  SET_MATERIAL_OPT: (state, data) => {
    state.materialOpt = data
  },
  CHANGE_IS_EDIT: (state, status) => {
    state.isEdit = status
  },
  SET_BUDGET_YEAR: (state, year) => {
    if (year) {
      state.budgetYear = year
    }
  }
}

const actions = {
  setResearchForms({ commit }, data) {
    commit('SET_RESEARCH_FORMS', data)
  },
  addCenter({ commit }, data) {
    commit('ADD_CENTER', data)
  },
  deleteCenter({ commit }, index) {
    commit('DELETE_CENTER', index)
  },
  addBudget({ commit }, { centerId, data }) {
    commit('ADD_BUDGET', { centerId, data })
  },
  deleteBudget({ commit }, { centerId, projectId }) {
    commit('DELETE_BUDGET', { centerId, projectId })
  },
  addChild({ commit }, { centerId, projectId, data }) {
    commit('ADD_CHILD', { centerId, projectId, data })
  },
  deleteChild({ commit }, { centerId, projectId, childId }) {
    commit('DELETE_CHILD', { centerId, projectId, childId })
  },
  addAttaments({ commit }, { centerId, projectId, data }) {
    commit('ADD_ATTAMENTS', { centerId, projectId, data })
  },
  deleteAttaments({ commit }, { centerId, projectId, fileId }) {
    commit('DELETE_ATTAMENTS', { centerId, projectId, fileId })
  },
  openCenterContent({ commit }, id) {
    commit('OPEN_CENTER_CONTENT', id)
  },
  editCenterName({ commit }, { index, cost_center_code, name }) {
    commit('EDIT_CENTER_NAME', { index, cost_center_code, name })
  },
  setReachFormItem({ commit }, { centerId, projectId, childId, formName, formValue }) {
    commit('SET_REACH_FORM_ITEM', { centerId, projectId, childId, formName, formValue })
  },
  getMaterialCategory({ commit }) {
    return new Promise((resolve, reject) => {
      getMaterialCategory().then(res => {
        const { data } = res
        const parseData = JSON.parse(data)
        const materialOpt = parseData.map(item => {
          return {
            value: item.cate_name,
            label: item.cate_name,
            children: item.child ? item.child.map(list => {
              return {
                value: list.cate_name,
                label: list.cate_name
              }
            }) : []
          }
        })
        commit('SET_MATERIAL_DATA', parseData)
        commit('SET_MATERIAL_OPT', materialOpt)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  changeIsEdit({ commit }, status) {
    commit('CHANGE_IS_EDIT', status)
  },
  setBudgetYear({ commit }, year) {
    commit('SET_BUDGET_YEAR', year)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

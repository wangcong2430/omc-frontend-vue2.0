// 内容制作费预算store
import { getCpCategory } from '@/api/budget/content'
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
  contentForms: [],
  categoryOpt: [],
  isEdit: false, // 是否是编辑预算
  budgetYear: new Date().getFullYear() + 1 // 预算年份
}

const mutations = {
  SET_CONTENT_FORMS: (state, data) => {
    state.contentForms = data
  },
  ADD_CENTER: (state, data) => {
    const form = addCenter(state.contentForms, data)
    state.contentForms = form
  },
  DELETE_CENTER: (state, index) => {
    const form = deleteCenter(state.contentForms, index)
    state.contentForms = form
  },
  ADD_BUDGET: (state, { centerId, data }) => {
    const form = addBudget(state.contentForms, centerId, data)
    state.contentForms = form
  },
  DELETE_BUDGET: (state, { centerId, projectId }) => {
    const form = deleteBudget(state.contentForms, centerId, projectId)
    state.contentForms = form
  },
  ADD_CHILD: (state, { centerId, projectId, data }) => {
    const form = addChild(state.contentForms, centerId, projectId, data)
    state.contentForms = form
  },
  DELETE_CHILD: (state, { centerId, projectId, childId }) => {
    const form = deleteChild(state.contentForms, centerId, projectId, childId)
    state.contentForms = form
  },
  ADD_ATTAMENTS: (state, { centerId, projectId, data }) => {
    const form = addAttaments(state.contentForms, centerId, projectId, data)
    state.contentForms = form
  },
  DELETE_ATTAMENTS: (state, { centerId, projectId, fileId }) => {
    const form = deleteAttaments(state.contentForms, centerId, projectId, fileId)
    state.contentForms = form
  },
  OPEN_CENTER_CONTENT: (state, id) => {
    const form = state.contentForms.map((item, index) => {
      if (index === id) {
        return Object.assign(item, { open: !item.open })
      } else {
        return item
      }
    })
    state.contentForms = form
  },
  EDIT_CENTER_NAME: (state, { index, cost_center_code, name }) => {
    const form = state.contentForms.map((item, i) => {
      if (i === index) {
        return Object.assign(item, { cost_center_code, name })
      } else {
        return item
      }
    })
    state.contentForms = form
  },
  // 更新表单项数据
  SET_CONTENT_FORM_ITEM: (state, { centerId, projectId, childId, formName, formValue }) => {
    const form = setFormItem(state.contentForms, centerId, projectId, childId, formName, formValue)
    state.contentForms = form
  },
  SET_CATEGORY_OPT: (state, data) => {
    state.categoryOpt = data
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
  setContentForms({ commit }, data) {
    commit('SET_CONTENT_FORMS', data)
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
  setContentFormItem({ commit }, { centerId, projectId, childId, formName, formValue }) {
    commit('SET_CONTENT_FORM_ITEM', { centerId, projectId, childId, formName, formValue })
  },
  getCpCategory({ commit }) {
    return new Promise((resolve, reject) => {
      getCpCategory().then(res => {
        const { data } = res
        const parseData = JSON.parse(data)
        commit('SET_CATEGORY_OPT', parseData)
        resolve(parseData)
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

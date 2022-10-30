// 研发费预算追加Store
import {
  addCenter,
  deleteCenter,
  addBudget,
  deleteBudget,
  addChild,
  deleteChild,
  addAttaments,
  deleteAttaments,
  setFormItem,
  setAdditionalInfo
} from '@/utils/form'

const state = {
  contentIncreaseForms: [],
  additionalReason: '', // 申请追加原因
  additionalCause: '', // 申请追加事由
  isEdit: false, // 是否是编辑/追加预算
  budgetYear: new Date().getFullYear() + 1 // 预算年份
}

const mutations = {
  SET_CONTENT_FORMS: (state, data) => {
    state.contentIncreaseForms = data
  },
  ADD_CENTER: (state, data) => {
    const form = addCenter(state.contentIncreaseForms, data)
    state.contentIncreaseForms = form
  },
  DELETE_CENTER: (state, index) => {
    const form = deleteCenter(state.contentIncreaseForms, index)
    state.contentIncreaseForms = form
  },
  ADD_BUDGET: (state, { centerId, data }) => {
    const form = addBudget(state.contentIncreaseForms, centerId, data)
    state.contentIncreaseForms = form
  },
  DELETE_BUDGET: (state, { centerId, projectId }) => {
    const form = deleteBudget(state.contentIncreaseForms, centerId, projectId)
    state.contentIncreaseForms = form
  },
  ADD_CHILD: (state, { centerId, projectId, data }) => {
    const form = addChild(state.contentIncreaseForms, centerId, projectId, data)
    state.contentIncreaseForms = form
  },
  DELETE_CHILD: (state, { centerId, projectId, childId }) => {
    const form = deleteChild(state.contentIncreaseForms, centerId, projectId, childId)
    state.contentIncreaseForms = form
  },
  ADD_ATTAMENTS: (state, { centerId, projectId, data }) => {
    const form = addAttaments(state.contentIncreaseForms, centerId, projectId, data)
    state.contentIncreaseForms = form
  },
  DELETE_ATTAMENTS: (state, { centerId, projectId, fileId }) => {
    const form = deleteAttaments(state.contentIncreaseForms, centerId, projectId, fileId)
    state.contentIncreaseForms = form
  },
  OPEN_CENTER_CONTENT: (state, id) => {
    const form = state.contentIncreaseForms.map((item, index) => {
      if (index === id) {
        return Object.assign(item, { open: !item.open })
      } else {
        return item
      }
    })
    state.contentIncreaseForms = form
  },
  EDIT_CENTER_NAME: (state, { index, cost_center_code, name }) => {
    const form = state.contentIncreaseForms.map((item, i) => {
      if (i === index) {
        return Object.assign(item, { cost_center_code, name })
      } else {
        return item
      }
    })
    state.contentIncreaseForms = form
  },
  // 更新表单项数据
  SET_CONTENT_FORM_ITEM: (state, { centerId, projectId, childId, formName, formValue }) => {
    const form = setFormItem(state.contentIncreaseForms, centerId, projectId, childId, formName, formValue)
    state.contentIncreaseForms = form
  },
  SET_ADDITIONAL_REASON: (state, msg) => {
    state.additionalReason = msg
  },
  SET_ADDITIONAL_CAUSE: (state, msg) => {
    state.additionalCause = msg
  },
  RESET_ADDITIONAL: (state) => {
    state.additionalReason = ''
    state.additionalCause = ''
  },
  SET_ADDITIONAL_INFO: (state, data) => {
    const form = setAdditionalInfo(state.contentIncreaseForms, data)
    state.contentIncreaseForms = form
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
  setAdditionalReason({ commit }, msg) {
    commit('SET_ADDITIONAL_REASON', msg)
  },
  setAdditionalCause({ commit }, msg) {
    commit('SET_ADDITIONAL_CAUSE', msg)
  },
  resetAdditional({ commit }) {
    commit('RESET_ADDITIONAL')
  },
  setAdditionalInfo({ commit }, data) {
    commit('SET_ADDITIONAL_INFO', data)
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

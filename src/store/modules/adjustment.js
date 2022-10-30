// 预算调整store
import { setFormItem } from '@/utils/form'
import { set } from 'lodash/object'

const state = {
  adjustedProject: [],
  adjustedKey: [],
  adjustForm: [],
  adjustReason: '', // 预算调整原因
  adjustCause: '', // 预算调整事由
  editId: '', // 编辑id
  isEdit: false // 是否是编辑预算调整
}

const mutations = {
  SET_ADJUSTED_PROJECT: (state, data) => {
    state.adjustedProject = data
  },
  DEL_ADJUSTED_PROJECT: (state, key) => {
    const project = state.adjustedProject.filter(item => item.key !== key)
    state.adjustedProject = project
  },
  SET_ADJUSTED_KEY: (state, data) => {
    state.adjustedKey = data
  },
  DEL_ADJUSTED_KEY: (state, key) => {
    const keys = state.adjustedKey.filter(item => item !== key)
    state.adjustedKey = keys
  },
  SET_ADJUST_FORM: (state, data) => {
    state.adjustForm = data
  },
  SET_ADJUST_FORM_ITEM: (state, { centerId, projectId, childId, formName, formValue }) => {
    const form = setFormItem(state.adjustForm, centerId, projectId, childId, formName, formValue)
    state.adjustForm = form
  },
  OPEN_CENTER_CONTENT: (state, id) => {
    const form = set(state.adjustForm, [id, 'open'], !state.adjustForm[id].open)
    state.adjustForm = form
  },
  SET_ADJUST_REASON: (state, msg) => {
    state.adjustReason = msg
  },
  SET_ADJUST_CAUSE: (state, msg) => {
    state.adjustCause = msg
  },
  CHANGE_IS_EDIT: (state, status) => {
    state.isEdit = status
  },
  SET_EDIT_ID: (state, id) => {
    state.editId = id
  },
  RESET_ADJUST_INFO: (state) => {
    state.adjustReason = ''
    state.adjustCause = ''
  }
}

const actions = {
  setAdjustedProject({ commit }, data) {
    commit('SET_ADJUSTED_PROJECT', data)
  },
  delAdjustedProject({ commit }, key) {
    commit('DEL_ADJUSTED_PROJECT', key)
  },
  setAdjustedKey({ commit }, data) {
    commit('SET_ADJUSTED_KEY', data)
  },
  delAdjustedKey({ commit }, key) {
    commit('DEL_ADJUSTED_KEY', key)
  },
  setAdjustForm({ commit }, data) {
    commit('SET_ADJUST_FORM', data)
  },
  setAdjustFormItem({ commit }, { centerId, projectId, childId, formName, formValue }) {
    commit('SET_ADJUST_FORM_ITEM', { centerId, projectId, childId, formName, formValue })
  },
  openCenterContent({ commit }, id) {
    commit('OPEN_CENTER_CONTENT', id)
  },
  setAdjustReason({ commit }, msg) {
    commit('SET_ADJUST_REASON', msg)
  },
  setAdjustCause({ commit }, msg) {
    commit('SET_ADJUST_CAUSE', msg)
  },
  changeIsEdit({ commit }, status) {
    commit('CHANGE_IS_EDIT', status)
  },
  setEditId({ commit }, id) {
    commit('SET_EDIT_ID', id)
  },
  resetAdjustInfo({ commit }) {
    commit('RESET_ADJUST_INFO')
  },
  resetAdjust({ commit }) {
    commit('SET_ADJUSTED_PROJECT', [])
    commit('SET_ADJUSTED_KEY', [])
    commit('SET_ADJUST_FORM', [])
    commit('RESET_ADJUST_INFO')
    commit('CHANGE_IS_EDIT', false)
    commit('SET_EDIT_ID', '')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

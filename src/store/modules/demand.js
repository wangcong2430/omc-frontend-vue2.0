// demand store
import {
  addCenter,
  deleteCenter,
  setFormItem
} from '@/utils/form'

const state = {
  selectedProject: {},
  consumeStat: [],
  selectedConsumeStat: {},
  consumeDetail: {
    name: '',
    description: '',
    is_base: undefined,
    pm_name: '',
    receiver_names: [],
    purchaser: '',
    begin_date: '',
    end_date: '',
    attachments: [],
    apply_for: '', // 经办人
    verify_reviewers: '' // 指定需求审核人
  },
  detailForms: [],
  isEdit: false,
  isReEdit: false, // 是否是驳回重新编辑
  reEditMaterialBillNos: [],
  isConsumeModify: false // 是否是需求修改，需求修改只支持需求预估金额，并只能调大
}

const mutations = {
  SET_SELECTED_PRO: (state, pro) => {
    state.selectedProject = pro
  },
  SET_CONSUME_STAT: (state, data) => {
    state.consumeStat = data
  },
  SET_SELECTED_CONSUME_STAT: (state, data) => {
    state.selectedConsumeStat = data
  },
  SET_CONSUME_DETAIL: (state, detail) => {
    state.consumeDetail = detail
  },
  SET_ATTACHMENTS: (state, data) => {
    state.consumeDetail.attachments = data
  },
  ADD_ATTACHMENT: (state, { data }) => {
    state.consumeDetail.attachments = [...state.consumeDetail.attachments, data]
  },
  DEL_ATTACHMENT: (state, index) => {
    state.consumeDetail.attachments.splice(index, 1)
  },
  SET_DETAIL_FORMS: (state, data) => {
    state.detailForms = data
  },
  ADD_DETAIL: (state, data) => {
    const form = addCenter(state.detailForms, data)
    state.detailForms = form
  },
  DELETE_DETAIL: (state, index) => {
    const form = deleteCenter(state.detailForms, index)
    state.detailForms = form
  },
  RESET_DETAIL: (state) => {
    state.detailForms = []
  },
  SET_DEMAND_FORM_ITEM: (state, { index, formName, formValue }) => {
    const form = setFormItem(state.detailForms, index, undefined, undefined, formName, formValue)
    state.detailForms = form
  },
  // 设置需求属性动态表单字段
  SET_PROPERTY_FORM_ITEM: (state, { detailIndex, propertyIndex, fieldIndex, formName, formValue }) => {
    const form = setFormItem(state.detailForms, detailIndex, propertyIndex, fieldIndex, formName, formValue, 'attributes', 'fields')
    state.detailForms = form
  },
  SET_IS_EDIT: (state, status) => {
    state.isEdit = status
  },
  SET_IS_REEDIT: (state, status) => {
    state.isReEdit = status
  },
  SET_REEDIT_MATERIAL_BILLNOS: (state, data) => {
    state.reEditMaterialBillNos = data
  },
  SET_IS_CONSUME_MODIFY: (state, status) => {
    state.isConsumeModify = status
  }
}

const actions = {
  setSelectedPro({ commit }, pro) {
    commit('SET_SELECTED_PRO', pro)
  },
  setConsumeStat({ commit }, data) {
    commit('SET_CONSUME_STAT', data)
  },
  setSelectedConsumeStat({ commit }, data) {
    commit('SET_SELECTED_CONSUME_STAT', data)
  },
  setConsumeDetail({ commit }, detail) {
    commit('SET_CONSUME_DETAIL', detail)
  },
  setAttachments({ commit }, data) {
    commit('SET_ATTACHMENTS', data)
  },
  addAttachment({ commit }, { data }) {
    commit('ADD_ATTACHMENT', { data })
  },
  delAttachment({ commit }, index) {
    commit('DEL_ATTACHMENT', index)
  },
  setDetailForms({ commit }, data) {
    commit('SET_DETAIL_FORMS', data)
  },
  addDetail({ commit }, data) {
    commit('ADD_DETAIL', data)
  },
  deleteDetail({ commit }, index) {
    commit('DELETE_DETAIL', index)
  },
  resetDetail({ commit }) {
    commit('RESET_DETAIL')
  },
  setDemandFormItem({ commit }, { index, formName, formValue }) {
    commit('SET_DEMAND_FORM_ITEM', { index, formName, formValue })
  },
  setPropertyFormItem({ commit }, { detailIndex, propertyIndex, fieldIndex, formName, formValue }) {
    commit('SET_PROPERTY_FORM_ITEM', { detailIndex, propertyIndex, fieldIndex, formName, formValue })
  },
  setIsEdit({ commit }, status) {
    commit('SET_IS_EDIT', status)
  },
  setIsReEdit({ commit }, status) {
    commit('SET_IS_REEDIT', status)
  },
  setReEditMaterialBillNos({ commit }, data) {
    commit('SET_REEDIT_MATERIAL_BILLNOS', data)
  },
  setIsConsumeModify({ commit }, status) {
    commit('SET_IS_CONSUME_MODIFY', status)
  },
  resetDemandForm({ commit }) {
    commit('SET_CONSUME_DETAIL', {
      name: '',
      pm_name: '',
      receiver_names: '',
      purchaser: [],
      begin_date: '',
      end_date: '',
      description: '',
      is_base: undefined,
      attachments: [],
      apply_for: '',
      verify_reviewers: ''
    })
    commit('RESET_DETAIL')
    commit('SET_IS_EDIT', false)
    commit('SET_IS_REEDIT', false)
    commit('SET_REEDIT_MATERIAL_BILLNOS', [])
    commit('SET_IS_CONSUME_MODIFY', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

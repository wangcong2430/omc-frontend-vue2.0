// 人力外包类store
const state = {
  outsourceTable: { // 外包人力数据
    files: []
  }
}

const mutations = {
  SET_OUTSOURCE_TABLE: (state, { files }) => {
    state.outsourceTable.files = files
  },
  RESET_OUTSOURCE_TABLE: (state) => {
    state.outsourceTable.files = []
  }
}

const actions = {
  setOutsourceTable({ commit }, { files }) {
    commit('SET_OUTSOURCE_TABLE', { files })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

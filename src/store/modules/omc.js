// omc store, all common data of omc
import { getEntrySetting } from '@/api/system/entry-setting'

const state = {
  entrySetting: []
}

const mutations = {
  SET_ENTRY_SETTING: (state, data) => {
    state.entrySetting = data
  }
}

const actions = {
  getEntrySetting({ commit }) {
    return new Promise((resolve, reject) => {
      getEntrySetting().then(res => {
        const { data } = res
        commit('SET_ENTRY_SETTING', data)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

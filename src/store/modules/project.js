// 项目store
import { getStages } from '@/api/project/index'

const state = {
  stages: []
}

const mutations = {
  GET_STAGES: (state, data) => {
    state.stages = data
  }
}

const actions = {
  getStages({ commit }) {
    return new Promise((resolve, reject) => {
      getStages().then(res => {
        const { items } = res.content
        const stages = items.map(item => ({
          label: item.name,
          value: item.id
        }))
        commit('GET_STAGES', stages)
        resolve(items)
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

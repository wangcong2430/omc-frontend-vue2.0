import { getInfo, getOrgInfo, getStaffList, getMyConsolePerms } from '@/api/user/info'
import { from } from '@/utils/local-storage'

const state = {
  chineseName: '',
  englishName: '',
  avatar: '',
  departmentId: 0,
  unitId: 0,
  orgPath: '',
  departmentName: '',
  memberData: {},
  perms: []
}

const mutations = {
  SET_CHINESE_NAME: (state, chineseName) => {
    state.chineseName = chineseName
  },
  SET_ENGLISH_NAME: (state, englishName) => {
    state.englishName = englishName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_DEPARTMENT_ID: (state, id) => {
    state.departmentId = id
  },
  SET_UNIT_ID: (state, id) => {
    state.unitId = id
  },
  SET_ORG_PATH: (state, path) => {
    state.orgPath = path
  },
  SET_DEPARTMENT_NAME: (state, name) => {
    state.departmentName = name
  },
  SET_MEMBER_DATA: (state, data) => {
    state.memberData = data
  },
  SET_PERMS: (state, data) => {
    state.perms = data
  }
}

const actions = {
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        const { chinese_name, english_name, avatar, depart_id, unit_id } = data

        commit('SET_CHINESE_NAME', chinese_name)
        commit('SET_ENGLISH_NAME', english_name)
        commit('SET_AVATAR', avatar)
        commit('SET_DEPARTMENT_ID', depart_id)
        commit('SET_UNIT_ID', unit_id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getOrgInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getOrgInfo(state.departmentId).then(res => {
        const { data } = res
        const { org_path, id, name } = data
        const parsePath = org_path.replace(/\\/, '').split(/\\/)
        commit('SET_ORG_PATH', parsePath.slice(0, -1).join('/'))
        commit('SET_DEPARTMENT_NAME', name)
        // 设置默认部门信息
        commit('budget/SET_SELECTED_ORG', { id, name }, { root: true })
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取人名控件源数据
  getMemberData({ commit }) {
    from('STAFF_LISTS', () => {
      return getStaffList().then(result => {
        const { data } = result
        const allMemberList = []
        data.forEach(item => {
          // 英文名(中文名)序列
          allMemberList.push(item.data[1])
        })
        return {
          allMemberList
        }
      })
    }, false, 'STAFF_LISTS_TIMER', 60 * 60 * 24).then(result => {
      commit('SET_MEMBER_DATA', result)
    })
  },
  /**
   * 获取当前用户菜单导航和按钮的权限
   */
  getUserPerms({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMyConsolePerms().then(res => {
        const { content } = res
        const perms = []
        content.forEach(item => {
          if (item.module === 'vue') {
            perms.push(item.object)
          }
        })
        commit('SET_PERMS', perms)
        resolve(perms)
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

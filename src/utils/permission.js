// 权限判断函数
import store from '../store'
import moment from 'moment'

/**
 * 验证权限函数
 * @param {Array} value 权限
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const perms = store.getters && store.getters.perms

    const hasPermission = perms.some(perm => {
      if (!perm.includes('*')) {
        return value.includes(perm)
      }
      const reg = new RegExp(perm.replace(/(\*)/g, '.*'))
      return value.findIndex(p => reg.test(p)) > -1
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need perms as array! Like "['xxx']"`)
    return false
  }
}

/**
 * 检查入口状态是否开发
 * @param {String} type 业务类型 rd-研发费、cp-内容制作费
 */
export function checkEntryStatus(type) {
  if (type !== 'rd' && type !== 'cp') {
    console.log(`need type as 'cp' or 'rd'`)
    return false
  }
  const entrySetting = store.getters && store.getters.entrySetting
  const filterSetting = entrySetting.find(e => e.biz_type === type)
  if (filterSetting && filterSetting.start_time && filterSetting.end_time) {
    const status = moment().isAfter(filterSetting.start_time) && moment().isBefore(filterSetting.end_time)
    return status
  }
  return false
}

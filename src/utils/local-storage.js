// local storage 相关方法封装
import * as ls from 'local-storage'
import moment from 'moment'

const _promises = {}

export function get(key) {
  const result = ls.get(key)
  if (result) {
    return JSON.parse(result)
  }
  return result
}

export function set(key, value) {
  ls.set(key, JSON.stringify(value))
}

export function remove(key) {
  ls.remove(key)
}

/**
 * 获取本地存储数据，没有时加载并设置
 * @param {String} key 数据Key
 * @param {Function} callback 回调函数
 * @param {Boolean} isForcedLoad 是否强制加载数据
 * @param {String} timerKey 加载频率Key
 * @param {Number} timeRange 加载频率，单位s
 */
export function from(
  key,
  callback,
  isForcedLoad = false,
  timerKey,
  timeRange
) {
  const result = get(key)
  const timer = get(timerKey)
  let isInTimeRange = false
  if (timer) {
    const range = moment(timer).add(timeRange, 's')
    isInTimeRange = moment().isBetween(
      moment(timer),
      range
    )
  }

  let promise
  if (result && !isForcedLoad && isInTimeRange) {
    promise = new Promise((resolve) => {
      resolve(result)
    })
  } else {
    if (_promises[key]) {
      return _promises[key]
    }
    _promises[key] = promise = callback().then(function(res) {
      set(key, res)
      set(timerKey, moment().format('YYYY-MM-DD HH:mm:ss'))
      return res
    })
  }
  return promise
}

export function clear() {
  ls.clear()
}

export function getLocalData(key) {
  return ls.get(key)
}

export function setLocalData(key, value) {
  ls.set(key, value)
}

export const LocalSelectedProductKey = 'local-selected-product'

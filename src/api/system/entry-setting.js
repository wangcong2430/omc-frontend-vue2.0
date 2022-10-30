// 入口开发时间配置api

import http from '@/axios/request'
import { commonSrv } from '@/api/index'

/**
 * 获取预算入口开关配置
 */
export function getEntrySetting() {
  return http({
    url: `${commonSrv}/GetSysCfg`,
    method: 'get'
  })
}

/**
 * 保存预算入口开关配置
 * @param {Number} id 配置id
 * @param {String} biz_type 业务类型 rd-研发费、cp-内容制作费
 * @param {String} start_time 开始时间
 * @param {String} end_time 结束时间
 * @param {Number} status 状态 1-正常 2-删除
 */
export function saveEntrySetting(
  id,
  biz_type,
  start_time,
  end_time,
  status
) {
  return http({
    url: `${commonSrv}/SaveSysCfg`,
    method: 'post',
    data: {
      id,
      biz_type,
      start_time,
      end_time,
      status
    }
  })
}

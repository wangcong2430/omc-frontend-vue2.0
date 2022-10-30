// 需求审批配置相关api

import http from '@/axios/request'
import { consumeSrv } from '../index'

export function addDemandConfig(items) {
  return http({
    url: `${consumeSrv}/AddConsumeConfig`,
    method: 'post',
    data: { items }
  })
}

export function getDemandConfigs(page_idx, page_count, dept_id) {
  return http({
    url: `${consumeSrv}/GetConsumeConfig`,
    method: 'get',
    params: {
      page_idx,
      page_count,
      dept_id
    }
  })
}

export function delDemandConfig(items) {
  return http({
    url: `${consumeSrv}/DelConsumeConfig`,
    method: 'post',
    data: { items }
  })
}

export function updateDemandConfig(items) {
  return http({
    url: `${consumeSrv}/UpdateConsumeConfig`,
    method: 'post',
    data: { items }
  })
}

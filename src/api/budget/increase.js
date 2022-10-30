// 预算追加接口

import http from '@/axios/request'
import { budgetSrv } from '../index'

/**
 * 保存预算追加
 * @param {Number} depart_id
 * @param {String} depart_name
 * @param {Array} form
 * @param {Number} budget_year
 * @param {String} budget_type rd-研发费、cp-内容制作费
 */
export function saveAppendForm(
  depart_id,
  depart_name,
  form,
  budget_year,
  budget_type
) {
  return http({
    url: `${budgetSrv}/SaveAppendBudget`,
    method: 'post',
    data: {
      depart_id,
      depart_name,
      form,
      budget_year,
      budget_type
    }
  })
}

// 获取追加详情
export function getAppendInfo(process_id) {
  return http({
    url: `${budgetSrv}/GetAppendBudgetInfo`,
    method: 'get',
    params: { process_id }
  })
}

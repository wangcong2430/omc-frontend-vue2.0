// 研发费填报接口
import http from '@/axios/request'
import { budgetSrv } from '../index'

/**
 * 保存研发费预算填报
 * @param {Number} depart_id
 * @param {String} depart_name
 * @param {Array} form
 * @param {Number} budget_year
 * @param {String} budget_type 'rd'-研发费
 */
export function saveRd(
  depart_id,
  depart_name,
  form,
  budget_year,
  budget_type
) {
  return http({
    url: `${budgetSrv}/SaveBudget`,
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

// 物料
export function getMaterialCategory() {
  return http({
    url: `${budgetSrv}/GetMaterialCategory`,
    method: 'get',
    params: { budget_type: 'rd' }
  })
}

// 关联历史项目
export function getRelateProject() {
  return http({
    url: '/budget/relate_project',
    method: 'get'
  })
}

// 获取研发费预算详情
export function getBudgetRdInfo(process_id) {
  return http({
    url: `${budgetSrv}/GetBudgetInfo`,
    method: 'get',
    params: { process_id }
  })
}

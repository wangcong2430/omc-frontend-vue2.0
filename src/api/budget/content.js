// 内容制作费接口
import http from '@/axios/request'
import { budgetSrv, consumeSrv, consumeReportSrv } from '../index'

// 获取内容制作费子项类别
export function getCpCategory() {
  return http({
    url: `${budgetSrv}/GetMaterialCategory`,
    method: 'get',
    params: { budget_type: 'cp' }
  })
}

/**
 * 保存内容制作费预算填报
 * @param {Number} depart_id
 * @param {String} depart_name
 * @param {Array} form
 * @param {Number} budget_year
 * @param {String} budget_type 'cp'-内容制作费
 */
export function saveCp(depart_id, depart_name, form, budget_year, budget_type) {
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

// 获取内容制作费预算详情
export function getBudgetCpInfo(process_id) {
  return http({
    url: `${budgetSrv}/GetBudgetInfo`,
    method: 'get',
    params: { process_id }
  })
}

// 获取内容制作费采购全流程明细

export function getCostList() {
  return http({
    url: `${consumeSrv}/GetCntExportConfig`,
    method: 'post',
    data: {}
  })
}

// 导出内容制作费采购全流程明细

export function exportCostReport(data) {
  return http({
    url: `/${consumeReportSrv}/ExportOrders`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 预算报表接口
import http from '@/axios/request'
import { reportSrv } from '../index'
import { toNumber } from 'lodash/lang'

// 获取部门预算报表概览
export function getDepartReportOverview(budget_year, depart_id) {
  return http({
    url: `${reportSrv}/GetOverview`,
    method: 'get',
    params: {
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      depart_id: depart_id ? toNumber(depart_id) : undefined
    }
  })
}

// 获取预算趋势
export function getDepartReportTrend() {
  return http({
    url: `${reportSrv}/GetBudgetTrend`,
    method: 'get'
  })
}

// 获取预算执行列表
export function getDepartReportExecution(budget_year, depart_id) {
  return http({
    url: `${reportSrv}/GetExecution`,
    method: 'get',
    params: {
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      depart_id: depart_id ? toNumber(depart_id) : undefined
    }
  })
}

// 获取部门预算执行列表
export function getDepartReportExecutionDepart(budget_year, depart_id) {
  return http({
    url: `${reportSrv}/GetExecutionDepart`,
    method: 'get',
    params: {
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      depart_id: depart_id ? toNumber(depart_id) : undefined
    }
  })
}

// 获取执行详情
export function getDepartReportDetail(budget_year, depart_id, cost_center_code) {
  return http({
    url: `${reportSrv}/GetExecutionDetail`,
    method: 'get',
    params: {
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      depart_id: depart_id ? toNumber(depart_id) : undefined,
      cost_center_code
    }
  })
}

// 导出执行列表数据
export function exportDepartReport(budget_year, depart_id) {
  return http({
    url: `${reportSrv}/ExportReport`,
    method: 'get',
    params: {
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      depart_id: depart_id ? toNumber(depart_id) : undefined
    }
  })
}

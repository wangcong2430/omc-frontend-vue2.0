import http from '@/axios/request'
import { commonSrv, budgetSrv, uploadSrv } from '../index'
import { toString, toNumber } from 'lodash/lang'

// 获取关联产品代码
export function getFinanceProduct() {
  return http({
    url: `${commonSrv}/GetProductList`,
    method: 'get'
  })
}

// 获取部门列表
export function getDepart() {
  return http({
    url: `${commonSrv}/GetDepartList`,
    method: 'get'
  })
}

// 成本中心
export function getCoscenter(depart_id) {
  return http({
    url: `${commonSrv}/GetCostCenterList`,
    method: 'get',
    params: { depart_id }
  })
}

// 预算列表
export function getBudgetList(page, page_size, budget_year, depart_id, cost_center_code, budget_type) {
  return http({
    url: `${budgetSrv}/GetBudgetProcessList`,
    method: 'post',
    data: { page, page_size, budget_year: toNumber(budget_year), depart_id, cost_center_code, budget_type }
  })
}

// 追加列表
export function getAppendList(page, page_size, depart_id, cost_center_code, budget_type) {
  return http({
    url: `${budgetSrv}/GetAppendBudgetProcessList`,
    method: 'post',
    data: { page, page_size, depart_id, cost_center_code, budget_type }
  })
}

// 成本中心唯一性校验
export function checkCostCenter(
  cost_center_code,
  depart_id,
  budget_type,
  op_type,
  budget_year
) {
  return http({
    url: `${budgetSrv}/CheckCostCenter`,
    method: 'get',
    params: {
      cost_center_code: toString(cost_center_code),
      depart_id: depart_id,
      budget_type,
      op_type: toNumber(op_type),
      budget_year: toNumber(budget_year)
    }
  })
}

/**
 * 预算提交
 * @param {Array} process_id
 */
export function submitBudget(process_id) {
  return http({
    url: `${budgetSrv}/BudgetSubmit`,
    method: 'post',
    data: { process_id }
  })
}

// 获取预算单审批进度
export function getAuditProgress(instance_id) {
  return http({
    url: `${budgetSrv}/GetBudgetAuditProgress`,
    method: 'get',
    params: { instance_id }
  })
}

// 删除预算单/成本中心
export function delProcess(process_id) {
  return http({
    url: `${budgetSrv}/DeleteBudget`,
    method: 'post',
    data: { process_id }
  })
}

// 删除成本中心项目
export function delProject(process_id, project_id) {
  return http({
    url: `${budgetSrv}/DeleteProject`,
    method: 'post',
    data: { process_id, project_id }
  })
}

// 删除物料
export function delMaterial(material_id) {
  return http({
    url: `${budgetSrv}/DeleteMaterial`,
    method: 'post',
    data: { material_id }
  })
}

/**
 * 撤回审批单
 * @param {String} budget_type adjust-预算调整、rd-研发费、cp-内容制作费
 * @param {String} process_id
 */
export function revokeBudget(budget_type, process_id) {
  return http({
    url: `${budgetSrv}/BudgetRevoke`,
    method: 'post',
    data: { budget_type, process_id }
  })
}

/**
 * 导入填报
 * @param {Number} type 导入类型 1-研发费、2-内容制作费、3-人力外包费
 * @param {binary} file 文件的Blob格式数据
 */
export function importBudget(type, file) {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('file', file)
  return http({
    url: `${uploadSrv}/UploadFile`,
    responseType: 'blob',
    method: 'post',
    data: formData
  })
}

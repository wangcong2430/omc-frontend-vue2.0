// 预算调整接口
import http from '@/axios/request'
import { budgetSrv, downLoadTemplate, uploadFileSrv } from '../index'
import { toNumber } from 'lodash/lang'

// 获取调整列表
export function getAdjustList(page, page_size, budget_year, create_user) {
  return http({
    url: `${budgetSrv}/GetBudgetAdjustList`,
    method: 'post',
    data: {
      page,
      page_size,
      budget_year: budget_year ? toNumber(budget_year) : undefined,
      create_user
    }
  })
}

// 获取预算调整项详情
export function getAdjustDetail(process_id) {
  return http({
    url: `${budgetSrv}/GetBudgetAdjustDetail`,
    method: 'get',
    params: {
      process_id
    }
  })
}

// 查询需要调整的项目
export function getAdjustProjectList(
  page,
  page_size,
  budget_type,
  depart_id,
  cost_center_code,
  keywords,
  budget_year
) {
  return http({
    url: `${budgetSrv}/GetAdjustProjectList`,
    method: 'post',
    data: {
      page,
      page_size,
      budget_type,
      depart_id: toNumber(depart_id),
      cost_center_code,
      keywords,
      budget_year: toNumber(budget_year)
    }
  })
}

// 获取已选调整项目信息
export function getAdjustProjectInfo(relate_id) {
  return http({
    url: `${budgetSrv}/GetAdjustProjectInfo`,
    method: 'post',
    data: { relate_id }
  })
}

// 保存预算调整表单
export function saveAdjustForm(data) {
  return http({
    url: `${budgetSrv}/SaveAdjust`,
    method: 'post',
    data
  })
}

// 删除预算调整单
export function delAdjustList(process_id) {
  return http({
    url: `${budgetSrv}/DeleteAdjust`,
    method: 'post',
    data: { process_id }
  })
}
// 下载模板
export function downLoadTemplatefile(data) {
  return http({
    url: `${downLoadTemplate}/get_import_template`,
    method: 'post',
    data: {
      custom: data.custom,
      project: data.project,
      schema: data.schema
    }
  })
}

// 导入模板
export function uploadfile(data) {
  return http({
    url: `${uploadFileSrv}/import_template`,
    method: 'post',
    data: {
      schema: data.schema,
      project: data.project
    }
  })
}

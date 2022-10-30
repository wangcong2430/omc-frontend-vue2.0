// 项目相关api
import http from '@/axios/request'
import { projSrv } from '../index'

/**
 * 新增项目
 * @param {Array} items
 */
export function addProject(items) {
  return http({
    url: `${projSrv}/AddProjects`,
    method: 'post',
    data: { items }
  })
}

/**
 * 获取项目列表
 * @param {Number} dept_id 部门id
 * @param {String} costcenter_code 成本中心code
 * @param {String} product_name COA产品名称关键字
 * @param {Number} page_idx 当前页码
 * @param {Number} page_count 每页数量
 */
export function getProjects(
  dept_id,
  costcenter_code,
  product_name = '',
  page_idx,
  page_count
) {
  return http({
    url: `${projSrv}/GetProjects`,
    method: 'post',
    data: {
      dept_id,
      costcenter_code,
      product_name,
      page_idx,
      page_count
    }
  })
}

// 获取项目所处阶段
export function getStages(stages) {
  return http({
    url: `${projSrv}/GetStages`,
    method: 'post',
    data: { stages }
  })
}

/**
 * 删除项目
 * @param {Array} items
 */
export function delProjects(items) {
  return http({
    url: `${projSrv}/DelProjects`,
    method: 'post',
    data: { items }
  })
}

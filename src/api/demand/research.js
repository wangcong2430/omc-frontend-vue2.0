// 研发费需求管理相关api
import http from '@/axios/request'
import { consumeSrv } from '../index'

// 获取研发费需求类别
export function getRdCategoryType(parent_id) {
  return http({
    url: `${consumeSrv}/GetDevCategoryList`,
    method: 'get',
    params: {
      parent_id
    }
  })
}

// 获取研发费需求类别父类
export function getDevCategoryParentList() {
  return http({
    url: `${consumeSrv}/GetDevCategoryParentList`,
    method: 'get'
  })
}

/**
 * 获取研发费工作量单位
 * @param {String} category 类别
 */
export function getDevWorkloadUnit(category) {
  return http({
    url: `${consumeSrv}/GetDevWorkloadUnit`,
    method: 'get',
    params: {
      category
    }
  })
}

export function getConsumePurchasers() {
  return http({
    url: `${consumeSrv}/GetMemberList`,
    method: 'get',
    params: {
      type: 'purchaser'
    }
  })
}

/**
 * Epo结项
 * @param {String} item_id 需求单ID
 */
export function closeEpo(item_id) {
  return http({
    url: `${consumeSrv}/CloseEpo`,
    method: 'get',
    params: {
      item_id
    }
  })
}

/**
 * 研发费用审结数据可视化
 * @param { String }   bill_no 订单号
 */
export function getEpoPoList(bill_no) {
  return http({
    url: `${consumeSrv}/GetEpoPoList`,
    method: 'get',
    params: {
      bill_no
    }
  })
}

/**
 * 关联预算编制项目
 * @param {Number}  dept_id  部门id
 */
export function getDevBudgetProject(dept_id) {
  return http({
    url: `${consumeSrv}/GetDevBudgetProject`,
    method: 'get',
    params: {
      dept_id
    }
  })
}

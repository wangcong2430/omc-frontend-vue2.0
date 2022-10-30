// 内容制作费需求管理相关api
import http from '@/axios/request'
import { consumeSrv } from '../index'

/**
 * 获取意向供应商
 * @param {String} product_code 产品代码
 * @param {Number} category_id 子类Id
 */
export function getCntSupplicants(product_code, category_id) {
  return http({
    url: `${consumeSrv}/GetCntSupplicants`,
    method: 'get',
    params: {
      product_code,
      category_id
    }
  })
}

/**
 * 获取内容制作费大类别
 * @param resource_rule 资源规则匹配规则(查询具有该资源规则权限的产品)
 * @param resource_action 资源规则(查询具有该行为权限的产品)
 */
export function getCntCategoryList(resource_rule, resource_action) {
  return http({
    url: `${consumeSrv}/GetCntCategoryList`,
    method: 'post',
    data: {
      resource_rule,
      resource_action
    }
  })
}

/**
 * 获取内容制作费类别详情
 * @param {Number} category_id 大类Id
 */
export function getCntCategoryDetailList(category_id) {
  return http({
    url: `${consumeSrv}/GetCntCategoryDetailList`,
    method: 'get',
    params: {
      category_id
    }
  })
}

/**
 * 获取内容制作费工作量单位
 */
export function getCntWorkloadUnit() {
  return http({
    url: `${consumeSrv}/GetCntWorkloadUnit`,
    method: 'get'
  })
}

/**
 * 获取经办人列表
 * @param {String} product_code 产品代码
 * @param {Number} category_id 大类Id
 */
export function getApplyByList(product_code, category_id) {
  return http({
    url: `${consumeSrv}/GetApplyByList`,
    method: 'get',
    params: {
      product_code,
      category_id
    }
  })
}

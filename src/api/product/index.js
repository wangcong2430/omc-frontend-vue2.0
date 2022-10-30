// COA 产品相关的api
import http from '@/axios/request'
import { commonSrv } from '../index'

/**
 * 获取COA产品
 * @param {Number} page 当前页码
 * @param {Number} page_size 每页数量
 * @param {Number} depart_id 部门id
 * @param {String} depart_name 部门名称
 * @param {String} product_name COA产品名称关键字
 * @param {String} product_code COA产品代码
 * @param {String} resource_rule 资源规则匹配规则(查询具有该资源规则权限的产品)
 *                               例如：研发费需求审批配置列表(consume:*:*:item_type/2)、内容管理需求审批配置列表(consume:*:*:item_type/1)、
 *                                    需求管理列表(consume:*:*:*)
 * @param {String} resource_action 资源规则(查询具有该行为权限的产品)
 */
export function getProductList(
  page,
  page_size,
  depart_id,
  depart_name,
  product_code,
  product_name,
  resource_rule,
  resource_action
) {
  return http({
    url: `${commonSrv}/GetProductList`,
    method: 'post',
    data: {
      page,
      page_size,
      depart_id,
      depart_name,
      product_code,
      product_name,
      resource_rule,
      resource_action
    }
  })
}

export function getProductInfo(
  product_code
) {
  return http({
    url: `${commonSrv}/GetProductInfo`,
    method: 'post',
    data: {
      product_code: product_code
    }
  })
}

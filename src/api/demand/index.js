// 需求管理相关api
import http from '@/axios/request'
import { consumeSrv, consumeReportSrv } from '../index'
import { toNumber } from 'lodash/lang'

/**
 * 获取个人需求列表
 * @param {Array} search {
 *  consume_id: 需求单id,
 *  type: 需求类型,
 *  product_code: 产品代码,
 *  bill_no: 需求单号,
 *  detail_bill_no: 物料编号,
 *  name: 需求名,
 *  detail_name: 物件名,
 *  ulink_id: ulink关联id,
 *  epo_status: EPO推送状态(1-成功，2-失败),
 *  wbp_status: WBP推送状态(1-成功, 2-失败)，
 *  status: IOMC审批状态(1-草稿，2-审批中，3-审批结束)
 *  only_draft: 只看草稿(0:否 1:是)
 *  only_thirdparty_reject: 只看第三方驳回(0:否 1:是)
 * }
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */
export function getDemandLists(
  search,
  page_idx,
  page_count,
  year
) {
  return http({
    url: `${consumeSrv}/GetConsumeItemList`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    }
  })
}

/**
 * 需求导出
 * @param {Array} search {
 *  consume_id: 需求单id,
 *  type: 需求类型,
 *  product_code: 产品代码,
 *  bill_no: 需求单号,
 *  detail_bill_no: 物料编号,
 *  name: 需求名,
 *  detail_name: 物件名,
 *  ulink_id: ulink关联id,
 *  epo_status: EPO推送状态(1-成功，2-失败),
 *  wbp_status: WBP推送状态(1-成功, 2-失败)，
 *  status: IOMC审批状态(1-草稿，2-审批中，3-审批结束)
 *  only_draft: 只看草稿(0:否 1:是)
 *  only_thirdparty_reject: 只看第三方驳回(0:否 1:是)
 * }
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */
export function exportConsumeItem(
  search,
  page_idx,
  page_count,
  year
) {
  return http({
    url: `${consumeReportSrv}/ExportConsumeItem`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    },
    responseType: 'blob'
  })
}

/**
 * 获取所有需求列表
 * @param {Array} search {
 *  consume_id: 需求单id,
 *  type: 需求类型,
 *  product_code: 产品代码,
 *  bill_no: 需求单号,
 *  detail_bill_no: 物料编号,
 *  applicant: 提单人,
 *  name: 需求名,
 *  detail_name: 物件名称,
 *  epo_status: EPO推送状态(1-成功，2-失败),
 *  wbp_status: WBP推送状态(1-成功, 2-失败)，
 *  status: IOMC审批状态(1-草稿，2-审批中，3-审批结束)
 * }
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */
export function getGlobalDemandLists(
  search,
  page_idx,
  page_count,
  year
) {
  return http({
    url: `${consumeSrv}/GetConsumeItemGlobalList`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    }
  })
}

/**
 * 导出所有需求列表
 * @param {Array} search {
 *  consume_id: 需求单id,
 *  type: 需求类型,
 *  product_code: 产品代码,
 *  bill_no: 需求单号,
 *  detail_bill_no: 物料编号,
 *  applicant: 提单人,
 *  name: 需求名,
 *  detail_name: 物件名称,
 *  epo_status: EPO推送状态(1-成功，2-失败),
 *  wbp_status: WBP推送状态(1-成功, 2-失败)，
 *  status: IOMC审批状态(1-草稿，2-审批中，3-审批结束)
 * }
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */
export function exportConsumeItemGlobal(
  search,
  page_idx,
  page_count,
  year
) {
  return http({
    url: `${consumeReportSrv}/ExportConsumeItemGlobal`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    },
    responseType: 'blob'
  })
}

/**
 * 保存需求表单
 * @param {Object} item
 * @param {Number} is_draft 是否为草稿：1-草稿、2-非草稿
 * @param {String} ulink_id 内嵌ulink页面传参，非必填
 */
export function saveConsume(item, is_draft, ulink_id = '') {
  return http({
    url: `${consumeSrv}/AddConsumeItem`,
    method: 'post',
    data: { item, is_draft, ulink_id: ulink_id }
  })
}

/**
 * 更新需求表单
 * @param {Object} item
 * @param {Number} is_draft 是否为草稿：1-草稿、2-非草稿、3-修改价格
 */
export function updateConsume(item, is_draft) {
  return http({
    url: `${consumeSrv}/UpdateConsumeItem`,
    method: 'post',
    data: { item, is_draft }
  })
}

/**
 * 删除需求单
 * @param {Number} type 需求类别: 1-内容制作费、2-研发费
 * @param {Array} items 需求单ids
 * @param {String} product_code 产品代码
 */
export function delConsumeItem(type, items, product_code) {
  return http({
    url: `${consumeSrv}/DelConsumeItem`,
    method: 'post',
    data: { type, items, product_code }
  })
}

/**
 * 删除物件
 * @param {Array<string>} bill_no 物件单号
 */
export function delConsumeDetail(bill_no) {
  return http({
    url: `${consumeSrv}/DelConsumeDetail`,
    method: 'post',
    data: {
      bill_no
    }
  })
}

/**
 * 删除物件
 * @param {Array<string>} bill_no 物件单号
 * @param {String} status 物件状态，-13000为重新提单
 */
export function updateConsumeDetailStatus(bill_no, status) {
  return http({
    url: `${consumeSrv}/UpdateConsumeDetailStatus`,
    method: 'post',
    data: {
      bill_no,
      wbp_status: status
    }
  })
}

/**
 * 获取需求详情
 * @param {Array} search {consume_id: 需求单id, type: 需求类型, product_code: 产品代码, bill_no: 物料编号(Array)}
 */
export function getConsumeDetail(search) {
  return http({
    url: `${consumeSrv}/GetConsumeDetailList`,
    method: 'post',
    data: { search }
  })
}

/**
 * 撤回需求申请单
 * @param {Array} item_id 需求单id
 * @param {String} remark 撤回备注
 */
export function revertConsume(item_id, remark) {
  return http({
    url: `${consumeSrv}/Revert`,
    method: 'post',
    data: { item_id, remark }
  })
}

/**
 * 获取需求的统计信息
 * @param {Number} year 年份
 * @param {Number} product_code 产品代码
 * @param {Number} dept_id 部门id
 */
export function getConsumeStat(
  year,
  product_code,
  dept_id
) {
  return http({
    url: `${consumeSrv}/GetConsumeStat`,
    method: 'get',
    params: {
      year: year ? toNumber(year) : undefined,
      product_code,
      dept_id
    }
  })
}

/**
 * 重置同步状态
 * @param {Array} items 需求单ids
 */
export function resetSyncStatus(items) {
  return http({
    url: `${consumeSrv}/ResetSyncStatus`,
    method: 'post',
    data: {
      items
    }
  })
}

/**
 * 需求解绑（仅草稿）
 * @param {String} uid 内嵌ulink页面的uid
 */
export function unbindULink(uid) {
  return http({
    url: `${consumeSrv}/UnbindUlink`,
    method: 'get',
    params: {
      ulink_id: uid
    }
  })
}

/**
 * 导出物件需求
 * @param {Array} search {
 *  type: {Number} 需求类型,
 *  product_code: {srting} 产品代码,
 * }
 * @param {string} type
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */
export function exportConsumeDetail(search, page_idx, page_count, year) {
  return http({
    url: `${consumeReportSrv}/ExportConsumeDetail`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    },
    responseType: 'blob'
  })
}
/**
 * 查询页导出物件需求
 *  @param {Array} search {
 *  type: {Number} 需求类型,
 *  product_code: {srting} 产品代码,
 *  bill_no：{string}  订单号,
 *  detail_bill_no：{string}  物件单号,
 *  applicant:{Array<string>}  提单人数组
 *  name:{srting} 需求名
 *  detail_name:{string},
 *  status: {Number} 审批状态,
 *  wbp_status:{Number}  推送状态
 * }
 * @param {string} type
 * @param {Number} page_idx 页码
 * @param {Number} page_count 每页条数
 * @param {Number} year 年份
 */

export function exportConsumeDetailGlobal(search, page_idx, page_count, year) {
  return http({
    url: `${consumeReportSrv}/ExportConsumeDetailGlobal`,
    method: 'post',
    data: {
      search,
      page_idx,
      page_count,
      year: year ? toNumber(year) : undefined
    },
    responseType: 'blob'
  })
}

/**
 * 获取产品维度
 */
export function getProductDimension() {
  return http({
    url: `${consumeSrv}/GetProductDimension`,
    method: 'get'
  })
}

/**
 * wbp审核流程
 * @param {string} bill_no 物件单号
*/
export function getWbpHistoryList(bill_no) {
  return http({
    url: `${consumeSrv}/GetWbpHistoryList`,
    method: 'get',
    params: {
      bill_no
    }
  })
}

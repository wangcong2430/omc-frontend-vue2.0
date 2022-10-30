// 工作台相关api
import http from '@/axios/request'
import { budgetSrv, consumeSrv } from '../index'

// 获取待办分类列表，audit_type：0-未完成、1-已完成
export function getBacklogCategory(audit_type) {
  return http({
    url: `${budgetSrv}/GetBacklogCategory`,
    method: 'get',
    params: { audit_type }
  })
}

// 获取待办事项列表，cate_type：1-预算编制、2-预算追加、3-预算调整、4-需求管理
export function getBacklogList(page, page_size, cate_type, audit_type) {
  return http({
    url: `${budgetSrv}/GetBacklogList`,
    method: 'get',
    params: {
      page,
      page_size,
      cate_type,
      audit_type
    }
  })
}

// 完成审批，backlog_id(Array)：审批单id（一键审批传多个id），operate_status：1-通过、2-驳回，comment：备注
export function completeBacklog(backlog_id, operate_status, comment) {
  return http({
    url: `${budgetSrv}/BacklogComplete`,
    method: 'post',
    data: {
      backlog_id,
      operate_status,
      comment
    }
  })
}

/**
 * 审批需求申请单
 * @param {Array} item_id 需求单ids
 * @param {Number} action 执行的操作：1-同意、2-拒绝
 * @param {String} remark 审批备注
 */
export function checkConsume(item_id, action, remark) {
  return http({
    url: `${consumeSrv}/Check`,
    method: 'post',
    data: { item_id, action, remark }
  })
}

export function getWbpCount() {
  return http({
    url: `${consumeSrv}/GetWbpCount`,
    method: 'get'
  })
}

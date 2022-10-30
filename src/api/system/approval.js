// 预算审批配置相关接口

import http from '@/axios/request'
import { budgetSrv } from '../index'

// 获取所有审批流节点
export function getWorkflowNodes() {
  return http({
    url: `${budgetSrv}/GetAuditWorkflowNode`,
    method: 'get'
  })
}

// 保存审核配置人员
export function saveApprovalConfig({ depart_id, workflow_type, cfg, id }) {
  return http({
    url: `${budgetSrv}/SaveAuditCfg`,
    method: 'post',
    data: {
      depart_id,
      workflow_type,
      cfg,
      id
    }
  })
}

// 获取审批配置列表
export function getApprovalList(page, page_size, depart_id, workflow_type) {
  return http({
    url: `${budgetSrv}/GetAuditCfgList`,
    method: 'get',
    params: {
      page,
      page_size,
      depart_id,
      workflow_type
    }
  })
}

// 删除审批配置
export function delApprovalList(cfg_id) {
  return http({
    url: `${budgetSrv}/DeleteAuditCfg`,
    method: 'post',
    data: { cfg_id }
  })
}

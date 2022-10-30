// 工作流程相关api
import http from '@/axios/request'
import { workflowSrv, permSrv } from '../index'

/**
 * 获取工作单类型配置
 */
export function getWorkTypeOpt() {
  return http({
    url: `${workflowSrv}/GetWorkTypeOpt`,
    method: 'get'
  })
}

/**
 * 获取工作单数量汇总
 * @param {Number} status 流程节点状态：1-待处理、2-已结束
 */
export function getSummary(status) {
  return http({
    url: `${workflowSrv}/GetSummary`,
    method: 'get',
    params: { status }
  })
}

/**
 * 获取工作流程的步骤
 * @param {Number} work_type 工作单类型：1-研发费、2-内容制作费
 */
export function getFlowStep(work_type) {
  return http({
    url: `${workflowSrv}/GetFlowStep`,
    method: 'get',
    params: { work_type }
  })
}

/**
 * 创建工作的流程配置
 * @param {Number} work_type 工作项单位
 * @param {String} work_name 工作单名称
 * @param {String} flow_code 对应的流程代码
 * @param {Object} reviewer_setting 审核人表单项配置 {role_code: 关联系统角色代码, form_title: 表单项名称, form_element: 表单类型, is_required: 是否必填, sort: 排序}
 * @param {String} reviewer_resource 资源规则四段式
 */
export function addWorkConfig(
  work_type,
  work_name,
  flow_code,
  reviewer_setting,
  reviewer_resource
) {
  return http({
    url: `${workflowSrv}/AddWorkConfig`,
    method: 'post',
    data: {
      work_type,
      work_name,
      flow_code,
      reviewer_setting,
      reviewer_resource
    }
  })
}

/**
 * 更新工作的流程配置
 * @param {Number} work_type 工作项单位
 * @param {String} work_name 工作单名称
 * @param {String} flow_code 对应的流程代码
 * @param {Object} reviewer_setting 审核人表单项配置 {role_code: 关联系统角色代码, form_title: 表单项名称, form_element: 表单类型, is_required: 是否必填, sort: 排序}
 * @param {String} reviewer_resource 资源规则四段式
 */
export function updateWorkConfig(
  work_type,
  work_name,
  flow_code,
  reviewer_setting,
  reviewer_resource
) {
  return http({
    url: `${workflowSrv}/UpdateWorkConfig`,
    method: 'post',
    data: {
      work_type,
      work_name,
      flow_code,
      reviewer_setting,
      reviewer_resource
    }
  })
}

/**
 * 获取工作的流程配置
 * @param {Number} work_type 工作单类型
 */
export function getWorkConfigs(work_type) {
  return http({
    url: `${workflowSrv}/GetWorkConfigs`,
    method: 'get',
    params: { work_type }
  })
}

/**
 * 获取所有流程定义
 */
export function getFlowRules() {
  return http({
    url: `${workflowSrv}/GetFlowRules`,
    method: 'get'
  })
}

/**
 * 更新审核人名单
 * @param {Number} work_type 工作单类型
 * @param {Object} reviewers { role_code: 关联的权限系统角色, form_element: 表单类型, user_names: 用户名列表, checked: 是否勾选 }
 * @param {Object} res_params { product: 所属产品代码, module: 所属模块(需求研发费和内容制作费默认是'consume'), type: 分类 }
 */
export function updateReviewers(
  work_type,
  reviewers,
  res_params
) {
  return http({
    url: `${workflowSrv}/UpdateReviewers`,
    method: 'post',
    data: {
      work_type,
      reviewers,
      res_params
    }
  })
}

/**
 *
 * @param {Number} work_type 工作单类型
 * @param {Object} res_params { product: 所属产品代码, type: 分类 }
 */
export function getReviewerSettingAndUsers(
  work_type,
  res_params
) {
  return http({
    url: `${workflowSrv}/GetReviewerSettingAndUsers`,
    method: 'post',
    data: {
      work_type,
      res_params
    }
  })
}

/**
 * 获取审核人配置列表
 * @param {Number} page 页码
 * @param {Number} page_size 每页条数
 * @param {Number} work_type 工作单类型
 * @param {Number} depart_id 部门ID
 * @param {String} product_code 产品代码
 * @param {Object} res_params { module: 所属模块(需求研发费和内容制作费默认是'consume'), product: 所属产品代码, type: 分类 }
 */
export function getAllReviewerSettingList(
  page,
  page_size,
  work_type,
  depart_id,
  product_code,
  res_params
) {
  return http({
    url: `${workflowSrv}/GetAllReviewerSettingList`,
    method: 'post',
    data: {
      page,
      page_size,
      work_type,
      depart_id,
      product_code,
      res_params
    }
  })
}

/**
 * 获取审核人角色的名单
 * @param {Number} work_type 工作单类型, 1-研发费、2-内容制作费
 * @param {String} product_code 产品代码
 * @param {Object} res_params { module: 所属模块(需求研发费和内容制作费默认是'consume'), product: 所属产品代码, type: 分类 }
 */
export function getVerifyReviewerList(
  work_type,
  product_code,
  res_params
) {
  return http({
    url: `${workflowSrv}/GetVerifyReviewerList`,
    method: 'post',
    data: {
      work_type,
      product_code,
      res_params
    }
  })
}

/**
 * 获取处理过的工作流
 * @param {Number} page 页码
 * @param {Number} page_size 每页条数
 * @param {Number} work_type 工作单类型: 1-需求研发费、2-需求内容制作费
 */
export function getDoneFlows(
  page,
  page_size,
  work_type
) {
  return http({
    url: `${workflowSrv}/GetMyDoneFlows`,
    method: 'get',
    params: {
      page,
      page_size,
      work_type
    }
  })
}

/**
 * 获取待处理的工作流
 * @param {Number} page 页码
 * @param {Number} page_size 每页条数
 * @param {Number} work_type 工作单类型: 1-需求研发费、2-需求内容制作费
 */
export function getTodoFlows(
  page,
  page_size,
  work_type
) {
  return http({
    url: `${workflowSrv}/GetMyTodoFlows`,
    method: 'get',
    params: {
      page,
      page_size,
      work_type
    }
  })
}

/**
 * 处理工作流
 * @param {Array} items { record_id: 流程节点id, action: 处理动作(1: 同意，2: 拒绝), reason: 拒绝原因 }
 */
export function handleFlows(items = []) {
  return http({
    url: `${workflowSrv}/HandleMyFlows`,
    method: 'post',
    data: { items }
  })
}

/**
 * 设置用户身份
 * @param {String} staff_name 用户RTX
 */
export function setUserSession(staff_name) {
  return http({
    url: `${permSrv}/SetUserSession`,
    method: 'post',
    data: { staff_name }
  })
}

/**
 * 获取流程执行历史
 * @param {Array} instance_id 流程实例Id
 * @param {Number} filter 过滤类型: 0-全部节点、1-仅用户审批任务
 */
export function getFlowHistory(
  instance_id,
  filter
) {
  return http({
    url: `${workflowSrv}/GetFlowHistory`,
    method: 'post',
    data: {
      instance_id,
      filter
    }
  })
}

/**
 * 验证用户权限
 * @param {Number} work_type 工作单类型：1-研发费、2-内容制作费
 * @param {string} product_code  产品代码
 */
export function checkApplicantRule(
  product_code,
  work_type
) {
  return http({
    url: `${workflowSrv}/CheckApplicantRule`,
    method: 'post',
    data: {
      product_code,
      work_type
    }
  })
}

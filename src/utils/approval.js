// 审批相关公共方法
import { findLastIndex } from 'lodash/array'

/**
 * 解析审批状态，返回不同的class
 * @param {Number} status 0-编辑中、1-审批中、2-驳回、100-已完成
 */
export function formatStatus(status) {
  let res = ''
  switch (status) {
    case 0:
      res = 'text-muted'
      break
    case 1:
      res = 'text-primary'
      break
    case 2:
      res = 'text-danger'
      break
    case 100:
      res = 'text-success'
      break
    default:
      res = 'text-muted'
  }
  return res
}

/**
 * 解析审批状态，返回不同文字
 * @param {Number} status 0-编辑中、1-审批中、2-驳回、100-已完成
 * @param {String} text 审批状态的文字
 */
export function concatStatusText(status, text) {
  let res = ''
  switch (status) {
    case 0:
      res = '编辑中'
      break
    case 1:
      res = `${text}审批中`
      break
    case 2:
      res = '驳回'
      break
    case 100:
      res = '已完成'
      break
    default:
      res = ''
  }
  return res
}

/**
 * 解析预算单审批进度数据
 * @param {Array} data 数据源
 * @returns {Object} stepLists：进度总数、errorStep：被驳回的进度、currentStep：当前的进度
 */
export function formatApprovalData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Must push Array!')
  }
  const stepLists = []
  const errorStep = {}
  let currentStep = 0
  data.forEach((item, index) => {
    stepLists.push(item.title)
    // 审批被驳回
    if (item.status === 2) {
      errorStep[index] = `审批单被驳回，原因：${item.comment ? item.comment : '无'}`
      currentStep = index
    }
    // 审批通过
    if (item.status === 1) {
      currentStep = index + 1
    }
  })
  return { stepLists, errorStep, currentStep }
}

/**
 * 解析需求审批状态，返回不同的class
 * @param {Number} status 当前的流程：1-编辑中、2-审批中、3-结束、4-变更审批中、5-变更审批结束
 * @param {Array} processList 所有的流程
 */
export function formatDemandStatus(status) {
  let res = ''
  switch (status) {
    case 1:
      res = 'text-muted'
      break
    case 3:
    case 5:
      res = 'text-success'
      break
    default:
      res = 'text-primary'
  }
  return res
}

/**
 * 解析流程状态，返回不同的class
 * @param {Number} status 当前状态：1-进行中、9-已结束、8-已拒绝
 */
export function formatWorkflowStatus(status) {
  let res = ''
  switch (status) {
    case 1:
      res = 'text-primary'
      break
    case 7:
      res = 'text-muted'
      break
    case 8:
      res = 'text-danger'
      break
    case 9:
      res = 'text-success'
      break
    default:
      res = 'text-primary'
  }
  return res
}

/**
 * 解析流程状态，返回不同文字
 * @param {Number} status 当前状态：1-进行中、9-已结束、8-已拒绝
 * @param {String} text 流程节点状态的文字
 */
export function concatWorkflowStatusText(status, text) {
  let res = ''
  switch (status) {
    case 1:
      res = `${text}（审批中）`
      break
    case 7:
      res = '已撤销'
      break
    case 8:
      res = `${text}（驳回）`
      break
    case 9:
      res = '已完成'
      break
    default:
      res = text
  }
  return res
}

/**
 * 解析流程步骤和流程日志
 * @param {Array} stepLists 流程步骤
 * @param {Array} stepLogs 流程执行历史
 * @returns {Object} {currentStep: 当前流程节点Index, errorStep: 驳回流程节点}
 */
export function formatWorkflowSteps(
  stepLists,
  stepLogs
) {
  if (!Array.isArray(stepLists) || !Array.isArray(stepLogs)) {
    return {
      currentStep: 0,
      errorStep: {}
    }
  }

  let currentStepNode = null
  const currentStepIndex = findLastIndex(stepLists, list => {
    const step = stepLogs.find(s => s.node_name === list)
    if (step) {
      currentStepNode = step
      return true
    }
    return false
  })
  let currentStep = 0
  let errorStep = {}
  if (currentStepIndex > -1) {
    if (currentStepNode.is_rejected && currentStepNode.is_rejected === 1) { // 驳回
      currentStep = currentStepIndex
      const errorRes = currentStepNode.result
      errorStep = { [currentStepIndex]: errorRes || '没有驳回原因' }
    } else {
      if (currentStepNode && currentStepNode.status === 1) { // 待处理
        currentStep = currentStepIndex
      } else { // 已处理
        currentStep = currentStepIndex + 1
      }
    }

    // 如果到流程最后一步，则走到已完成
    if (
      currentStepNode &&
      currentStepNode.status === 2 &&
      currentStepIndex === stepLists.length - 2
    ) {
      currentStep = currentStepIndex + 2
    }
  }

  return {
    currentStep,
    errorStep
  }
}

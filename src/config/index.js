/**
 * 权限配置项
 */
export const perms = {
  workbench: 'menu/workbench',
  workbenchList: 'menu/workbench_list',
  workbenchWbp: 'menu/workbench_wbp',
  budget: 'menu/budget',
  budgetEntry: 'menu/budget_entry',
  budgetCpAdd: 'menu/budget_cp_add',
  budgetCpPredict: 'menu/budget_cp_predict',
  budgetRdAdd: 'menu/budget_rd_add',
  budgetRdPredict: 'menu/budget_rd_predict',
  budgetAdjustment: 'menu/budget_adjustment',
  budgetReport: 'menu/budget_report',
  report: 'menu/report',
  reportRdDetail: 'menu/report_rd_detail',
  reportCpDetail: 'menu/report_cp_detail',
  reportObBudget: 'menu/report_ob_budget',
  reportArtWorkload: 'menu/report_art_workload',
  reportObSource: 'menu/report_ob_source',
  demand: 'menu/demand',
  demandApply: 'menu/demand_apply',
  demandSearch: 'menu/demand_search',
  demandApplyRd: 'button/demand_apply_rd',
  demandApplyCp: 'button/demand_apply_cp',
  demandApplyCpEpo: 'button/demand_apply_cp_epo',
  approval: 'menu/approval',
  approvalDemandRd: 'menu/approval_demandRd',
  approvalDemandCp: 'menu/approval_demandCp',
  approvalDemandEpoCp: 'menu/approval_demandEpoCp',
  system: 'menu/system',
  systemSetting: 'menu/system_setting',
  systemSettingRole: 'menu/system_setting_role',
  systemSettingInterface: 'menu/system_setting_interface',
  systemSettingWorkflow: 'menu/system_setting_workflow',
  systemSettingPerms: 'menu/system_setting_perms',
  budgetPlanningEntry: 'button/budget_planning_entry',
  demandModify: 'button/demand_modify',
  demandDelete: 'button/demand_delete',
  gResetSyncStatus: 'button/g_reset_sync_status',
  gAddDemandApproval: 'button/g_add_demand_approval',
  workbenchDemandReject: 'button/workbench_demand_reject',
  workbenchDemandAudit: 'button/workbench_demand_audit',
  demandSearchCp: 'menu/enter_search_cp',
  demandSearchRd: 'menu/enter_search_rd',
  demandSearchEpoCp: 'menu/enter_search_epo_cp',
  reportObProduct: 'menu/report_ob_product',
  reportObDetailed: 'menu/report_ob_detailed'
}

/**
 * type: 权限类型（菜单项、页面、按钮操作）
 * name: 权限名称
 * value: 权限值
 */
export const permsConfig = [
  {
    key: 0,
    type: '菜单项',
    name: '工作台',
    value: perms.workbench
  },
  {
    key: 1,
    type: '页面',
    name: '工作台列表',
    value: perms.workbenchList
  },
  {
    key: 3,
    type: '页面',
    name: 'WBP验收-我的待办',
    value: perms.workbenchWbp
  },
  {
    key: 4,
    type: '页面',
    name: 'WBP变更-我的待办',
    value: perms.workbenchWbp
  },
  {
    key: 5,
    type: '菜单项',
    name: '预算管理',
    value: perms.budget
  },
  {
    key: 6,
    type: '菜单项',
    name: '预算编制',
    value: perms.budgetEntry
  },
  {
    key: 7,
    type: '菜单项',
    name: '内容制作费预算填报',
    value: perms.budgetCpAdd
  },
  {
    key: 8,
    type: '菜单项',
    name: '内容制作费预测填报',
    value: perms.budgetCpPredict
  },
  {
    key: 9,
    type: '菜单项',
    name: '研发费预算填报',
    value: perms.budgetRdAdd
  },
  {
    key: 10,
    type: '菜单项',
    name: '研发费预测填报',
    value: perms.budgetRdPredict
  },
  {
    key: 11,
    type: '菜单项',
    name: '研发费预算查询及调整',
    value: perms.budgetAdjustment
  },
  {
    key: 12,
    type: '菜单项',
    name: '内容制作费预算查询及调整',
    value: perms.budgetAdjustment
  },
  {
    key: 13,
    type: '菜单项',
    name: '预算填报统计汇总',
    value: perms.budgetReport
  },
  {
    key: 14,
    type: '菜单项',
    name: '报表分析',
    value: perms.report
  },
  {
    key: 15,
    type: '菜单项',
    name: '研发费采购全流程明细',
    value: perms.reportRdDetail
  },
  {
    key: 16,
    type: '菜单项',
    name: '内容制作费采购全流程明细',
    value: perms.reportCpDetail
  },
  {
    key: 17,
    type: '菜单项',
    name: '外包费用预算执行表',
    value: perms.reportObBudget
  },
  {
    key: 18,
    type: '菜单项',
    name: '美术资源投入可视化报表',
    value: perms.reportArtWorkload
  },
  {
    key: 19,
    type: '菜单项',
    name: '内容制作费数据统计表-BY服务品类',
    value: perms.reportObSource
  },
  {
    key: 20,
    type: '菜单项',
    name: '需求管理',
    value: perms.demand
  },
  {
    key: 21,
    type: '菜单项',
    name: '需求申请',
    value: perms.demandApply
  },
  {
    key: 22,
    type: '菜单项',
    name: '需求查询',
    value: perms.demandSearch
  },
  {
    key: 22,
    type: '按钮',
    name: '研发费需求申请',
    value: perms.demandApplyRd
  },
  {
    key: 23,
    type: '按钮',
    name: '内容制作费需求申请',
    value: perms.demandApplyCp
  },
  {
    key: 24,
    type: '菜单项',
    name: '审批配置',
    value: perms.approval
  },
  {
    key: 25,
    type: '菜单项',
    name: '研发费需求审批',
    value: perms.approvalDemandRd
  },
  {
    key: 26,
    type: '菜单项',
    name: '内容制作费需求审批',
    value: perms.approvalDemandCp
  },
  {
    key: '24-3',
    type: '菜单项',
    name: '内容制作费(自行采购)',
    value: perms.approvalDemandEpoCp
  },
  {
    key: 27,
    type: '菜单项',
    name: '系统配置',
    value: perms.system
  },
  {
    key: 28,
    type: '页面',
    name: '系统配置',
    value: perms.systemSetting
  },
  {
    key: 29,
    type: '页面',
    name: '系统角色配置',
    value: perms.systemSettingRole
  },
  {
    key: 29,
    type: '页面',
    name: '系统接口配置',
    value: perms.systemSettingInterface
  },
  {
    key: 30,
    type: '页面',
    name: '系统审批流程配置',
    value: perms.systemSettingWorkflow
  },
  {
    key: 31,
    type: '页面',
    name: '系统权限配置表',
    value: perms.systemSettingPerms
  },
  {
    key: 32,
    type: '按钮',
    name: '预算调整-新增预算',
    value: perms.budgetPlanningEntry
  },
  {
    key: 33,
    type: '按钮',
    name: '需求编辑',
    value: perms.demandModify
  },
  {
    key: 34,
    type: '按钮',
    name: '需求删除',
    value: perms.demandDelete
  },
  {
    key: 35,
    type: '按钮',
    name: '重置同步状态',
    value: perms.gResetSyncStatus
  },
  {
    key: 36,
    type: '按钮',
    name: '新增需求审批配置',
    value: perms.gAddDemandApproval
  },
  {
    key: 37,
    type: '按钮',
    name: '需求审批驳回',
    value: perms.workbenchDemandReject
  },
  {
    key: 38,
    type: '按钮',
    name: '需求审批通过',
    value: perms.workbenchDemandAudit
  },
  {
    key: 39,
    type: '按钮',
    name: '内容制作费(自行采购)需求申请',
    value: perms.demandApplyCpEpo
  },
  {
    key: 40,
    type: '菜单',
    name: '内容制作费查询',
    value: perms.demandSearchCp
  },
  {
    key: 41,
    type: '菜单',
    name: '研发费查询',
    value: perms.demandSearchRd
  },
  {
    key: 42,
    type: '菜单',
    name: '内容制作费(自行采购)查询',
    value: perms.demandSearchEpoCp
  },
  {
    key: 43,
    type: '菜单',
    name: '内容制作费数据统计表-BY产品',
    value: perms.reportObProduct
  },
  {
    key: 43,
    type: '菜单',
    name: '内容制作费数据统计表-BY明细类别',
    value: perms.reportObDetailed
  }
]

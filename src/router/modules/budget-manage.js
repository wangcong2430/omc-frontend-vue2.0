/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import MicroPage from '@/views/components/micro-page'

const budgetManageRouter = {
  path: '/budget',
  component: Layout,
  name: 'BudgetManagement',
  meta: { perms: ['menu/budget'], title: '预算管理', icon: 'mdi-credit-card-outline' },
  children: [
    {
      path: 'entry',
      component: () => import('@/views/budget/planning/entry'),
      name: 'BudgetPlanningEntry',
      meta: { perms: ['menu/budget_entry'], title: '预算编制' }
    },
    // 重构
    {
      path: 'cp-add',
      name: 'BudgetPlanningCpAdd',
      component: () => import('@/views/components/budgetPlanningRdPredict/cp-add'),
      hidden: true,
      meta: {
        perms: ['menu/budget_cp_add'],
        title: '2023年内容制作费预算填报',
        mode: 'micro',
        name: 'cpadd'
      }
    },
    // 重构
    {
      path: 'cp-predict',
      name: 'BudgetPlanningCpPredict',
      component: () => import('@/views/components/budgetPlanningRdPredict/cp-predict'),
      hidden: true,
      meta: {
        perms: ['menu/budget_cp_predict'],
        title: '2022年内容制作费预测填报',
        mode: 'micro',
        name: 'cppredict'
      }
    },
    // 重构
    {
      path: 'rd-add',
      name: 'BudgetPlanningRdAdd',
      component: () => import('@/views/components/budgetPlanningRdPredict/rd-add'),
      hidden: true,
      meta: {
        perms: ['menu/budget_rd_add'],
        title: '2023年研发费预算填报',
        mode: 'micro',
        name: 'rdadd'
      }
    },
    // 重构
    {
      path: 'rd-predict',
      name: 'BudgetPlanningRdPredict',
      component: () => import('@/views/components/budgetPlanningRdPredict/rd-predict'),
      hidden: true,
      meta: {
        perms: ['menu/budget_rd_predict'],
        title: '2022年研发费预测填报',
        mode: 'micro',
        name: 'rdpredict'
      }
    },
    {
      path: 'rd-adjustment',
      component: () => import('@/views/budget/adjustment/index'),
      name: 'BudgetRdAdjustment',
      meta: {
        perms: ['menu/budget_adjustment'],
        title: '研发费预算查询及调整',
        mode: 'micro',
        name: 'rdadjustment',
        url: 'worksheet/iomc_budgetsrv/budget_submit_rd/iomc/19/88'
      }
    },
    {
      path: 'cp-adjustment',
      component: () => import('@/views/budget/adjustment/index'),
      name: 'BudgetCpAdjustment',
      meta: {
        perms: ['menu/budget_adjustment'],
        title: '内容制作费预算查询及调整',
        mode: 'micro',
        name: 'cpadjustment',
        url: 'worksheet/iomc_budgetsrv/budget_submit_cp/iomc/19/89'
      }
    },
    {
      path: 'report',
      name: 'BudgetReport',
      component: MicroPage,
      meta: {
        perms: ['menu/budget_report'],
        title: '预算填报统计汇总',
        mode: 'micro',
        name: 'budgetreport',
        url: 'worksheet/iomc_budgetsrv/report_budget_submit/iomc/19/62'
      }
    }
  ]
}

export default budgetManageRouter

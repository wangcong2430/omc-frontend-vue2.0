// report routes
import Layout from '@/layout'
import MicroPage from '@/views/components/micro-page'

const reportRouter = {
  path: '/report',
  component: Layout,
  name: 'Report',
  redirect: '/report/rd-detail',
  meta: { perms: ['menu/report'], title: '报表分析', icon: 'mdi-chart-donut' },
  children: [
    {
      path: 'rd-detail',
      component: MicroPage,
      name: 'RdDetailReport',
      meta: {
        perms: ['menu/report_rd_detail'],
        title: '研发费采购全流程明细',
        mode: 'micro',
        group_by: 'epo_po_number',
        name: 'rddetail',
        url: 'worksheet/iomc_consumesrv/consume_items/iomc/18/55?group_by=epo_po_number'
      }
    },
    {
      path: 'cp-detail',
      name: 'CpDetailReport',
      component: () => import('@/views/report/demand-report/cp-detail-export'),
      meta: {
        perms: ['menu/report_cp_detail'],
        title: '内容制作费采购全流程明细',
        mode: 'micro'
        // name: 'cpdetail',
        // url: 'wuji/xy/app/prod/iomc/order-export'
      }
    },
    {
      path: 'ob-budget',
      component: MicroPage,
      name: 'ObBudgetReport',
      meta: {
        perms: ['menu/report_ob_budget'],
        title: '内容制作外包费用预算执行表',
        mode: 'micro',
        name: 'obbudget',
        url: 'worksheet/iomc_budgetsrv/report_product_budget/iomc/18/57'
      }
    },
    {
      path: 'art-workload',
      name: 'ArtWorkloadReport',
      component: MicroPage,
      meta: {
        perms: ['menu/report_art_workload'],
        title: '美术资源投入可视化报表',
        mode: 'micro',
        name: 'artworkload',
        url: 'worksheet/iomc_budgetsrv/report_cp_workload/iomc/18/59'
      }
    },
    {
      path: 'ob-source',
      name: 'ObSourceReport',
      component: MicroPage,
      meta: {
        perms: ['menu/report_ob_source'],
        title: '内容制作数据统计-品类',
        mode: 'micro',
        name: 'obsource',
        url: 'worksheet/iomc_budgetsrv/report_category_budget_cp_monthly/iomc/18/135'
      }
    },
    {
      path: 'ob-detailed',
      name: 'ObDetailedReport',
      component: MicroPage,
      meta: {
        perms: ['menu/report_ob_detailed'],
        title: '内容制作数据统计-明细',
        mode: 'micro',
        name: 'definite',
        url: 'worksheet/iomc_budgetsrv/report_cnt_category_budget_cp_monthly/iomc/18/134'
      }
    },
    {
      path: 'ob-product',
      name: 'ObProductReport',
      component: MicroPage,
      meta: {
        perms: ['menu/report_ob_product'],
        title: '内容制作数据统计-产品',
        mode: 'micro',
        name: 'product',
        url: 'worksheet/iomc_budgetsrv/report_product_budget_cp_monthly/iomc/18/119'
      }
    }
  ]
}

export default reportRouter

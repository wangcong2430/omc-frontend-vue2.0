// personal workbench routes
import Layout from '@/layout'

const workbenchRouter = {
  path: '/workbench',
  component: Layout,
  name: 'Workbench',
  redirect: '/workbench/list',
  meta: { perms: ['menu/workbench'], title: '工作台', icon: 'mdi-archive-outline', badge: true },
  children: [
    {
      path: 'list',
      component: () => import('@/views/workbench/index'),
      name: 'WorkbenchList',
      meta: { perms: ['menu/workbench_list'], title: '工作台' },
      hidden: true
    },
    {
      path: 'acceptance',
      component: () => import('@/views/workbench/wbp-page/acceptance'),
      name: 'WorkbenchAcceptancePage',
      meta: { perms: ['menu/workbench_wbp'], title: '工作台' },
      hidden: true,
      redirect: '/workbench/acceptance/by-acceptance',
      children: [
        {
          path: 'by-acceptance',
          component: () => import('@/views/workbench/components/iframe-page'),
          name: 'WbpByAcceptance',
          meta: { title: '待发起验收页面', url: '//idea.waibao.oa.com/iomc/by-acceptance' }
        },
        {
          path: 'demand-acceptance',
          component: () => import('@/views/workbench/components/iframe-page'),
          name: 'WbpDemandAcceptance',
          meta: { title: '待需求经办人验收页面', url: '//idea.waibao.oa.com/iomc/demand-acceptance' }
        },
        {
          path: 'acceptance-approve',
          component: () => import('@/views/workbench/components/iframe-page'),
          name: 'WbpAcceptanceApprove',
          meta: { title: '待审批人验收页面', url: '//idea.waibao.oa.com/iomc/acceptance-approve' }
        }
      ]
    },
    {
      path: 'change',
      component: () => import('@/views/workbench/wbp-page/change'),
      name: 'WorkbenchChangePage',
      meta: { perms: ['menu/workbench_wbp'], title: '工作台' },
      hidden: true,
      redirect: '/workbench/change/demand-audit-confirmation',
      children: [
        {
          path: 'demand-audit-confirmation',
          component: () => import('@/views/workbench/components/iframe-page'),
          name: 'WbpDemandAuditConfirmation',
          meta: { title: '需求审核人确认页面', url: '//idea.waibao.oa.com/iomc/demand-audit-confirmation' }
        },
        {
          path: 'demand-person-ponfirmation',
          component: () => import('@/views/workbench/components/iframe-page'),
          name: 'WbpDemandPersonPonfirmation',
          meta: { title: '需求人确认页面', url: '//idea.waibao.oa.com/iomc/demand-person-ponfirmation' }
        }
      ]
    }
  ]
}

export default workbenchRouter

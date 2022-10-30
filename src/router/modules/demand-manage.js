// 需求管理相关路由
import Layout from '@/layout'

const demandManageRouter = {
  path: '/demand',
  component: Layout,
  name: 'DemandManagement',
  redirect: '/demand/apply',
  meta: { perms: ['menu/demand'], title: '需求管理', icon: 'mdi-checkbox-marked-circle-outline' },
  showDropdown: true,
  children: [
    {
      path: 'apply',
      component: () => import('@/views/demand/list/index'),
      name: 'DemandApply',
      meta: { perms: ['menu/demand_apply'], title: '需求申请' }
    },
    {
      path: 'search',
      component: () => import('@/views/demand/search'),
      name: 'DemandSearch',
      meta: { perms: ['menu/demand_search'], title: '需求查询' }
    },
    {
      path: 'apply/rd',
      component: () => import('@/views/demand/apply/research/index'),
      name: 'DemandApplyRd',
      meta: { perms: ['button/demand_apply_rd'], title: '需求申请' },
      hidden: true
    },
    {
      path: 'apply/cp',
      component: () => import('@/views/demand/apply/content/index'),
      name: 'DemandApplyCp',
      meta: { perms: ['button/demand_apply_cp'], title: '需求申请' },
      hidden: true
    },
    {
      path: 'apply/cp-epo',
      component: () => import('@/views/demand/apply/epo-content/index'),
      name: 'DemandApplyCpEpo',
      meta: { perms: ['button/demand_apply_cp_epo'], title: '需求申请' },
      hidden: true
    }
  ]
}

export default demandManageRouter

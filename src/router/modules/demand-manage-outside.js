// 需求管理相关路由
import Layout from '@/layout/layout-outside'

const demandManageRouter = {
  path: '/demand-outside',
  component: Layout,
  name: 'DemandOutsideManagement',
  meta: {
    perms: ['menu/demand'],
    title: '需求管理',
    icon: 'mdi-checkbox-marked-circle-outline'
  },
  hidden: true,
  showDropdown: true,
  children: [
    {
      path: 'apply/cp',
      component: () => import('@/views/demand-outside/apply/content/index'),
      name: 'DemandOutsideApplyCp',
      meta: { perms: ['button/demand_apply_cp'], title: '需求申请' },
      hidden: true
    },
    {
      path: 'detail',
      component: () => import('@/views/demand-outside/detail/index'),
      name: 'DemandOutsideDetail',
      meta: { perms: ['button/demand_apply_cp'], title: '需求详情' },
      hidden: true
    }
  ]
}

export default demandManageRouter

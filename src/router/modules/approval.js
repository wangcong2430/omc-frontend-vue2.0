// 审批配置相关路由
import Layout from '@/layout'

const approvalRouter = {
  path: '/approval',
  component: Layout,
  name: 'Approval',
  redirect: '/approval/demandRd',
  meta: { perms: ['menu/approval'], title: '审批配置', icon: 'mdi-square-edit-outline' },
  showDropdown: true,
  children: [
    {
      path: 'demandRd',
      component: () => import('@/views/demand-approval/rd-setting'),
      name: 'ApprovalDemandRd',
      meta: { perms: ['menu/approval_demandRd'], title: '研发费需求审批' }
    },
    {
      path: 'demandCp',
      component: () => import('@/views/demand-approval/cp-setting'),
      name: 'ApprovalDemandCp',
      meta: { perms: ['menu/approval_demandCp'], title: '内容制作费需求审批' }
    },
    {
      path: 'demandEpoCp',
      component: () => import('@/views/demand-approval/epo-cp-setting'),
      name: 'ApprovalDemandEpoCp',
      meta: { perms: ['menu/approval_demandEpoCp'], title: '内容制作费(自行采购)' }
    }
  ]
}

export default approvalRouter

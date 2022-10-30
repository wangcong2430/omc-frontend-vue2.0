/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const projectManageRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project/management',
  name: 'ProjectManage',
  meta: { perms: ['menu/project'], title: '项目管理与分析', icon: 'mdi-cube-outline' },
  showDropdown: true,
  children: [
    {
      path: 'management',
      component: () => import('@/views/project/management/index'),
      name: 'ProjectManagement',
      meta: { perms: ['menu/project_management'], title: '项目管理' }
    },
    {
      path: 'analysis',
      component: () => import('@/views/project/analysis/index'),
      name: 'ProjectAnalysis',
      meta: { perms: ['menu/project_analysis'], title: '项目成本效应分析' }
    }
  ]
}

export default projectManageRouter

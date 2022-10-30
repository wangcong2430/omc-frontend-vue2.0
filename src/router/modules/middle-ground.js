/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const middleGroundRouter = {
  path: '/ground',
  component: Layout,
  redirect: '/ground/message-share',
  name: 'MiddleGround',
  meta: { title: '中台管理', icon: 'mdi-view-grid-outline' },
  children: [
    {
      path: 'message-share',
      component: () => import('@/views/middle-ground/message-share'),
      name: 'MessageShare',
      meta: { title: '中台信息共享' }
    },
    {
      path: 'sign-approval',
      component: () => import('@/views/middle-ground/sign-approval'),
      name: 'SignApproval',
      meta: { title: '中台会签审批' }
    }
  ]
}

export default middleGroundRouter

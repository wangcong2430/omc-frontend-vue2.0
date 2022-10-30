import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import workbenchRouter from './modules/workbench'
import budgetManageRouter from './modules/budget-manage'
import demandManageRouter from './modules/demand-manage'
import demandManageOutsideRouter from './modules/demand-manage-outside'
// import projectManageRouter from './modules/project-manage'
// import middleGroundRouter from './modules/middle-ground'
import reportRouter from './modules/report'
import approvalRouter from './modules/approval'
import systemConfig from './modules/system-config'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * openMenu: true                 if set true, will open the menu as default
 *                                otherwise it will becomes nested mode(default is false)
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * showDropdown: false            if set true, it will show dropdown when the route only has one child(default is false)
 * noSubchildIcon: false          if set true, it will not show icon when the parent route is not hidden, but the subchild is hidden
 * meta : {
    perms: ['menu/xxx_xxx']       control the page permissions (you can set multiple permission)
    title: 'title'                the name show in sidebar and breadcrumb (recommend set)
    icon: 'icon-name'             the icon show in the sidebar （must set in the parent route if it has children routes）
    cache: true                   if set true, the page will be cached(default is false)
    badge: false                  if set true, it will have badge in the right of the sidebar.The method of setting badge is in 'store/app/setBadge'
    mode: 'micro'                 设置是否是子应用
  }
 */

export const constantRoutes = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-pages/404'),
    hidden: true
  },
  {
    path: '/401',
    component: Layout,
    redirect: '/401/page',
    children: [
      {
        path: 'page',
        component: () => import('@/views/error-pages/401'),
        hidden: true
      }
    ],
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench/list',
    hidden: true
  },
  {
    path: '/setUserSession',
    component: () => import('@/views/user-session'),
    name: 'SetUserSession',
    hidden: true
  },
  workbenchRouter
  // middleGroundRouter
]

// 需要根据权限生成的路由
export const asyncRoutes = [
  budgetManageRouter,
  reportRouter,
  demandManageRouter,
  demandManageOutsideRouter,
  // projectManageRouter,
  approvalRouter,
  systemConfig
]

const createRouter = () => new Router({
  mode: process.env.VUE_APP_LOCAL_ROUTER_MODE === 'hash' ? 'hash' : 'history', // history mode require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

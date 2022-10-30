import Layout from '@/layout'

const systemConfig = {
  path: '/system',
  component: Layout,
  name: 'System',
  redirect: '/system/setting',
  meta: { perms: ['menu/system'], title: '系统配置', icon: 'mdi-settings-outline' },
  children: [
    {
      path: 'setting',
      component: () => import('@/views/system/index'),
      name: 'SystemConfig',
      redirect: '/system/setting/role',
      meta: { perms: ['menu/system_setting'], title: '系统配置' },
      hidden: true,
      children: [
        {
          path: 'role',
          component: () => import('@/views/system/role/index'),
          name: 'RoleSetting',
          meta: { perms: ['menu/system_setting_role'], title: '系统配置' },
          hidden: true
        },
        {
          path: 'interface',
          component: () => import('@/views/system/interface/index'),
          name: 'InterfaceSetting',
          meta: { perms: ['menu/system_setting_interface'], title: '系统配置' },
          hidden: true
        },
        {
          path: 'workflow',
          component: () => import('@/views/system/workflow/index'),
          name: 'WorkflowSetting',
          meta: { perms: ['menu/system_setting_workflow'], title: '系统配置' },
          hidden: true
        },
        {
          path: 'perms',
          component: () => import('@/views/system/perms'),
          name: 'PermsSetting',
          meta: { perms: ['menu/system_setting_perms'], title: '系统配置' },
          hidden: true
        }
        // {
        //   path: 'approval',
        //   component: () => import('@/views/system/approval/index'),
        //   name: 'ApprovalSetting',
        //   meta: { perms: ['menu/system_setting_approval'], title: '系统配置' },
        //   hidden: true
        // },
        // {
        //   path: 'control',
        //   component: () => import('@/views/system/control/index'),
        //   name: 'ControlSetting',
        //   meta: { perm: ['menu/system_setting_control'], title: '系统配置' },
        //   hidden: true
        // }
        // {
        //   path: 'demand',
        //   component: () => import('@/views/system/demand/index'),
        //   name: 'DemandSetting',
        //   meta: { perms: ['menu/system_setting_demand'], title: '系统配置' },
        //   hidden: true
        // },
        // {
        //   path: 'report',
        //   component: () => import('@/views/system/report/index'),
        //   name: 'ReportSetting',
        //   meta: { perms: ['menu/system_setting_report'], title: '系统配置' },
        //   hidden: true
        // },
        // {
        //   path: 'material',
        //   component: () => import('@/views/system/material/index'),
        //   name: 'MaterialSetting',
        //   meta: { perms: ['menu/system_setting_material'], title: '系统配置' },
        //   hidden: true
        // },
        // {
        //   path: 'product',
        //   component: () => import('@/views/system/product/index'),
        //   name: 'ProductSetting',
        //   meta: { perms: ['menu/system_setting_product'], title: '系统配置' },
        //   hidden: true
        // }
      ]
    }
  ]
}

export default systemConfig

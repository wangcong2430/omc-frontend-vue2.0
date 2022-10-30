<template>
  <div class="page-wrapper" :class="{'sidebar-toggle': sidebar.opened}">
    <side-bar class="page-sidebar" />
    <div class="page-arrow" @click="toggleSideBar"><i class="arrow-icon" /></div>
    <div class="page-content">
      <page-header class="page-header" />
      <app-main class="page-container" />
      <page-footer></page-footer>
    </div>
  </div>
</template>

<script>
import { AppMain, SideBar, PageHeader, PageFooter } from './components'
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils/permission'

export default {
  name: 'Layout',
  components: {
    AppMain,
    SideBar,
    PageHeader,
    PageFooter
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  created() {
    // this.$notification.warning({
    //   message: '系统升级中...',
    //   description: '系统在2021年3月9日 11:00-15:00进行系统升级，期间系统不稳定，非紧急需求尽量避免使用，如需使用，遇到系统问题，请联系brucepsun',
    //   duration: null
    // })
    this.$store.dispatch('user/getInfo')
    // this.$store.dispatch('user/getOrgInfo')
    // 有工作台的权限才获取待办的总数
    if (checkPermission(['menu/workbench_list'])) {
      this.getTodoCount()
      // this.getDoneCount()
      this.$store.dispatch('workbench/getWbpCount')
    }
    this.$store.dispatch('user/getMemberData')
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 获取待办的总数，显示在左侧导航栏
    getTodoCount() {
      this.$store.dispatch('workbench/getTodoCount')
    }
    // getDoneCount() {
    //   this.$store.dispatch('workbench/getDoneCount')
    // }
  }
}
</script>

<style lang="less" scoped>
.page-arrow {
  z-index: 100;
}
.page-content {
  position: relative;
}
</style>

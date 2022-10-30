<template>
  <div>
    <div class="side-box">
      <div class="box-head">
        <div class="system-logo">
          <i class="omc-logo"></i>
        </div>
        <div class="system-name">
          <router-link to="/">IEG外采费用管理</router-link>
        </div>
      </div>
      <div class="box-body">
        <ul class="sidebar-nav">
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            :default-open-menu="route.openMenu"
            :active-route="activeRoute"
          ></sidebar-item>
        </ul>
      </div>
    </div>
    <div class="side-backdrop" @click="closeSideBar"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  data() {
    return {
      activeRoute: this.$route.path
    }
  },
  computed: {
    ...mapGetters([
      'routes'
    ])
  },
  watch: {
    $route(route) {
      this.activeRoute = route.path
    }
  },
  methods: {
    closeSideBar() {
      this.$store.dispatch('app/toggleSideBar', false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>

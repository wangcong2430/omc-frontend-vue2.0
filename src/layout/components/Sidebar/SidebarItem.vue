<template>
  <li
    v-if="!item.hidden"
    :class="{'has-subnav': !hasOneShowingChild(item.children, item), 'open': openMenuStatus}"
    @click.stop="openMenu(item.children, item)"
  >
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)"
    >
      <template v-if="item.children && !item.noSubchildIcon">
        <router-link
          v-if="onlyOneChild.meta"
          :to="routerLinkTo(onlyOneChild)"
          :active-class="'active'"
        >
          <span class="nav-icon">
            <i class="mdi-set" :class="[onlyOneChild.meta.icon || (item.meta&&item.meta.icon)]"></i>
          </span>
          <span class="nav-title">{{ onlyOneChild.meta.title }}</span>
          <span
            v-if="onlyOneChild.meta.badge && filterBadge(onlyOneChild.meta.badge, onlyOneChild.name) > 0"
            class="nav-badge"
          >{{ filterBadge(onlyOneChild.meta.badge, onlyOneChild.name) }}</span>
        </router-link>
      </template>
      <router-link
        v-else
        :to="routerLinkTo(onlyOneChild)"
        :active-class="'active'"
      >{{ onlyOneChild.meta.title }}</router-link>
    </template>
    <template v-else>
      <a :class="{'active': openMenuStatus}">
        <span class="nav-icon">
          <i class="mdi-set" :class="[item.meta && item.meta.icon]"></i>
        </span>
        <span class="nav-title">{{ item.meta.title }}</span>
        <span
          v-if="item.meta.badge && filterBadge(item.meta.badge, item.name) > 0"
          class="nav-badge"
        >{{ filterBadge(item.meta.badge, item.name) }}</span>
        <span class="nav-arrow">
          <i class="mdi-set mdi-chevron-down"></i>
        </span>
      </a>
      <ul class="subnav">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
          :title="tipsTitle(child.meta.title)"
        />
      </ul>
    </template>
  </li>
</template>
<script>
import { mapState } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'

export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    defaultOpenMenu: {
      type: Boolean,
      default: false
    },
    activeRoute: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      openMenuStatus: this.defaultOpenMenu ? this.defaultOpenMenu : this.activeRoute.startsWith(this.item.path)
    }
  },
  computed: {
    ...mapState({
      badge: state => state.app.badge
    })
  },
  watch: {
    activeRoute() {
      // 打开当前激活的路由
      this.openMenuStatus = this.defaultOpenMenu ? this.defaultOpenMenu : this.activeRoute.startsWith(this.item.path)
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // Show dropdown when there is only one child router if set `showDropdown` true
      if (showingChildren.length === 1 && parent.showDropdown) {
        return false
      }

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    routerLinkTo(route) {
      if (route.meta && route.meta.group_by) {
        return {
          path: this.resolvePath(route.path),
          query: {
            group_by: route.meta.group_by
          }
        }
      }

      return {
        path: this.resolvePath(route.path)
      }
    },
    openMenu(child, parent) {
      // 点击的是否是可用路由，不包括有下拉的父级菜单
      const isRouteItem = this.hasOneShowingChild(child, parent)
      if (isRouteItem) {
        // 判断是否是需要缓存的路由
        // const { name } = this.$route
        // if (name) {
        //   this.$store.dispatch('app/addCachedView', this.$route)
        // }
      } else {
        this.openMenuStatus = !this.openMenuStatus
      }
    },
    filterBadge(status, name) {
      if (!status) return 0
      const badge = this.badge.find(item => item.route === name)
      if (badge) {
        return badge.badge
      }
      return 0
    },
    tipsTitle(title) {
      if (title.length > 12) {
        return title
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

<template>
  <div class="omc-worktable">
    <div class="worktable-nav">
      <ul class="workbench-types">
        <li v-for="opt in dropdownOpt" :key="opt.value" @click.stop="onSelectChange(opt.value)">
          <a href="javascript:;" :class="{'active': workbenchType === opt.value }">
            {{ opt.label }}
            <span class="ml-5">
              <i :class="['mdi-set', opt.icon]"></i>
            </span>
            <span v-if="opt.count !== undefined" class="nav-badge">{{ opt.count }}</span>
          </a>
        </li>
        <li>
          <router-link to="/workbench/acceptance">
            验收-我的待办
            <span class="ml-5">
              <i class="mdi-set mdi-briefcase-minus"></i>
            </span>
            <span class="nav-badge">{{ wbpVerifyCount.allCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/workbench/change">
            变更-我的待办
            <span class="ml-5">
              <i class="mdi-set mdi-briefcase-edit"></i>
            </span>
            <span class="nav-badge">{{ wbpChangeCount.allCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="worktable-toolbar">
      <div class="col-right">
        <ul class="toolbar-navs">
          <li v-for="item in workTypes" :key="item.work_type" @click="selectWorkType(item)">
            <a href="javascript:;" :class="{'active': currentWorkType === item.work_type}">
              {{ item.work_name }}（{{ item.count }}）
            </a>
          </li>
        </ul>
      </div>
    </div>
    <component
      :is="optionComponent()"
      :workbench-type="workbenchType"
      :current-work-type="currentWorkType"
      :update-summary="updateSummary"
    ></component>
  </div>
</template>
<script>
/**
 * 路由参数：status(1-待办、2-已办)、workType(工作单类型)
 */
import { mapState } from 'vuex'
import NoTask from '@/components/NoTask'
import WorkbenchDemand from './demand'
import { toNumber } from 'lodash/lang'
import { getSummary } from '@/api/workflow'

export default {
  name: 'Workbench',
  components: {
    NoTask,
    WorkbenchDemand
  },
  data() {
    return {
      workbenchType: 1, // 1-我的待办、2-我的已办
      workTypes: [],
      currentWorkType: 0 // 1-需求研发费、2-需求内容制作费、3-内容制作费（自行采购）
    }
  },
  computed: {
    ...mapState({
      wbpVerifyCount: state => state.workbench.wbpVerifyCount,
      wbpChangeCount: state => state.workbench.wbpChangeCount,
      iomcTodoCount: state => state.workbench.iomcTodoCount
      // iomcDoneCount: state => state.workbench.iomcDoneCount
    }),
    dropdownOpt: function() {
      return [
        {
          icon: 'mdi-briefcase-clock',
          label: '需求-我的待办',
          value: 1,
          count: this.iomcTodoCount
        },
        {
          icon: 'mdi-briefcase-check',
          label: '需求-我的已办',
          value: 2
          // count: this.iomcDoneCount
        }
      ]
    }
  },
  watch: {
    $route(route) {
      this.onRouteChange(route)
    }
  },
  created() {
    this.handleRouteQuery(this.$route)
    this.getWorkTypes()
  },
  methods: {
    getWorkTypes() {
      getSummary(this.workbenchType).then(res => {
        const { content } = res
        const routerQuery = this.$route.query
        this.workTypes = content
        // 没有路由参数时默认选择我的待办中的第一个工作单类型
        if (
          content &&
          content.length > 0 &&
          routerQuery &&
          (!routerQuery.status ||
          !routerQuery.workType)
        ) {
          this.workbenchType = 1
          this.currentWorkType = content[0].work_type
          this.$router.replace({
            path: this.$router.path,
            query: {
              status: 1,
              workType: content[0].work_type
            }
          })
        }
      })
    },
    updateSummary() {
      getSummary(this.workbenchType).then(res => {
        const { content } = res
        this.workTypes = content
      })
    },
    handleRouteQuery(route) {
      const query = route.query
      if (query && query.status && query.workType) {
        this.workbenchType = toNumber(query.status)
        this.currentWorkType = toNumber(query.workType)
      }
    },
    onRouteChange(route) {
      const query = route.query
      if (query && query.status && query.workType) {
        if (toNumber(query.status) !== this.workbenchType) {
          this.workbenchType = toNumber(query.status)
          this.getWorkTypes()
        }
        if (toNumber(query.workType) !== this.currentWorkType) {
          this.currentWorkType = toNumber(query.workType)
        }
      } else { // 没有路由参数重新获取
        this.getWorkTypes()
      }
    },
    selectWorkType(item) {
      if (item.work_type === this.currentWorkType) {
        return
      }
      this.currentWorkType = item.work_type
      this.$router.replace({
        path: this.$router.path,
        query: {
          status: this.workbenchType,
          workType: item.work_type
        }
      })
    },
    onSelectChange(value) {
      if (value === this.workbenchType) {
        return
      }
      this.workbenchType = value
      this.$router.replace({
        path: this.$router.path,
        query: {
          status: value,
          workType: this.currentWorkType
        }
      })
      this.getWorkTypes()
    },
    optionComponent() {
      // 自动生成组件
      switch (this.currentWorkType) {
        case 1:
        case 2:
        case 3:
          return 'WorkbenchDemand'
        default:
          return 'NoTask'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.worktable-nav {
  padding-bottom: 15px;
  .workbench-types {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    padding: 0;
    list-style: none;
    & > li {
      padding: 0 5px;
      a {
        display: block;
        font-size: 14px;
        line-height: 20px;
        padding: 7px 12px;
        background-color: #fff;
        color: #6a6f85;
        margin-bottom: 10px;
        border-radius: 3px;
        &:hover {
          color: #6b5aed;
        }
        &.active {
          background-color: #6b5aed;
          color: #fff;
        }
      }
    }
    .nav-badge {
      padding: 0 4px;
      font-size: 12px;
      line-height: 18px;
      min-width: 18px;
      text-align: center;
      background-color: #f84f4f;
      color: #fff;
      border-radius: 9px;
      font-weight: normal !important;
      margin-left: 10px;
    }
  }
}
</style>

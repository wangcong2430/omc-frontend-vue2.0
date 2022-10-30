<template>
  <div class="omc-worktable">
    <div class="worktable-nav">
      <ul class="workbench-types">
        <li v-for="opt in dropdownOpt" :key="opt.value">
          <router-link :to="opt.path" active-class="active">
            {{ opt.label }}
            <span class="ml-5">
              <i :class="['mdi-set', opt.icon]"></i>
            </span>
            <span v-if="opt.allCount !== undefined" class="nav-badge">{{ opt.allCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="worktable-toolbar">
      <div class="col-right">
        <ul class="toolbar-navs">
          <li v-for="item in workTypes" :key="item.value">
            <router-link :to="item.path" active-class="active">
              {{ item.label }}（{{ item.count }}）
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'WorkbenchWbpPageChange',
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      wbpChangeCount: state => state.workbench.wbpChangeCount,
      wbpVerifyCount: state => state.workbench.wbpVerifyCount,
      iomcTodoCount: state => state.workbench.iomcTodoCount
      // iomcDoneCount: state => state.workbench.iomcDoneCount
    }),
    workTypes: function() {
      return [
        {
          label: '需求审核人确认',
          value: 1,
          path: '/workbench/change/demand-audit-confirmation',
          count: this.wbpChangeCount.auditCount
        },
        {
          label: '需求人确认',
          value: 2,
          path: '/workbench/change/demand-person-ponfirmation',
          count: this.wbpChangeCount.personCount
        }
      ]
    },
    dropdownOpt: function() {
      return [
        {
          icon: 'mdi-briefcase-clock',
          label: '需求-我的待办',
          value: 1,
          type: 'iomc',
          path: '/workbench/list?status=1&workType=1',
          allCount: this.iomcTodoCount
        },
        {
          icon: 'mdi-briefcase-check',
          label: '需求-我的已办',
          value: 2,
          type: 'iomc',
          path: '/workbench/list?status=2&workType=1'
          // allCount: this.iomcDoneCount
        },
        {
          icon: 'mdi-briefcase-minus',
          label: '验收-我的待办',
          value: 3,
          type: 'wbp',
          path: '/workbench/acceptance',
          allCount: this.wbpVerifyCount.allCount
        },
        {
          icon: 'mdi-briefcase-edit',
          label: '变更-我的待办',
          value: 4,
          type: 'wbp',
          path: '/workbench/change',
          allCount: this.wbpChangeCount.allCount
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.omc-worktable {
  height: calc(100vh - 124px);
}
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

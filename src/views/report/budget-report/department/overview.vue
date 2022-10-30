<template>
  <div class="col-5">
    <div class="omc-box">
      <div class="box-head">
        <h2 class="box-title">预算概览</h2>
        <div class="box-actions"></div>
      </div>
      <div class="box-body">
        <div class="omc-report-overview">
          <div class="overview-general">
            <h4>
              <i class="mdi-set mdi-credit-card-outline mr-10"></i>总预算
            </h4>
            <ul class="overview-general-list">
              <li>
                <div class="general-bigdata">{{ allData.budget_fee | formatNumber }}</div>
              </li>
              <li>
                <div class="general-data">{{ allData.budget_cost | formatNumber }}</div>
                <div class="general-label">已使用</div>
              </li>
              <li>
                <div class="general-data">{{ allData.usage_rate }}%</div>
                <div class="general-label">执行率</div>
              </li>
              <li>
                <div class="general-data">
                  <span :class="[filterPercentColor(allData.percent)]">
                    <i class="mdi-set" :class="[filterPercentArrow(allData.percent)]"></i>{{ allData.percent | positiveNumber }}
                  </span>
                </div>
                <div class="general-label">环比</div>
              </li>
            </ul>
          </div>
          <div class="overview-progress">
            <ul class="overview-progress-list">
              <li
                v-for="(list, index) in listData"
                :key="index"
                :style="{'width': index === 1 ? '40%' : '30%'}"
              >
                <omc-progress :percent="list.usage_rate" :stroke-color="filterStrokeColor(list)"></omc-progress>
              </li>
            </ul>
          </div>
          <div v-if="listData.length > 0" class="overview-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>预算</th>
                  <th>已使用（执行率）</th>
                  <th>环比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listData" :key="index">
                  <td>
                    <span
                      class="overview-badge"
                      :class="[filterBadgeColor(item)]"
                    >{{ item.budget_name }}</span>
                  </td>
                  <td>{{ item.budget_fee | formatNumber }}</td>
                  <td>
                    <span class="text-muted">
                      {{ item.budget_cost | formatNumber }}
                      <span>（{{ item.usage_rate }}%）</span>
                    </span>
                  </td>
                  <td>
                    <span
                      :class="[filterPercentColor(item.percent)]"
                    >
                      <i
                        class="mdi-set"
                        :class="[filterPercentArrow(item.percent)]"
                      ></i>
                      {{ item.percent | positiveNumber }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OmcProgress from '@/components/Progress/index'

export default {
  name: 'DepartBudgetOverview',
  components: {
    OmcProgress
  },
  props: {
    allData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    listData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  methods: {
    filterStrokeColor(list) {
      switch (list.budget_type) {
        case 'cp':
          return '#6b5aed'
        case 'rd':
          return '#54d575'
        case 'outsource':
          return '#ffab00'
        default:
          return ''
      }
    },
    filterBadgeColor(list) {
      switch (list.budget_type) {
        case 'cp':
          return 'badge1'
        case 'rd':
          return 'badge2'
        case 'outsource':
          return 'badge3'
        default:
          return ''
      }
    },
    filterPercentColor(percent) {
      if (percent === '-') {
        return ''
      }
      if (percent > 0) {
        return 'text-danger'
      } else {
        return 'text-success'
      }
    },
    filterPercentArrow(percent) {
      if (percent === '-') {
        return ''
      }
      if (percent > 0) {
        return 'mdi-arrow-top-right'
      } else {
        return 'mdi-arrow-bottom-right'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

<template>
  <div class="col-12">
    <div class="omc-report-table">
      <div class="table-toolbar">
        <div class="toolbar-title">预算执行列表</div>
      </div>
      <div v-if="departData.length > 0" class="table-content">
        <table class="table-secondary">
          <thead>
            <tr>
              <th width="30"></th>
              <th>部门</th>
              <th>
                内容制作费预算
                <br />已使用（执行率）
              </th>
              <th>
                研发费预算
                <br />已使用（执行率）
              </th>
              <th>
                人力外包费预算
                <br />已使用（执行率）
              </th>
              <th>
                总预算
                <br />已使用（执行率）
              </th>
              <th width="80"></th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in departData"
            :key="index"
            :class="{'tr-first-show': !item.open}"
          >
            <tr>
              <td class="text-center" @click="getReportExecutionDepart(item)">
                <a class="tbody-collapse" href="javascript:;">
                  <i class="mdi-set mdi-chevron-down"></i>
                </a>
              </td>
              <td>
                <b>{{ item.depart_name }}</b>
              </td>
              <td v-for="(type, i) in budgetTypes" :key="i">
                <div v-if="!item.list[type]">-</div>
                <template v-else>
                  {{ item.list[type].budget_fee | formatNumber }}
                  <div
                    class="inline-block text-muted"
                  >{{ item.list[type].budget_cost | formatNumber }}（{{ item.list[type].usage_rate }}%）</div>
                </template>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li @click="showDetail(item, {}, true)">
                    <a href="javascript:;" class="btn-icon">
                      <i class="mdi-set mdi-text-subject"></i>
                      <span>查看明细</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr v-for="(val, k) in item.data" :key="k">
              <td class="text-center"></td>
              <td>{{ val.cost_center_name }}</td>
              <td v-for="(type, i) in budgetTypes" :key="i">
                <div v-if="!val.list[type]">-</div>
                <template v-else>
                  {{ val.list[type].budget_fee | formatNumber }}
                  <div
                    class="inline-block text-muted"
                  >{{ val.list[type].budget_cost | formatNumber }}（{{ val.list[type].usage_rate }}%）</div>
                </template>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li @click="showDetail(item, val, false)">
                    <a href="javascript:;" class="btn-icon">
                      <i class="mdi-set mdi-text-subject"></i>
                      <span>查看明细</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template v-else>
        <a-empty style="margin-top: 30px;"></a-empty>
      </template>
    </div>
    <!-- 弹窗 -->
    <right-modal
      :visible="detailModalShow"
      :title="`预算执行明细 - ${viewDetailTitle}`"
      @close="detailModalShow = false;"
    >
      <template #modalBody>
        <table class="omc-table-data">
          <thead>
            <tr>
              <th width="120">预算科目</th>
              <th>项目名称</th>
              <th class="text-right">累计已使用</th>
              <th class="text-right">预算总数</th>
              <th class="text-right">剩余预算</th>
              <th class="text-right">预算执行率</th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in detailData"
            :key="index"
            :class="{'tr-first-show': !item.open}"
          >
            <tr>
              <td @click="item.open = !item.open;">
                <a class="tbody-collapse" href="javascript:;">
                  <span class="mr-5">{{ item.budget_name }}</span>
                  <i
                    v-if="item.budget_type !== 'all' && item.budget_type !== 'outsource' && item.list && item.list.length > 0"
                    class="mdi-set mdi-chevron-down"
                  ></i>
                </a>
              </td>
              <td></td>
              <td class="text-right">{{ item.budget_cost | formatNumber }}</td>
              <td class="text-right">{{ item.budget_fee | formatNumber }}</td>
              <td class="text-right">{{ item.budget_left | formatNumber }}</td>
              <td class="text-right">{{ item.usage_rate }}%</td>
            </tr>
            <tr v-for="(list, i) in item.list" :key="i">
              <td></td>
              <td>{{ list.project_name }}</td>
              <td class="text-right">{{ list.budget_cost | formatNumber }}</td>
              <td class="text-right">{{ list.budget_fee | formatNumber }}</td>
              <td class="text-right">{{ list.budget_left | formatNumber }}</td>
              <td class="text-right">{{ list.usage_rate }}%</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #modalFooter>
        <div class="modal-foot">
          <div class="text-right">
            <a-button type="primary" :loading="exportLoading" @click="exportData">导出明细数据</a-button>
          </div>
        </div>
      </template>
    </right-modal>
  </div>
</template>
<script>
import RightModal from '@/components/RightModal/index'
import {
  getDepartReportExecution,
  getDepartReportExecutionDepart,
  getDepartReportDetail
} from '@/api/report/budget-report'
import { export_json_to_excel } from '@/utils/export-excel'
import { dHeader, parseDetailData } from './export-data'

export default {
  name: 'DepartBudgetDetail',
  components: {
    RightModal
  },
  props: {
    departId: {
      type: [Number, String],
      default: ''
    },
    budgetYear: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      departData: [],
      detailData: [],
      budgetTypes: ['cp', 'rd', 'outsource', 'all'], // 预算类型， 顺序按照列表展示顺序！！
      detailModalShow: false,
      viewDetailTitle: '',
      exportLoading: false
    }
  },
  watch: {
    departId() {
      this.getReportExecution()
    },
    budgetYear() {
      this.getReportExecution()
    }
  },
  created() {
    this.getReportExecution()
  },
  methods: {
    getReportExecution() {
      return new Promise((resolve, reject) => {
        getDepartReportExecution(this.budgetYear, this.departId)
          .then(res => {
            const { data } = res
            this.departData = data.map(item => {
              const budgetList = {}
              item.list.forEach(list => {
                budgetList[list.budget_type] = list
              })
              return Object.assign({}, item, {
                open: false,
                data: [],
                list: budgetList
              })
            })
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getReportExecutionDepart(item) {
      item.open = !item.open
      if (!item.open || item.data.length > 0) return

      return new Promise((resolve, reject) => {
        getDepartReportExecutionDepart(this.budgetYear, item.depart_id)
          .then(res => {
            const { data } = res
            item.data = data.map(item => {
              const budgetList = {}
              item.list.forEach(list => {
                budgetList[list.budget_type] = list
              })
              return Object.assign({}, item, {
                list: budgetList
              })
            })
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /** 查看明细
     * @param {Boolean} type true-部门明细、false-成本中心明细
     */
    showDetail(item, list, type) {
      this.detailData = []
      if (type) {
        this.viewDetailTitle = item['depart_name']
        getDepartReportDetail(this.budgetYear, item['depart_id']).then(res => {
          const { data } = res
          this.detailData = data.map(d => Object.assign({}, d, { open: false }))
        })
      } else {
        this.viewDetailTitle = list['cost_center_name']
        getDepartReportDetail(this.budgetYear, item['depart_id'], list['cost_center_code']).then(res => {
          const { data } = res
          this.detailData = data.map(d => Object.assign({}, d, { open: false }))
        })
      }
      this.detailModalShow = true
    },
    exportData() {
      if (!this.detailData.length) {
        return this.$message.info('预算执行明细数据为空，不能导出！')
      }
      this.exportLoading = true
      try {
        parseDetailData(this.detailData)
          .then(async res => {
            await export_json_to_excel({
              header: dHeader,
              data: res,
              filename: `${this.viewDetailTitle}-预算执行明细`,
              autoWidth: true,
              bookType: 'xlsx'
            })
            this.exportLoading = false
          })
          .catch(err => {
            this.exportLoading = false
            this.$message.error(`导出明细数据失败！${err}`)
          })
      } catch (error) {
        this.exportLoading = false
        this.$message.error(`导出明细数据失败！${error}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

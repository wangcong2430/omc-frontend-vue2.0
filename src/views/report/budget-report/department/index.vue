<template>
  <div>
    <div class="omc-report">
      <div class="omc-report-headline">
        <div class="headline-title-wrapper">
          <a-select
            v-model="selectedDepartId"
            style="width: 300px;"
            placeholder="请选择部门"
            show-search
            option-filter-prop="children"
            allow-clear
            :default-active-first-option="false"
            :options="departmentOpt"
            @change="onSelectedDepartChange"
          ></a-select>
        </div>
        <div class="headline-time">
          <year-picker
            :placeholder="'请选择年份'"
            :default-value="budgetYear"
            :allow-clear="false"
            @change="onYearPickerChange"
          ></year-picker>
        </div>
        <div class="headline-actions">
          <a-button type="primary" :loading="exportLoading" @click="exportData">导出报表</a-button>
        </div>
      </div>
      <div class="omc-report-row">
        <depart-overview :all-data="overviewAllData" :list-data="overviewListData"></depart-overview>
        <depart-trend :options="options"></depart-trend>
        <depart-detail :depart-id="selectedDepartId" :budget-year="budgetYear"></depart-detail>
      </div>
    </div>
  </div>
</template>
<script>
import YearPicker from '@/components/YearPicker/index'
import DepartOverview from './overview'
import DepartTrend from './trend'
import DepartDetail from './detail'
import { getDepart } from '@/api/budget/index'
import {
  getDepartReportOverview,
  getDepartReportTrend,
  exportDepartReport
} from '@/api/report/budget-report'
import { formatNumber } from '@/utils/index'
import { export_json_to_excel } from '@/utils/export-excel'
import { tHeader, parseExecutionData } from './export-data'
import { partition } from 'lodash/collection'

export default {
  name: 'DepartBudgetReport',
  components: {
    YearPicker,
    DepartOverview,
    DepartTrend,
    DepartDetail
  },
  data() {
    return {
      departmentOpt: [],
      selectedDepartId: undefined,
      budgetYear: new Date().getFullYear() + 1,
      options: {
        xAxis: {
          categories: []
        },
        yAxis: [
          {},
          {
            opposite: true
          }
        ],
        plotOptions: {
          area: {
            fillOpacity: 0.2,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true
                }
              }
            }
          },
          column: {
            borderWidth: 0,
            maxPointWidth: 40
          }
        },
        tooltip: {
          shared: true,
          useHTML: true,
          formatter: function() {
            const operationevents = ''
            let text =
              '<p style="font-size:12px; text-align:center; padding:2px; color:#fff; margin:0 0 10px 0; background-color:#414660; min-width:160px;">' +
              this.x +
              '</p><table style="width:100%">'
            this.points.forEach((point, i) => {
              text +=
                '<tr><td style="padding:2px 20px 2px 5px; font-size:12px; color:#777;"><span style="width:8px; height:8px; display:inline-block; margin:3px 5px 0 0; border-radius:2px; background-color:' +
                point.series.color +
                '"></span>' +
                point.series.name +
                ': </td>' +
                '<td style="text-align:right; padding:2px 5px 2px 0; font-size:12px; color:#333;">' +
                formatNumber(point.y) +
                '</td></tr>'
            })
            text += '</table>' + operationevents
            return text
          },
          backgroundColor: '#fff',
          borderColor: '#ccc',
          borderRadius: 0
        },
        series: [
          {
            name: '总预算',
            type: 'area',
            yAxis: 1,
            data: []
          },
          {
            type: 'column',
            name: '内容制作费',
            data: []
          },
          {
            type: 'column',
            name: '研发费',
            data: []
          },
          {
            type: 'column',
            name: '人力外包费',
            data: []
          }
        ]
      },
      overviewListData: [],
      overviewAllData: {},
      exportLoading: false
    }
  },
  created() {
    this.getDepartment()
    this.getReportOverview()
    this.getReportTrend()
  },
  methods: {
    getDepartment() {
      getDepart().then(res => {
        const { data } = res
        this.departmentOpt = data.map(item => {
          return {
            label: item.depart_name,
            value: item.depart_id
          }
        })
      })
    },
    getReportOverview() {
      return new Promise((resolve, reject) => {
        getDepartReportOverview(this.budgetYear, this.selectedDepartId)
          .then(res => {
            const { data } = res
            const filterData = partition(data, { budget_type: 'all' })
            this.overviewAllData = filterData[0][0]
            this.overviewListData = filterData[1]
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    onSelectedDepartChange(val) {
      this.getReportOverview()
    },
    onYearPickerChange(val) {
      this.budgetYear = val
      this.getReportOverview()
    },
    getReportTrend() {
      this.options.xAxis.categories = []
      this.options.series[0].data = []
      this.options.series[1].data = []
      this.options.series[2].data = []
      this.options.series[3].data = []
      return new Promise((resolve, reject) => {
        getDepartReportTrend()
          .then(res => {
            const { data } = res
            const keys = Object.keys(data)
            keys.forEach(item => {
              this.options.xAxis.categories.push(`${item}年`)
              data[item].list.forEach(t => {
                if (t.budget_type === 'all') {
                  this.options.series[0].data.push(t.budget_fee)
                }
                if (t.budget_type === 'cp') {
                  this.options.series[1].data.push(t.budget_fee)
                }
                if (t.budget_type === 'rd') {
                  this.options.series[2].data.push(t.budget_fee)
                }
                if (t.budget_type === 'outsource') {
                  this.options.series[3].data.push(t.budget_fee)
                }
              })
            })
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async exportData() {
      this.exportLoading = true
      const res = await exportDepartReport(this.budgetYear, this.selectedDepartId)
      if (!res.data || !res.data.length) {
        this.exportLoading = false
        return this.$message.info('预算执行列表为空，不能导出！')
      }
      try {
        parseExecutionData(res.data)
          .then(async res => {
            await export_json_to_excel({
              header: tHeader,
              data: res,
              filename: '预算执行报表',
              autoWidth: true,
              bookType: 'xlsx'
            })
            this.exportLoading = false
          })
          .catch(err => {
            this.exportLoading = false
            this.$message.error(`导出报表失败！${err}`)
          })
      } catch (error) {
        this.exportLoading = false
        this.$message.error(`导出报表失败！${error}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.headline-title-wrapper {
  margin-right: 20px;
}
</style>

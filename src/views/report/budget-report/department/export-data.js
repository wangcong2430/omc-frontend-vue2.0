// 导出预算执行报表
import { formatJson } from '@/utils/export-excel'

export const tHeader = [
  '部门',
  '成本中心',
  '内容制作费预算',
  '已使用内容制作费预算',
  '内容制作费执行率',
  '研发费预算',
  '已使用研发费预算',
  '研发费执行率',
  '人力外包费预算',
  '已使用人力外包费预算',
  '人力外包费执行率',
  '总预算',
  '已使用总预算',
  '总预算执行率'
]

export const tFilterVal = [
  'depart_name',
  'cost_center_name',
  'cp_budget_fee',
  'cp_budget_cost',
  'cp_usage_rate',
  'rd_budget_fee',
  'rd_budget_cost',
  'rd_usage_rate',
  'outsource_budget_fee',
  'outsource_budget_cost',
  'outsource_usage_rate',
  'all_budget_fee',
  'all_budget_cost',
  'all_usage_rate'
]

function filterBudgetList(source) {
  const result = {}
  const filterTypes = ['cp', 'rd', 'outsource', 'all']

  filterTypes.forEach(type => {
    const filterData = source.find(item => item.budget_type === type)
    if (!filterData) {
      result[type] = {
        'budget_fee': '-',
        'budget_cost': '-',
        'usage_rate': '-'
      }
    } else {
      result[type] = Object.assign({}, filterData, { 'usage_rate': filterData['usage_rate'] + '%' })
    }
  })

  return result
}

export function parseExecutionData(data) {
  return new Promise((resolve, reject) => {
    const jsonData = []
    try {
      data.forEach(item => {
        const filterData = filterBudgetList(item.list)
        jsonData.push({
          'depart_name': item.depart_name,
          'cost_center_name': '-',
          'cp_budget_fee': filterData['cp'].budget_fee,
          'cp_budget_cost': filterData['cp'].budget_cost,
          'cp_usage_rate': filterData['cp'].usage_rate,
          'rd_budget_fee': filterData['rd'].budget_fee,
          'rd_budget_cost': filterData['rd'].budget_cost,
          'rd_usage_rate': filterData['rd'].usage_rate,
          'outsource_budget_fee': filterData['outsource'].budget_fee,
          'outsource_budget_cost': filterData['outsource'].budget_cost,
          'outsource_usage_rate': filterData['outsource'].usage_rate,
          'all_budget_fee': filterData['all'].budget_fee,
          'all_budget_cost': filterData['all'].budget_cost,
          'all_usage_rate': filterData['all'].usage_rate
        })
        item.cost_center.forEach(list => {
          const filterData = filterBudgetList(list.list)
          jsonData.push({
            'depart_name': item.depart_name,
            'cost_center_name': list.cost_center_name,
            'cp_budget_fee': filterData['cp'].budget_fee,
            'cp_budget_cost': filterData['cp'].budget_cost,
            'cp_usage_rate': filterData['cp'].usage_rate,
            'rd_budget_fee': filterData['rd'].budget_fee,
            'rd_budget_cost': filterData['rd'].budget_cost,
            'rd_usage_rate': filterData['rd'].usage_rate,
            'outsource_budget_fee': filterData['outsource'].budget_fee,
            'outsource_budget_cost': filterData['outsource'].budget_cost,
            'outsource_usage_rate': filterData['outsource'].usage_rate,
            'all_budget_fee': filterData['all'].budget_fee,
            'all_budget_cost': filterData['all'].budget_cost,
            'all_usage_rate': filterData['all'].usage_rate
          })
        })
      })
      const res = formatJson(tFilterVal, jsonData)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}

export const dHeader = [
  '预算科目',
  '项目名称',
  '累计已使用',
  '预算总数',
  '剩余预算',
  '预算执行率'
]

export const dFilterVal = [
  'budget_name',
  'project_name',
  'budget_cost',
  'budget_fee',
  'budget_left',
  'usage_rate'
]

export function parseDetailData(data) {
  return new Promise((resolve, reject) => {
    const jsonData = []
    try {
      data.forEach(d => {
        jsonData.push({
          'budget_name': d.budget_name,
          'project_name': '-',
          'budget_cost': d.budget_cost,
          'budget_fee': d.budget_fee,
          'budget_left': d.budget_fee,
          'usage_rate': d.usage_rate + '%'
        })
        if (d.list && Array.isArray(d.list)) {
          d.list.forEach(t => {
            jsonData.push({
              'budget_name': d.budget_name,
              'project_name': t.project_name,
              'budget_cost': t.budget_cost,
              'budget_fee': t.budget_fee,
              'budget_left': t.budget_left,
              'usage_rate': t.usage_rate + '%'
            })
          })
        }
      })
      const res = formatJson(dFilterVal, jsonData)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}

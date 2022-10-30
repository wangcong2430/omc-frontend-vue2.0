// 导出配置表
import { formatJson } from '@/utils/export-excel'

export const tHeader = [
  '部门',
  '类型',
  '配置名称',
  '配置人'
]

export const filterVal = [
  'depart_name',
  'budget_name',
  'title',
  'handler'
]

export function parseConfigsData(data) {
  return new Promise((resolve, reject) => {
    const jsonData = []
    try {
      data.forEach(d => {
        d.config.forEach(c => {
          jsonData.push({
            'depart_name': d.depart_name,
            'budget_name': d.budget_name,
            'title': c.title,
            'handler': c.handler
          })
        })
      })
      const res = formatJson(filterVal, jsonData)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
